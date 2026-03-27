import fs from "node:fs";
import path from "node:path";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

const OUTPUT_DIR = path.join(process.cwd(), "public/images/news/og");
const NEWS_DATA_PATH = path.join(process.cwd(), "lib/news-data.generated.json");
const FONTS_DIR = path.join(process.cwd(), "public/fonts");

const WIDTH = 1200;
const HEIGHT = 630;

const categoryColors = {
  Announcement: "#8DA3B9",
  Update: "#8C977D",
  Community: "#D9BC8C",
};
const defaultColor = "#888888";

function truncate(str, maxLen) {
  if (str.length <= maxLen)
    return str;
  return `${str.slice(0, maxLen).trimEnd()}…`;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildCard(post) {
  const accent = categoryColors[post.category] ?? defaultColor;

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1C1917",
        padding: "60px",
        fontFamily: "Torus",
        position: "relative",
        overflow: "hidden",
      },
      children: [
        // Accent gradient blob (top-left)
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: "-100px",
              left: "-100px",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
            },
          },
        },
        // Accent gradient blob (bottom-right)
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: "-150px",
              right: "-150px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
            },
          },
        },
        // Top: Category badge
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
                    backgroundColor: `${accent}25`,
                    border: `1px solid ${accent}50`,
                    borderRadius: "8px",
                    padding: "6px 16px",
                    fontSize: "20px",
                    color: accent,
                    fontFamily: "Torus Bold",
                  },
                  children: post.category,
                },
              },
            ],
          },
        },
        // Middle: Title + Excerpt
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
              gap: "16px",
              marginTop: "8px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "48px",
                    fontFamily: "Torus Bold",
                    color: "#EEEEEE",
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
                    fontSize: "22px",
                    color: "#A8A29E",
                    lineHeight: 1.5,
                    overflow: "hidden",
                  },
                  children: truncate(post.excerpt, 140),
                },
              },
            ],
          },
        },
        // Bottom: Date + branding
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid #2A2522",
              paddingTop: "20px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "20px",
                    color: "#78716C",
                  },
                  children: formatDate(post.date),
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: accent,
                        },
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "20px",
                          fontFamily: "Torus Bold",
                          color: "#57534E",
                          letterSpacing: "0.05em",
                        },
                        children: "himejoshi",
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

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const torusRegular = fs.readFileSync(path.join(FONTS_DIR, "Torus-Regular.otf"));
  const torusBold = fs.readFileSync(path.join(FONTS_DIR, "Torus-Bold.otf"));

  const fonts = [
    { name: "Torus", data: torusRegular, weight: 400 },
    { name: "Torus Bold", data: torusBold, weight: 700 },
  ];

  let generated = 0;

  for (const post of posts) {
    const element = buildCard(post);

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
