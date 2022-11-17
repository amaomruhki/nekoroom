## Neko Room（ネコルーム）

[https://nekoroom.vercel.app/](https://nekoroom.vercel.app/)

## アプリ概要

NekoRoom は猫を飼っている方のお部屋や猫用アイテムの写真を共有するサイトです。<br>
お部屋写真と一緒に使っているアイテムを登録でき、写真を見たユーザーはリンクから商品購入ができます。

おしゃれな部屋にしたいけど、なにより愛猫に快適に過ごしてほしい。<br>
愛猫が気に入ってくれるのが一番だけど、猫用アイテムは部屋のテイストに合わせたい。<br>
そんな猫と人間の Win-Win な部屋作りのアイデア探しをお手伝いします。

## 作成した経緯

私が猫と暮らしはじめたとき、インテリアや猫用アイテム選びにはとても悩みました。<br>
実際に猫と暮らす人がどんな部屋に住んでいるのか、<br>
どんなアイテムがいいのかネットで実例を探してみるものの、<br>
猫を飼っている人の SNS アカウントはインテリアの投稿が少なく、探すのに一苦労。<br>
ネットショップのアイテムの商品レビューはテキスト中心で使用写真はなく、<br>
実際に部屋に置いたイメージがつかみづらいものでした。<br>
猫を飼っている人に特化したインテリア写真の共有サイトがあれば一度に欲しい情報にアクセスできるのに…<br>
と思ったのが開発のきっかけです。

## アプリケーション機能

- 認証（サインアップ/サインイン/ログアウト/パスワードリセット）
- ユーザー編集（ユーザーアイコン/ニックネーム/自己紹介文）
- 写真投稿/リスト表示/編集/削除
- 写真投稿時に楽天 API から使用アイテム検索/投稿/編集
- コメント投稿/編集/削除
- Like（いいにゃ）追加/リスト表示/削除
- Like（いいにゃ）した記事のリスト閲覧

## 実装予定機能

- 1 投稿にアイテム最大 5 件登録

## 使用画面

| トップ                                                                                                         | 新規登録                                                                                                            | 　ログイン                                                                                                          |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| ![top](https://user-images.githubusercontent.com/105156227/201690019-0c6c0b5e-066e-4668-8e69-557f06b86d15.png) | ![新規登録](https://user-images.githubusercontent.com/105156227/201667793-9d609835-aabe-4b7b-a205-16dc7f78c6fe.png) | ![ログイン](https://user-images.githubusercontent.com/105156227/201666979-9d1c3b48-1e88-4f16-8097-97aff268ac49.png) |
| 投稿が新着順で表示されます。写真をクリックすると投稿詳細へ遷移します                                           | 　登録不要で閲覧可能ですが、登録すると写真投稿/投稿にコメント/いいにゃ機能が使用できます                            | Google ログインも利用できます                                                                                       |

| 投稿                                                                                                              | 投稿詳細 1                                                                                                             | 投稿詳細 2                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| ![投稿２](https://user-images.githubusercontent.com/105156227/201686072-6b1f1a03-1ada-40e6-afc0-c26eacca62ab.png) | ![詳細1](https://user-images.githubusercontent.com/105156227/201687305-042fb979-fcad-4876-9431-ac03ebe0699c.png)       | ![詳細2](https://user-images.githubusercontent.com/105156227/201678451-a2140b14-95e3-4088-9ff3-bf9eee3b2566.png) |
| 部屋やアイテムの写真を投稿できます。アイテムは楽天市場の API を利用して商品情報も登録できます                     | 気に入った写真は肉球アイコンを押すと「いいにゃ」できます。<br>ユーザーアイコンをクリックするとユーザー詳細へ遷移します | コメントを送ってユーザー同士で交流できます                                                                       |

| 投稿詳細 3                                                                                                        | マイページ/ユーザー詳細                                                                                               | いいにゃした投稿                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| ![詳細23](https://user-images.githubusercontent.com/105156227/201678453-b36a53eb-b75c-4353-b651-6482e0d0e557.png) | ![マイページ](https://user-images.githubusercontent.com/105156227/201684957-0e4ce459-fde8-4bb2-ab80-1c34637fb6cf.png) | ![いいにゃ](https://user-images.githubusercontent.com/105156227/201685212-8a5709e8-440e-4366-bac2-da5f4bb02c48.png) |
| アイテムアイコンをクリックするとアイテムの詳細と楽天市場へのリンクが表示されます                                  | 自己紹介やこれまでの投稿が表示されます                                                                                | 自分がいいにゃした投稿が表示されます                                                                                |

## 開発技術

### フロントエンド

- HTML
- CSS
- TypeScript
- React(v18.2.0)
- Next.js(v12.3.1)
- recoil
- chakra-ui(v2.3.4)

### バックエンド

- firebase(v9.10.0)
- rakuten_web_service（外部 API）

## ローカル環境下での動作方法

１　 git clone https://github.com/amaomruhki/nekoroom.git
２　 cd nekoroom
３　 yarn
４　 yarn dev

## 画面遷移図

[https://www.figma.com/proto/k21Dy0phIWWxxyGkRAVZ6t/NekoRoom?page-id=807%3A9212&node-id=807%3A9213&starting-point-node-id=811%3A9410](https://www.figma.com/proto/k21Dy0phIWWxxyGkRAVZ6t/NekoRoom?page-id=807%3A9212&node-id=807%3A9213&starting-point-node-id=811%3A9410)
