import {PrefixStorage} from "./identity.module";

describe("PrefixStorage", () => {
  let storage: PrefixStorage;

  beforeEach(() => {
    storage = new PrefixStorage("tenant1.localhost");
    spyOn(localStorage, "getItem").and.callThrough();
    spyOn(localStorage, "setItem").and.callThrough();
    spyOn(localStorage, "removeItem").and.callThrough();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("prefixes keys with tenant subdomain", () => {
    storage.setItem("access_token", "abc");
    expect(localStorage.setItem).toHaveBeenCalledWith("tenant1_access_token", "abc");
  });

  it("returns null for missing keys", () => {
    expect(storage.getItem("access_token")).toBeNull();
  });

  it("retrieves stored values with prefix", () => {
    storage.setItem("id_token", "xyz");
    expect(storage.getItem("id_token")).toBe("xyz");
  });

  it("removes items with prefix", () => {
    storage.setItem("refresh_token", "r");
    storage.removeItem("refresh_token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("tenant1_refresh_token");
  });

  it("uses empty prefix when hostname has no subdomain", () => {
    const rootStorage = new PrefixStorage("");
    rootStorage.setItem("access_token", "abc");
    expect(localStorage.setItem).toHaveBeenCalledWith("access_token", "abc");
  });
});
