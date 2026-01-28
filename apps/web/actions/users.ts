import { db, users, boerds, blocks, eq, sql, and } from "@boerd/database";

export async function getUserProfile(username: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
    with: {},
  });

  if (!user) {
    return null;
  }

  const [followers, following] = await Promise.all([
    db.query.users.findMany({
      where: sql`username IN (SELECT followed_id FROM user_follows WHERE user_id = ${user.id})`,
    }),
    db.query.users.findMany({
      where: sql`username IN (SELECT following_id FROM user_follows WHERE user_id = ${user.id})`,
    }),
  ]);

  const [channelsCount, blocksCount] = await Promise.all([
    db.query.boerds.findMany({
      where: eq(boerds.userId, user.id),
    }),
    db.query.blocks.findMany({
      where: eq(blocks.userId, user.id),
    }),
  ]);

  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    joinedDate: user.createdAt,
    followersCount: followers.length,
    followingCount: following.length,
    channelsCount: channelsCount.length,
    blocksCount: blocksCount.length,
  };
}
