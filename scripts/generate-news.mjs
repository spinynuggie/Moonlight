import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const matter = require("gray-matter");
const { marked } = require("marked");

const newsDirectory = path.join(process.cwd(), "content/news");
const outputPath = path.join(process.cwd(), "lib/news-data.generated.json");

function generate() {
  if (!fs.existsSync(newsDirectory)) {
    fs.writeFileSync(outputPath, "[]", "utf-8");
    console.info("[generate-news] No content/news directory found, wrote empty array.");
    return;
  }

  const files = fs.readdirSync(newsDirectory).filter(f => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "").toLowerCase().replaceAll(/\s+/g, "-");
    const filePath = path.join(newsDirectory, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const contentHtml = marked.parse(content);

    return {
      slug,
      title: data.title,
      date: data.date,
      category: data.category,
      excerpt: data.excerpt,
      author_id: data.author_id,
      content,
      contentHtml,
    };
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2), "utf-8");
  console.info(`[generate-news] Generated ${posts.length} news posts to lib/news-data.generated.json`);
}

generate();
