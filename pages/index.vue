<template>
  <div>

    <header class="d-flex justify-center my-6">
      <h1>{{ siteName }}</h1>
    </header>

    <v-container class="d-flex flex-row">
      <div class="flex-wrap">

        <template v-for="article in articles">
          <v-hover v-slot="{ hover }" :key="article.slug">
            <v-card width="300px" class="d-inline-block transition-swing ma-3" :elevation="hover ? 14 : 3">
              <NuxtLink style="text-decoration: none;" :to="`/article/${article.slug}`">
                <div class="pa-4">
                  <v-img width="300px" :height="`${imageHeight(300)}px`" class="mb-4" :src="bannerPath(article)" />
                  <h3 class="mb-1">{{ article.title }}</h3>
                  <small>{{ formatDate(article.createdAt) }}</small>
                </div>
              </NuxtLink>
            </v-card>
          </v-hover>
        </template>
      </div>

      <v-treeview
        :items="treeviewItems"
        hoverable
      >
        <template v-slot:label="{ item }">
          <NuxtLink :to="`/articles?tag=${item.name}`" style="text-decoration: none;">
            {{ item.name }} ({{ articleCount(item.name) }})
          </NuxtLink>
        </template>
      </v-treeview>
    </v-container>

  </div>
</template>



<script lang="ts">

import { IContentDocument } from '@nuxt/content/types/content';
import { Component, Vue } from 'nuxt-property-decorator';
import moment from 'moment';



type TreeviewItem = {
  id: number,
  name: string,
  count: number,
};


function toTreeviewItems(tagArticleCount: { tag: string, count: number }[]): TreeviewItem[] {

  return tagArticleCount
    .sort((a, b) => b.count - a.count)
    .map((e, i) => ({
      id: i,
      name: e.tag,
      count: e.count,
    }));
}

@Component({
  async asyncData({ $content }) {

    const articles = await $content('articles')
      .only(['title', 'banner', 'createdAt', 'slug'])
      .sortBy('createdAt', 'desc')
      .fetch();
    if (!Array.isArray(articles)) throw new Error();

    const tags: string[] = await $content('articles')
      .only(['tags'])
      .fetch()
      .then(result => {
        const list = [result].flat().map(v => v.tags).flat();
        return Array.from(new Set(list));
      });

    const getArticleCount = (t: string) => $content('articles')
      .only(['slug'])
      .where({ tags: { $contains: t } })
      .fetch()
      .then(r => ({ tag: t, count: r.length }));

    const tagArticleCount = await Promise.all(tags.map(getArticleCount));
    const treeviewItems = toTreeviewItems(tagArticleCount);

    return { articles, treeviewItems };
  }
})
export default class Page extends Vue {

  readonly imageAspectRatio = 1.618;

  articles: IContentDocument[] = [];
  treeviewItems: TreeviewItem[] = [];
  siteName: string = process.env.siteName || '';

  imageHeight = (w: number) => w / this.imageAspectRatio;
  formatDate = (d: Date) => moment(d).format('YYYY/MM/DD');
  bannerPath = (a: IContentDocument) => `/article/${a.slug}/${a.banner}`;
  get articleCount() {
    return (tag: string) => {
      const found = this.treeviewItems.find(item => item.name === tag);
      return found === undefined ? 0 : found.count;
    }
  }
}
</script>
