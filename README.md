# MindFlow

> 本地优先的 AI 笔记工作台

![GitHub release (latest by date)](https://img.shields.io/github/v/release/SuSuMarker/MindFlow-Note)
![License](https://img.shields.io/github/license/SuSuMarker/MindFlow-Note)
## 项目简介

MindFlow 是一个基于 Tauri 2、React、TypeScript 和 Rust 的桌面应用。

它把下面几类能力放在同一个本地工作区里：

- 本地 Markdown 笔记管理
- AI 对话与 Agent 工作流
- 笔记级检索与知识组织
- 图谱、标签、反向链接、全局搜索
- 深度研究工作流

项目强调“本地优先”：

- 你的笔记库就是本地文件夹
- 默认围绕本地文件工作
- 是否把内容发送给模型服务商，由你自己决定

## 当前版本重点

### 1. AI 工作台

- 主工作区支持 AI Chat 标签页
- 右侧面板支持当前文件会话、设置和上下文操作
- 支持 `Chat`、`Agent`、`Deep Research`
- 支持多模型提供商：
  - OpenAI
  - Anthropic
  - Gemini
  - DeepSeek
  - Moonshot
  - Groq
  - OpenRouter
  - Ollama
  - 自定义 OpenAI-compatible 接口

### 2. 本地笔记工作流

- 本地文件夹作为 vault
- Markdown 编辑
- 源码 / 实时预览 / 阅读模式
- 标签页工作区
- `[[WikiLinks]]` 双链
- 自动文件树刷新与文件变更监听

### 3. 知识组织能力

- 知识图谱
- 孤立节点图谱视图
- 大纲面板
- 反向链接面板
- 标签面板
- 全局搜索

### 4. 检索与研究

- 本地笔记索引
- 可选 RAG 检索能力
- Deep Research 研究流程
- OpenClaw 工作区集成与相关总览入口

### 5. 桌面体验

- Tauri 2 桌面应用
- macOS / Windows 打包配置
- 内置更新检查
- 多语言界面
- 主题切换与自定义主题


## 适合的使用场景

- 用 AI 辅助整理个人知识库
- 在本地 Markdown 仓库上做问答、改写和总结
- 把笔记、图谱和研究过程放在同一桌面应用里
- 为 Agent 任务提供本地上下文

## 技术栈

**前端**
- 桌面框架：Tauri 2
- 前端：React 18 + TypeScript + Vite
- 状态管理：Zustand
- 编辑器：CodeMirror 6
- 样式：Tailwind CSS
- 数据请求：@tanstack/react-query
- UI 组件：React Markdown, Marked, KaTeX, Mermaid

**后端**
- 桌面宿主：Rust (Tauri 2)
- 服务器：Rust (Actix-web / Tower)
- 本地检索：SQLite
- 协作：Yjs (CRDT)

**移动端**
- Android：Kotlin
- iOS：Swift
- 跨平台：支持多设备同步

## 项目结构

```text
.
├── src/              # React 前端
│   ├── components/    # UI 组件
│   ├── editor/       # 编辑器相关
│   ├── stores/       # Zustand 状态管理
│   ├── services/     # 业务逻辑服务
│   └── hooks/        # React Hooks
├── src-tauri/        # Tauri / Rust 桌面宿主
│   └── src/          # Rust 源代码
├── mobile/           # 移动端代码
│   ├── android/      # Android 原生代码
│   └── ios/          # iOS 原生代码
├── server/           # Rust 后端服务
├── packages/         # 插件相关
│   ├── plugin-api/   # 插件 API
│   └── plugin-ui/    # 插件 UI
├── docs/             # 设计、计划、说明文档
├── tests/            # 测试与实验数据
├── scripts/          # 构建与辅助脚本
└── public/           # 静态资源
```

## 本地开发

### 环境要求

- Node.js 22+
  - 当前仓库记录的 Node 运行时版本：`22.21.0`
- Rust stable
- npm
- Tauri CLI

### 安装依赖

```bash
npm install
```

### 启动开发环境

**桌面端开发：**
```bash
npm run tauri dev
```
这会同时启动 Vite 前端开发服务和 Tauri 桌面宿主。

**前端开发（仅浏览器）：**
```bash
npm run dev
```

**后端服务开发：**
```bash
npm run server:dev
```

**云同步开发（前端 + 后端）：**
```bash
npm run dev:cloud
```

### 构建与打包

```bash
npm run build           # 构建前端
npm run tauri build     # 构建桌面应用
```

### 测试

```bash
npm run test            # 运行测试（监视模式）
npm run test:run        # 运行测试（单次）
npm run test:e2e:webkit # 运行 E2E 测试
npm run test:agent-eval  # 运行 Agent 评估测试
```

### 性能测试

```bash
npm run bench           # 运行性能测试（监视模式）
npm run bench:run       # 运行性能测试（单次）
```

## 移动端开发

### Android 开发

```bash
cd mobile/android
# 使用 Android Studio 打开项目
```

### iOS 开发

```bash
cd mobile/ios
# 使用 Xcode 打开项目
```

详细开发指南请参考 `mobile/README.md`

## 部署

### 桌面应用构建

```bash
# macOS
npm run tauri build

# 打包后的文件位置
# src-tauri/target/release/bundle/dmg/
```

### 后端服务部署

项目提供了 Docker 部署配置：

```bash
# 托管版本部署
docker-compose -f docker-compose.hosted.yml up -d

# 自托管部署
docker-compose -f docker-compose.selfhost.yml up -d
```

详细部署指南请参考 `deploy/` 目录下的配置文件。

## 常见问题

### 1. 首次启动很慢

正常现象。首次运行 `npm run tauri dev` 时，Rust 依赖编译会比较久。

### 2. 命令行里找不到 `node` 或 `npm`

如果你用的是 `nvm`，先确保当前 shell 已经加载对应的 Node 环境：

```bash
nvm use 22
```

### 3. Tauri 因旧路径缓存导致构建异常

如果你移动过项目目录，Rust 的旧 target 缓存有时会带着历史路径。可以用新的 target 目录启动：

```bash
CARGO_TARGET_DIR=/tmp/mindflow-note-tauri-target npm run tauri dev
```

### 4. 依赖安装失败

如果遇到依赖安装问题，可以尝试：

```bash
rm -rf node_modules package-lock.json
npm install
```

## 文档

- [中文文档](README.md)
- [交互效果指南](INTERACTION-EFFECTS-GUIDE.md)
- [设计文档](docs/)
- [开发计划](docs/plans/)


## 链接

- [GitHub 仓库](https://github.com/SuSuMarker/MindFlow-Note)
- [问题反馈](https://github.com/SuSuMarker/MindFlow-Note/issues)

## License

[Apache License 2.0](LICENSE)
