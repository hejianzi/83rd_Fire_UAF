# 预设对比助手 / 83rd_Fire_UAF

当前版本：`2.8.2`

这是一个面向 SillyTavern Chat Completion / OpenAI 预设的对比、迁移、编辑插件。当前代码同时支持酒馆内运行和独立离线 HTML 壳运行。

## 当前主要文件

- `index.js`
  - 本地开发源文件。
  - 当前插件版本日志为 `v2.8.2 就绪`。
  - 注意：本仓库 `.gitignore` 可能会忽略 `index.js`，发布到 GitHub/CDN 时通常使用 `indexxx.js`。

- `indexxx.js`
  - GitHub / jsDelivr 发布版插件主体。
  - 离线 HTML 当前会从 jsDelivr 读取这个文件。
  - 如果修改了 `index.js`，发布前记得同步到 `indexxx.js`。

- `granbluefantasy.jp.html`
  - 独立离线版 HTML 壳。
  - 不再依赖同目录 `index.js`。
  - 当前远程加载地址在 HTML 内配置：
    ```js
    var PCA_REMOTE_VERSION = '2.8.2';
    var PCA_REMOTE_SCRIPT = 'https://cdn.jsdelivr.net/gh/hejianzi/83rd_Fire_UAF@' + PCA_REMOTE_VERSION + '/indexxx.js';
    ```
  - 如果要测试 `main` 分支，可以临时把 `PCA_REMOTE_VERSION` 改成 `main`。
  - 如果要发布固定版本，需要 GitHub 仓库存在对应 tag / release，例如 `2.8.2`。

## 当前功能概况

### 1. 预设对比

- 从 SillyTavern 的预设管理器读取预设列表。
- 支持旧预设 / 新预设双栏选择。
- 支持开关差异对比。
- 支持条目差异查看。
- 支持把条目从左侧同步到右侧。
- 支持覆盖保存、另存为。

### 2. 条目迁移

- 支持预设条目迁移。
- 支持收藏分组。
- 支持迁移队列。
- 支持搜索、筛选、批量操作。
- 支持撤销栈。

### 3. 条目编辑

- 支持单预设编辑器。
- 重新打开单预设编辑器时，会自动记住上次编辑的预设。
- 进入单预设编辑器时，会关闭/隐藏原对比面板，关闭编辑器后不再恢复旧对比面板。
- 支持条目编辑、插入、删除、搜索。
- 支持编辑队列和撤销。

### 4. 搜索替换

- 支持在目标预设内执行搜索替换。
- 支持大小写、正则、整词等选项。
- 支持替换方案保存。

### 5. 缝合其他预设

- 单预设编辑器中有“缝合其他预设”功能。
- 可以搜索关键词，列出所有包含该关键词条目的预设。
- 支持展开匹配预设，选择具体条目插入当前预设。
- 搜索结果会高亮关键词。
- 勾选条目后局部刷新列表，保持滚动位置，不再自动回顶。

### 6. 批量删除 / 复制等管理能力

- 已修复复制预设相关问题。
- 已加入批量删除预设功能。
- 离线壳中删除/保存会更新浏览器缓存中的虚拟预设库。

## 主题系统

主题定义在 `index.js` 顶部的 `pcaThemes`。

当前内置主题：

- `apple`：默认苹果风格。
- `moonlight`：月光风格。
- `cafe`：咖啡厅风格，参考 `Paradiselost/caffe_snapshot.js` 的暖棕、奶白、玫瑰红、铜棕配色。

旧主题名兼容：

```js
var pcaThemeAliases = { 'default':'apple', 'magic':'moonlight' };
```

新增主题时，只需要在 `pcaThemes` 中新增对象，并确保包含这些颜色 token：

```js
bg, surface, surfaceHi, border, borderHi,
primary, primaryDim, accent, accentDim,
text, textDim, textOff,
danger, warning, success,
info, infoDim, input
```

## 离线 HTML 工作方式

`granbluefantasy.jp.html` 提供一个 SillyTavern mock/shim，让插件主体在没有酒馆后端的浏览器环境中运行。

它提供：

- 虚拟 `SillyTavern.getContext()`。
- 虚拟 `getPresetManager()`。
- 虚拟 `SillyTavern.Popup`。
- 虚拟 `#extensionsMenu`。
- 虚拟 `#settings_preset_openai`。
- 拦截：
  - `/api/settings/get`
  - `/api/presets/save`
  - `/api/presets/delete`

离线壳支持：

- 拖放 `.json` 预设文件。
- 拖放文件夹。
- 手动选择多个 `.json` 文件。
- 使用 `showDirectoryPicker()` 选择预设文件夹。
- 使用 IndexedDB 缓存已加载预设。
- 记住上次选择的文件夹 handle。
- 下次打开后从缓存恢复预设。

### 离线版应选择哪个酒馆文件夹

通常选择：

```text
SillyTavern/data/default-user/OpenAI Settings
```

如果不是 `default-user`，则选择对应用户目录下的：

```text
SillyTavern/data/你的用户名/OpenAI Settings
```

该文件夹中应该能看到多个 `.json` 预设文件。

## 最近重要修改记录

- 版本号升级到 `2.8.2`。
- 新增 `cafe / 咖啡厅` 主题。
- 离线 HTML 由本地 `index.js` 改为远程读取：
  ```text
  https://cdn.jsdelivr.net/gh/hejianzi/83rd_Fire_UAF@2.8.2/indexxx.js
  ```
- 合并了早期 `granbluefantasy.jp.html` 和后续 `standalone.html` 的功能。
- 保留 `granbluefantasy.jp.html`，删除重复的 `standalone.html`。
- 修复离线壳读取预设后，插件面板下拉仍为空的问题：
  - 原因：插件按酒馆/jQuery 风格读取 `pm.select[0]`。
  - 修复：离线壳中 `select` 返回 `[presetSelect]`。
- 修复 `granbluefantasy.jp.html` 第一行 `DOCTYPE` 少 `<` 的问题。

## 已知注意点

1. jsDelivr 版本缓存

   如果使用固定版本 `2.8.2`，CDN 会按 tag/release 缓存。更新代码后需要：

   - 新建新 tag；或
   - 临时使用 `main`；或
   - 等待 CDN 缓存刷新。

2. `index.js` 与 `indexxx.js` 同步

   开发时多数修改发生在 `index.js`。但离线 HTML 读取的是 GitHub 上的 `indexxx.js`。

   发布前请确认：

   ```text
   index.js -> indexxx.js -> push/tag -> jsDelivr
   ```

3. 离线 HTML 的保存逻辑

   离线版保存/删除只更新浏览器内存和 IndexedDB 缓存，不会自动写回原始本地 JSON 文件，也不会自动下载 JSON。

   之前版本存在“保存时自动下载 JSON”的逻辑，后来已移除，避免频繁弹下载。

4. 浏览器要求

   - 推荐 Chrome / Edge。
   - 文件夹选择和记住文件夹依赖 File System Access API。
   - 如果浏览器不支持 `showDirectoryPicker()`，可以改用拖放文件或手动选择多个 `.json`。

## 下次继续编辑时建议先检查

1. 当前开发目标是改酒馆插件主体，还是改离线 HTML 壳。
2. 如果改插件主体：优先编辑 `index.js`，完成后同步到 `indexxx.js`。
3. 如果改离线壳：编辑 `granbluefantasy.jp.html`。
4. 修改后至少运行：
   ```bash
   node --check index.js
   ```
5. 修改 HTML 内联脚本后，可用 Node 提取 `<script>` 内容做语法验证。
6. 如果改了远程版本号，确认 GitHub 上对应 tag/分支存在。

## 常用路径

项目目录：

```text
i:\Program Files\github\83rd_Fire_UAF
```

参考咖啡厅配色：

```text
i:\Program Files\github\Paradiselost\caffe_snapshot.js
```

离线 HTML：

```text
i:\Program Files\github\83rd_Fire_UAF\granbluefantasy.jp.html
```

本地开发源：

```text
i:\Program Files\github\83rd_Fire_UAF\index.js
```

GitHub 发布版：

```text
i:\Program Files\github\83rd_Fire_UAF\indexxx.js
```
