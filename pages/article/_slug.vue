<template>

  <article class="article content section-article mx-auto">

    <header class="d-flex justify-center my-6">
      <NuxtLink style="text-decoration: none;" :to="`/`">
        <h1 class="text-h5 font-weight-bold">{{ siteName }}</h1>
      </NuxtLink>
    </header>

    <v-container class="d-flex flex-column align-start blog-content pa-0">
      <v-img width="100%" :minHeight="`200px`" class="mb-7 mx-auto" :src="bannerPath(article)" />
      <div style="width: 100%;" class="d-flex flex-row justify-space-between align-center mb-3">
        <time class="text-subtitle-1" v-html="formatDate(article.updatedAt)"></time>
        <div>
          <a
            href="https://twitter.com/share?ref_src=twsrc%5Etfw"
            class="twitter-share-button"
            height="30px"
            data-size="large"
            data-show-count="false"
          ></a>
          <div
            class="line-it-button"
            data-lang="ja"
            data-type="share-b"
            data-ver="3"
            :data-url="`https://blog.oskn259.com/article/${article.slug}`"
            data-color="default"
            data-size="small"
            data-count="false"
            style="display: none;"
          ></div>
        </div>
      </div>
      <h1 class="text-h4 font-weight-bold mb-9">{{ article.title }}</h1>

      <div class="twitter-profile d-flex flex-row ma-0 mb-5 pa-4 pr-8">
        <img
          class="twitter-icon mr-5"
          width="100px"
          src="https://pbs.twimg.com/profile_images/1433402394780450820/6TzyCMrN_400x400.jpg"
        >
        <v-col class="pa-0">
          <v-col class="pa-0">
            <span class="twitter-id">oskn259</span>
          </v-col>
          <v-row class="ma-0">
            <a href="https://twitter.com/oskn259" style="text-decoration: none;">
              <v-icon class="mdi mdi-twitter mr-2"/>
            </a>
            <a href="https://github.com/oskn259" style="text-decoration: none;">
              <v-icon class="mdi mdi-github mr-2"/>
            </a>
          </v-row>
        </v-col>
      </div>

      <TableOfContent :article="article" />
      <NuxtContent :document="article"/>
    </v-container>

  </article>
</template>



<script lang="ts">

import { IContentDocument } from '@nuxt/content/types/content';
import { Component, Vue } from 'nuxt-property-decorator';
import moment from 'moment';
import TableOfContent from '../../components/TableOfContent/index.vue';



@Component({

  components: {
    TableOfContent,
  },

  mounted() {
    // @ts-ignore
    if (typeof twttr !== 'undefined') twttr.widgets.load();
    try {
      // @ts-ignore
      LineIt.loadButton();
    } catch(e) {}
  },

  async asyncData({ $content, params }) {

    const slug = params.slug
    return {
      article: await $content('articles', slug).fetch()
    }
  }
})
export default class Page extends Vue {

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
article {
  width: 100%;
  max-width: 660px;
}

.twitter-profile {
  background: #eee;
  border-radius: 20px;
}

.twitter-id {
  font-size: 20px;
  font-weight: bold;
}

.twitter-icon {
  width: 60px;
  height: 60px;
  border: 1px solid #aaa;
  border-radius: 30px;
}

.nuxt-content-container {
  width: 100%;
}

.nuxt-content {
  width: 100%;
  overflow: hidden;
  text-align: justify;
  line-height: 1.8em;

  p {
    margin: 1.5rem 0;
  }

  h1,
  h2,
  h3 {
    margin: 2em 0 0.4em;
    line-height: 1.3em !important;
  }

  h1 {
    font-size: 2.4rem;
  }

  h2 {
    font-size: 2.2rem;
  }

  h3 {
    font-size: 1.6rem;
  }

  a {
    word-wrap: break-word;
  }

  img {
    max-width: 100%;
  }
}
</style>
