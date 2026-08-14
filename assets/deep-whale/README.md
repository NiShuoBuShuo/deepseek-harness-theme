# Deep Whale asset map

用户提供的 1–13 号素材按原生成顺序映射；14、15 为额外偏好素材。构建脚本会将这些 WebP 内嵌进浏览器插件。

| 编号 | 文件 | Harness 挂载位置 |
| --- | --- | --- |
| 01 | `01-background-day.webp` | 浅色模式全局背景 |
| 02 | `02-background-night.webp` | 深色模式全局背景 |
| 03 | `03-hero-girl-whale.webp` | ConversationRoot `hero` 阶段左侧主角色 |
| 04 | `04-sidebar-habitat.webp` | 展开侧栏底部海底场景 |
| 05 | `05-active-companion.webp` | ConversationRoot `active` 阶段右缘陪伴角色 |
| 06 | `06-top-current.webp` | 中央栏顶部水纹装饰 |
| 07 | `07-hero-seafloor.webp` | Hero 底部海草层 |
| 08 | `08-composer-seafloor.webp` | Active Composer 底部海草层 |
| 09 | `09-details-corner.webp` | Details 面板右上角装饰 |
| 10 | `10-new-session-frame.webp` | 原生 New Session 按钮边框 |
| 11 | `11-settings-frame.webp` | 原生 Settings 区边框 |
| 12 | `12-workspace-ribbon.webp` | 原生 Workspace / Session 选中态 |
| 13 | `13-brand-whale.webp` | 侧栏 Logo 行的 Deep Whale 徽记 |
| 14 | `14-details-girl.webp` | Hero 阶段右下角抱平板少女（用户指定的 2026-08-14 21:33 图片） |
| 15 | `15-status-whale.webp` | 左下角主题状态区前景鲸鱼（用户偏好图） |

所有角色、鲸鱼和海底装饰层均不接收鼠标事件。侧栏收缩为 rail 或视口小于 920px 时，大型装饰会自动隐藏。
