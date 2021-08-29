<template>

  <article class="article content section-article">

    <header class="d-flex justify-center my-6">
      <NuxtLink style="text-decoration: none;" :to="`/`">
        <h1 class="text-h5 font-weight-bold">{{ siteName }}</h1>
      </NuxtLink>
    </header>
      
    <v-container class="d-flex flex-column align-start">
      <v-img :height="`${imageHeight}px`" contain class="mb-7" :src="bannerPath(article)" />
      <time class="text-subtitle-1 mb-3" v-html="formatDate(article.updatedAt)"></time>
      <h1 class="text-h4 font-weight-bold mb-5">{{ article.title }}</h1>
      <div class="media-right mb-6">
        <i class="mdi mdi-account-edit"/> &nbsp;
        {{ article.author }}
      </div>

      <NuxtContent :document="article"/>
    </v-container>

  </article>
</template>



<script lang="ts">

import { IContentDocument } from '@nuxt/content/types/content';
import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment';



@Component({
  async asyncData({ $content, params }) {

    const slug = params.slug
    return {
      article: await $content('articles', slug).fetch()
    }
  }
})
export default class Page extends Vue {

  readonly imageHeight = 450;

  articles: IContentDocument[] = [];
  siteName: string = process.env.siteName || '';

  formatDate = (d: Date) => moment(d).format('YYYY/MM/DD HH:mm');
  bannerPath = (a: IContentDocument) => `/article/${a.slug}/${a.banner}`;
}

</script>
