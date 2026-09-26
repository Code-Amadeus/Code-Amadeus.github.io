# Code Amadeus 官网与资源中心

独立静态站点：**https://code-amadeus.github.io/**

与 [Amadeus 主程序](https://github.com/Code-Amadeus/Amadeus) 分开维护。
提供中英文介绍、演示入口、源码入门，以及语音、角色与场景资源目录。
不构建或发布桌面安装程序。

## 补充网盘资源

编辑根目录的 **`resources.json`**。每项资源预留四个网盘入口：

| 字段 | 网盘 |
| --- | --- |
| `baidu` | 百度网盘 |
| `quark` | 夸克网盘 |
| `mega` | MEGA |
| `google` | Google Drive |

`null` 表示尚未提供链接，网站会显示不可点击的“待补充”。有实际链接后改成：

```json
"baidu": {
  "url": "https://pan.baidu.com/s/你的真实分享链接",
  "code": "你的提取码"
}
```

无需提取码时省略 `code`。MEGA 链接保留 `#` 后的完整解密部分。
URL 使用 HTTPS；没有链接的入口继续保留 `null`。填入链接后，资源卡片状态自动更新。

`title`、`description`、`detail` 分别包含中文 `zh` 和英文 `en`。
`category` 为 `voice` 或 `art`；`id` 应与主程序支持的资源包对应。
资源文档以主程序的 [外部资产包说明](https://github.com/Code-Amadeus/Amadeus/blob/main/docs/external_asset_bundles.md) 为准。

## 修改文案与版本

- `index.html`：结构、中文文案和版权声明。
- `app.js`：英文文案、资源筛选和下载入口显示。
- `styles.css`：桌面与手机布局。
- `site.json`：网站展示的主程序版本；主程序版本发布后按实际情况更新。
- `resources.json`：资源信息及网盘链接。

## 本地预览

需要 Python 3.10+，只使用标准库，不需要安装主程序或 npm 依赖。

```powershell
python build.py
python -m http.server 4173 --bind 127.0.0.1 --directory build/site
```

打开 http://127.0.0.1:4173 。修改后重新构建并刷新。
构建只包含明确列出的页面、资源清单和两张展示图，不复制模型或运行时资源包。

## 发布

推送到 `main` 后，GitHub Actions 自动构建并部署到 GitHub Pages。
也可以在 Actions 手动运行 **Website Pages**。
仓库 Settings → Pages 的 Source 应为 **GitHub Actions**。
不涉及主程序测试、Electron 构建或安装包发布。

## 许可证与展示素材

网站第一方代码沿用 AGPL-3.0，见 `LICENSE`。
角色、语音、模型、原作内容和演示素材保留各自权利；代码许可证不授予这些素材的使用或再分发许可。
素材出处见 [assets/README.md](assets/README.md)，页面资源区另有中英文 Kurisu 使用声明。
