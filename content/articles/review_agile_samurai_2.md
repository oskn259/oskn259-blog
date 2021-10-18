---
title: 【解説】アジャイルサムライ（実践編）
createdAt: 2021-10-17
updatedAt: 2021-10-17
tags: ['Management']
banner: glass.jpg
author: oskn259
---

どうも、oskn259です。  

今回はこちらの記事の続き、アジャイルサムライの解説記事になります。  
https://blog.oskn259.com/article/review_agile_samurai

前回までの内容でプロジェクトの目的や方向性が定まり、
チームメンバーがそれを共通認識として持つことができました。  

これを実作業に落とし込む工程を見ていきましょう。  


## アジャイルな計画づくり
* メンバーの退職
* 思っていたほど開発速度がない
* お客さんの心変わり
* 期間短縮

必ずやってくるこうした現実に立ち向かうには、**スコープを柔軟に**保つことが必須です。  
したがって我々は、
<span style="color: #ff0000; font-weight: bold;">
顧客に対し、新しいストーリーを追加するなら同量のストーリーを削ってもらうことを約束してもらわねばなりません
</span>
。  
それをしないなら、それは **「奇跡によるマネジメント」** に頼ることになります。  

<img width="80%" src="/article/review_agile_samurai_2/miracle.jpg">    
<br/>
<span style="font-style: italic;">
fig.1 奇跡によるマネジメント
</span>  

これはお客さんに全てのリスクを負わせるということではありません。  
状況の変化に関わらず、開発チームが価値（動くソフトウェア）を提供し続けるために、
以下のようにして計画を立てていきます。  


### 1. マスターストーリーリストを作る
顧客と一緒に考えたストーリーの全てを含むリストのことを**マスターストーリーリスト**と呼びます。  
ここからさらに、市場価値のある最小単位として、**リリース**と呼ばれるストーリーの集まりを定義してきます。  
リリースは第一弾まであればよく、それが実際にリリースされてから第二弾を考えます。  

### 2. ストーリーポイントの見積もり
[先述](https://blog.oskn259.com/article/review_agile_samurai#%E8%A6%8B%E7%A9%8D%E3%82%82%E3%82%8A)の、ポイントを使った方法でストーリーの大きさを見積もります。  
この時点では、全体として何ヶ月かという数字は得られません。  

### 3. 優先順位をつける
ストーリーを優先度順に並べ替えます。  
PJがどんな状況に置かれているか分からない遠い未来ではなく、
**重要なことは直近で終わらせてしまう**のです。  

基本はビジネス上の重要度を元に判断しますが、
アーキテクチャ的なリスクという観点も存在します。  
「このストーリーが問題なく完了するなら、設計に問題がなかったことを意味する」
といった内容のストーリーは優先すべきでしょう。  

### 4. ベロシティを見積もる
開発をスタートし、イテレーションあたりの完了ポイント数、つまりベロシティを計測します。  
はじめは開発環境や連携方法など、各種整備のためにベロシティはブレがちですが、
次第に安定します。  

これはあくまで**チームとしてのベロシティ**であり、
個人の能力を測るものではありません。  
個人の能力を測定すると、チームとしての協調が失われます。  

### 5. 期日を仮決めする
ベロシティとポイントを元に、完了日時のあたりをつけます。  
重要なのは**期待のマネジメント**で、
何かのために何かを諦めねばならない事は変わりません。  

顧客に約束できる内容は以下のいずれかです。  

* 期日固定
  - リリース日時を約束する
  - スコープを絞り、一部機能を諦める可能性がある
* フィーチャーセット固定
  - 一定の機能が完了するまではリリースしない
  - そのためには時期は多少動かせる



## イテレーションの運営
アジャイルでは、動くソフトウェアをイテレーションごとに顧客に届けます。  
「完成」したストーリーは、いつでもリリースできる状態になっています。  
そのために、以下のステップでストーリーを完成させます。  

### 1. 分析、設計、作業の段取り
**全てを文章にまとめる時間はありません。**  
分析は必要になった段階で初めて、必要なだけ行います。  

基本的には、以下のことがまとまっていれば良いでしょう。  
* ストーリーの説明
* タスクリスト
* 受け入れテスト条件

ストーリーが複雑であれば、相応に分析する必要があります。  
こうした場合、以下の概念について顧客と一緒に考えるのが役に立ちます。  

* フローチャート
  - システムの動作や手順を示す
* ペルソナ
  - ユーザーがどんな人たちで、何をしたいのか
* ペーパープロトタイプ
  - 画面デザインを何パターンか紙に書き出す
* 受け入れテストの条件を書き出す
  - 「どうしたら、この機能がうまく動作しているってわかりますかね？」


### 2. 開発作業
ストーリーに取り掛かる前に済ませておくべき作業には以下のようなものがあります。  

* ソースコード管理の整備
* ビルド自動化
* 開発環境、テスト環境、本番環境の作成
* 技術選定、ベース部分の作成

ストーリーの中から、アーキテクチャをend to endで検証できるようなものを選択し、
それをまず完成させて土台とするのは良い考えです。  
<span style="color: #ff0000; font-weight: bold;">
開発プラクティスを何度も検証する時間はありません。
</span>
<br/>
ここでしっかりした土台を作りましょう。  

これらの作業を終わらせるイテレーションのことを、
イテレーション・ゼロと呼びます。  
顧客に成果を届け始めるのは、この次のイテレーションからになります。  


### 3. テスト
ストーリーを完成とするには、テストが必須です。  
開発者が作成した自動化されたテストの他に、 **顧客の前で受け入れテストを実施** します。  

自動化されたテストがあるのにわざわざ受け入れテストを行うのは、
顧客には成果物を受け入れるかどうかを判断する責務があり、ここがその判断のタイミングだからです。  
いつも以上に真剣に動作を確認してもらえるでしょう。  

それに、単体テスト、結合テストが通っていても受け入れテストが失敗するというのは十分考えられます。  
面倒ですが、開発フローの一部として設けておきましょう。  



## 継続的な意思疎通
以下の4つのmtgをイテレーションごとに開催して、リズムを掴んでいきましょう。  

* ストーリー計画mtg
* ショーケース
* イテレーション計画mtg
* ミニふりかえり

また、デイリースタンドアップを毎日開催しましょう。  


### ストーリー計画mtg
これから直近で取り組むストーリーの調査が終わっているかを全員で確認します。  
顧客と受け入れテストの内容を再確認、
見積もりの数値におかしな点がないかを見るのもこのタイミングです。  


### ショーケース
顧客に成果物を「お披露目」します。  
見せるのはテスト環境で実際に動いていて、
必要ならすぐに本番にデプロイできる、動くソフトウェアです。  

<img width="60%" src="/article/review_agile_samurai_2/showcase.jpg">    
<br/>
<span style="font-style: italic;">
fig.2 ショーケースに陳列された肉
</span>  

もし何も見せるものがない状況でも顧客にきてもらい、ショーケースを開催します。  
それはメンバー全員が危機感を共有する機会になります。  


### イテレーション計画mtg
次回のイテレーションで取り掛かるストーリーを検討します。  
ここまでのベロシティをもとに、チームが終わらせる作業量を決定しましょう。  

また、プロジェクトの厄介ごとについて議論する良い場でもあります。  
バーンダウンチャートをつくり、進行具合が一目でわかるようにしましょう。  
バーンダウンチャートは残ポイントをグラフにしたもので、
作業の遅れ、ストーリーの追加によるプロジェクトへの影響を可視化することができます。  

<img width="50%" src="/article/review_agile_samurai_2/burn_down.png">    
<br/>
<span style="font-style: italic;">
fig.3 残ポイントが減少していく様子をグラフにする
</span>  


### ミニ振り返り
チーム全員が集まって15分程度で振り返りをしましょう。  

* うまくやれたことは？
* どうすればもっと上手くやれるか？
<br/>

<span style="color: #ff0000; font-weight: bold;">
振り返りは魔女狩りではない
</span>
ことに注意しましょう。<br/>
そもそもイテレーションの結果は、全メンバーが最大限努力した結果です。  


### デイリースタンドアップ
全員が集まり、メンバー一人一人が全員に対して、
* 昨日やったこと
* 今日完了させること
* 懸念点があればなんでも
を共有します。  
長くても10分程度にし、立ったままやりましょう。  

<img width="50%" src="/article/review_agile_samurai_2/standup.png">    
<br/>
<span style="font-style: italic;">
fig.4 みんなで立ってやりましょう
</span>  



## 現場の状況が見えるようにする
期限短縮、予算削減、規模縮小...  
コスト削減は経営者の仕事で、こうした要求がプロジェクトに向けられることは多数あります。  
しかし現場からすれば理不尽以外の何者でもない。  
どうすれば経営層、その他関係者にわかってもらえるのでしょうか？

プロジェクトの状況を常に可視化しておきましょう。  
単なる資料としてではなく、
メンバーが作業するリアルの現場に「貼りもの」として用意してあるのが良いでしょう。  

以下のような貼りものを活用します。  


### インセプションデッキ
作成した段階で、壁に貼っておきましょう。  
目的は何で、お客さんは誰で、誰が資金を投じているのか、
一目でわかります。  


### リリースボード
これまでのイテレーションで完了したものと、
未完了のものが一目でわかるようにストーリーを張り出します。  

（↓の表がしょぼいですが、実際はストーリーを書いたカードを貼っていきます）

|イテレーション1　|イテレーション2　|ToDo　|
|:-|:-|:-|
|story1|story3|story6|
|story2|story4|story7|
|      |story5|story8|
|      |      |story9|
|      |      |story10|


### ストーリーボード
現在のイテレーションで完了させるストーリーが、
今どうなっているかを可視化します。  

|未着手　|仕掛かり　|テスト待ち　|完了　|
|:-|:-|:-|:-|
|story1|story3|story6|story7|
|story2|story5|      |story8|
|story3|      |      |      |

イテレーション終了時には、
全てのストーリーがテストを終えて「完了」の位置に移動することになります。  


### バーンダウンチャート
残りのポイント数の推移をグラフにしたものです。  
残りの作業量がわかると同時に、
その減少速度（ベロシティ）を見ることで今後の作業の見通しを立てることができます。  

これを見せられる状況にしておく事は、
**期待マネジメント**の上で非常に役立ちます。  
経営者にこれを見せて、あとは淡々と事実を伝えればokです。  
「メンバーを半分にすれば速度が半分になって、完了時期が〜〜ヶ月伸びます。」



## その他共有すべき事

### 用語の定義
用語の定義が曖昧だと様々な不都合が生じます。  

* 間違った抽象化がなされる
* 機能ごとに別の単語が同一の意味を持ち、認識が大変に
* バグが増えて保守コストが高くなる

開発と業務をつなぐ共通の用語を定めましょう。  
ストーリーや図表でも、ここで定めた用語の使用を徹底しましょう。  


### バグを監視する
<span style="color: #ff0000; font-weight: bold;">
バグはその場で潰しましょう。
</span>
<br/>
バグの発生は常に監視し、その処理がどうなっているか追跡します。  
イテレーションの中でいくらかの時間をバグ潰しに割くのもアリです。  



## まとめ
ﾁｶﾚﾀ...

今回のまとめを通して特に
<span style="color: #ff0000; font-weight: bold;">
期待のマネジメント
</span>
がいかに大事かというのを再認識できたように思います。  

いかに技術職であっても、 **「どれくらいで終わりそう？(^^)」** という質問から逃れる事はできません。  
期日重視で突貫工事したのに、不具合が起こったら困った顔されるなんてことも良くあることでしょう。  
期待をうまくマネジメントして、自分もチームも幸せに仕事したいものですね。  

もう一つ、
<span style="color: #ff0000; font-weight: bold;">
集まって働く
</span>
ことは個人的に重要に思えました。  
メールでやりとりして一切伝わらなかったことが、
実際話すと一瞬で伝わるというのはよく実感します。  
ましてやソフトウェア開発という複雑なジャンルに挑むなら、
情報交換それ自体が難しいタスクになるでしょう。  

個人の印象としてslackなどのチャットは、
* mtgというほどではない小さい単位で共有できる
* ゆっくり文章を組み立てながら会話できる
のが強みで、対面で話すのは、
* 応答が高速なので、一つの議題に集中できる
* 議題とは違うところで発見があったりする
  - unknown unknowns の発見
という点が良さそうですね。  

unknown unknownsというのは「気づいていないことにすら気づいていない」
という状態のことで、これを発見するのは至難の業です。  
何気ない会話、共有する情報の量を地道に増やすしかなく、
そのためには **直接の会話という最も帯域幅の広い通信** を使うのが良いと思うのです。  
<br/>

ちなみに、本の終盤にある以下の箇所は力尽きて省略しました。  
まぁこの辺りは詳しい解説が本とか記事でいっぱいあるしｲｲﾖﾈ?

* ユニットテスト
* リファクタリング
* テスト駆動開発
* 継続的インテグレーション

<br/>

何卒。  