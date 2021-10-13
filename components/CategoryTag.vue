<template>
  <nuxt-link :to="`/articles?tag=${tagName}`" class="flex-row justify-center text-subtitle1">
    <v-icon dense class="mdi mdi-tag"/>
    <span>{{ tagName }}</span>
  </nuxt-link>
</template>



<script lang="ts">

import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class CategoryTag extends Vue {

  @Prop({ type: String, required: true })
  // @ts-ignore
  tagName: string;
}
</script>



<style lang="scss" scoped>
a {
  display: inline-block !important;
  line-height: 2em;
  text-decoration: none;
}
</style>