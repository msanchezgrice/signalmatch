import { describe, expect, it } from "vitest";

import { isBlockedWebsiteHostname, isPublicIpAddress } from "@/server/lib/safe-url";

describe("site analyzer network safety", () => {
  it.each([
    "127.0.0.1",
    "10.1.2.3",
    "172.16.0.1",
    "172.31.255.255",
    "192.168.1.1",
    "169.254.169.254",
    "100.64.0.1",
    "0.0.0.0",
    "::1",
    "fc00::1",
    "fe80::1",
    "::ffff:127.0.0.1",
  ])("blocks private address %s", (address) => {
    expect(isPublicIpAddress(address)).toBe(false);
  });

  it.each(["8.8.8.8", "1.1.1.1", "2606:4700:4700::1111"])("allows public address %s", (address) => {
    expect(isPublicIpAddress(address)).toBe(true);
  });

  it.each(["localhost", "api.localhost", "router.local", "metadata.google.internal", "service.home.arpa"])("blocks internal hostname %s", (hostname) => {
    expect(isBlockedWebsiteHostname(hostname)).toBe(true);
  });
});
