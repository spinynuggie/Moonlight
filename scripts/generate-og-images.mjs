import fs from "node:fs";
import path from "node:path";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

const OUTPUT_DIR = path.join(process.cwd(), "public/images/news/og");
const NEWS_DATA_PATH = path.join(process.cwd(), "lib/news-data.generated.json");
const FONTS_DIR = path.join(process.cwd(), "public/fonts");

const WIDTH = 1200;
const HEIGHT = 630;

const colors = {
  background: "#141414",
  border: "#222222",
  foreground: "#E5E1E0",
  mutedForeground: "#8E8A89",
  primary: "#8DA3B9",
};

const categoryColors = {
  Announcement: "#8DA3B9",
  Update: "#8C977D",
  Community: "#D9BC8C",
};
const defaultColor = "#888888";

function loadEnv() {
  if (process.env.NEXT_PUBLIC_SERVER_DOMAIN)
    return;
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replaceAll(/^["']|["']$/g, "");
        if (!process.env[key])
          process.env[key] = value;
      }
    }
  }
  catch { /* .env.local may not exist */ }
}

const authorCache = new Map();

async function fetchAuthor(authorId) {
  if (authorCache.has(authorId))
    return authorCache.get(authorId);

  const domain = process.env.NEXT_PUBLIC_SERVER_DOMAIN;
  if (!domain) {
    authorCache.set(authorId, null);
    return null;
  }

  try {
    const res = await fetch(`https://api.${domain}/user/${authorId}`);
    if (!res.ok) {
      authorCache.set(authorId, null);
      return null;
    }

    const user = await res.json();
    let avatarDataUri = null;

    if (user.avatar_url) {
      try {
        const avatarRes = await fetch(user.avatar_url);
        if (avatarRes.ok) {
          const buffer = Buffer.from(await avatarRes.arrayBuffer());
          const contentType = avatarRes.headers.get("content-type") || "image/png";
          avatarDataUri = `data:${contentType};base64,${buffer.toString("base64")}`;
        }
      }
      catch {
        console.warn(`[generate-og] Failed to fetch avatar for user ${authorId}`);
      }
    }

    const author = { username: user.username, avatarDataUri };
    authorCache.set(authorId, author);
    return author;
  }
  catch {
    console.warn(`[generate-og] Failed to fetch author data for user ${authorId}`);
    authorCache.set(authorId, null);
    return null;
  }
}

function truncate(str, maxLen) {
  if (str.length <= maxLen)
    return str;
  return `${str.slice(0, maxLen).trimEnd()}\u2026`;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildCard(post, author) {
  const accent = categoryColors[post.category] ?? defaultColor;

  const bottomLeftChildren = [
    {
      type: "div",
      props: {
        style: {
          fontSize: "18px",
          color: colors.mutedForeground,
        },
        children: formatDate(post.date),
      },
    },
  ];

  if (author) {
    const authorChildren = [];

    if (author.avatarDataUri) {
      authorChildren.push({
        type: "img",
        props: {
          src: author.avatarDataUri,
          width: 28,
          height: 28,
          style: {
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            objectFit: "cover",
            border: `1px solid ${colors.border}`,
          },
        },
      });
    }

    authorChildren.push({
      type: "div",
      props: {
        style: {
          fontSize: "18px",
          color: colors.foreground,
          fontFamily: "Torus Bold",
        },
        children: author.username,
      },
    });

    bottomLeftChildren.unshift(
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
          },
          children: authorChildren,
        },
      },
      {
        type: "div",
        props: {
          style: {
            fontSize: "18px",
            color: `${colors.mutedForeground}60`,
          },
          children: "\u00B7",
        },
      },
    );
  }

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.background,
        padding: "56px",
        fontFamily: "Torus",
        position: "relative",
        overflow: "hidden",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: "-120px",
              left: "-120px",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: "-180px",
              right: "-120px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${accent}15 0%, transparent 70%)`,
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "12px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    backgroundColor: `${accent}18`,
                    border: `1px solid ${accent}30`,
                    borderRadius: "6px",
                    padding: "5px 14px",
                    fontSize: "17px",
                    color: accent,
                    fontFamily: "Torus Bold",
                  },
                  children: post.category,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
              gap: "14px",
              marginTop: "4px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "46px",
                    fontFamily: "Torus Bold",
                    color: colors.foreground,
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                    overflow: "hidden",
                  },
                  children: truncate(post.title, 80),
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "21px",
                    color: colors.mutedForeground,
                    lineHeight: 1.5,
                    overflow: "hidden",
                  },
                  children: truncate(post.excerpt, 140),
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: `1px solid ${colors.border}`,
              paddingTop: "20px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  },
                  children: bottomLeftChildren,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "baseline",
                    letterSpacing: "-0.025em",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "22px",
                          fontFamily: "Torus SemiBold",
                          color: colors.primary,
                        },
                        children: "hime",
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "22px",
                          fontFamily: "Torus SemiBold",
                          color: colors.foreground,
                        },
                        children: "joshi",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function generate() {
  if (!fs.existsSync(NEWS_DATA_PATH)) {
    console.info("[generate-og] No news data found, skipping OG image generation.");
    return;
  }

  const posts = JSON.parse(fs.readFileSync(NEWS_DATA_PATH, "utf-8"));

  if (posts.length === 0) {
    console.info("[generate-og] No news posts found, skipping.");
    return;
  }

  loadEnv();

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const torusRegular = fs.readFileSync(path.join(FONTS_DIR, "Torus-Regular.otf"));
  const torusSemiBold = fs.readFileSync(path.join(FONTS_DIR, "Torus-SemiBold.otf"));
  const torusBold = fs.readFileSync(path.join(FONTS_DIR, "Torus-Bold.otf"));

  const fonts = [
    { name: "Torus", data: torusRegular, weight: 400 },
    { name: "Torus SemiBold", data: torusSemiBold, weight: 600 },
    { name: "Torus Bold", data: torusBold, weight: 700 },
  ];

  let generated = 0;

  for (const post of posts) {
    const author = await fetchAuthor(post.author_id);
    const element = buildCard(post, author);

    const svg = await satori(element, {
      width: WIDTH,
      height: HEIGHT,
      fonts,
    });

    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: WIDTH },
    });

    const png = resvg.render().asPng();
    const outputPath = path.join(OUTPUT_DIR, `${post.slug}.png`);
    fs.writeFileSync(outputPath, png);
    generated++;
  }

  console.info(`[generate-og] Generated ${generated} OG images to public/images/news/og/`);
}

generate();
