# TCL分析ツール — 自分の「強み」発見・可視化アプリ

森岡毅氏のメソッドに基づき、「好きな動詞」を書き出してT・C・Lに分類し、自分の強みを特定するためのデスクトップアプリです。

## 概要

100個の「好きな動詞」を入力し、それぞれを以下の3カテゴリに分類します：

| カテゴリ | 英語 | 説明 |
|---|---|---|
| **T** | Thinking | 考える・分析する系 |
| **C** | Communication | 伝える・繋ぐ系 |
| **L** | Leadership | 動かす・決める系 |

分類結果を棒グラフで可視化し、自分の強みの傾向を把握できます。

参考: [森岡毅メソッド — TCL分析](https://note.com/otsukim___i/n/n486b4d0a6195)

## 技術スタック

- **フロントエンド**: React + TypeScript + Vite
- **デスクトップ**: Tauri v2 (Rust)
- **UI**: ドラッグ&ドロップによる動詞の分類
- **永続化**: Tauriのファイルシステムプラグインでローカル保存

## 機能

1. **入力フェーズ** — 好きな動詞を1つずつ追加（最大100個）
2. **分類フェーズ** — 各動詞をT・C・Lにドラッグ&ドロップで割り当て
3. **結果フェーズ** — カテゴリ別の割合をグラフで表示

## 開発環境のセットアップ

前提条件: [Node.js](https://nodejs.org/) と [Rust](https://rustup.rs/) がインストール済みであること。

```bash
# 依存関係をインストール
npm install

# 開発サーバー起動（Tauriウィンドウつき）
npm run tauri dev

# プロダクションビルド
npm run tauri build
```

## ESLintの型チェック設定（任意）

型を考慮したLintルールを有効にするには `eslint.config.js` を以下のように更新します：

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      // より厳格にする場合:
      // tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```
