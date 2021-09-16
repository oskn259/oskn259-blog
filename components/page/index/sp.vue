<template>
  <div>

    <header class="d-flex justify-center my-6">
      <h1>{{ siteName }}</h1>
    </header>

    <v-container class="d-flex flex-column align-center">

      <template v-for="article in articles">
        <v-hover v-slot="{ hover }" :key="article.slug">
          <v-card width="300px" class="transition-swing ma-3" :elevation="hover ? 14 : 3">
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

      <v-treeview
        :items="tagList"
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
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import moment from 'moment';
import * as content from '../../../libs/content';



@Component
export default class Page extends Vue {

  @Prop({ type: Array, required: true })
  // @ts-ignore
  articles: IContentDocument[];

  @Prop({ type: Array, required: true })
  // @ts-ignore
  tagList: content.TagTreeviewItem[];


  readonly imageAspectRatio = 1.618;

  siteName: string = process.env.siteName || '';


  imageHeight = (w: number) => w / this.imageAspectRatio;
  formatDate = (d: Date) => moment(d).format('YYYY/MM/DD');
  bannerPath = (a: IContentDocument) => `/article/${a.slug}/${a.banner}`;
  get articleCount() {
    return (tag: string) => {
      const found = this.tagList.find(item => item.name === tag);
      return found === undefined ? 0 : found.count;
    }
  }
}
</script>
