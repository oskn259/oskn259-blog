import { contentFunc } from "@nuxt/content/types/content";



export type TagTreeviewItem = {
  id: number,
  name: string,
  count: number,
};



function toTreeviewItems(tagArticleCount: { tag: string, count: number }[]): TagTreeviewItem[] {

  return tagArticleCount
    .sort((a, b) => b.count - a.count)
    .map((e, i) => ({
      id: i,
      name: e.tag,
      count: e.count,
    }));
}


export async function getArticleList(content: contentFunc) {

  const articles = await content('articles')
    .only(['title', 'banner', 'createdAt', 'slug'])
    .sortBy('createdAt', 'desc')
    .fetch();
  if (!Array.isArray(articles)) throw new Error();

  return articles;
}


export async function getTagList(content: contentFunc) {

  const tags: string[] = await content('articles')
    .only(['tags'])
    .fetch()
    .then(result => {
      const list = [result].flat().map(v => v.tags).flat();
      return Array.from(new Set(list));
    });

  const getArticleCount = (t: string) => content('articles')
    .only(['slug'])
    .where({ tags: { $contains: t } })
    .fetch()
    .then(r => ({ tag: t, count: r.length }));

  const tagArticleCount = await Promise.all(tags.map(getArticleCount));
  const treeviewItems = toTreeviewItems(tagArticleCount);

  return treeviewItems;
}