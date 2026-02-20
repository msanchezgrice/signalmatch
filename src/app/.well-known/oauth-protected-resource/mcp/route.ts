import {
  metadataCorsOptionsRequestHandler,
  protectedResourceHandlerClerk,
} from "@clerk/mcp-tools/next";

export const GET = protectedResourceHandlerClerk();
export const OPTIONS = metadataCorsOptionsRequestHandler();
