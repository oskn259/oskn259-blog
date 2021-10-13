<template>
  <div>
    <page-article-sp :article="article" :tags="tags" :siteName="siteName" v-if="$vuetify.breakpoint.name === 'xs'" />
    <page-article-pc :article="article" :tags="tags" :siteName="siteName" v-if="$vuetify.breakpoint.name !== 'xs'" />
  </div>
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
    const article = await $content('articles', slug).fetch();
    const fetchedTags = await $content('articles', slug).only(['tags']).fetch();
    const tags = [fetchedTags].flat().map(i => i.tags).flat() as string[];
    return { article, tags };
  }
})
export default class Page extends Vue {

  article: IContentDocument | null = null;
  tags: string[] | null = null;
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
