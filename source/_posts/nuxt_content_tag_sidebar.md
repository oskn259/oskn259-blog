---
title: nuxt contentのブログにタグ機能をつける話
date: 2021-9-12
tags: ['Nuxtjs', 'Vuejs', 'TypeScript', 'JavaScript']
author: oskn259
---

このサイトを技術情報発信として運営していく予定なので、記事もそうですが機能の拡充を図っていきたいところです。  
シンプルな見た目というのも良いですが、サイト内の回遊を増やして記事を見てもらうのはブログとしては必須機能になりそうです。  
今回は記事にタグをつけ、タグ別に記事をリスティングできるような機能を追加していきます。  



## タグごとの一覧ページの追加
内容が空のページファイルを配置します。  
<img src="empty_page.png">  
（この記事を並行して書いているので、関係ないところも変更アリ表記になっています）  

まずは`?tag=javascript`のようにクエリでタグ指定を受け付けるようにしましょう。
↑のファイルに追記していきます。

```ts
@Component({
  async asyncData({ route }) {
    const tag = route.query.tag;
    return { tag };
  }
})
```
ここでは[`nuxt-property-decorator`](https://www.npmjs.com/package/nuxt-property-decorator)というパッケージを導入し、
普段のvueとは異なる書き方をしています。  
一つの巨大なオブジェクトになり、階層が深くなりがちなVueコンポーネントを普通のクラスのように書けるので気に入ってます。  

ともかくやっていることは、`asyncData`で`route.query.tag`を受け取って`this.data`に保存するという事です。  

そしてここが今回のメイン。  
tagを受け取ったので、これに該当する記事一覧を取得しましょう。  
```ts
@Component({
  async asyncData({ $content, route }) {
    const tag = route.query.tag;
    const articles = await $content('articles')
      .only(['title', 'banner', 'createdAt', 'slug'])
      .where({ tags: { $contains: tag } })
      .sortBy('createdAt', 'desc')
      .fetch();
    return { tag, articles };
  }
})
```
該当タグに関する検索は、こちらの記事を参考にしました。  
`https://content.nuxtjs.org/ja/fetching/#wherequery`  
`https://www.suzunatsu.com/post/nuxtjs-nuxtcontent/`  

nuxt contentの機能として提供されている、`$content`経由で検索を実行して、記事一覧を取得しています。  
記事側に書かれたタグをもとに検索しており、記事側ではこんな感じでタグを追加しています。  
<img src="article_header.png">  

あとはページに記事一覧を表示してやりましょう。  
```vue
<v-container>
  <div class="flex-wrap">

    <template v-for="article in articles">
      <v-hover v-slot="{ hover }" :key="article.slug">
        <v-card width="300px" class="d-inline-block transition-swing ma-3" :elevation="hover ? 14 : 3">
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

    <template v-if="articles.length === 0">
      {{ tag }} に該当する記事はありませんでした
    </template>
  </div>
</v-container>
```
ちょっと長く見えますが、要するに`v-for`で各カードについて、記事へのリンクを貼ってあげてるだけです。  


## タグ一覧のサイドバーを追加
該当タグ専用の一覧ページができたので、これらのページへのリンクを貼ってあげましょう。  
サイドバーの形でタグ検索できるブログが一般的かなと思うので、今回もその形を採用します。  

引き続き、`$content`を使って情報を引っ張ってきましょう。  
まずは存在する全てのタグの一覧を取得します。  
```ts
const tags: string[] = await $content('articles')
  .only(['tags'])
  .fetch()
  .then(result => {
    const list = [result].flat().map(v => v.tags).flat();
    return Array.from(new Set(list));
  });
```
全記事のタグを一まとめにして、重複を廃城することでタグ一覧を取得しています。  

単純にこれを並べても良いのですが、記事数でソートして表示できると、ちゃんとしたブログに近づいてる感じがあります。  
タグごとの記事数は以下のように取ってきます。  
```ts
const getArticleCount = (t: string) => $content('articles')
  .only(['slug'])
  .where({ tags: { $contains: t } })
  .fetch()
  .then(r => ({ tag: t, count: r.length }));
const tagArticleCount = await Promise.all(tags.map(getArticleCount));
```
`$content`による記事取得では、`where`をつかった検索も可能です。  
タグごとに検索結果の件数を数えればokです。  

あとはvuetifyコンポーネントに値を渡してやれば  

<img src="built.png">  

完成！


## 今後
スマホ対応しないと見た目がどえれぇ事にになってます。  
あとインデントとかline-heightあたりを調節したい。  
