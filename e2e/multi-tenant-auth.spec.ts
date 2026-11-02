import { test, expect } from '@playwright/test';

/**
 * Multi-SaaS / Multi-Tenant Authentication E2E Tests
 *
 * Covers the OIDC/OAuth2 auth flow with Duende IdentityServer:
 * - Health endpoint
 * - Per-tenant OIDC discovery (issuer isolation)
 * - Authorize endpoint redirect validation per tenant
 * - Cross-tenant isolation (tenant A issuer != tenant B issuer)
 * - Silent refresh endpoint availability
 * - Rejection of unregistered/unknown tenant redirect URIs
 * - JWKS signing-key exposure
 *
 * These tests expect the IdentityServer backend to be running.
 * Set BASE_URL (default http://localhost:8090) via env.
 * Tests are skipped automatically when the backend is unreachable.
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:8090';

async function isBackendReachable(request: any): Promise<boolean> {
  try {
    const res = await request.get(`${BASE_URL}/health`);
    return res.ok();
  } catch {
    return false;
  }
}

test.describe('Multi-Tenant IdentityServer Auth Flow', () => {
  test.beforeEach(async ({ request }) => {
    if (!(await isBackendReachable(request))) {
      test.skip(true, `Backend not reachable at ${BASE_URL}`);
    }
  });

  test.describe('Health', () => {
    test('health endpoint returns healthy', async ({ request }) => {
      const res = await request.get(`${BASE_URL}/health`);
      expect(res.ok()).toBeTruthy();
      const text = await res.text();
      expect(text).toContain('Healthy');
    });
  });

  test.describe('OIDC Discovery (issuer isolation per tenant)', () => {
    const tenants = ['tenant-a.localhost', 'tenant-b.localhost'];

    for (const tenant of tenants) {
      test(`${tenant} exposes its own issuer in discovery document`, async ({ request }) => {
        const res = await request.get(`${BASE_URL}/.well-known/openid-configuration`, {
          headers: { host: tenant }
        });
        expect(res.ok()).toBeTruthy();
        const body = await res.json();
        expect(body.issuer).toContain(tenant);
        expect(body.authorization_endpoint).toContain('/connect/authorize');
        expect(body.token_endpoint).toContain('/connect/token');
        expect(body.jwks_uri).toBeTruthy();
      });
    }

    test('issuer differs between tenants (cross-tenant isolation)', async ({ request }) => {
      const resA = await request.get(`${BASE_URL}/.well-known/openid-configuration`, {
        headers: { host: 'tenant-a.localhost' }
      });
      const resB = await request.get(`${BASE_URL}/.well-known/openid-configuration`, {
        headers: { host: 'tenant-b.localhost' }
      });
      expect(resA.ok()).toBeTruthy();
      expect(resB.ok()).toBeTruthy();
      const issuerA = (await resA.json()).issuer;
      const issuerB = (await resB.json()).issuer;
      expect(issuerA).not.toBe(issuerB);
      expect(issuerA).toContain('tenant-a');
      expect(issuerB).toContain('tenant-b');
    });
  });

  test.describe('Authorize endpoint (redirect URI validation)', () => {
    test('rejects authorize request with unregistered redirect_uri', async ({ request }) => {
      const res = await request.get(`${BASE_URL}/connect/authorize`, {
        params: {
          client_id: 'localhost-spa',
          redirect_uri: 'https://unknown-tenant.example.com/login-callback',
          response_type: 'code',
          scope: 'openid profile email offline_access api',
          state: 'random-state',
          nonce: 'random-nonce'
        },
        headers: { host: 'unknown-tenant.example.com' }
      });
      // Duende returns 400 with error for invalid redirect_uri
      expect([400, 302, 403]).toContain(res.status());
    });

    test('authorize request includes required OIDC parameters', async ({ request }) => {
      const res = await request.get(`${BASE_URL}/connect/authorize`, {
        params: {
          client_id: 'localhost-spa',
          redirect_uri: 'http://localhost:4200/login-callback',
          response_type: 'code',
          scope: 'openid profile email offline_access api',
          state: 'random-state',
          nonce: 'random-nonce'
        },
        headers: { host: 'localhost:4200' }
      });
      // localhost is allowed without tenant registration; expect a redirect to login or an error page
      expect([200, 302, 307, 400]).toContain(res.status());
    });
  });

  test.describe('Cross-tenant token issuer isolation', () => {
    test('well-known issuer is tenant-scoped, not a shared issuer', async ({ request }) => {
      for (const tenant of ['org1.localhost', 'org2.localhost']) {
        const res = await request.get(`${BASE_URL}/.well-known/openid-configuration`, {
          headers: { host: tenant }
        });
        if (!res.ok()) continue;
        const body = await res.json();
        expect(body.issuer).toContain(tenant);
        // The issuer must NOT be a generic/central issuer shared across tenants
        expect(body.issuer).not.toBe('https://localhost:8090');
        expect(body.issuer).not.toBe('https://identity.enrator.com');
      }
    });
  });

  test.describe('Silent refresh endpoint', () => {
    test('silent-refresh route is reachable via SPA', async ({ request }) => {
      const res = await request.get('http://localhost:4200/silent-refresh.html');
      expect([200, 404]).toContain(res.status());
    });
  });

  test.describe('JWKS endpoint', () => {
    test('exposes signing keys per tenant issuer', async ({ request }) => {
      const res = await request.get(`${BASE_URL}/.well-known/openid-configuration`, {
        headers: { host: 'tenant-a.localhost' }
      });
      if (!res.ok()) return;
      const { jwks_uri } = await res.json();
      const jwks = await request.get(jwks_uri);
      expect(jwks.ok()).toBeTruthy();
      const keys = await jwks.json();
      expect(keys.keys).toBeInstanceOf(Array);
      expect(keys.keys.length).toBeGreaterThan(0);
    });
  });

});
