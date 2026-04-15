# MindFlow

> 本地优先的 AI 笔记工作台

![GitHub release (latest by date)](https://img.shields.io/github/v/release/SuSuMarker/MindFlow-Note)
![License](https://img.shields.io/github/license/SuSuMarker/MindFlow-Note)

## 项目简介

MindFlow 是一个基于 Tauri 2、React、TypeScript 和 Rust 的桌面应用。

它把本地笔记、AI 对话、Agent 工作流、知识组织、语义检索和可选的多端/云能力放进同一个工作区里。项目的核心前提是“本地工作区优先”：

- 你的笔记库就是本地文件夹
- 文件仍然是事实源，而不是私有数据库格式
- 是否把内容发送给模型服务商，由你自己决定
- 浏览器预览仅适用于前端开发，完整能力以桌面端为准

## 核心能力

### 1. 本地笔记工作流

- 本地文件夹作为 vault
- Markdown 编辑与实时预览
- 阅读 / Live / Source 多模式编辑
- 标签页工作区
- 文件树、文件监听、自动刷新
- `[[WikiLinks]]` 双链与反向链接

### 2. AI 工作台

- 主工作区内置 AI Chat 标签页
- 支持 `Chat`、`Agent`、`Deep Research`
- 支持当前文件、文件树、文本选区等上下文注入
- 支持流式响应、Diff 预览和应用修改

支持的模型提供商包括：

- OpenAI
- Anthropic
- Gemini
- Moonshot
- DeepSeek
- Z.ai (GLM)
- Groq
- OpenRouter
- Ollama
- Custom OpenAI-compatible API

### 3. 知识组织

- 知识图谱
- 孤立节点图谱视图
- 标签面板
- 大纲面板
- 全局搜索
- 本地笔记索引

### 4. 检索与研究

- 本地 RAG 索引
- Embedding / Reranker 可配置
- Deep Research 工作流
- OpenClaw 工作区集成

### 5. 桌面能力

- Tauri 2 桌面宿主
- 原生文件系统访问
- Rust 侧统一 HTTP/流式请求
- 代理配置
- 内置更新检查
- 多语言界面
- 主题与插件扩展

### 6. 可选扩展能力

- 移动端配对与同步入口
- 独立 Rust 服务端
- WebDAV / 发布 / 通知 / relay / 协作相关能力

## 适合的使用场景

- 用 AI 辅助整理个人知识库
- 在本地 Markdown 仓库上做问答、改写、总结和检索
- 把笔记、图谱、研究过程和 Agent 流程放在一个桌面应用里
- 为本地工作区提供可控的 AI 上下文

## 技术栈

### 前端

- React 18
- TypeScript
- Vite
- Zustand
- CodeMirror 6
- Tailwind CSS
- TanStack Query
- React Markdown / Marked / KaTeX / Mermaid

### 桌面宿主

- Tauri 2
- Rust
- reqwest
- rusqlite

### 服务与协作

- Rust server
- Axum
- SQLite
- Yjs / y-websocket

### 移动端

- Android
- iOS

## 仓库结构

```text
.
├── src/                  # React 前端主应用
├── src-tauri/            # Tauri / Rust 桌面宿主
├── server/               # 独立 Rust 服务端
├── mobile/               # Android / iOS 工程
├── packages/             # 插件相关包
├── public/               # 静态资源
├── scripts/              # 构建、打包、发布辅助脚本
├── tests/                # 测试与基准数据
├── docker-compose.*.yml  # 服务端部署示例
└── README.md             # 对外项目说明
```

重点目录说明：

- `src/components`: UI 组件
- `src/editor`: 编辑器相关实现
- `src/stores`: Zustand 状态管理
- `src/services`: LLM、RAG、插件、Markdown、发布等领域服务
- `src/lib`: Tauri 调用与底层工具封装
- `src-tauri/src`: 原生命令、Agent、移动网关、向量库、代理、更新器等

## 本地开发

### 环境要求

- Node.js 22+
- Rust stable
- npm
- Tauri CLI 及其系统依赖

建议先确认本机能正常运行 Tauri 2 开发环境。

### 安装依赖

```bash
npm install
```

### 启动前端预览

```bash
npm run dev
```

说明：

- 这只会启动 Vite 前端开发服务器
- 适合做纯 UI 开发和浏览器预览
- 依赖 Tauri 的功能在这里可能不可用，例如打开文件夹、文件监听、原生 HTTP、嵌入 WebView 等

### 启动桌面端开发

```bash
npm run tauri dev
```

这会启动：

- Vite 前端开发服务
- Tauri 桌面宿主
- Rust 侧命令与本地系统能力

### 启动独立服务端

```bash
npm run server:dev
```

### 同时启动前端和服务端

```bash
npm run dev:cloud
```

## 构建与打包

### 构建前端

```bash
npm run build
```

### 构建桌面应用

```bash
npm run tauri build
```

macOS 打包产物通常在：

```text
src-tauri/target/release/bundle/
```

## 测试

```bash
npm run test
npm run test:run
npm run test:e2e:webkit
npm run test:agent-eval
npm run bench
npm run bench:run
```

补充说明：

- `test` 是 Vitest 监视模式
- `test:run` 是单次运行
- `test:e2e:webkit` 是 WebKit 相关 E2E 测试
- `test:agent-eval*` 是 Agent 评估脚本

## 移动端开发

### Android

```bash
cd mobile/android
```

然后用 Android Studio 打开。

### iOS

```bash
cd mobile/ios
```

然后用 Xcode 打开。

更多说明可见 [mobile/README.md](mobile/README.md)。

## 服务端部署

项目提供了两套 Docker Compose 示例：

```bash
docker-compose -f docker-compose.hosted.yml up -d
docker-compose -f docker-compose.selfhost.yml up -d
```

当前部署配置使用的环境变量前缀是 `MINDFLOW_*`，例如：

- `MINDFLOW_DOMAIN`
- `MINDFLOW_JWT_SECRET`
- `MINDFLOW_BIND`
- `MINDFLOW_DB_URL`
- `MINDFLOW_DATA_DIR`

示例可参考 [.env.example](.env.example)。

## 常见问题

### 1. 首次启动很慢

正常现象。首次运行 `npm run tauri dev` 时，Rust 依赖和 Tauri 相关组件会编译较久。

### 2. 浏览器里某些功能不可用

这通常不是 bug，而是运行环境差异。

`npm run dev` 只提供前端预览；完整功能需要 `npm run tauri dev`，因为很多能力依赖 Tauri 和 Rust 宿主。

### 3. 命令行里找不到 `node` 或 `npm`

如果你使用的是 `nvm`：

```bash
nvm use 22
```

### 4. Tauri 因旧路径缓存导致构建异常

如果你移动过项目目录，Rust 的旧 target 缓存可能携带历史路径。可以临时指定新的 target 目录：

```bash
CARGO_TARGET_DIR=/tmp/mindflow-note-tauri-target npm run tauri dev
```

### 5. 依赖安装失败

可以尝试重新安装依赖：

```bash
rm -rf node_modules package-lock.json
npm install
```

## 链接

- [GitHub 仓库](https://github.com/SuSuMarker/MindFlow-Note)
- [问题反馈](https://github.com/SuSuMarker/MindFlow-Note/issues)

## License

[Apache License 2.0](LICENSE)
