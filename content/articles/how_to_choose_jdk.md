---
title: jdkの種類とは？どれを選べば良いのか？
createdAt: 2021-9-15
tags: ['java', 'architecture']
banner: zyaba.png
author: oskn259
---

これまでしばらくnode.jsにかかりきりだったこともあり、javaのアプデについて行けていない感...。  
僕の知ってるjavaはver 8のはずなんですが、最近の更新を見てみると17とかいう数字になっています。  
界王拳じゃねぇんだからと思いつつ昨今の流れについて調べて見たいと思います。  


## JDKバージョンの一覧
JDKといっても様々な開発元があり、oracleの開発したjdk、googleの開発したjdk...
というように様々なディストリビューションがあります。  

[https://qiita.com/yamadamn/items/2dd26a014791b9557199](https://qiita.com/yamadamn/items/2dd26a014791b9557199)  
現状のディストリビューションの種類や情報元については、こちらが詳しかったです。  

[https://www.slideshare.net/TakahiroYamada3/how-to-choose-jdk-20191101](https://www.slideshare.net/TakahiroYamada3/how-to-choose-jdk-20191101)  
細かい歴史はこちらの資料に任せます。  
要約するとこういった内容のようです。  

* JDK8~10まではopenjdkコミュニティが開発したものをベースにoracleが拡張を行うことで、oracle JDKとして公開していた
* openjdk11以降はoracleが拡張機能をopenjdkに寄贈し、openjdk = oracle JDK となる
* こうして拡張されたopenjdkをベースに、各社が独自のopenjdk distributionを開発する
* ある時点から、openjdk8 LTSのサポートをRed Hatが主導するようになる（？）

<br/>


#### ディストリビューションの種類

* Oracle JDK
  - 従来からのメインディストリビューター
  - ドキュメントが豊富
  - ≠ Oracle Open JDK
* Red Hat Open JDK
  - Oracleに次ぐOpenJDK貢献者
* Azul Zulu
  - 素のOpenJDKビルドに近かったが、コンテナ上での動作対応など機能拡張が始まっている
* AdaptOpenJDK
  - コミュニティに最も近い存在
  - 広範なプラットフォーム対応
  - コンテナ上で動作可能
  - バージョン切り替えシステムを利用可能
  - TCK/JCKを通過していない問題が残る
* その他諸々...

<br/>


#### アンケートにて使用率の高いもの
* JDKバージョンは8
* 種類は、Oracle JDKもしくはAdaptOpenJDK

<br/>


#### サポート期間
* OracleJDK
  - 8(LTS)
    - Premier Support: March 2022
    - Extended Support: December 2030
  - 17(LTS)
    - Premier Support: September 2026
    - Extended Support: September 2029
* AdaptOpenJDK
  - 8(LTS)
    - At Least May 2026
  - 17(LTS)
    - OpenJDK17の開発が続く限り、との事
<br/>

・参考  
https://www.oracle.com/jp/java/technologies/java-se-support-roadmap.html  
https://adoptopenjdk.net/support.html  

ただし、「サポート」の内容がどちらも曖昧に見えます。  

<br/>


## どれを使うのか？
サポート期限や、アップデート頻度は最新の情報を確認し、
以下のことを確認、予測しながらディストリビューションやバージョンを決定するのが良さそうです。  

* セキュリティホール発見時の対応速度
* 言語としての速度改善
* 不具合発見時の修正速度
<br/>

大雑把な印象としてはこういった採用傾向になるように思います。  
* Oracle JDK
  - サポートに支払う費用は用意できる
  - 長期的に動かすシステムを構築したい、無期限サポートを受けたい
  - 実績の多いJDKを採用したい、ドキュメントの豊富さが重要
* AdaptOpenJDK
  - コンテナ上で動作させたい
  - 周辺ツールの充実と、開発の快適さを重視したい
<br/>

バージョンとしてはLTSである8, 11, 17が候補になります。  
ここでは、安定と機能の豊富さの意味で両極端になる8と17を取りあげます。
* ver 8
  - 歴史が長く、実績の豊富なバージョン
  - 枯れた技術
  - 長く使用された今でも、今後長期のサポート期間が設定されている
  - 金融システムなど、故障率が重要な問題になり、システム運営に費用がかけられる場合に向く
* ver 17
  - 8より後続のバージョンで追加されてきた、様々なプログラミングパラダイムを使用可能
  - LTSと銘打たれており、長期サポートが期待できる
  - 2021/9リリース、枯れた技術とは言いづらい
  - ベンチャーの自社開発など、最小の費用でスピーディーに機能実装したい場合に向く

<br/>


## まとめ
この調査を進める中で知ったのですが、JDK 17 LTSがリリースされたのって今月なんですね。  
個人的な嗜好としては、17に慣れて、その知識を資産として長期間使いたいという風に思いますね。  

* Oracle JDK, AdaptOpenJDK あたりが有名どころ
* 実績のOracle, トレンドキャッチアップのAdapt
* 8がド安定、17もLTSとしてリリースされたので期待
* サポート内容については、まずはお問い合わせください
<br/>

界隈識者的にはどうなんでしょうか。
