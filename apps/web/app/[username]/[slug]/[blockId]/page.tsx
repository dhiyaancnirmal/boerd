"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Block as BlockType } from "@boerd/database";
import { Block } from "@/components/blocks/Block";
import { BlockDetailLayout } from "@/components/block/BlockDetailLayout";
import { getBlock } from "@/actions/blocks";
import { getBlockConnections } from "@/actions/connections";
import Header from "@/components/layout/Header";

export const metadata = {
  title: "Block Detail",
};

export default async function BlockDetailPage({
  params,
}: {
  params: { username: string; slug: string; blockId: string };
}) {
  const block = await getBlock(params.blockId);
  const connections = await getBlockConnections(params.blockId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPath={`/${params.username}/${params.slug}`} />

      <main className="flex-1 max-w-content mx-auto w-full px-4 sm:px-12 py-8">
        <BlockDetailLayout block={block} connections={connections} />
      </main>
    </div>
  );
}
