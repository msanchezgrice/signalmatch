import { z } from "zod";

import {
  findUserByClerkId,
  getCampaignById,
  getCampaignDirectory,
  getCampaignPartnershipsForBuilder,
  getCreatorById,
  getCreatorDirectory,
  getMyCampaignAnalytics,
  getBuilderCampaigns,
} from "@/server/mcp/read-store";

function getBuilderUserId(extra: { authInfo?: { extra?: Record<string, unknown> } }) {
  return String(extra.authInfo?.extra?.userId ?? "");
}

export function registerMcpTools(server: any) {
  server.registerTool(
    "search_creators",
    {
      title: "Search creators",
      description: "Find creator profiles by niche, channel, and follower range.",
      inputSchema: {
        query: z.string().optional(),
        niches: z.array(z.string()).default([]),
        platforms: z.array(z.string()).default([]),
        min_followers: z.number().int().optional(),
        max_followers: z.number().int().optional(),
        verification_status: z
          .enum(["verified", "unverified", "any"])
          .default("any"),
        limit: z.number().int().min(1).max(50).default(20),
        offset: z.number().int().nonnegative().default(0),
      },
    },
    async (args: any) => {
      const result = await getCreatorDirectory({
        query: args.query,
        niches: args.niches,
        platforms: args.platforms,
        minFollowers: args.min_followers,
        maxFollowers: args.max_followers,
        verificationStatus: args.verification_status,
        limit: args.limit,
        offset: args.offset,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { creators: result.creators, next_offset: result.nextOffset },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get_creator",
    {
      title: "Get creator",
      description: "Get complete creator profile by id.",
      inputSchema: {
        creator_profile_id: z.string().uuid(),
      },
    },
    async ({ creator_profile_id }: any) => {
      const creator = await getCreatorById(creator_profile_id);

      return {
        content: [{ type: "text", text: JSON.stringify({ creator }, null, 2) }],
      };
    },
  );

  server.registerTool(
    "search_campaigns",
    {
      title: "Search campaigns",
      description: "Find active CPA campaigns by tag and payout range.",
      inputSchema: {
        query: z.string().optional(),
        tags: z.array(z.string()).default([]),
        conversion_type: z.enum(["signup", "activation", "any"]).default("any"),
        min_cpa_cents: z.number().int().nonnegative().optional(),
        max_cpa_cents: z.number().int().nonnegative().optional(),
        status: z.enum(["active", "any"]).default("any"),
        limit: z.number().int().min(1).max(50).default(20),
        offset: z.number().int().nonnegative().default(0),
      },
    },
    async (args: any) => {
      const result = await getCampaignDirectory({
        query: args.query,
        tags: args.tags,
        conversionType: args.conversion_type,
        minCpaCents: args.min_cpa_cents,
        maxCpaCents: args.max_cpa_cents,
        status: args.status,
        limit: args.limit,
        offset: args.offset,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { campaigns: result.campaigns, next_offset: result.nextOffset },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get_campaign",
    {
      title: "Get campaign",
      description: "Get detailed campaign record by id.",
      inputSchema: {
        campaign_id: z.string().uuid(),
      },
    },
    async ({ campaign_id }: any) => {
      const campaign = await getCampaignById(campaign_id);

      return {
        content: [{ type: "text", text: JSON.stringify({ campaign }, null, 2) }],
      };
    },
  );

  server.registerTool(
    "list_my_campaigns",
    {
      title: "List my campaigns",
      description: "List authenticated builder campaigns.",
      inputSchema: {
        status: z.enum(["draft", "active", "paused", "ended", "any"]).default("any"),
        limit: z.number().int().min(1).max(50).default(50),
      },
    },
    async (args: any, extra: any) => {
      const clerkUserId = getBuilderUserId(extra);
      const appUser = await findUserByClerkId(clerkUserId);

      if (!appUser || appUser.role !== "BUILDER") {
        return {
          content: [{ type: "text", text: JSON.stringify({ error: "forbidden" }) }],
        };
      }

      const campaigns = await getBuilderCampaigns(appUser.id, args.status);
      return {
        content: [{ type: "text", text: JSON.stringify({ campaigns }, null, 2) }],
      };
    },
  );

  server.registerTool(
    "get_my_campaign_analytics",
    {
      title: "Get my campaign analytics",
      description: "Get aggregate campaign analytics for authenticated builder.",
      inputSchema: {
        campaign_id: z.string().uuid(),
      },
    },
    async ({ campaign_id }: any, extra: any) => {
      const clerkUserId = getBuilderUserId(extra);
      const appUser = await findUserByClerkId(clerkUserId);

      if (!appUser || appUser.role !== "BUILDER") {
        return {
          content: [{ type: "text", text: JSON.stringify({ error: "forbidden" }) }],
        };
      }

      const analytics = await getMyCampaignAnalytics(appUser.id, campaign_id);
      return {
        content: [{ type: "text", text: JSON.stringify({ analytics }, null, 2) }],
      };
    },
  );

  server.registerTool(
    "list_my_partnerships",
    {
      title: "List my partnerships",
      description: "List partnerships for one builder campaign.",
      inputSchema: {
        campaign_id: z.string().uuid(),
      },
    },
    async ({ campaign_id }: any, extra: any) => {
      const clerkUserId = getBuilderUserId(extra);
      const appUser = await findUserByClerkId(clerkUserId);

      if (!appUser || appUser.role !== "BUILDER") {
        return {
          content: [{ type: "text", text: JSON.stringify({ error: "forbidden" }) }],
        };
      }

      const partnerships = await getCampaignPartnershipsForBuilder(
        appUser.id,
        campaign_id,
      );
      return {
        content: [{ type: "text", text: JSON.stringify({ partnerships }, null, 2) }],
      };
    },
  );
}
