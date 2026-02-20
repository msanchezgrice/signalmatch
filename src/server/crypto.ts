import { createHash, randomBytes } from "crypto";

export function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function newApiKey(prefix = "sm") {
  const raw = randomBytes(24).toString("base64url");
  const token = `${prefix}_${raw}`;

  return {
    token,
    hash: hashToken(token),
  };
}
