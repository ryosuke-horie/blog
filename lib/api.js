import { createClient } from "microcms-js-sdk"

export const client = createClient({
    serviceDomain: process.env.SERVICE_DOMAIN,
    apiKey: process.env.API_KEY,
})

export async function getPostBySlug(slug) {
    try {
        const post = await client.get({
            endpoint: "blog",
            queries: { filters: `slug[equals]${slug}` },
        })
        return post.contents[0]
    } catch (err) {
        console.log('-- getPostBySlug --')
        console.log(err)
    }
}

export async function getAllSlugs(limit = 100) {
    try {
        const slugs = await client.get({
            endpoint: "blog",
            queries: { fields: "title.slug", orders: "-publishedDate", limit: limit },
        })
        return slugs.contents
    } catch (err) {
        console.log('-- getAllSlugs --')
        console.log(err)
    }
}

export async function getAllPosts(limit = 100) {
    try {
        const posts = await client.get({
            endpoint: "blog",
            queries: { fields:'title,slug,eyecatch', orders: "-publishedDate", limit: limit },
        })
        return posts.contents
    } catch (err) {
        console.log('-- getAllPosts --')
        console.log(err)
    }
}