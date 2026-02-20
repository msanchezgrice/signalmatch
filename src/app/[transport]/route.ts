import { auth } from "@clerk/nextjs/server";
import { verifyClerkToken } from "@clerk/mcp-tools/next";
import { createMcpHandler, experimental_withMcpAuth } from "mcp-handler";
import { NextResponse } from "next/server";

import { env } from "@/server/env";
import { registerMcpTools } from "@/server/mcp/tools";

const mcpHandler = createMcpHandler(
  (server) => {
    registerMcpTools(server);
  },
  {
    serverInfo: {
      name: "SignalMatch MCP",
      version: "0.1.0",
    },
  },
  {
    basePath: "",
    disableSse: true,
  },
);

const protectedMcpHandler = experimental_withMcpAuth(
  mcpHandler,
  async (_req, bearerToken) => {
    const authState = await auth({ acceptsToken: "oauth_token" });
    return verifyClerkToken(authState, bearerToken);
  },
  {
    required: true,
    resourceMetadataPath: "/.well-known/oauth-protected-resource/mcp",
    resourceUrl: env.NEXT_PUBLIC_APP_URL,
    requiredScopes: ["openid", "profile", "email"],
  },
);

async function handle(
  req: Request,
  { params }: { params: Promise<{ transport: string }> },
) {
  const { transport } = await params;

  if (transport !== "mcp") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return protectedMcpHandler(req);
}

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
