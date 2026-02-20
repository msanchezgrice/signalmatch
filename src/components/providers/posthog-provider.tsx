"use client";

import posthog from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  apiKey?: string;
};

export function PostHogProvider({ children, apiKey }: Props) {
  useEffect(() => {
    if (!apiKey || posthog.__loaded) {
      return;
    }

    posthog.init(apiKey, {
      api_host: "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
    });
  }, [apiKey]);

  return <Provider client={posthog}>{children}</Provider>;
}
