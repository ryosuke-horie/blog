import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: process.env.SERVICE_DOMAIN as string,
  apiKey: process.env.API_KEY as string,
});

export async function getPostBySlug(slug: string): Promise<any> {
  try {
    const post = await client.get({
      endpoint: "blog",
      queries: { filters: `slug[equals]${slug}` },
    });
    return post.contents[0];
  } catch (err) {
    console.log("~~ getPostBySlug ~~");
    console.log(err);
  }
}

export async function getAllSlugs(limit: number = 100): Promise<any> {
  try {
    const slugs = await client.get({
      endpoint: "blog",
      queries: { fields: "title,slug", orders: "-publishDate", limit: limit },
    });
    return slugs.contents;
  } catch (err) {
    console.log("~~ getAllSlugs ~~");
    console.log(err);
  }
}

export async function getAllPosts(limit: number = 100): Promise<any> {
  try {
    const posts = await client.get({
      endpoint: "blog",
      queries: {
        fields: "title,slug,eyecatch",
        orders: "-publishDate",
        limit: limit,
      },
    });
    return posts.contents;
  } catch (err) {
    console.log("~~ getAllPosts ~~");
    console.log(err);
  }
}

/**
 * カテゴリーのデータを取得する。
 * @param {number} limit デフォルトは100件
 * @returns
 */
export async function getAllCategories(limit: number = 100): Promise<any> {
  try {
    const categories = await client.get({
      endpoint: "categories",
      queries: {
        fields: "name,id,slug",
        limit: limit,
      },
    });
    return categories.contents;
  } catch (err) {
    console.log("~~ getAllCategories ~~");
    console.log(err);
  }
}

export async function getAllPostsByCategory(
  catID: string,
  limit: number = 100
): Promise<any> {
  try {
    const posts = await client.get({
      endpoint: "blog",
      queries: {
        filters: `categories[contains]${catID}`,
        fields: "title,slug,eyecatch",
        orders: "-publishDate",
        limit: limit,
      },
    });
    return posts.contents;
  } catch (err) {
    console.log("~~ getAllPostsByCategory ~~");
    console.log(err);
  }
}
