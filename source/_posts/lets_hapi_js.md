---
title: hapi.jsと出会って10分でAPI起動
date: 2021-11-16
tags: ['TypeScript', 'Javascript', 'hapi.js', 'Joi']
author: oskn259
---

どうも、oskn259です。  

みなさんは、APIを構築するときどの言語を使っていますでしょうか？  
例えばPHPでLaravel、JavaでSpringFrameworkというのは一般的かと思います。  
**PHPはわかる人が多くて人的リソースを活用**しやすいですし、
**Javaは動作の高速さや充実のドキュメント**がいいですよね。  

ただ、webサイトを作るときにはどうしてもjavascriptというものを避けて通れず、
**二種類の言語**を使わざるを得ない状況となっています。  
最近ではフロントとバックエンドを完全に分担する形が多いですが、
コミュニケーションコストが増大しますし、個人的にはできれば避けたい形と思っています。  
<br/>

そこで今回紹介するのはこちらです。  
https://hapi.dev/

javascriptで書けるwebフレームワークで、
元々はExpressの開発者の一人がシンプルさを求めて新たに始めたプロジェクトのようです
（確かそう、違ったらすいません）。  
これが本当にシンプルで、最低限のコア部分に、
自分が必要だと思う機能のみを付け足していく感覚がは触っていて楽しいですね。  

僕が現在担当している案件では、`hapi.js`をapiのコードベースに使用しています。  
つまり、
<span style="color: #ff0000; font-weight: bold;">
フロントもバックエンドもTypescriptで記述
</span>
しています。  
これによって、 **参加エンジニアがフロントとバック両方を変更できる**
状態に近づけようとしています。  

今回はhapi.jsセットアップのさわりの部分を解説していきます。  


## セットアップ
```sh
$ mkdir hapi_hapi_nyowa
$ cd hapi_hapi_nyowa
$ yarn init
$ yarn add @hapi/hapi
$ yarn add -D typescript @types/node
```
以上のようにnodeプロジェクトをセットアップしたら、
以下のファイルをその場に配置します。  

```json
// package.jsonへ追記
{
  "scripts": {
    "build": "tsc",
    "start": "node index.js"
  },
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "rootDir": "."
  }
}
```

```ts
// index.ts
import { Server } from '@hapi/hapi';

const server = new Server({
  port: 5000,
  host: '127.0.0.1'
});

server.start();
```

実行します。  
```sh
$ yarn build
$ yarn start
```

```sh
$ curl http://localhost:5000
{"statusCode":404,"error":"Not Found","message":"Not Found"}
```

APIサーバーが完成しました！！！  
仕事終わり！！閉廷！！  
君もう帰っていいよ！！！  
愛だよ愛、Love & Peace!!!!!



## ページの作成
hapi.jsでいかにシンプルにapiサーバーを構築できるかがお分かりいただけたかと思います。  
404を返すサイトでお金を取るのは難しそうなので、
何かしらのコンテンツを返すように拡張してみましょう。  

```ts
// index.ts
import { Server, Request, Response } from '@hapi/hapi';
// ...

server.route({
  method: 'GET',
  path: '/',
  handler: function (req: Request, res: Response) {
    return { msg: '開けろ！デトロイト市警だ！' };
  }
});

server.start();
```

```sh
$ yarn build
$ yarn start
```

```sh
$ curl http://localhost:5000/ 
{"msg":"開けろ！デトロイト市警だ！"}
```
<br/>
<br/>

<img width="60%" src="kantan.jpg">    
<br/>
<span style="font-style: italic;">
fig.1 ね？簡単でしょ？
</span>  

いかがでしょうか？  
ここまで、APIサーバーを起動するという目的以外の余計な記述をほぼしていません。  
hapi.jsに限らず、このように **目的に集中できるフレームワーク**は僕は好きですね。  


## 充実のバリデーション
ページの追加もとっても簡単に完了しました。  
これだけで終わるのも寂しいので、個人的に便利だと思っている機能を一つ紹介しましょう。  

```sh
$ yarn add joi
```

```ts
// index.ts
import Joi from 'joi';

// ...

server.route({
  method: 'GET',
  path: '/',
  handler: function (req: Request, res: Response) {
    // @ts-ignore
    const speaker = req.query.speaker;
    return { msg: `${speaker}: 開けろ！デトロイト市警だ！` };
  },
  options: {
    validate: {
      query: Joi.object({
        speaker: Joi.string().required(),
      }),
    },
    response: {
      schema: Joi.object({
        msg: Joi.string().required(),
      }),
      sample: 100,
    }
  }
});

server.start();
```

```sh
$ yarn build
$ yarn start
```

```sh
$ curl http://localhost:5000/ 
{"statusCode":400,"error":"Bad Request","message":"Invalid request query input"}
```

はい、弾かれましたね。  
なんと、上記の`options`部分の追記だけでクエリのバリデーションが行われるようになり、
クエリが空のリクエストを弾いているのです！

クエリを正しく付与して再度アクセスしてみましょう。  

```sh
$ curl http://localhost:5000/?speaker=Cona
{"msg":"Cona: 開けろ！デトロイト市警だ！"}
```
<br/>
<br/>
<br/>

<span style="color: #ff0000; font-weight: bold; font-size: 1.8em">
開けろ！デトロイト市警だ！
</span>  
<br/>
<br/>
<br/>

ちなみにお察しの方も居るかもしれませんが、
リクエストだけでなく **レスポンスにもバリデーション**をかけることができます。  
意図的にレスポンスをおかしな値にして試してみましょう。  

```ts
// index.ts
// ...
    // @ts-ignore
    const speaker = req.query.speaker;
    return { msg: { 'open_up': 'Detroit_Police' } };
// ...
```

```sh
$ yarn build
$ yarn start
```

```sh
$ curl http://localhost:5000/?speaker=Cona
{"statusCode":500,"error":"Internal Server Error","message":"An internal server error occurred"}
```

このように、**期待するスキーマと実際のレスポンスが異なる場合は500を返す**という動作をとります。  
バリデーション機能は、以下のような面で僕の開発にとても役立っています。  

* ロジックの設計ミスで思わぬ情報を返してしまうおそれがない
* 外部からの攻撃によって意図しない情報を返却してしまうリスクを減らせる
* **バグの早期発見に役立つ**
  - 特にこれは頻繁に体感します
  - DevOpsの一環とも言えますね



## バリデーターJoi
サラッと通過しましたが、リクエストやレスポンスのスキーマをチェックするために`Joi`というライブラリを使用しています。  
これがとても表現力の高いバリデーターで、
表現できなくて困るという事態に僕はまだなっていません。  

例えばこんな感じで値やオブジェクトの型をチェックすることができます。  
非常に便利で、DBやネットワーク経由で取得した値のバリデーションにも使用しています。  

```ts
cosnt validator = Joi.object({
  greeting: Joi.string().valid('やぁダニエル', '君を助けにきたんだ').require(),
  isHaveGun: Joi.boolean().require(),
  stressLevel: Joi.number().min(0).max(100).require(),
});

const result = validator.validate(android);

if (result.error === underined) {
  console.log('コナーです');
}
```
<br/>

<img width="80%" src="akero.jpg">    
<br/>
<span style="font-style: italic;">
fig.2 キレる若者
</span>  


## まとめ
今回はhapi.jsの簡単な導入と、Joiを使ったバリデーションを紹介しました。  
hapi.jsのこうした点を感じてもらえれば嬉しいです。  

* とにかくシンプル
* Joiと連携した強力なバリデーション機能

こうしたシンプルなコアをベースに、オプショナルに記述できる機能や多数のプラグインが存在しており、
**実際のサービス構築にも十分耐えうる**機能を有しています。  
僕が思う良いところはまだ紹介しきれていないので、また別の記事で書きたいと思っています。  

モノリシックなフレームワークの、体系化された集合知をそのまま活かせる雰囲気も良いですが、
自分になじむようカスタマイズされたコードベースでの開発もなかなか良いものですよ。  
