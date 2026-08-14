# Deep Whale 素材映射

用户提供的 1–13 号素材按原生成顺序映射；14、15 为后续选定的偏好素材。所有文件均为 WebP；两张全局背景为不透明图，其余角色和装饰素材带透明通道。构建脚本只把当前运行需要的素材内嵌进浏览器插件，未启用的备选素材仍保留在仓库中。

| 编号 | 文件 | 尺寸 | Harness 挂载位置 | 状态 |
| --- | --- | --- | --- | --- |
| 01 | `01-background-day.webp` | 1586×992 | 浅色模式全局背景 | 启用 |
| 02 | `02-background-night.webp` | 1586×992 | 深色模式全局背景 | 启用 |
| 03 | `03-hero-girl-whale.webp` | 1024×1536 | Hero / Active 左侧人物与鲸鱼 | 启用 |
| 04 | `04-sidebar-habitat.webp` | 1254×1254 | 原右侧边界鲸鱼方案 | 备选，不嵌入 |
| 05 | `05-active-companion.webp` | 1070×1470 | 原右侧人物方案 | 备选，不嵌入 |
| 06 | `06-top-current.webp` | 2048×768 | 中央栏顶部水纹 | 启用 |
| 07 | `07-hero-seafloor.webp` | 1536×1024 | Hero 阶段底部海草层 | 启用 |
| 08 | `08-composer-seafloor.webp` | 1536×1024 | Active Composer 下方海草层 | 启用 |
| 09 | `09-details-corner.webp` | 1254×1254 | Details 右上装饰及左下鲸鱼水晶框 | 启用 |
| 10 | `10-new-session-frame.webp` | 2182×721 | 原生 New Session 按钮边框 | 启用 |
| 11 | `11-settings-frame.webp` | 2172×724 | 原生 Settings 区边框 | 启用 |
| 12 | `12-workspace-ribbon.webp` | 2172×724 | Workspace / Session 选中态 | 启用 |
| 13 | `13-brand-whale.webp` | 1122×1402 | 侧栏 Logo 行的 Deep Whale 徽记 | 启用 |
| 14 | `14-details-girl.webp` | 1070×1470 | Hero / Active 右侧人物 | 启用 |
| 15 | `15-status-whale.webp` | 1536×1024 | 左下主题状态区前景鲸鱼 | 启用 |

运行中使用的角色、鲸鱼和海底装饰均不接收鼠标事件。会话开始后人物会缩小并移动到安全边缘；底部素材位于输入框下方和人物后方。
