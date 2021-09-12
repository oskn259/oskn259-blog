---
title: CloudWatchの監視メトリクスをterraformでまとめて設定
createdAt: 2021-9-2
tags: ['AWS', 'Terraform', 'CloudWatch']
banner: cloud.jpg
author: oskn259
---

awsでインフラ構成を作る時に監視の役割を果たすのがCloudWatch。  
監視全般に言えることですが、サーバーAのCPU, メモリ, トラフィック, ...、サーバーBのCPU, メモリ, トラフィック, ...
なんていちいちwebコンソールから手動で設定するのは面倒ですね。  
今回はTerraformを使って、監視設定のテキスト化、設定反映の自動化を進めていきます。


# やりたいこと
* 基本的な監視項目を各サーバーに設定
  - CPU, memory, traffic
  - RDS: CPU, slowlog count, operation count
* 危険水準を検知したらslackに通知
* テキストベースで監視設定を表現
  - これをgit管理
* コマンド一発でCloudWatchにその設定を反映できる


# 調査
クラウド設定というイメージからTerraformの名前を挙げたが、そもそもCloudWatch設定機能はあるのか？  
ありそう: https://dev.classmethod.jp/articles/manages-cloudwatch-alarm-with-terraform/  

awsからslackに投げるような機能はあるのか？  
ありそう:  
https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html  
https://www.esz.co.jp/blog/2874.html  
https://blog.adachin.me/archives/6121  
CloudWatch Alarmで閾値超過を検出して、Amazon SNSでslackへ通知、という感じにぱっと見見えますね。  


# Terraform記述
https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_dashboard  
ここにある、ダッシュボード追加機能を使えば良さそうですね。  
内容を見ていくと、設定事項をまとめたjsonを渡せば良いようです。
このjsonのフォーマットは、aws cliでダッシュボードを取得したときのフォーマットそのままとのこと。  
このコマンドで取ってきたないようを、そのままテンプレートに改造していきます。  
```bash
$ aws cloudwatch get-dashboard --dashboard-name test-api-cpu
```  

<details>
<summary>template/dashboard.tpl</summary>

```terraform
# template/dashboard.tpl

{
  "widgets": ${jsonencode([
    for widget in jsondecode(widgets) : {
      "type": "explorer",
      "x": 0,
      "y": 0,
      "width": 24,
      "height": 15,
      "properties": {
        "metrics": widget.metrics,
        "labels": [
          for name in widget.servers : {
            "key": "Name",
            "value": name
          }
        ],
        "widgetOptions": {
          "legend": {
            "position": "bottom"
          },
          "view": "timeSeries",
          "stacked": false,
          "rowsPerPage": 50,
          "widgetsPerRow": 2
        },
        "period": 300,
        "splitBy": "",
        "region": "ap-northeast-1"
      }
    }
  ])}
}
```
</details>
このテンプレートに`widgets`という変数を渡してやればokです。  
その中身については、以下のvariable定義の通り。  

<details>
<summary>variables.tf</summary>

```terraform
variable "cw_widget_api_metrics" {
  description = "Basic metrics for api servers"
  type = list(object({
    metricName   = string
    resourceType = string
    stat         = string
  }))
  default = [
    {
      "metricName": "CPUUtilization",
      "resourceType": "AWS::EC2::Instance",
      "stat": "Average"
    },
    {
      "metricName": "NetworkIn",
      "resourceType": "AWS::EC2::Instance",
      "stat": "Average"
    },
    {
      "metricName": "NetworkOut",
      "resourceType": "AWS::EC2::Instance",
      "stat": "Average"
    },
    {
      "metricName": "DiskReadBytes",
      "resourceType": "AWS::EC2::Instance",
      "stat": "Average"
    },
    {
      "metricName": "DiskWriteBytes",
      "resourceType": "AWS::EC2::Instance",
      "stat": "Average"
    }
  ]
}

variable "cw_widget_api_servers" {
  description = "List of API server name"
  type = list(string)
  default = [
    "my-api-01
  ]
}
```  
</details>
`cw_widget_api_metrics`と`cw_widget_api_servers`という変数を作成しています。  
データ型と、デフォルトの値も設定しています。  

terraformに変数は毎回こういった形の記述が必要になる上、
この値を同的に変更するということはできないようです。  
とても面倒に見えますが、
* 全てを宣言的に書くことで、複雑な手続きを書くことを不可能にし、不測の事態を回避
* 変数に説明や型を付与することで、誤った操作を防ぐ
といった意図があるように思います。  
特にインフラという、オペミスが致命的な領域では大事なことですね。  

あとはこれらを使ってawsに設定を反映していきます。  
<details>
<summary>main.tf</summary>

```terraform
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  required_version = ">= 0.14.9"
}

provider "aws" {
  profile = "default"
  region  = "ap-northeast-1"
}

data "template_file" "api_basic" {
  template = file("./templates/dashboard.tpl")
  vars = {
    widgets = jsonencode([
      { metrics: var.cw_widget_api_metrics, servers: var.cw_widget_api_servers }
    ])
  }
}

resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "api"
  dashboard_body = data.template_file.api_basic.rendered
}
```  
</details>

`template_file`を使ってテンプレートからテキストを生成し、`aws_couldwatch_dashboard`にて反映しています。  


# 感想

元々ansibleを長く触ってきて、インフラのコード化という作業には慣れていました。  
今回Terraformは久しぶりに触るのでほぼ忘れてしまっていました🐓。  

こうしたインフラのコード化が良いのは、
* 設計図が残せる
  - 後になって意図不明な機能やファイルがサーバーに残らない
* 何度でも作り直せる
  - お引っ越しが楽
* インフラに対する変更をレビューしたり、ログを残せる
  - ~~レビューしてくれる人がいない~~みんなでチェックしよう！
あたりだと思っています。  

欠点はと言えば、学習コストと初期構築コストということになります。  
とはいえ、一つのシステムを一人が生涯担当するようなことがなくなってきた今の世、
メリットの影響がデメリットの影響を上回る損益分岐点が訪れるタイミングはかなり近いと思います。  
