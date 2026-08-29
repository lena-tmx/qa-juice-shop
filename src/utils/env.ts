import "dotenv/config";

function toBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  return value === "true";
}

function normalizeTag(tag: string): string {
  const trimmedTag = tag.trim().replace(/^@+/, "");
  return trimmedTag ? `@${trimmedTag}` : "";
}

function parseTagsFilter(value: string | undefined): string[] {
  if (!value) return [];

  return value
    .split(",")
    .map(normalizeTag)
    .filter(Boolean);
}

export const env = {
  baseUrl: process.env.BASE_URL ?? "http://localhost:3000",
  startWebServer: toBoolean(process.env.START_WEB_SERVER, false),
  ci: toBoolean(process.env.CI, false),
  tagsFilter: parseTagsFilter(process.env.TAGS_FILTER),
  cleanupAdminEmail: process.env.TEST_CLEANUP_ADMIN_EMAIL,
  cleanupAdminPassword: process.env.TEST_CLEANUP_ADMIN_PASSWORD,
};
