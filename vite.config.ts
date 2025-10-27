import { defineConfig } from 'vite';
import ssl from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [
    copy({
      targets: [{ src: 'src/silent-refresh.html', dest: 'dist' }],
      hook: 'writeBundle',
    }),
  ],
  server: {
    https: {
      key: './certs/localhost-key.pem',
      cert: './certs/localhost.pem'
    },
    host: 'localhost',
    port: 4200,
    strictPort: true,
    hmr: {
      protocol: 'wss',
      host: 'localhost',
      port: 4200
    }
  },
  plugins: [ssl()]
});
