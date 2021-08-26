<template>

  <article class="article content section-article">
    // 記事のヘッダー部分の例
      
    <section class="header">

      <h1>{{ post.title }}</h1>
      <div class="media">

        <div class="media-left">
          <figure class="image is-48x48">
            <img :src="post.top_image" />
          </figure>
        </div>

        <div class="media-content">
          <div class="tags">
            <i class="mdi mdi-tag"/> &nbsp;

          </div>
        </div>

        <div class="media-right">
          <i class="mdi mdi-update"/> &nbsp;
          <time v-html="post.updated_at"></time>
        </div>
      </div>
    </section>

    <NuxtContent :document="post"/>

  </article>

</template>



<script lang="ts">

import Vue from 'vue'

export default Vue.extend({
  async asyncData({ $content, params }) {

    const id = params.id
    return {
      post: await $content('posts/' + id).fetch()
    }
  },
})
</script>
