<template>
  <div>

    <page-index-sp :articles="articles" :tagList="treeviewItems" v-if="$vuetify.breakpoint.name === 'xs'" />
    <page-index-tb :articles="articles" :tagList="treeviewItems" v-if="$vuetify.breakpoint.name === 'sm'" />
    <page-index-pc :articles="articles" :tagList="treeviewItems" v-if="$vuetify.breakpoint.name !== 'xs' && $vuetify.breakpoint.name !== 'sm'"/>

  </div>
</template>



<script lang="ts">

import { IContentDocument } from '@nuxt/content/types/content';
import { Component, Vue } from 'nuxt-property-decorator';
import * as content from '../libs/content';



@Component({
  async asyncData({ $content }) {

    return {
      articles: await content.getArticleList($content),
      treeviewItems: await content.getTagList($content),
    };
  }
})
export default class Page extends Vue {

  articles: IContentDocument[] = [];
  treeviewItems: content.TagTreeviewItem[] = [];
  siteName: string = process.env.siteName || '';
}
</script>
