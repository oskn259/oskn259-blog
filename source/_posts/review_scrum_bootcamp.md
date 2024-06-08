---
title: 【レビュー】SCRUM BOOTCAMP
date: 2021-10-31
tags: ['Management']
author: oskn259
---

どうも、oskn259です。  

最近は実際の開発のみでなく、開発の進め方みたいなところに興味があり、
アジャイルサムライのレビュー記事を書いたりしています。  
https://blog.oskn259.com/article/review_agile_samurai  

今回はこちらの本のレビューをやっていきます。  
https://www.amazon.co.jp/-/en/%E8%A5%BF%E6%9D%91-%E7%9B%B4%E4%BA%BA/dp/4798163686/

アジャイルサムライの記事にて基礎的なことは書いてしまったので、
SCRUM BOOTCAMPを読んで新たに得た知識に絞って書いていきたいと思います。  



## 得た知識

### スクラムマスターの概念
スクラムマスターの概念をより正確に把握できました。  

開発の一部分を担当するというイメージでしたが、
実際はスクラムという開発体制が動くために必要なことをするのが仕事のようです。  
例えば以下のようなことですね。  

* チーム外部からの横槍を排除
* POやステークホルダーの協力を取付ける
* 開発メンバー全員で連携が取れるようにする
  - デイリーにはいない方がいいぐらい
* テストの自動化など、一部DevOps的な準備も行う
* やる意義を浸透させて、MTGや仕組みの形骸化を防ぐ
* POとは引っ張りたい方向が異なるので、兼任は不可能


### 結局いつまでにできそう？
案件を振る側からすれば **「いつまでにできそう？」**
は特に初期段階で確認しておきたいハズです。  
ここで報告する数字で先方の期待感は大きく変わりますし、重要ですね。  
しかしアジャイルにおいては、安定したベロシティがあって初めてまともな時間見積もりが得られます。  

どうするのかと言えば、完全な見積もりはどこまでいっても無理という前提のもと、
**少しでも近いと思う数字を報告する**しかありません。  

例えば適当なタスクをひとつ選んで実装してみて、
何日かかったかをベースに計算するのは良さそうです。  
一週間で何ポイントできそうか、開発チームの肌感を聞いてみるのも良さそうです。  

当然、人間は病気にかかるし有給も取るし辞職もあり得るので、
報告する日数にはバッファを持たせましょう。  

<img width="60%" src="1000.jpg">    
<br/>
<span style="font-style: italic;">
fig.1 踏み倒す気満々の空条さん
</span>  


### デイリーは進捗報告ではない
<span style="color: #ff0000; font-weight: bold;">
デイリーは、POやスクラムマスターに何かを報告する会議ではありません。  
</span></br>
開発チーム内部で情報共有し、問題の早期発見、チーム内での助け合いを促すために行います。  

なので、スクラムマスターやPOが参加することは必須ではないんですね。  


### ベロシティは本来安定する
開発チームを結成してから数スプリントを終え、
スクラムにも慣れてきました。  
直近のベロシティを見ても上昇傾向にあるように見えます。  
ベロシティは今後も上がっていくのでしょうか？  

そうではありません。  
<span style="color: #ff0000; font-weight: bold;">
ベロシティは安定していないと信頼できません。  
</span>

ベロシティが不安定になる要素としては、
* 練度の低さから、初期段階での見積もりのズレが大きい
* 外圧により、小さいタスクを高ポイントにして数字を良く見せようとする
といったものがあります。  
こうした状況下でベロシティを計測しても、**それは意味のない数字**です。  

また、チームの練度が上がっていったとしても、
以前なら5にしたストーリーも今では3に思える、
という状況が考えられます。  
つまり、**ベロシティが変わっていなくても実際に終わらせている仕事量は増えている**のです。  

真にベロシティを向上させるのは、例えば以下のような要素です。  
* 開発PCのスペックを上げた
* 外部からの差し込みタスクを排除した
* 余計な会議を排除した


### 妨害リスト
タスクを管理するスプリントバックログにおいて、
開発を阻害している要素を列挙して、その解決をタスクとしてスクラムマスターに割り当てておきます。  

<img width="30%" src="counter.jpg">    
<br/>
<span style="font-style: italic;">
fig.2 妨害をカウンターするスクラムマスター
</span>  

Todo, Doing, Done のように管理しているスプリントバックログにおいて、
スクラムマスターのレーンを作るのです。  

チームの受ける妨害や、そのためのスクラムマスターのタスクも、開発タスクと同じように公開します。  


### スコープを調整するということ
時間や予算を固定したなら、あと調整できるものはスコープ（どこまで作るか）しかありません。  
スコープの調整にあたってはどのストーリーをやる/やらない という調整のみではなく、
当初の要望を解決できるもっと簡単な形はないか？という調整もあり得ます。  

例えば、KPIはリアルタイム表示出なくても、
必要なタイミングでxlsでエクスポートできれば良い、といった具合です。  



## 全体の感想
言ってしまうと、個人的にはアジャイルサムライの方が断然分かりやすかったです。  

共通の著者に西村直人さんという方がいらっしゃるのですが、
同じ人が書いたとは思えないぐらい読みやすさに差がありました。  

**今何についての話だっけ？**
と何度も自問自答しながら読んでいました。  

30代から衰えが始まると言いますし、
僕も耄碌が始まってしまったのかもしれません。  
老いに抗っていきたい。  

ですが良かった点もあります。  
* 基本的な概念を、予備知識があまり必要ない形で説明されている
* 漫画が挟まっている分ボリュームとしては抑えられ、手軽に読める

おそらくですが、  
* SCRUM BOOTCAMP
  - 基本的な概念を詰め込んだ
  - 開発自体初心者向け
* アジャイルサムライ
  - 現場での「あるある」をもとに解説
  - 近い経験をしている人だと、あ〜、となる表現が多い
のような書き分けがされているのだと思います。  