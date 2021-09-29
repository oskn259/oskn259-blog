<template>
  <v-container class="mb-5">
    <h1 class="mb-2">目次</h1>
    <SubList :items="items" />
  </v-container>
</template>



<script lang="ts">

import { IContentDocument } from '@nuxt/content/types/content';
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import SubList from './SubList.vue';



function tocArray(toc: { id: number, depth: number, text: string }[], depth: number = 2) {

  type Layer = (string | Layer)[];

  const buf: Layer = [];
  let it = 0;

  while(toc.length > it) {

    if (toc[it].depth === depth) {

      buf.push(toc[it].text);
      it++;
    } else {

      const i = toc.slice(it).findIndex(e => e.depth === depth);
      const endPos = i === -1 ? toc.length : i + it;
      buf.push(
        tocArray(toc.slice(it, endPos), depth+1)
      );
      it = endPos;
    }
  }

  return buf;
}


@Component({
  components: {
    SubList
  }
})
export default class TableOfContent extends Vue {

  @Prop({ type: Object, required: true })
  // @ts-ignore
  article: IContentDocument;

  get items() {
    return tocArray(this.article.toc);
  }
}
</script>