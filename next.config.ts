import type { NextConfig } from "next";

function getGitHubPagesBasePath(): string {
  if (process.env.GITHUB_ACTIONS !== "true") return "";

  const repo = process.env.GITHUB_REPOSITORY?.split("/")?.[1];
  if (!repo) return "";

  return `/${repo}`;
}

const basePath = getGitHubPagesBasePath();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
};

export default nextConfig;
