import { db, boerds, blocks } from "@boerd/database";
import { desc } from "drizzle-orm";

export async function getExploreContent(params: {
  view: "all" | "channels" | "blocks";
  sort: "recent" | "random";
}) {
  let boerdResult = [];
  let blockResult = [];

  if (params.view === "all" || params.view === "channels") {
    const allBoerds = await db.query.boerds.findMany({
      where: (boerds, { eq }) => eq(boerds.status, "public"),
      orderBy: params.sort === "recent" ? [desc(boerds.updatedAt)] : undefined,
      limit: 20,
    });

    boerdResult = allBoerds;
  }

  if (params.view === "all" || params.view === "blocks") {
    let allBlocks = await db.query.blocks.findMany({
      orderBy: params.sort === "recent" ? [desc(blocks.createdAt)] : undefined,
      limit: 20,
      with: {
        user: true,
      },
    });

    if (params.sort === "random") {
      allBlocks = allBlocks.sort(() => Math.random() - 0.5);
    }

    blockResult = allBlocks;
  }

  return {
    boerds: boerdResult,
    blocks: blockResult,
  };
}
