export type ShowcaseCampaign = {
  id: string;
  example: true;
  title: string;
  productName: string;
  productDescription: string;
  brief: string;
  category: string;
  audience: string;
  targetTags: string[];
  conversionType: "signup" | "activation";
  cpaAmountCents: number;
  preview: {
    accent: string;
    accentSoft: string;
    metricLabel: string;
    metricValue: string;
    rows: [string, string, string];
  };
};

export const showcaseCampaigns: ShowcaseCampaign[] = [
  {
    id: "codepilot-ai",
    example: true,
    title: "Show developers how much faster they can ship with an AI pair programmer",
    productName: "CodePilot AI",
    productDescription: "An AI coding workspace that plans changes, edits across a repository, and explains every pull request before it ships.",
    brief: "Create a practical build-along that starts with a real issue and ends with a reviewed pull request. We want developers to see the planning, multi-file editing, and verification workflow—not a generic feature list.",
    category: "AI coding",
    audience: "Software engineers, technical founders, and engineering leads",
    targetTags: ["coding", "developer tools", "AI agents", "SaaS"],
    conversionType: "activation",
    cpaAmountCents: 4200,
    preview: { accent: "#7c3aed", accentSoft: "#ede9fe", metricLabel: "Tasks shipped", metricValue: "24", rows: ["Plan repository change", "Edit 8 files", "Tests passing"] },
  },
  {
    id: "traceforge",
    example: true,
    title: "Teach backend teams to find production failures before customers report them",
    productName: "TraceForge",
    productDescription: "A developer-first observability platform that connects traces, logs, deployments, and customer impact in one investigation timeline.",
    brief: "Record a production-debugging walkthrough using a realistic broken checkout or API latency incident. Explain how the trace moves from symptom to root cause and what makes the alert actionable.",
    category: "Observability",
    audience: "Backend engineers, platform teams, and SaaS CTOs",
    targetTags: ["observability", "backend", "DevOps", "performance"],
    conversionType: "activation",
    cpaAmountCents: 5600,
    preview: { accent: "#ea580c", accentSoft: "#ffedd5", metricLabel: "P95 latency", metricValue: "184ms", rows: ["api.checkout", "db.orders", "stripe.confirm"] },
  },
  {
    id: "shipgrid-ci",
    example: true,
    title: "Help engineering teams cut slow CI pipelines down to minutes",
    productName: "ShipGrid CI",
    productDescription: "A parallel CI platform for modern monorepos with intelligent test splitting, cache diagnostics, and flaky-test quarantine.",
    brief: "Compare the same repository before and after ShipGrid. Show the pipeline graph, cache hits, and test distribution, then explain the concrete developer-time savings for a growing team.",
    category: "CI/CD",
    audience: "Engineering teams using GitHub, monorepos, and automated testing",
    targetTags: ["CI/CD", "GitHub", "testing", "engineering productivity"],
    conversionType: "activation",
    cpaAmountCents: 4800,
    preview: { accent: "#0891b2", accentSoft: "#cffafe", metricLabel: "Build time", metricValue: "3m 18s", rows: ["Install dependencies", "Parallel test suite", "Deploy preview"] },
  },
  {
    id: "promptbench",
    example: true,
    title: "Show AI product teams how to evaluate prompts before shipping them",
    productName: "PromptBench",
    productDescription: "An evaluation workspace for comparing prompts, models, datasets, costs, and quality regressions across every AI release.",
    brief: "Build a small evaluation suite for a support copilot or extraction workflow. Demonstrate a regression, compare models, and show how a team decides what is safe to release.",
    category: "AI evaluation",
    audience: "AI engineers, product teams, and founders shipping LLM features",
    targetTags: ["LLM", "evaluation", "prompt engineering", "AI products"],
    conversionType: "activation",
    cpaAmountCents: 3800,
    preview: { accent: "#db2777", accentSoft: "#fce7f3", metricLabel: "Pass rate", metricValue: "94.2%", rows: ["Helpfulness", "Factuality", "Schema match"] },
  },
  {
    id: "schemaflow",
    example: true,
    title: "Turn database planning into a visual workflow developers can review together",
    productName: "SchemaFlow",
    productDescription: "A collaborative database design canvas that generates migrations, type-safe models, and living diagrams from one source of truth.",
    brief: "Design a small SaaS schema from scratch, invite a reviewer, and generate the first migration. Focus on how visual collaboration prevents expensive data-model mistakes.",
    category: "Database tools",
    audience: "Full-stack developers, architects, and technical founders",
    targetTags: ["database", "Postgres", "system design", "developer tools"],
    conversionType: "signup",
    cpaAmountCents: 2200,
    preview: { accent: "#2563eb", accentSoft: "#dbeafe", metricLabel: "Models", metricValue: "12", rows: ["users → teams", "teams → projects", "projects → events"] },
  },
  {
    id: "testmint",
    example: true,
    title: "Demonstrate how teams can generate maintainable tests from user behavior",
    productName: "TestMint",
    productDescription: "An AI-assisted quality platform that turns recorded product flows into resilient browser tests with readable assertions and repair suggestions.",
    brief: "Record a critical signup or checkout flow, generate the first test, then deliberately change the UI and show how TestMint diagnoses and repairs the broken step.",
    category: "Quality engineering",
    audience: "Frontend developers, QA teams, and product engineers",
    targetTags: ["testing", "Playwright", "QA", "frontend"],
    conversionType: "activation",
    cpaAmountCents: 3500,
    preview: { accent: "#16a34a", accentSoft: "#dcfce7", metricLabel: "Coverage", metricValue: "87%", rows: ["Signup flow", "Team invite", "Billing upgrade"] },
  },
  {
    id: "devrelay",
    example: true,
    title: "Help API teams publish documentation developers actually enjoy using",
    productName: "DevRelay",
    productDescription: "A documentation platform that syncs OpenAPI changes, generates interactive examples, and measures where developers get stuck.",
    brief: "Import a real or sample API, customize its quickstart, and use the interactive request builder. Explain the experience from the perspective of a developer integrating for the first time.",
    category: "API tooling",
    audience: "Developer-relations teams, API founders, and integration engineers",
    targetTags: ["API", "documentation", "developer experience", "OpenAPI"],
    conversionType: "activation",
    cpaAmountCents: 4400,
    preview: { accent: "#0f766e", accentSoft: "#ccfbf1", metricLabel: "API calls", metricValue: "8.4K", rows: ["POST /events", "GET /customers", "POST /webhooks"] },
  },
  {
    id: "cloudcanvas",
    example: true,
    title: "Make infrastructure changes understandable before teams apply them",
    productName: "CloudCanvas",
    productDescription: "A visual infrastructure workspace that previews Terraform changes, cloud costs, dependencies, and policy risks before deployment.",
    brief: "Plan a realistic infrastructure change and walk through cost, dependency, and policy impact. The best content should help a technical buyer understand the safety case, not just the diagram.",
    category: "Cloud infrastructure",
    audience: "Platform engineers, DevOps teams, and cloud-conscious founders",
    targetTags: ["cloud", "Terraform", "DevOps", "FinOps"],
    conversionType: "activation",
    cpaAmountCents: 6800,
    preview: { accent: "#ca8a04", accentSoft: "#fef9c3", metricLabel: "Monthly cost", metricValue: "$1,842", rows: ["3 resources added", "1 policy warning", "$214 saved"] },
  },
  {
    id: "reviewstack",
    example: true,
    title: "Show teams a calmer, higher-signal way to review pull requests",
    productName: "ReviewStack",
    productDescription: "A pull-request review assistant that maps change risk, summarizes intent, and routes the right code sections to the right reviewers.",
    brief: "Review a multi-file pull request with meaningful risk. Show the change map, explain one high-risk suggestion, and compare the experience with scrolling through a raw diff.",
    category: "Code review",
    audience: "Engineering managers, senior developers, and open-source maintainers",
    targetTags: ["GitHub", "code review", "engineering management", "AI coding"],
    conversionType: "activation",
    cpaAmountCents: 3900,
    preview: { accent: "#4f46e5", accentSoft: "#e0e7ff", metricLabel: "Review time", metricValue: "11 min", rows: ["Auth flow · high risk", "API types · reviewed", "Docs · low risk"] },
  },
  {
    id: "launchloop",
    example: true,
    title: "Help product teams turn every release into customer-facing momentum",
    productName: "LaunchLoop",
    productDescription: "A release-communication workspace that converts shipped changes into changelogs, launch assets, customer updates, and adoption campaigns.",
    brief: "Take one shipped feature from merged pull request to public launch. Show the generated changelog, segmented customer message, and adoption checklist while keeping the creator’s own editorial voice.",
    category: "Product marketing",
    audience: "SaaS founders, product marketers, and developer-tool teams",
    targetTags: ["product launch", "changelog", "SaaS", "growth"],
    conversionType: "signup",
    cpaAmountCents: 2600,
    preview: { accent: "#e11d48", accentSoft: "#ffe4e6", metricLabel: "Adoption", metricValue: "31.8%", rows: ["Release note drafted", "Users segmented", "Campaign scheduled"] },
  },
];

export function getShowcaseCampaign(id: string) {
  return showcaseCampaigns.find((campaign) => campaign.id === id);
}
