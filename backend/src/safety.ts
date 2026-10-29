import net from "node:net";
import dns from "node:dns/promises";

const blocked = new net.BlockList();

const IPV4_RANGES: [string, number][] = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
];

for (const [network, prefix] of IPV4_RANGES) {
  blocked.addSubnet(network, prefix, "ipv4");
}
blocked.addAddress("::", "ipv6");
blocked.addAddress("::1", "ipv6");
blocked.addSubnet("fc00::", 7, "ipv6");
blocked.addSubnet("fe80::", 10, "ipv6");
blocked.addSubnet("ff00::", 8, "ipv6");

export function isBlockedAddress(address: string): boolean {
  const family = net.isIP(address);
  if (family === 0) return true;

  if (family === 6) {
    const mapped = address.toLowerCase().match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return blocked.check(mapped[1], "ipv4");
    return blocked.check(address, "ipv6");
  }
  return blocked.check(address, "ipv4");
}

export type SafetyResult = { ok: true } | { ok: false; message: string };

export async function assertSafeUrl(rawUrl: string): Promise<SafetyResult> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return { ok: false, message: "Invalid URL" };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, message: "Only http and https are allowed" };
  }

  const host = url.hostname.replace(/^\[|\]$/g, "");

  if (net.isIP(host)) {
    return isBlockedAddress(host)
      ? { ok: false, message: `Address ${host} is not allowed` }
      : { ok: true };
  }

  let records: { address: string }[];
  try {
    records = await dns.lookup(host, { all: true });
  } catch {
    return { ok: true };
  }

  const bad = records.find((r) => isBlockedAddress(r.address));
  return bad
    ? { ok: false, message: `${host} resolves to a private address (${bad.address})` }
    : { ok: true };
}