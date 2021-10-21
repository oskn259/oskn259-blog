---
title: 抽象化すれば本当に依存度は下がる？？？
createdAt: 2021-10-20
updatedAt: 2021-10-20
tags: ['Architecture', 'TypeScript']
banner: pine_sea.jpg
author: oskn259
---

皆さんは「抽象的」と聞くとどういうイメージが浮かびますか？  
アレだよアレ、とか、**そのような意味で申し上げたのではない**、とか様々あることでしょう。  

Wikipedia先生曰く
`思考における手法のひとつで、対象から注目すべき要素を重点的に抜き出して他は捨て去る方法である`
とのことです。  
今話してる流れ的に重要なところにフォーカスを当てる、という事ですね。  

プログラミング的にも抽象化は昔からある概念で、
特に**依存度を下げて疎結合にする**ために重要、と語られることが多いように思います。  
なんとなく雰囲気は分かるのですが、抽象化をすると依存度が下がる、
というのはどういう理屈でしょうか？  

今回はこの両者の関係を、**具体的に**掘り下げていきましょう。  



## 抽象化って？
以下のような、本屋を表すシンプルなクラスを考えます。  
```ts
class BookStore {
  bookList: string[] = [];

  addBook = (name: string) => this.bookList.push(name);
  getBookList = () => this.bookList;
  buyBook = (name: string) => {
    this.list = this.bookList.filter(book => book !== name);
  }
}
```

これを利用する側は以下のようなコードになります。  
```ts
const bookStore = new BookStore();
bookStore.addBook('完全教祖マニュアル');
bookStore.addBook('金持ち父さん貧乏父さん');
bookStore.addBook('パーフェクトPHP');

const list = bookStore.getBookList();
bookStore.buyBook('完全教祖マニュアル');
```

素晴らしい本屋ですね〜。  
利用側のコードでは以下の処理を行っています。  

* 本の追加
* 本の一覧を取得
* 本の購入

この処理を見ていると、どうも「本」でなくても当てはまりそうな気がしてきませんか？  
「本」を「家具」、「酒」に置き換えても意味として成り立つ感じがします。  
言い換えれば、**このコードの記述において、対象が「本」であることは知らなくても問題ありません**。

要は、**本屋というのは、商品を購入できるお店という概念の一部にすぎない**ということです。  
「本屋」のほうが具体的で、「商品を購入できるお店」のほうが抽象的ですよね？  
この抽象化された概念をコードにすると、以下のようになります。  

```ts
class Store {
  list: string[] = [];

  add = (name: string) => this.list.push(name);
  getList = () => this.list;
  buy = (name: string) => {
    this.list = this.list.filter(item => item !== name);
  }
}
```

```ts
const store = new Store();
store.add('完全教祖マニュアル');
store.add('金持ち父さん貧乏父さん');
store.add('パーフェクトPHP');

const list = store.getList();
store.buy('完全教祖マニュアル');
```

はい、何も問題なく書けますね。  
しかもこのコード、本に限らず他の商品にも流用できちゃうんです！  

```ts
const store = new Store();
store.add('建設予定地に入る権利');
store.add('30分話す権利');
store.add('絵本を売る権利');

const list = store.getList();
store.buy('建設予定地に入る権利');
```

なんと、オンラインサロンの情報商材にも適用することができました！  

このように、
<span style="color: #ff0000; font-weight: bold;">
使用するにあたって必要な側面のみを抽出すること
</span>
を抽象化といいます。  



## 抽象化の活用
**概念としては分かるけど、これが何の役に立つんや・・・？**  
ということで、もう少し実践的な例を出してみましょう。  

文字列を受け取って、どこかに出力したいという処理を考えます。  
ログ出力を想像してみてください。  
標準出力に表示してリアルタイムで確認したいものもあれば、
ログファイルに記録して蓄積したいものもあるはずです。  

単純に考えるなら、それぞれ出力用のクラスを作って、
場面によってこれを使い分けるというのができそうです。  
ここで抽象化を活用することで、
<span style="color: #ff0000; font-weight: bold;">
利用元のコードをほぼ変更せずに切り替える
</span>
ことが可能です。  

```ts
abstract class Writer {
  abstract write(message: string);
}
```

はい、シンプルですね。  
これは、「文字列を受け取って出力する」機能を表したクラスです。  
どこに？どうやって？という指定はここにはありません。  
**これぞ、抽象的な概念です。**  

```ts
class StdoutWriter extends Writer {
  write(message: string) {
    console.log(message);
  }
}
```

```ts
class LogfileWriter extends Writer {
  write(message: string) {
    fs.writeFile('./message.log', message);
  }
}
```

「標準出力への表示」、「ログファイルへの記録」という具体的な機能は、
Writerクラスを使ってこのように記述できます。  

え、
<span style="color: #ff0000; font-weight: bold;">
ファイル数無駄に増えてるだけじゃね
</span>
ですって？  

こうした抽象化がメリットをもたらすのは、使用側の立場に立ったときです。  

```ts
const writer = new StdoutWriter();
writer.write('圧迫祭りよッ');
writer.write('薄っぺらな藁の家');
```

先に作成したStdoutWriterを使うと、
標準出力へのメッセージ表示はこのように記述できます。  
ここで「やっぱりログファイルに出力したい！！」となったとき、
このコードをどう改変すればいいでしょうか？

```ts
const writer = new LogfileWriter(); // ココだけ！
writer.write('圧迫祭りよッ');
writer.write('薄っぺらな藁の家');
```

なんと、1ワード変えるだけで全てが完了してしまいました。  
StdoutWriterとLogfileWriterは、Writerクラスでもあるため、
このように同じように使うことができるのです。  

さらに、この処理を関数に切り出していたらどうでしょうか？  

```ts
function display(writer: Writer) {
  writer.write('圧迫祭りよッ');
  writer.write('薄っぺらな藁の家');
}
```

もはや何も変更する必要はなく、
この関数は**使い回しの効くコード資産**となります。  



## 依存している状態って？
「依存している」もしくは「密結合」という単語で表される状態について、
wikipediaから抜粋すると  
`各機能各データに対して、どのデータはどこで利用されまたどこで利用されていないか確実に判断できるよう整理、分割が行き届いている状態を結合度が低いと表現する`  
とのことです。  

<img width="50%" src="/article/abstraction_relieves_dependency/menhera.jpg">    
<br/>
<span style="font-style: italic;">
fig.1 多数のデータを公開しそれを外部から制御するため、依存度が高い
</span>  

結合度を低くする、もしくは依存を排除するには、
機能もしくはデータの使用を狭い範囲にとどめるということですね。  
例えばグローバル変数で状態を制御するシステムなんかは、密結合であり、全体が全体に依存していると言えそうです。  



## 抽象度と依存度の関係
抽象化と依存の意味を確認したところで、本当に両者には関係があるのかを見ていきましょう。  

先程のWriterクラスについて考えてみます。  

```ts
function display(writer: Writer) {
  writer.write('圧迫祭りよッ');
  writer.write('薄っぺらな藁の家');
}
```

関数として切り出した利用側コードです。  
このコードは、StdoutWriterやLogfileWriterに依存しているでしょうか？  

**全く依存していません。**  
それらの実装がどう変わろうと、display関数を変更する必要はありません。  
NetworkSendWriterのような新しい出力方法が現れたとしても、
それをそのままdisplay関数で使用できます。  
<span style="color: #ff0000; font-weight: bold;">
Writerというインターフェースにより繋がっている
</span>
からです。  

ここで各種Writerが、抽象化されていなかったらどうでしょう？  

```ts
class StdoutWriter {
  write(message: string) {
    console.log(message);
  }
}
```

```ts
class LogfileWriter {
  write(message: string) {
    fs.writeFile('./message.log', message);
  }
}
```

```ts
function stdoutDisplay(writer: StdoutWriter) {
  writer.write('圧迫祭りよッ');
  writer.write('薄っぺらな藁の家');
}

function logfileDisplay(writer: LogfileWriter) {
  writer.write('圧迫祭りよッ');
  writer.write('薄っぺらな藁の家');
}
```

なんと、Writerの実装ごとにdisplay関数を用意しなくてはいけません。  
つまり、**display関数が、Writerの実装に依存している**ということですね。  
<br/>

・・・  
とはいえ、コードはどこかから呼び出されて実行されるんだし、
**必ずどこかは依存することになるんじゃん？**

その通りですね。  
前述の、display関数がコード資産になるという話も、
display関数を**使用する側に依存関係を押し付けたに過ぎないかも**しれません。  

以下は、displayとWriterが依存するケース、しないケースを改めて書いたものです。  

```ts
function main() {
  stdoutDisplay(new StdoutWriter());
  logfileDisplay(new LogfileWriter());
}

function stdoutDisplay(writer: StdoutWriter) {
  writer.write('圧迫祭りよッ');
  writer.write('薄っぺらな藁の家');
}

function logfileDisplay(writer: LogfileWriter) {
  writer.write('圧迫祭りよッ');
  writer.write('薄っぺらな藁の家');
}
```

```ts
function main() {
  display(new StdoutWriter());
  display(new LogfileWriter());
}

function display(writer: Writer) {
  writer.write('圧迫祭りよッ');
  writer.write('薄っぺらな藁の家');
}
```

どうでしょうか？  
main関数はWriterの実装に等しく依存します。  
これは仕方ありません。  
しかし、display関数が依存するかどうかは書き方次第でコントロールできることがわかりますね。  

main関数が中継地点になって、displayとWriterの橋渡しをしていると言えそうです。  
その際のインターフェースが、Writerということですね。  

よって、単に依存性をどこに押し付けるかという問題ではなく、
Writerの抽象化により**不必要な依存性を排除**することができていたのです。  

また、この恩恵はdisplay関数をmain関数から切り出していたからこそ受けられたものです。  
切り出していたからこそ、display関数はWriterの実装に依存しませんし、
逆にWriterの実装に依存しない箇所を切り出せたとも言えます。  

抽象化による依存回避のメリットは
<span style="color: #ff0000; font-weight: bold;">
コードをうまく切り出しているからこそ効果がある
</span>
ということも分かりました。  



## まとめ
今回は抽象化と依存度の関係について見ていきました。  
結果から、以下のことが言えそうです。  

* 抽象化により、不必要な依存を避けることができる
* このメリットは、コードをうまく切り出している場合に効果が大きい

必要と不必要の境目とか、うまく切り出すってなんやねん
みたいな話もあると思いますが、そこまでやるとサクラダファミリアになりそうなので...  

各々感覚で掴んでいただければ幸いです。  
<span style="color: #ff0000; font-weight: bold;">
これぞ抽象化です。
</span>  
<br/>

関連するケースは無数にあって、この記事で取り上げられたのはそのうちの1ケースになったように思います。  
別パターンもまた記事にしていきたいですね。  
