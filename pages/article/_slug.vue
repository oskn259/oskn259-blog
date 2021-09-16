<template>

  <article class="article content section-article">

    <header class="d-flex justify-center my-6">
      <NuxtLink style="text-decoration: none;" :to="`/`">
        <h1 class="text-h5 font-weight-bold">{{ siteName }}</h1>
      </NuxtLink>
    </header>
      
    <v-container class="d-flex flex-column align-start blog-content">
      <v-img :height="`${imageHeight}px`" class="mb-7 mx-auto" :src="bannerPath(article)" />
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
import { Component, Vue } from 'nuxt-property-decorator';
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

  article: IContentDocument | null = null;
  siteName: string = process.env.siteName || '';

  head() {
    return {
      title: this.article ? this.article.title : this.siteName,
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:title', name: 'og:title', content: this.article ? this.article.title : this.siteName },
        { hid: 'og:image', property: 'og:image', content: `https://blog.oskn259.com${this.bannerPath(this.article)}` },
      ],
    };
  }

  formatDate = (d: Date) => moment(d).format('YYYY/MM/DD');
  bannerPath = (a: IContentDocument | null) => a ? `/article/${a.slug}/${a.banner}` : '';
}

</script>



<style lang="scss">
.nuxt-content-container {
  width: 100%;
  overflow: hidden;
  line-height: 1.65em;
  text-align: justify;

  .nuxt-content {
    width: 100%;
  }

  p {
    margin: 0.725rem 0;
  }

  h1,
  h2,
  h3 {
    margin: 2.175em 0 0.725rem;
  }

  a {
    word-wrap: break-word;
  }

  img {
    max-width: 100%;
  }
}
</style>
