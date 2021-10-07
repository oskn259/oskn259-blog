---
title: Redux-Sagaなる厄介な中年管理職を追放してコード浄化を図った話
createdAt: 2021-10-8
updatedAt: 2021-10-8
tags: ['Architecture', 'React', 'TypeScript', 'JavaScript']
banner: forest.jpg
author: oskn259
---

どうも、oskn259です。  

皆さんは、非同期処理というものをご存知でしょうか？  

例えば、ブラウザで送信ボタンを押すとAPIが呼び出され、
返ってきたレスポンスの内容を表示する機能があるとします。  
こうした待ち時間にはローディング画面が動いたり、そもそも他の箇所を操作できたりします。  

<img width="60%" src="/article/redux_saga_the_bottleneck/nagara.png">  
<br/>
<span style="font-style: italic;">fig.1 煎餅を食いながらスマホを見ながらテレビを見る女性</span>  

これはAPIの呼び出し部分を非同期的に動作させているためで、
APIの応答を待っている間に、他の処理が並行して実行されるためです。  

非同期処理は取り扱いが難しく、デッドロックやセマフォの概念、スレッドの概念等、
その扱いについて人類は考え続けてきました。  
今回のタイトルにもなっている**redux-saga**も、そうした流れの中で生まれたフレームワークです。  

知らない人のために解説すると、公式README曰く
```
redux-saga は React/Redux アプリケーションにおける副作用
（データ通信などの非同期処理、ブラウザキャッシュへのアクセスのようなピュアではない処理）
をより簡単で優れたものにするためのライブラリです。
```
とのことです。  
要するにReduxを使ったStoreパターンをReactアプリケーションに実装していく時に、
非同期処理をきれいに書けますよというものです。  

ところが、この書きやすさを優位性として挙げているredus-sagaが、
**一つのプロジェクトを書きやすさの面で崩壊**させました。  

順番に説明していきます。  


## TL;DR
* redux-saga導入でコード総量が爆増
* Promise使った方が普通にきれいに書けた



## 馴れ初め
僕がアサインされた時には既に`redus-saga`がコードに組み込まれていたので、
当初の考えを完全に把握できているわけではありません。  
ですが、Storeパターンにおける非同期処理をまとめる存在として、当時の自分も納得していました。  

当時はさしたる問題もなく、開発は順調に進んでいきリリースとなりました。  
事が起こったのはしばらくして、後追い新規機能を実装するようになってからです。  

「事が起こった」というのは正確ではなく、このとき既に
<span style="color: #00aa55; font-weight: bold;">
ゴムパッキンにカビが根を張るように
</span>
じわじわと事態は進行していました。  



## 何が起こっているか
まず、redux-sagaを使用したコードとはどのようなものなのでしょうか？  
以下は、APIを呼び出してレスポンスを表示するシンプルな機能から、
説明に必要な部分を抜粋したミニチュアです。  

<details>
<summary style="font-weight: bold;">ミニチュア（展開）</summary>

```
page/
  top.tsx
store/
  reducers.ts
  sagas.ts
  actions.ts
api/
  getUser.ts
```

```tsx
// page/top.tsx
import * as actions from '../store/actions';

export const Component = ({ dispatch, store }) => {
  useEffect(() => dispatch(actions.getUser()), []);

  return (
    <div>{store.user.name}</div>
  );
}
```

```ts
// store/reducers.ts
import * as actions from './actions';

export default function subReducer(state: State = { name: null }, action: Actions): State {
  switch (action.type) {
    case actions.GET_USER_RESPONSE:
      return { ...state, name: action.response };
    default:
      return state;
  }
}

```

```ts
// store/sagas.ts
import * as apis from '../api/getUser';
import * as actions from '../store/actions';

function* handleGetUser() {
  const response = yield call(apis.getUser);
  yield put(actions.getUserResponse(response));
}

export default function* subSaga() {
  yield all([
    takeLatest(actions.GET_USER, handleGetUser),
  ]);
}
```

```ts
// store/actions.ts
export const GET_USER = 'GET_USER';
export const GET_USER_RESPONSE = 'GET_USER_RESPONSE';
export const getUser = () => ({ type: GET_USER });
export const getUserResponse = (response: object) => ({ type: GET_USER_RESPONSE, response });
```

```ts
// api/getUser.ts
export function getUser() {
  return axios.get('/user').data;
}
```
</details>

・・・  

**俺はAPIを叩いてレスポンスを表示したいだけなんだが・・・？**  
とお思いの読者もいる事でしょうが、それはまた別のお話にします。  
（Storeパターンにはちゃんとメリットもあります。）  

一体何が問題なのか、見ていきましょう。  


### 遥かなる変更距離
ここで、例えばこのページから呼び出すAPIを一つ追加して、そのレスポンスも表示したいとしたらどうなるでしょうか？  

<span style="color: #ff0000; font-weight: bold;">
この内容をほぼ二倍にする
</span>
ことになります。  
APIを一つ増やすだけでです。  

さらにもう一つ必要なら三倍です。  
界王拳か何か？  

<img width="60%" src="/article/redux_saga_the_bottleneck/far_away.png">  
<br/>
<span style="font-style: italic;">fig.2 長大な変更距離に苦しむ家族</span>  

一言で言えば変更距離が大きいということになります。  
変更距離に関してはこちらの記事でも触れています。  
https://blog.oskn259.com/article/optimize_for_requirement_change  

要は**ちょっとした変更**のために、**大量のコードを編集**しなくてはならないということです。  

このときのプロジェクトは新規機能が次々要求され、リファクタの時間を取りづらいものだったので、
この変更距離の大きさは致命的でした。  



## async/awaitでよくね？
今のtypescriptにはasync/awaitという便利なものがあります。  
普通にこれを使って書いた方が削れる箇所が多そうです。  

実際にそのように記述したものがこちらです。  

<details>
<summary style="font-weight: bold;">改善版ミニチュア（展開）</summary>

```
page/
  top.tsx
store/
  reducers.ts
  actions.ts
api/
  getUser.ts
```

```tsx
// page/top.tsx
import * as apis from '../api/getUser';
import * as actions from '../store/actions';

export const Component = ({ dispatch, store }) => {
  useEffect(() => {
    apis.getUser()
      .then(response => dispatch(actions.getUserResponse(response)))
  }, []);

  return (
    <div>{store.user.name}</div>
  );
}
```

```ts
// store/reducers.ts
import * as actions from './actions';

export default function subReducer(state: State = { name: null }, action: Actions): State {
  switch (action.type) {
    case actions.GET_USER_RESPONSE:
      return { ...state, name: action.response };
    default:
      return state;
  }
}

```

```ts
// store/actions.ts
export const GET_USER_RESPONSE = 'GET_USER_RESPONSE';
export const getUserResponse = (response: object) => ({ type: GET_USER_RESPONSE, response });
```

```ts
// api/getUser.ts
export function getUser() {
  return axios.get('/user').data;
}
```
</details>

どうですか？  
ちょっと**良心的**になった感じがしますよね。  

`saga.ts`ファイルと、非同期処理の発火アクションとなっていた`GET_USER`を削除する事ができました。

ミニチュアだと伝わりづらいのですが、
実際にはこれの何倍もある規模で同じ現象が発生しており、
Promiseを使用した方が遥かに把握しやすく、変更距離の小さいコードとなりました。  

特に、**ファイル数が減ったということが重要**です。  
ユーザーから見た一つの機能の裏には数個のAPIが組み合わさっており、
redux-saga環境においてそれらを追加し一つの機能としてまとめようとすると、
<span style="color: #ff0000; font-weight: bold;">
十数枚のファイルを並行して把握しながら作業
</span>
を進めることになります。  
サイトとしての機能が巨大化するにつれ、この傾向も強まっていました。  

レッドブルでゴリ押す生活ともお別れできるというわけです。  



## 結論
redux-sagaを廃止して、普通にPromiseやasync/awaitを使用して記述した方が非同期処理をきれいに書けました。  
きれい、というのは変更距離が小さいということで、将来の変更に対して強いということです。  

このことから、
<span style="color: #ff0000; font-weight: bold;">
いらぬ仕組みを追加して書類の処理ばかりしている中年管理職
</span>
のようなフレームワークというイメージを持つようになりました。  
※個人のイメージです

redux-sagaの力を100%引き出せていたかは定かではありませんが、
学習コストと有用性を比較した時に、**Promiseで十分**という結論になりました。  
属人性の排除（Promiseがわかる人なら編集可能）という面でも、この判断で正しかったと思っています。  

今回の話とは直接関係ありませんが、
Storeパターンは（必要ではあるが）本質でない記述が多いと個人的には思っていて、
その部分を抽象化するinterface, abstract classを作成して機能変更の効率化も図っています。  

その話もタイミングがあれば書きたいですね。  
