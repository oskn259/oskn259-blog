---
title: Terraformの機能をモジュールに切り出す
createdAt: 2021-9-3
updatedAt: 2021-9-3
tags: ['Terraform']
banner: earth.jpg
author: oskn259
---

前回の記事に引き続き`Terraform`関連です。  
詳細な解説というよりは、最短で実践できるような内容にしました。  

awsやgcpの設定をテキストで表現できるということで気に入っているTerraformですが、
設定の規模が大きくなってくると、意味ごとにファイルを分割したくなってきます。  
EC2インスタンス設定、ELB設定... といった感じですね。  
モジュール分割という方法で実現できるようなので、早速試していきましょう。  

先に貼っておくと、この解説が最強なのでこれをそのままやりました。  
https://stackoverflow.com/questions/39803182/terraform-use-case-to-create-multiple-almost-identical-copies-of-infrastructure  



## モジュール
公式：https://www.terraform.io/docs/language/modules/index.html  
言ってしまえば、普通にtfファイルを書いた場合と同じ構造を、モジュールとして使用できるということのようです。  
rootとleafが同じ構造の、フラクタル構造のような感じですね。  


## ディレクトリ構造
今回は以下のようなディレクトリ構造になりました。  
```shellscript
main.tf
modules/
  cloudwatch_widget_explorer/
    main.tf
    templates/
      dashboard.tpl
```  
`modules`ディレクトリを追加し、`cloudwatch_widget_explorer`というモジュールを作成しました。  
モジュールの中には、tfファイルをモジュール外と同じように作成します。  
`templates/`ディレクトリは、モジュールの処理で必要になるので、同じ階層に配置しています。  


## モジュール側の記述
モジュール内のtfファイルはこんな感じです。  
（重要でない箇所は省略しました）  
```terraform
# modules/cloudwatch_widget_explorer/main.tf

variable "name" {
  description = "name of dashboard"
  type = string
}

data "template_file" "body" {
  template = file("${path.module}/templates/dashboard.tpl")
  vars = {
    widgets = jsonencode([
      { name: var.name }
    ])
  }
}

resource "aws_cloudwatch_dashboard" "metrics" {
  dashboard_name = var.name
  dashboard_body = data.template_file.body.rendered
}
```

同階層にあるテンプレートファイルに値をセットし、それを`aws_cloudwatch_dashboard`にてAWSに反映するという内容です。  
`name`を`variable`として宣言しておくことで、
モジュールを利用する側にとってこの値は入力必須となり、
必ず有効な値を受け取った上で実行できるようになっています。  

モジュールだからといって特別な記述は必要なく、普通にtfファイルを書くように作成すればokです。  


## モジュールを呼び出す側の記述
`main.tf`の記述はこんな感じです。  
関連箇所だけ抜き出しています。  
```terraform
module "cloudwatch_widget_explorer_api" {
  source = "./modules/cloudWatch_widget_explorer"
  name = "api-metrics"
}

module "cloudwatch_widget_explorer_www" {
  source = "./modules/cloudWatch_widget_explorer"
  name = "www-metrics"
}
```

`module`を使用して、自作のモジュールを呼び出しています。  
どのモジュールを呼び出しているのかを指定しているのは`source`の部分で指定するパスであって、
moduleの後に続く文字列には好きな名前を指定できます。  
また、モジュール側で要求している`name`をここで指定する必要があります。  


## 感想
機能をモジュール化しつつパラメータを指定できるようにするのは、コードの再利用がしっかり効いて良いですね。  
基本的な概念なので最近のツールでできないわけは無いのですが、検索したらちゃんとドキュメントが出てきたという所です。  

変更の結果を予測できるようにする、望まぬ変更は回避する  
というポリシーがインフラコード化界隈にはあると思っていて、
今回のモジュール化に関しても、パラメータのバリデーションがしっかりなされていてその意思を感じますね。  
