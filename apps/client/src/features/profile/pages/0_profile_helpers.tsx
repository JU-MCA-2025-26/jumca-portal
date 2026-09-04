export const buildExternalProfileUrl = (
  platform: string,
  value?: string | null,
): string | undefined => {
  if (!value || typeof value !== "string") return undefined;
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) {
    // allow only http(s)
    return v;
  }

  try {
    // fallback: build a safe URL based on platform and encode the path component
    switch (platform) {
      case "github":
        return `https://github.com/${encodeURIComponent(v)}`;
      case "linkedin":
        return `https://www.linkedin.com/in/${encodeURIComponent(v)}`;
      case "leetcode":
        return `https://leetcode.com/${encodeURIComponent(v)}`;
      case "codeforces":
        return `https://codeforces.com/profile/${encodeURIComponent(v)}`;
      case "gfg":
        return `https://geeksforgeeks.org/user/${encodeURIComponent(v)}`;
      default:
        return undefined;
    }
  } catch (err) {
    console.error("Error building external profile URL:", err);
    return undefined;
  }
};
