<template>
  <ul>
    <template
      v-for="(item, index) of items"
    >
      <li v-if="typeof item === 'string'" :key="item">
        <a :href="`#${toId(item)}`" v-if="typeof item === 'string'">
          {{ item }}
        </a>
      </li>
      <SubList :items="item" v-else :key="index"/>
    </template>
  </ul>
</template>



<script lang="ts">

import { Component, Prop, Vue } from 'nuxt-property-decorator';

type Layer = (string | Layer)[];

@Component({
  components: {
    SubList
  }
})
export default class SubList extends Vue {

  @Prop({ type: Array, required: true })
  // @ts-ignore
  items: Layer;

  toId(str: string) {
    return str.toLowerCase().replace(/ /g, '-');
  }
}
</script>