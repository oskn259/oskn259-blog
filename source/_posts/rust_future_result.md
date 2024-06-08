---
title: 【Rust】Future, Resultの処理をチェーンさせる際のチートシート
date: 2022-04-10
tags: ['Rust']
author: oskn259
---

どうも、oskn259です。  

ここ数年はTypescriptの案件が多く、そろそろ他の言語にさわりたいと思ってRustに触り始めました。  
TSに甘やかされて~~バブバブして~~いた身としては、厳格な静的型付け言語は覚えることが多いですね...  
でも、こうした概念を習得しておけば、今後のあたらしい技術にもついていきやすいハズです。  

今回は、FutureやResultが配列の要素になっている際によく使いそうな表現をチートシートにしてみました。  
ほぼ自分向けですね。  



## 事前の定義
シンプルに、受け取った値に1を加えて返却する関数を用意しました。  
asyncの有無、Resultの有無で4パターンです。  

vectorの要素にこれらを適用するとき、どのような違いがあるかを見ていきましょう。  

```rust
fn modify(v: i32) -> i32 {
    v + 1
}

async fn modify_async(v: i32) -> i32 {
    v + 1
}

fn modify_result(v: i32) -> Result<i32, String> {
    Ok(v+1)
}

async fn modify_result_async(v: i32) -> Result<i32, String> {
    Ok(v+1)
}
```



## 動作サンプル

### 通常のケース（Futureなし、Resultなし）

普通にmapをチェーンさせれば配列処理はokです。  

```rust
vec![1,2,3]
    .into_iter()
    .map(|x| modify(x))
    .map(|x| modify(x))
    .collect::<Vec<_>>();
```

触っているうちに理解しましたが、 `collect`メソッドがいろんな変換を引き受けてくれるようです。  
この例では `collect::<Vec<_>>`として使用していますが、
このように、型情報を与えるだけでその型に変換してくれます。  


### 配列内のFutureを扱う

要素としてFutureを持つ配列を扱う際にはどうしたら良いでしょうか。  
以下の例では `join_all` を使ってFutureを完了させながら、次の処理に進んでします。  

```rust
async {
    let futures1 = vec![1,2,3]
        .into_iter()
        .map(|x| modify_async(x));
    let tmp1 = join_all(futures1).await;
    let futures2 = tmp1
        .into_iter()
        .map(|x| modify_async(x));
    let result = join_all(futures2).await;
    dbg!(result);
}.await;
```

やりたいことは `modify_async` を2度適用したいだけなのですが、大掛かりなコードです。  
Futureに対しては `then` メソッドを使用することで、処理をチェーンできます。  

```rust
// async func(future chain)
async {
    let futures = vec![1,2,3]
        .into_iter()
        .map(|x| {
            modify_async(x)
                .then(|y| modify_async(y))
        });
    let result = join_all(futures).await;
    dbg!(result);
}.await;
```

改善の余地はありそうですが、先の例よりも見やすくなりました。  



### 配列内のResultを扱う

Result型を扱う際には `match` を使い、 `Ok`, `Err` 型のどちらであるかをパターンマッチするのが基本です。  
しかし一つ結果を得るごとにこの記述をするのは厳しいものがあります。  

Result型は、以下の例のように `and_then` を使ってチェーンできます。  

```rust
let result = vec![1,2,3]
    .into_iter()
    .map(|x| {
        modify_result(x).and_then(|y| modify_result(y))
    }).collect::<Vec<_>>();
dbg!(result);
```

これによって、 `Ok` が得られた場合のみにその先を実行するチェーンが完成します。  
チェーンの途中で `Err` が発生した場合、その先の処理は実行されません。  

ちなみに、以下のように `collect` に型を指定すると、
Ok(x) の中身xをすべて取り出した1つのResultとして結果を得ることができます。  

```rust
    }).collect::<Result<Vec<_>, _>>();
```



### 配列内の Future<Result> を扱う

Futureであることに変わりはないので、まずは先の例と同じく then を使って対応します。  

```rust
async {
    let iter1 = vec![1,2,3]
        .into_iter()
        .map(|x| {
            modify_result_async(x)
                .then(|y| async move {
                    match y {
                        Ok(v) => v,
                        Err(_) => -999,
                    }
                })
        });
    let result1 = join_all(iter1).await;
    dbg!(result1);
}.await;
```

thenに与えたクロージャーの中でResult型をそのまま扱うことになるので、
matchの段階から記述してやる必要があります。  
処理をチェーンさせる方法もよくわかりません。  

この書き方しかできないということは当然なく、
`Future<Result>` に対してもand_thenが用意されています。  

```rust
async {
    let iter1 = vec![1,2,3]
        .into_iter()
        .map(|x| {
            modify_result_async(x)
                .and_then(|y| modify_result_async(y))
                .and_then(|y| modify_result_async(y))
        });
    let result1: Result<Vec<_>, _> = join_all(iter1).await.into_iter().collect();
    dbg!(result1);
}.await;
```

and_thenに与えるクロージャーでは、 `Future<Result<T, U>>` における `T` を引数としてとることができます。  
これによって処理のチェーンが非常に書きやすくなっています。  



## おわりに
今回は解説というよりは、初学者（自分）が学習の過程でひとまず使えるチートシートという風味になりました。  

**Typescriptのあまりの都合の良さに沼**っていたい気持ちもありますが、
Rustみたいに不具合の種を厳しくシバく言語も別の楽しさがありますね。  

Rustはコンパイル時点で厳しくコードをチェックする言語ですが、こうした厳しさはバグ排除のために存在します。  
現行の言語（それこそtsも）においてもバグ排除の目的でRustの仕組みを部分的に輸入するような動きは十分あり得ると思いますし、
今学習しておくことは意味があると信じつつ、引き続き学習していきます。  
