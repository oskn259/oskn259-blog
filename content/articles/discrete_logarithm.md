---
title: 公開鍵暗号が安全といわれる拠り所を、なるべ〜く簡単に
createdAt: 2021-12-31
updatedAt: 2021-12-31
tags: ['Cryptography']
banner: sushi.jpg
author: oskn259
---

どうも、oskn259です。  

皆さんは、本人確認を求められた場合どうしていますでしょうか。  
免許証、保険証、マイナンバーカード、パスポート  
ひとまずそのあたりを出しておけば役所での手続きに問題はなさそうですね。  
個人的にはまず保険証を出して、顔写真付きのものを求められたら、<span style="text-decoration-line: line-through;">心の中で舌打ちしながら</span>マイナンバーカードを提示しています。  

通信の世界ではどうでしょうか。  
本人確認を求めてくるのはコンピュータですし、パスポートの画像を送っても理解してもらえません。  
ボディーランゲージも通用しない（古い）  
コンピュータ間の本人確認には公開鍵暗号という方法が用いられており、他者がなりすましできない形で本人確認を行うことができます。  

しかし、 **なりすましできないというのは一体何なんでしょうか？**  

<span style="font-style: italic">
お札、免許証、LINEアイコン、年収、学歴、整形、<span style="text-decoration-line: line-through;">あなたの子よ</span>  
</span>

あらゆるものが偽装される世において、何をもってなりすましできないなどと言っているのでしょうか？  
そもそも本人確認とはあなたのみが持ちうる情報をもとに行われるものです。  
しかしコンピュータの世界では、免許証のノリでそれを提示した瞬間に複製され、その後は誰もがあなたを名乗れるようになります。  
鉄製の鍵や免許証とはワケが違います。  

最近では、インターネットの後の最大の発明としてブロックチェーンが話題になっていますが、こうした暗号化技術はまさにブロックチェーンの中核部分です。  
公開鍵暗号の技術を使って、本当に本人の指示による送金なのかを確認しているのです。  
なりすまし命令を通すことができれば、世界中のBTCはあなたのものです。  

<img width="50%" src="/article/discrete_logarithm/kati.jpeg">    
<br/>
<span style="font-style: italic;">
fig.1 公開鍵暗号を突破して人生逆転！
</span>  

もちろん、公開鍵暗号方式ではそうした問題はクリアされています。  
今回は公開鍵暗号のプロセスと、その原理である離散対数問題をなるべ〜く簡単に解説していきます。  



## 公開鍵暗号方式のプロセス
### 問題
Aが友人の口座にお金を振り込みたいとします。  
そうすると、Aは自分の口座があるB銀行に振り込みの指示をする必要があります。  
自分の口座から5000円を友人の口座に振り込み、という指示を発行するのです。  

しかし、Aになりすましてこの指示を発効できたらどうでしょうか？  
Aの口座から5000兆円を俺の口座に入金！  
といったことができてしまうのです。  
つまり、<span style="color: #f00;">この指示は本当にAが発効したものか</span>という確認が必要になるのです。  


### 準備
この場合、本人であることを証明したい者がA、Aに対して証明を求める者をBと言えそうです。  
Aはまず秘密鍵を生成し、この内容は一切誰にも教えません。  
墓まで持っていく秘密です🪦  

その後Aは、秘密鍵をもとに公開鍵を作成します。  
公開鍵は秘密鍵から一意に求めることができます。  
公開鍵というだけあって、この内容は誰が知っても問題ありません。  
Bはあらかじめ公開鍵を受け取っている状況です。  

これらの鍵は言うなれば、 **閉める鍵**と **開ける鍵**です。  
秘密鍵を使って暗号化して、公開鍵を使って復号化できるということです。  


### 本人確認
AはBに対して、「友人の口座に対して5000円振り込んで」というメッセージMを送信します。  
さらに、Mを秘密鍵を使って暗号化したメッセージ「くぇrftgyふじこ」M'も併せて送信します。  
このM'を **署名**と呼んだりします。  

受取側はこの2つのメッセージを受け取ります。  
メッセージの内容自体はMを見ればokです。  
ですが、この指示をそのまま実行してよいでしょうか？  
本当に本人からの指示でしょうか？  

それを確認するために、公開鍵を使って「くぇrftgyふじこ」を復号化してみましょう。  
するとなんと、元のメッセージ「友人の口座に対して5000円振り込んで」が得られました！  
ということは、MやM'を生成したのは間違いなく、この公開鍵に対応する秘密鍵を持つ者、つまりA本人！  
この指令は実行してよさそうです。  


### 偽造してみよう
悪いやつCが「Cの口座に5000兆円振り込んで」というメッセージMを、AのふりをしてBに送りつけようとしています。  
BにはM'も提出しなければならないので、適当に「uryyyyyyyyyyyyy」とか渡しておきましょう。  
だってAの秘密鍵ないから計算しようがないし。  

Bはこのメッセージを、Aからの指示として受け取りました。  
5000兆円！？ホントにやってええんか...  
それを確認するために、Aの公開鍵を使って「uryyyyyyyyyyyyy」を復号化してみましょう。  
すると、「mata髪nohanasi_siteru...」などというメッセージになりました。  
メッセージと一致しません！  
このメッセージは、誰かがなりすましで発行していそうです。  

<img width="60%" src="/article/discrete_logarithm/gdp.png">    
<br/>
<span style="font-style: italic;">
fig.2 アメリカのGDPでも5000兆円もないんだよなぁ
</span>  



## 離散対数問題
ここまで説明したように公開鍵暗号とは、閉める鍵と開ける鍵を分割して、開ける鍵のみを公開する方式です。  
しかし、<span style="color: #f00;">本当にそんな分割が可能なのでしょうか？</span>  
公開鍵は秘密鍵から一意に計算できると言いました。  
その逆の計算は本当にできないのでしょうか？  
ここで出てくるのが、 **離散対数問題**です。  
順番に見ていきましょう。  


### 原始根
```
3以上の素数 p と 1 以上 p-1 以下の整数 r が以下の性質を満たすとき r を mod p の原始根と呼びます。

r, r^2,⋯,r^(p−2) のいずれも、 p で割った余りが 1 でない。
```

分かりづらいですね。  
例を見てみましょう。  

```
素数 p = 13 のとき
2^1 mod 13=2
2^2 mod 13=4
2^3 mod 13=8
2^4 mod 13=3
2^5 mod 13=6
2^6 mod 13=12
2^7 mod 13=11
2^8 mod 13=9
2^9 mod 13=5
2^10 mod 13=10
2^11 mod 13=7
```

どこにも1は現れませんね。  
これによって、2は mod 13 における原始根といえます。  
(mod 13 においては 6, 7, 11 も原始根です)  


### 不可逆な計算
なぜこんな説明を唐突にしているのでしょうか。  
お気づきの方もいるかもしれませんが、上記の例において、 **計算結果は2~12の間で重複なくばらけています**。  

もう少し一般化して言えば、
```
素数 p と、それに対する原始根 r を見つけておけば
r, r^2, ... , r^(p-2)
の値は 2 ~ p-1 の中で重複なくバラける
```
重複なく、を正確に言えば
```
r^x mod p = y
としたとき、x, yは1対1に対応する
```
ということになります。  

これと併せて重要なのが、<span style="color: #f00; font-weight: bold;">r^x mod p = y において、yからxを逆算できない</span>ということです。  
自分がyを知っていて、それに対応する唯一のxが間違いなく存在するのに、どういうわけかそれを求めることはできません。  
言うなれば、 **中身が見えないあみだくじ**を実現できるのです。  


### 暗号化への利用
前述の、
* xが分かればyは計算可能
* yがわかってもxは不明
という特性は、まさに秘密鍵(x)と公開鍵(y)が備えるべき特性です。  

こんなややこしいことしなくてもx, yを全く関係ない値にすればいいじゃん、とも思えますが、秘密鍵で暗号化したものを公開鍵で復号しなくてはならないことを思い出してください。  
その具体的な計算は今回は扱いませんが、前述の計算により得られたx, yは閉める鍵、開ける鍵として機能する値になります。  



## まとめ
いかがでしたでしょうか。  
数式をテキストで打ってるのでちょっと見づらいですね。  

暗号技術というと企業vsハッカーみたいな印象があるかもしれませんが、ブラウザの通信にも普通に使われています。  
エンジニアなら尚更、SSH鍵を生成するというのはよくある事ですし、昨今勢いのあるブロックチェーンにおいてはその中核技術となっています。  
サーバーに好き勝手ログインしたり、なんの確認もなくBTCを送信するわけにはいきませんよね。  

個人的感想では、暗号化の知識がなくてもそういった分野はライブラリ化され、インフラに取り込まれていき、個人のエンジニアが気にしなくても問題はないような気はしています。  
ただ、とっさに漢字が書けないとダサいのと同じで、教養として知っておくべきないように思います。  
それに、アカギのカンに対する勘違いを矢木が利用したように、そういった静かに横たわる認識の差を、攻撃者は狙ってくるものなのです。  

<img width="40%" src="/article/discrete_logarithm/yagi.png">    
<br/>
<span style="font-style: italic;">
fig.3 githubで秘密鍵を発見する矢木
</span>  



## 参考
https://pebble8888.hatenablog.com/entry/2017/06/10/231249
https://manabitimes.jp/math/842
https://qiita.com/angel_p_57/items/f2350f2ba729dc2c1d2e