---
title: 適当なテーブル設計にシステム全体が苦しんだ話
createdAt: 2021-9-29
updatedAt: 2021-9-29
tags: ['Architecture']
banner: corn.jpg
author: oskn259
---

私事ですが、この度転職が決定し、一度正社員に戻ることになりました。  
様々考えた結果フリーランスを離れるという結果になりましたが、これに関しては別の記事にしようかと思います。  

今回は、フリーランスとして最後に携わったシステムの闇の部分を振り返りつつ、
今後同じ轍を踏まないようにする戒めの文章にしていきます。  

これを見た方々が、将来の惨事を回避していただければ幸いです。  
ちょっと長くなりますが、お付き合いください。  



## システムの概要

<img width="300px" src="/article/how_confusing_table_effects/matching.png">  

詳細は伏せますが、いわゆるマッチングサイトです。  
ユーザーは他のユーザーのプロフィールを閲覧できてLikeを送ることができ、
お互いにLikeをするとメッセージが可能になるという、オーソドックスなマッチングシステムです。  

僕がこのシステムにアサインされた時はまだリリース前の段階でしたが、
ある程度の基盤はできている状態でした。  
それをもとに突貫でリリースまでこぎつけたという経緯があるのですが、
これが全ての始まりでした。  

突貫工事が悪かったと言うよりは、既に用意されていた基盤に問題があったのです。  
より具体的には、**テーブル設計の悪影響をシステム全体が受けている**という形です。  

詳細を見ていきましょう。  


## テーブル構造
実際のテーブル構造を見ながら、問題を解説していきます。  
情報保護のため、実際のものから必要な情報を抜粋、一部修正しつつ掲載しています。  

筆者はテーブル設計のアンチパターンに関してはそこまで網羅できていませんが、
例えばこういう状態が発見され、これが危ういのはすぐに分かりました。  

```sql
mysql> describe user;
+---------------------+---------------------+------+-----+-------------------+-----------------------------+
| Field               | Type                | Null | Key | Default           | Extra                       |
+---------------------+---------------------+------+-----+-------------------+-----------------------------+
| id                  | bigint(20) unsigned | NO   | PRI | NULL              | auto_increment              |
| email_adddr         | varchar(200)        | NO   | MUL | NULL              |                             |
| password            | varchar(200)        | NO   |     | NULL              |                             |
| name                | varchar(50)         | NO   |     | NULL              |                             |
| status              | varchar(1)          | NO   |     | NULL              |                             |
| is_deleted          | tinyint(1)          | YES  |     | 0                 |                             |
+---------------------+---------------------+------+-----+-------------------+-----------------------------+

mysql> describe profile;
+---------------------------------+---------------------+------+-----+-------------------+-----------------------------+
| Field                           | Type                | Null | Key | Default           | Extra                       |
+---------------------------------+---------------------+------+-----+-------------------+-----------------------------+
| user_id                         | bigint(20) unsigned | NO   | PRI | NULL              |                             |
| email_addr                      | varchar(200)        | NO   | MUL | NULL              |                             |
| gender                          | varchar(1)          | NO   | MUL | NULL              |                             |
| name                            | varchar(50)         | NO   |     | NULL              |                             |
| date_of_birth                   | date                | NO   | MUL | NULL              |                             |
| user_membership                 | varchar(1)          | NO   | MUL | NULL              |                             |
| age_certification               | tinyint(1)          | YES  | MUL | 0                 |                             |
| self_introduction               | varchar(3000)       | YES  |     | NULL              |                             |
| is_deleted                      | tinyint(1)          | YES  |     | 0                 |                             |
+---------------------------------+---------------------+------+-----+-------------------+-----------------------------+
```

`user`はユーザーの登録に関わる情報、`user_profile`は他のユーザーに公開すべきプロフィール情報のテーブルです。  
（当初の概念は今となっては不明で、筆者はこのように理解しました）  
様々なモヤッとポイントが含まれています。  
ひとつずつ列挙していきましょう。  


### 重複フィールド 
例えば`email_addr`フィールドがどちらのテーブルにも含まれています。  

```sql
mysql> describe user;
| email_adddr         | varchar(200)        | NO   | MUL | NULL              |                             |

mysql> describe profile;
| email_addr                      | varchar(200)        | NO   | MUL | NULL              |                             |
```

これはユーザーがログイン時に使用する情報で、不整合があってはならない領域なので非常に危ういです。  
これを変更する際には、無意味に両テーブルを修正しなくてはなりません。  
`is_deleted`フィールドに関しても同様です。  

また、`name`フィールドも両テーブルに存在し、どちらを参照したら良いのか、
はたまたそれぞれ別の意味があるのか、テーブルを見る限りでは不明です。  

```sql
mysql> describe user;
| name                | varchar(50)         | NO   |     | NULL              |                             |

mysql> describe profile;
| name                            | varchar(50)         | NO   |     | NULL              |                             |
```


### 意味の重複
`user`テーブルの`status`フィールドは、ユーザーの登録状況（登録済、退会済、管理者による停止、など）を表します。  
これは`is_deleted`と役割が重複し、不整合の可能性が出てきます。  

```sql
mysql> describe user;
| status              | varchar(1)          | NO   |     | NULL              |                             |
| is_deleted          | tinyint(1)          | YES  |     | 0                 |                             |
```

例えば、`status`が退会済を示している場合、
`is_deleted`フィールドを確認せずとも、当然ユーザーは削除されていると分かります。  

しかし、ここで`is_deleted = false`だったとしたら、それをどう解釈すれば良いのでしょうか？  
退会したけど削除されていない？  
ユーザーの削除というのは、また別の特殊な意味があるのか？  

とにかく混乱します。  


### テーブルと意味の非対応
`user`はユーザーの登録に関わる情報、
`user_profile`は他のユーザーに公開すべきプロフィール情報のテーブル、
と先に記載しました。  
`self_introduction`フィールドが含まれている`profile`テーブルは、
ユーザーが公開したいプロフィール情報を保持するテーブルなのだと推測できます。  

しかし、それになぞって見て行った場合、いくつか不自然に見えるフィールドが存在します。  

```sql
mysql> describe user;
| name                | varchar(50)         | NO   |     | NULL              |                             |

mysql> describe profile;
| age_certification               | tinyint(1)          | YES  | MUL | 0                 |                             |
```

まず、`name`フィールドが`user`テーブルに存在するのはどう言うことでしょうか？  

このシステムにおいて本名は扱っておらず、nameと言えばユーザーが入力したニックネームのことを指します。  
後から変更も可能なこの情報は、`profile`テーブルに存在すべきではないでしょうか？  

更に、`age_certification`というフィールドが`profile`テーブルに含まれています。  
これは年齢確認が済んでいるかを表すフィールドで、ユーザーが自由に入力できるものではありません。  
管理者による承認を得て初めて設定できるフィールドです。  

一体、両者のテーブルは何を表しているのでしょうか？  



## テーブル構造に引っ張られるAPIコード
こういったテーブル設計の上にAPIコードを記述するとどうなるでしょうか？  


### 特定フィールドの無視
重複フィールドの問題に対して、APIはどのように対応すべきでしょうか？  
取れる方針は以下の2つです。  

* **片方のフィールドを無視する**
  - 片方のフィールドは、参照も変更も一切しない
* **両フィールドの生合成を担保する**
  - どちらを参照しても良い
  - 変更時は必ず両者を更新する

既存のAPIコードが採用していたのは前者で、現在でもこの仕組みは残っています。  
使用していない側のフィールドは、**間違っても参照してはなりません。**  
このルールを守った上でAPIコードが記述されています。  

この誤りを防ぐようなパターンや、コーディング規約の導入は一切ありません。  
**コーダーの脳みそだけが頼りです。**  

```ts
updateEmailAddr(newAddr: string) {
  // DO NOT update profile.email_adddr
  update('user', 'email_addr', newAddr);
}

getEmailAddr() {
  // DO NOT refer profile.email_addr
  return getValue('user', 'email_addr');
}
```
<br/>

意味が重複しているフィールドに関しても同様です。  
`status`と`is_deleted`の意味が重複していることを先に記載しましたが、
これに関しても、片方のフィールドを無視する方針を採用しています。  

```ts
updateStatusToQuit() {
  // DO NOT update profile.is_deleted
  update('user', 'status', 'quit');
}

isDeleted() {
  // DO NOT refer profile.is_deleted
  const status = getValue('user', 'status');
  if (status === 'quit' || status === 'banned') return true;
  else return false;
}
```
<br/>

こうした対応を徹底すれば動作としては成立しますが、既存のAPIコードでは
**この対応が徹底されていない部分があります**。  
<span style="color: #ff0000; font-weight: bold;">要するに、どちらがマスター情報かあやふやな箇所があります</span>。  

コードにすれば、こういう事態があり得るわけです。  

```ts
updateStatusToQuit() {
  // We correctly update is_deleted field! Thats it!
  update('user', 'is_deleted', true);
}

isDeleted() {
  // Status field must be maintaind, so we can refer it!
  const status = getValue('user', 'status');
  if (status === 'quit' || status === 'banned') return true;
  else return false;
}
```

手動での動作テストを通過しているので、今のところは整合性が保たれているんだと思います。  
しかし、いつ破綻するか分かったもんじゃありません。  

ごく小さい修正をするためにコード全体を把握しなければならない、
<span style="color: #ff0000; font-weight: bold;">コード全体で依存し合ったシステム</span>
と言わざるを得ません。  


### 一旦全てを取得して、その後加工する

ユーザーA, Bについて、AがBにメッセージ送信かを判断するにはどうしたら良いでしょうか？  
Aは登録済みユーザーで、年齢確認が済んでいて、有料会員であることを確認する必要があります。  

その情報がどこにあるかと言えば、
* `user`テーブルの`status`
* `profile`テーブルの`age_certification`
* `profile`テーブルの`user_membership`
という事になります。  

要するに、メッセージ送信可能かを判定するために、
`user`、`profile`の両テーブルから情報をとってこなくてはなりません。  

```ts
canSendMessage() {
  const status = getValue('user', 'status');
  const isAgeCertified = getValue('profile', 'age_certification');
  const membership = getValue('profile', 'user_membership');
  if (status === 'registered' && isAgeCertified && membership === 'premium') return true;
  else return false;
}
```

メッセージ送信の他にも、既存コードでは様々な判断において同じ状況が発生しています。  
<span style="color: #ff0000; font-weight: bold;">
各種テーブルに無作為に散らばった情報をAPIで拾い集めて加工する
</span>
ような作業を求められるわけです。  



## フロントコードへの波及
テーブルにあるデータは最終的にフロントにてwebページという形で表示する事になります。  
つまり、スキーマを定義してAPIから情報を取得する必要があります。  

既存のAPIコードにおいては、**テーブル構造をほぼ素通りでレスポンス**にしていました。  
このイカれたテーブル構造をフロントでそのまま受け取るという事です。  

どうなるでしょう？  

前述の、APIでコードで発生していた問題が、
<span style="color: #ff0000; font-weight: bold;">
そっくりそのままフロントコード内でも発生します
</span>。  

つまり
* updateするフィールドに気を遣わなければならない（特定フィールドの無視）
* APIをいくつも呼び出してその情報を統合しなければならない（一旦全てを取得）
ということで、特に後者はユーザーの体感速度に大きく影響します。  



## 何をどうすれば良いのか
テーブル設計の悪影響が全体に影響しているという説明をここまでしてきましたが、
つまり何に不便しているという事なのでしょうか？  

まとめれば、以下のことが問題と言えそうです。  

1. 一部の変更のために、全体を把握する必要がある
1. 名前が機能していない（名前を元に内容を推論できない）
1. フロントとAPI間の非効率な通信が、ユーザー体感速度を下げている

1を言い換えれば、コードの結合度が高いという事になります。  
これは技術の新旧は関係なく、デザインパターンの永遠のテーマですね。  

2は個人的には抽象化の問題と捉えていて、初期の構想がエンジニア間で統一されていないのが問題のように思います。  
`user`や`profile`という単語の指す意味が、人によって違ったという事ですね。  

3はURL名に紐づいた情報が散らかっているのが問題で、2の問題と実質同じという気もします。  

したがって、やるべきことは以下の2点になりそうです。  

* 機能ごとの結合度を下げる
* 概念設計を見直し、名前の意味するところをはっきりさせる



## 浄化槽の導入
長くなってきたので、いかに対策したかという話は次回の記事で解説します。  
