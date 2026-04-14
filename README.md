# MindFlow

本地优先的 AI 笔记工作台。

> 这份 README 对应当前仓库的实际状态。项目现在是一个聚焦 AI 工作流的桌面版构建，旧版本里的一些模块已经被移除或默认禁用。

## 项目简介

MindFlow 是一个基于 Tauri 2、React、TypeScript 和 Rust 的桌面应用。

它把下面几类能力放在同一个本地工作区里：

- 本地 Markdown 笔记管理
- AI 对话与 Agent 工作流
- 笔记级检索与知识组织
- 图谱、标签、反向链接、全局搜索
- 深度研究与 Codex 集成

项目强调“本地优先”：

- 你的笔记库就是本地文件夹
- 默认围绕本地文件工作
- 是否把内容发送给模型服务商，由你自己决定

## 当前版本重点

### 1. AI 工作台

- 主工作区支持 AI Chat 标签页
- 右侧面板支持当前文件会话、设置和上下文操作
- 支持 `Chat`、`Agent`、`Deep Research`、`Codex`
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
- Codex 面板与宿主能力
- OpenClaw 工作区集成与相关总览入口

### 5. 桌面体验

- Tauri 2 桌面应用
- macOS / Windows 打包配置
- 内置更新检查
- 多语言界面
- 主题切换与自定义主题

## 当前不包含的旧模块

为了让项目结构更清晰、主功能更聚焦，当前版本已经移除或默认禁用了这类旧功能：

- 云同步 / WebDAV / 团队协作
- 个人主页公开预览
- 独立 PDF 预览工作区
- 独立数据库视图工作区
- 独立图形 / Diagram 视图工作区
- 视频笔记
- Flashcard 复习入口
- 插件自定义视图入口
- DOCX 排版预览入口

如果你在历史文档、旧截图或旧分支说明里看到这些内容，以当前代码和本 README 为准。

## 适合的使用场景

- 用 AI 辅助整理个人知识库
- 在本地 Markdown 仓库上做问答、改写和总结
- 把笔记、图谱和研究过程放在同一桌面应用里
- 为 Codex / Agent 任务提供本地上下文

## 技术栈

- 桌面框架：Tauri 2
- 前端：React 18 + TypeScript + Vite
- 状态管理：Zustand
- 编辑器：CodeMirror 6
- 样式：Tailwind CSS
- 后端宿主：Rust
- 本地检索：SQLite / 向量索引相关实现

## 项目结构

```text
.
├── src/              # React 前端
├── src-tauri/        # Tauri / Rust 桌面宿主
├── packages/         # 插件 API / UI 辅助包
├── docs/             # 设计、计划、说明文档
├── tests/            # 测试与实验数据
└── scripts/          # 构建与辅助脚本
```

## 本地开发

### 环境要求

- Node.js 22+
  - 当前仓库记录的 Node 运行时版本：`22.21.0`
- Rust stable
- npm

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run tauri dev
```

这会同时启动：

- Vite 前端开发服务
- Tauri 桌面宿主

### 构建前端

```bash
npm run build
```

### 运行测试

```bash
npm run test:run
```

## 常用命令

```bash
npm run tauri dev      # 启动桌面开发环境
npm run build          # 构建前端
npm run test:run       # 跑测试
npm run bench:run      # 跑 bench
```

## 启动排错

### 1. 首次启动很慢

正常现象。首次运行 `npm run tauri dev` 时，Rust 依赖编译会比较久。

### 2. 命令行里找不到 `node` 或 `npm`

如果你用的是 `nvm`，先确保当前 shell 已经加载对应的 Node 环境。

### 3. Tauri 因旧路径缓存导致构建异常

如果你移动过项目目录，Rust 的旧 target 缓存有时会带着历史路径。可以用新的 target 目录启动：

```bash
CARGO_TARGET_DIR=/tmp/mindflow-note-tauri-target npm run tauri dev
```

## 说明

- 仓库里部分历史文件、文档或命名可能仍会出现旧名称 `Lumina Note`
- 当前产品名称以 `MindFlow` 为准
- 当前 README 优先描述“现在能跑、现在能用、现在仍保留”的部分

## License

[Apache License 2.0](LICENSE)
