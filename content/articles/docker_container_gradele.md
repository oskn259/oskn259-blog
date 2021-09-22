---
title: JDK + gradleのビルド環境をDocker上に起動する
createdAt: 2021-9-22
updatedAt: 2021-9-22
tags: ['Docker', 'Java', 'gradle']
banner: container.jpg
author: oskn259
---

最近はTypescriptの住人と化していますが、
新しい勉強としてデザインパーンの本を購入してサンプルを再現しようとしたところ、サンプルは全てjavaコードでした。  
思ったのですが、Typescriptで言うところのnpmに相当するものってJavaだと何があるんでしょうか？  
ぱっと見た感じでは`Gradle`というのが最近のツールのように見えます。  

また、nodeで言うところのnvmのように、
ローカルPCの環境に影響されずにjavaのバージョンを切り替えることは可能でしょうか？  
nvm的なものは見当たりませんが、dockerのコンテナを使い分けることで同じことができそうです。  

今回は以下の環境構築をゴールに解説していきます。  

* dockerコンテナ上でjavaをコンパイルして実行できる
* gradleの設定にコンパイル設定を記述、シンプルなコマンドでビルドが完了するように



## ディレクトリ構造
完成状態のディレクトリ構造を抜粋して先に載せておきます。  
これらの各種コンポーネントについて解説していきます。  

```
docker/
  java/
    Dockerfile
docker-compose.yml
gradlew
app/
  src/
    main/
      java/
        designpattern/
          Main.java
```



## 環境作成
やるべきことは大まかには以下の通りです。  
順番に作業していきます。  

* dockerイメージの作成
* docker-composeの設定
* gradleの初期化



### dockerコンテナ設定
今回はAdoptOpenJDK11を実行環境として採用します。  
JDKの種類については以前の記事でも解説しています。  
https://blog.oskn259.com/article/how_to_choose_jdk

本当はver17が良かったのですが、dockerイメージがまだ公開されていないようでした。  

`adoptopenjdk/openjdk11` こちらのイメージをベースにDockerfileを記述します。  

```Dockerfile:Dockerfile
FROM adoptopenjdk/openjdk11

RUN apt-get update
RUN apt-get -y install curl
RUN apt-get -y install zip
RUN curl -s "https://get.sdkman.io" | bash
RUN echo ". $HOME/.sdkman/bin/sdkman-init.sh; sdk install gradle" | bash
WORKDIR /usr/project
```

javaに関してはベースのイメージで完結しているので、追加の設定は必要ありません。  

ベースのイメージに、gradleのインストール処理を加えています。  
（Dockerfileは不慣れなのでもっと綺麗に書けるかもしれません）  

Gradleのインストールは[公式チュートリアル](https://gradle.org/install/)にある通り、
[sdkman](https://sdkman.io/)を使用する形を採用しました。  
sdkmanは開発に関わるツールのバージョン切り替えなどをしてくれるツールのようです。  



### docker-composeの設定
今回の開発環境ではdockerコンテナ内部での実行を考えていますが、
コードの編集はローカルPCでエディタを使ったほうが効率が良いです。  
つまり、ローカルPCにあるコードをdockerコンテナ内部のディレクトリと同期させてやる必要があります。  

このことは、以下のような指定でdockerコマンドを実行すれば実現できます。  

```bash
$ docker run -v <ローカルPC側のディレクトリ>:<コンテナ内部のディレクトリ> image-name /bin/bash
```

このような指定により、両者のディレクトリの内容が同期され、一方の変更がもう一方に反映されるようになります。  

毎回このコマンドを実行するのも面倒なので、
`docker-compose`の設定ファイルとしてまとめてしまいましょう。  

今回作成した`docker-compose.yml`はこちら。  

```yaml:docker-compose.yml
version: '3.6'
services:
  java:
    build: ./docker/java
    tty: true
    volumes:
      - .:/usr/project
```

`volumes`の箇所で、同期させるディレクトリを指定しています。  
これにより、ローカルPCの作業ディレクトリが、コンテナ上の`/usr/project`ディレクトリと同期します。  

作成した設定を使用して、dokcerコンテナを起動しましょう。  

```bash
$ docker-compose create
$ docker-compose start
```



### Gradleの初期設定
https://docs.gradle.org/current/samples/sample_building_java_applications.html  
こちらの公式チュートリアル(ver 7.2)をもとに進めていきます。  
Javaに限らずscalaなどの他言語や、ライブラリのビルドなど様々なオプションに向けたドキュメントがありますが、
今回はjava applicationの項目を選択してます。  

まずはコンテナに入ります。  
`docker exec`でログインした先は作業ディレクトリなので、
ここで`gradle init`を実行します。  
するといくつか質問されるので、チュートリアルに倣って入力しましょう。  

```bash
$ docker exec -i -t designpattern_java_1 bash
$ gradle init
```

<details>
<summary>gradle initの出力（展開）</summary>

```
root@b4abb718cdc0:/usr/project# gradle init

Select type of project to generate:
  1: basic
  2: application
  3: library
  4: Gradle plugin
Enter selection (default: basic) [1..4] 2

Select implementation language:
  1: C++
  2: Groovy
  3: Java
  4: Kotlin
  5: Scala
  6: Swift
Enter selection (default: Java) [1..6] 3

Split functionality across multiple subprojects?:
  1: no - only one application project
  2: yes - application and library projects
Enter selection (default: no - only one application project) [1..2] 1

Select build script DSL:
  1: Groovy
  2: Kotlin
Enter selection (default: Groovy) [1..2] 2

Select test framework:
  1: JUnit 4
  2: TestNG
  3: Spock
  4: JUnit Jupiter
Enter selection (default: JUnit Jupiter) [1..4] 

Project name (default: project): designpattern
Source package (default: designpattern): 

> Task :init
Get more help with your project: https://docs.gradle.org/7.2/samples/sample_building_java_applications.html

BUILD SUCCESSFUL in 17s
```
</details>

今回は、設定ファイルの言語としてKotlinを選択しています。  



## 開発環境の使い方
以上の手順で準備は完了しました！  
次はコードの実行や編集など、この開発環境をどのようにして使用するかを見ていきます。  



### 開発環境の起動
以下のコマンドでdockerコンテナを起動しましょう。  
作成手順においても起動の手順があるので、そこで起動されていればここはスキップできます。  
```bash
$ docker-compose create
$ docker-compose start
$ docker-compose ps   # コンテナの軌道を確認
```



### コードの実行
`gradle init`で作成された`gradlew`にサブコマンドとして`run`を渡すことでコードを実行できます。  
これはコンテナ内部で実行することになるので、`docker exec`コマンド経由で実行しましょう。  

<details>
<summary>runの出力（展開）</summary>

初期状態では単に`Hello World!`と表示するコードが生成されますが、正しく動いていることが確認できます。  

```
oskn259@localpc$ docker exec -i -t designpattern_java_1 ./gradlew run 
Downloading https://services.gradle.org/distributions/gradle-7.2-bin.zip
..........10%...........20%...........30%...........40%...........50%...........60%...........70%...........80%...........90%...........100%

> Task :app:run
Hello World!

BUILD SUCCESSFUL in 1m 22s
2 actionable tasks: 2 executed
```
</details>

また、配布用のビルド成果物が欲しい場合には`build`サブコマンドを実行すれば
`app/build/distributions`に圧縮ファイルが生成されます。  

<details>
<summary>buildの出力（展開）</summary>

```
oskn259@localpc$ docker exec -i -t designpattern_java_1 ./gradlew build

BUILD SUCCESSFUL in 14s
7 actionable tasks: 6 executed, 1 up-to-date


oskn259@localpc$ ls app/build/distributions 
app.tar app.zip
```
</details>



### ソースコードの編集
ここまでの設定で、`app/src/main/java/designpattern/App.java`にjavaのmainメソッドが配置されます。  
コーディングはここのディレクトリを起点に記述していくことになるでしょう。  

ローカルPC側から編集できるので、vscodeで開発を進めていくことができます。  
<img src="/article/docker_container_gradle/vscode_edit.png">  



### 開発環境の停止
コンテナがVMに比べて軽いとはいえ、PCの負荷的にいつでも動かしていたいものではありません。  
必要ない時は以下のコマンドで停止しましょう。  

```bash
$ docker-compose stop   # 単にコンテナを停止する
$ docker-compose down --rmi local  # 作成イメージの削除まで行う
```



## まとめ
今回はdockerコンテナを使用することで、

* javaのビルドをシンプルなコマンドで実行
* javaバージョンを作業環境に依存せず変更可能
* gradleバージョンについても同様に変更可能

という開発環境を作成しました。  
簡単なアプリケーション作成はこの環境で十分賄えそうです。  

実際のサービス開発においては、
`gradle build --scan`のような便利機能や、テストの実行についても設定を追加していくのが良さそうですね。  
