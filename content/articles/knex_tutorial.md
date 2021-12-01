---
title: 'knex: node製バックエンドでのDB接続'
createdAt: 2021-11-29
updatedAt: 2021-11-29
tags: ['knex', 'TypeScript', 'Javascript']
banner: buildings.jpg
author: oskn259
---

どうも、oskn259です。  
皆さんは、nodeでwebバックエンドを作ったことはありますか？  

バックエンドといえばjavaやphpが主流で、周辺ライブラリも充実しています。  
webサービスのバックエンドではDBへの接続が必須要件ですが、これらの言語にはいい意味で枯れたライブラリが存在しており、
充実のドキュメントと安定した動作が保証されています。  

では、nodeではどうでしょうか？  
現状、これ一択というライブラリはないように感じます。  
筆者が使ったことがあるのは`prisma`, `knex`の二者です。  

* prisma
  - CRUDを提供するサーバーが立ち上がる
  - それを経由して任意のクエリを実行する
* knex
  - シンプルにクエリビルダーを提供

どちらが良いのかは状況次第ですが、必要以上に機能を搭載することはメンテナンス製の悪化にもつながります。  
そうした理由で、現在関わっている案件ではknexを採用しています。  
<span style="font-size: 0.8em; opacity: 0.6;">
実ははじめはprismaを採用していて最近knexに入れ替えたのですが、それはまた別のお話
</span>

今回はknex導入の手引きになるような解説をしていきたいと思います。  



## knexでできること
knexはnode向けのシンプルなクエリビルダです。  
こんな感じで、必要最低限の機能が提供されているという雰囲気です。  

```ts
const l = await this.knex('user')
  .select('id, name')
  .where({ id: userId })
  .limit(1);
```


## 導入
普通のパッケージと同じようにyarn(npm)で追加すればokです。  

```
yarn add knex
```

knexインスタンスを作成して、DBとのコネクションを張りましょう。  

```ts
const db = knex({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    port : 3306,
    user : 'oskn259',
    password : 'show_me_your_move',
    database : 'knex_sample',
    charset  : 'utf8mb4',
  }
});
```

knexインスタンスは一度だけ作成して使い回すようにしましょう。  
リクエストが来るたびに作成するのは余分な処理が発生します。  

次にDBとやりとりするオブジェクトの内容を定義していきましょう。  
knexにはそのために受け口が用意してあり、以下のような形で記述すればokです。  

```ts
export type User = {
  id: number;
  name: string;
  age: number;
}
export type UserInsert = Omit<User, 'id'>;
export type UserUpdate = Partial<Omit<User, 'id'>>;
export type UserComposite = Knex.CompositeTableType<User, UserInsert, UserUpdate>;

declare module 'knex/types/tables' {
  interface Tables {
    user_composite: UserComposite;
  }
}
```

selectで取得する内容、insertの時に渡す内容、updateのときに渡す内容、といった具合ですね。  
今回は`user`テーブルの内容をUserタイプとして表しています。  



## クエリの発行
以下のようにCRUDを記述して、`where`, `join`といった条件も必要に応じて付与できます。  

```ts
// insert
const userData = { name: 'oredayo', age: 3 };
await this.knex('user').insert(data);

// select
const result1 = await this.knex('user').select('*').where({ id: 1 });
const result2 = await this.knex('user').select('*')
  .join('subscription', 'user.id', 'subscription.userId');

// update
const userData = { age: 4 };
await this.knex('user').update(userData).where({ id: 1 });

// delete
await this.knex('user').update(userData).where({ id: 1 });
```

この他にもオプションは様々あります。  
IDEのサジェストが使えれば、どんな機能が提供されているか、そこで一覧を見ることができます。  



## まとめ
knex、いかがでしたでしょうか？  
非常にシンプルで、余計な設定をする必要がなく、動作するまでが速いのが良いですね。  
今回はシンプルにクエリを発行するまでを解説しましたが、マイグレーションの設定もできるようです。  

筆者が関わっている案件では、prismaからknexにDB接続部分を入れ替えたところ、クエリ実行の速度面でも大きく改善しました。  
おそらくprismaの設定を最適化できていなかった面もありますが、
この案件においてprismaは不必要に重厚な機能を持っていました。  
機能が多いということにはメンテコスト、学習コストがかかるというデメリットもあるので、knexのシンプルさはそれだけで大きなメリットと言えそうです。  

<img width="80%" src="/article/knex_tutorial/gundam.png">    
<br/>
<span style="font-style: italic;">
fig.1 筆者のそれぞれのイメージ
</span>  
