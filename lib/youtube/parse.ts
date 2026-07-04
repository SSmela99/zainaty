export function parseYoutubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }

      const [section, id] = parsed.pathname.split("/").filter(Boolean);
      if (
        (section === "embed" || section === "shorts" || section === "live") &&
        id
      ) {
        return id;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function isYoutubeUrl(url: string): boolean {
  return parseYoutubeVideoId(url) !== null;
}

export function getYoutubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
}
