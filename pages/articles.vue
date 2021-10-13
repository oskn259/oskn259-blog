<template>
  <div>

    <header class="d-flex justify-center my-6">
      <NuxtLink style="text-decoration: none;" to="/">
        <h1>{{ siteName }}</h1>
      </NuxtLink>
    </header>

    <v-row class="d-flex justify-center">
      <category-tag class="mr-3" :tagName="tag"/>を含む記事
    </v-row>

    <v-container>
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

        <v-container class="d-flex flex-row justify-center" v-if="articles.length === 0">
          <span>該当する記事はありませんでした🎣</span>
        </v-container>
      </div>
    </v-container>

  </div>
</template>



<script lang="ts">

import { IContentDocument } from '@nuxt/content/types/content';
import { Component, Vue } from 'nuxt-property-decorator';
import moment from 'moment';

@Component({

  async asyncData({ $content, route }) {
    const tag = route.query.tag;

    const articles = await $content('articles')
      .only(['title', 'banner', 'createdAt', 'slug'])
      .where({ tags: { $contains: tag } })
      .sortBy('createdAt', 'desc')
      .fetch();

    return { tag, articles };
  }
})
export default class Page extends Vue {

  readonly imageAspectRatio = 1.618;

  articles: IContentDocument[] = [];
  siteName: string = process.env.siteName || '';

  imageHeight = (w: number) => w / this.imageAspectRatio;
  formatDate = (d: Date) => moment(d).format('YYYY/MM/DD');
  bannerPath = (a: IContentDocument) => `/article/${a.slug}/${a.banner}`;
}
</script>
