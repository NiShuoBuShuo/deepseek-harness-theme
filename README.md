# Deep Whale · DeepSeek Harness skin

一个不改动 Harness 信息架构的热插拔主题。它沿用 `dsh-deep-whale` 的客户端插件模式：`apply()` 只增加作用域属性、背景和装饰层，Cordis effect disposer 会在卸载时完整还原 DOM、标题、主题色与行内背景。

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

背景资产在 `assets/deep-whale-ocean.png`，构建时内嵌为 data URI，因此运行时不依赖外部 URL 或静态资源服务。

## 设计边界

- 不新增或伪造 Harness 业务数据。
- 不修改会话、工作区、工具、模型或 composer 的结构与行为。
- 左下角连接状态仅为主题装饰；真实 todo、dialog、资源计量和会话元素仍由 Harness 原组件提供。
- 选择器兼容公开的 `data-*` 钩子，并对 CSS Modules 类名只使用局部包含匹配。
