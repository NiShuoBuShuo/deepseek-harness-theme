# Deep Whale · DeepSeek Harness skin

一个不改动 Harness 信息架构的热插拔主题。它沿用 `dsh-deep-whale` 的客户端插件模式：独立静态资源、CSS 覆盖、DOM 标记与 Cordis effect disposer。卸载时会完整移除装饰层，并还原标题、主题色和行内样式。

## 安装

```sh
cd <deepseek-harness>
dsh plugin --profile web add /absolute/path/to/my-item
```

重新启动 `dsh web` 后生效。卸载插件即可恢复默认界面。

## 开发验证

```sh
pnpm install
pnpm check
```

15 张主题素材位于 `assets/deep-whale/`，构建时以内嵌 WebP data URI 写入 `lib/client.js`，因此运行时不依赖外部 URL 或静态资源服务。编号、挂载位置及用途见 `assets/deep-whale/README.md`。

## 设计边界

- 保留 Harness 原生的 `sidebar | conversation | details` 三栏结构，不加入 Dashboard、Agents 或虚构系统数据。
- New Session、工作区/会话树、ConversationRoot 三阶段、Composer、Todo、Details 仍是原组件，只做皮肤挂载。
- 左下角 `theme online` 仅表示主题已加载；真实工具结果、上下文计量和会话状态仍由 Harness 原组件提供。
- 角色层和海底装饰全部 `pointer-events: none`，不会遮挡交互；窄屏会自动收敛装饰。
- 选择器优先使用公开的 `data-*` / ARIA 钩子，并对 CSS Modules 类名只使用局部包含匹配。
