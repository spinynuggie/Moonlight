import { NextResponse } from "next/server";

import { getAllNews } from "@/lib/news";

export async function GET() {
  const posts = getAllNews();
  return NextResponse.json(posts);
}
