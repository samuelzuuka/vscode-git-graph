# Visual Studio Code 的 Git Graph 扩展

可视化查看仓库的 Git 图谱，并可直接在图谱上执行 Git 操作。界面可高度自定义，满足你的视觉需求！

![Git Graph 演示](https://github.com/mhutchie/vscode-git-graph/raw/master/resources/demo.gif)

## 功能特性

* **Git 图谱视图**：
    * 显示：
        * 本地和远程分支
        * 本地引用：分支、标签和远程
        * 未提交的更改
    * 可执行的 Git 操作（右键点击提交/分支/标签）：
        * 创建、检出、删除、获取、合并、拉取、推送、变基、重命名和重置分支
        * 添加、删除和推送标签
        * 检出、cherry-pick、丢弃、合并和还原提交
        * 清理、重置和暂存未提交的更改
        * 应用、从 stash 创建分支、丢弃和弹出 stash
        * 查看带注释的标签详情（名称、邮箱、日期和信息）
        * 复制提交哈希、分支、stash 和标签名称到剪贴板
    * 点击提交可查看提交详情和文件更改。在提交详情视图中你可以：
        * 点击文件更改，查看 VS Code 的差异视图
        * 打开该提交影响的文件的当前版本
        * 复制该提交影响的文件路径到剪贴板
        * 点击提交正文中的 HTTP/HTTPS 链接，在默认浏览器中打开
    * 通过点击一个提交，然后按住 CTRL/CMD 再点击另一个提交，可比较任意两个提交。在提交比较视图中你可以：
        * 点击文件更改，查看两个提交间的差异
        * 打开两个提交间受影响文件的当前版本
        * 复制受影响文件的路径到剪贴板
    * 代码评审 - 在提交详情和比较视图中跟踪你已评审的文件
        * 可对任意提交或任意两个提交间进行代码评审（不支持未提交更改）
        * 评审开始时，所有需评审文件加粗显示。查看差异/打开文件后，文件将取消加粗
        * 代码评审在 VS Code 会话间持久保存，90 天无操作后自动关闭
    * 查看未提交更改，并可与任意提交进行比较
    * 悬停在图谱上的任意提交节点，可显示提示信息：
        * 该提交是否包含在 HEAD 中
        * 哪些分支、标签和 stash 包含该提交
    * 使用"分支"下拉菜单过滤显示的分支。可选项包括：
        * 显示所有分支
        * 选择一个或多个分支查看
        * 选择用户自定义的 glob 模式（通过 `git-graph.customBranchGlobPatterns` 设置）
    * 从顶部控制栏获取远程仓库
    * 查找窗口可快速查找包含特定短语的一个或多个提交（支持提交信息/日期/作者/hash、分支或标签名）
    * 仓库设置窗口：
        * 查看、添加、编辑、删除、获取和修剪仓库远程
        * 配置"问题链接"——将提交信息中的问题编号转为超链接，直达你的问题跟踪系统
        * 配置"拉取请求创建"——可直接从分支上下文菜单自动打开并预填拉取请求表单
            * 内置支持 Bitbucket、GitHub 和 GitLab 公有托管的拉取请求
            * 可通过扩展设置 `git-graph.customPullRequestProviders` 配置自定义拉取请求（如私有部署），[配置方法见此](https://github.com/mhutchie/vscode-git-graph/wiki/Configuring-a-custom-Pull-Request-Provider)
        * 导出你的 Git Graph 仓库配置到文件，便于团队成员自动使用相同配置
    * 键盘快捷键（在 Git Graph 视图中）：
        * `CTRL/CMD + F`：打开查找窗口
        * `CTRL/CMD + H`：滚动至 HEAD 所在提交
        * `CTRL/CMD + R`：刷新 Git Graph 视图
        * `CTRL/CMD + S`：滚动至已加载提交中的第一个（或下一个）stash
        * `CTRL/CMD + SHIFT + S`：滚动至已加载提交中的最后一个（或上一个）stash
        * 当提交详情视图打开时：
            * `Up` / `Down`：切换到上/下一个提交的详情
            * `CTRL/CMD + Up` / `CTRL/CMD + Down`：切换到同一分支的父/子提交
                * 同时按下 Shift（即 `CTRL/CMD + SHIFT + Up/Down`），遇到分支或合并时会切换到另一分支
        * `Enter`：有对话框时，按下提交主操作
        * `Escape`：关闭当前对话框、菜单或提交详情视图
    * 可调整每列宽度，显示/隐藏日期、作者和提交列
    * 常用 Emoji 简码自动替换为对应表情（包括所有 [gitmoji](https://gitmoji.carloscuesta.me/)），可自定义 Emoji 映射
* 丰富的可配置设置（如图谱样式、分支颜色等），详见下方"扩展设置"
* 状态栏"Git Graph"启动按钮
* 命令面板中的"Git Graph: View Git Graph"启动命令

## 扩展设置

所有 Git Graph 设置的详细信息见[这里](https://github.com/mhutchie/vscode-git-graph/wiki/Extension-Settings)，包括描述、截图、默认值和类型。

设置摘要如下：
* **提交详情视图**：
    * **自动居中**：打开详情视图时自动居中
    * **文件视图**：
        * **文件树**：
            * **压缩文件夹**：将单子文件夹压缩为一层显示
        * **类型**：设置详情视图的默认文件视图类型
    * **位置**：指定详情视图在 Git Graph 视图中的渲染位置
* **上下文菜单操作可见性**：自定义哪些菜单操作可见，[详细说明](https://github.com/mhutchie/vscode-git-graph/wiki/Extension-Settings#context-menu-actions-visibility)
* **自定义分支 glob 模式**：自定义分支过滤模式
* **自定义 Emoji 映射**：自定义 Emoji 简码与表情的映射
* **自定义拉取请求提供商**：自定义拉取请求集成，[配置方法见此](https://github.com/mhutchie/vscode-git-graph/wiki/Configuring-a-custom-Pull-Request-Provider)
* **日期**：
    * **格式**：设置日期列的显示格式
    * **类型**：设置日期列显示作者日期或提交日期
* **默认列可见性**：设置日期、作者、提交列的默认可见性
* **对话框默认选项**：设置各类对话框的默认选项
* **增强辅助功能**：为色盲用户提供视觉文件变更指示，未来会增加更多辅助功能
* **文件编码**：设置检索仓库文件时的字符集编码，[支持编码列表](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings)
* **图谱**：
    * **颜色**：设置图谱使用的颜色
    * **样式**：设置图谱样式
    * **未提交更改**：设置未提交更改的显示方式
* **集成终端 Shell**：设置 Git Graph 打开集成终端时使用的 Shell 路径
* **键盘快捷键**：自定义所有快捷键
* **Markdown**：解析并渲染提交信息和标签详情中的常用 Markdown 格式
* **仓库搜索最大深度**：设置搜索仓库时的最大子文件夹深度
* **新标签页编辑器组**：设置 Git Graph 打开新标签页时的编辑器组
* **打开到活动文档所在仓库**：打开 Git Graph 视图时自动定位到当前活动文档所在仓库
* **引用标签**：
    * **对齐方式**：设置分支和标签引用标签的对齐方式
    * **合并本地和远程分支标签**：如本地和远程分支指向同一提交，则合并显示
* **仓库**：
    * **提交**：
        * **获取头像**：获取提交作者和提交者的头像
        * **初始加载**：设置初始加载的提交数量
        * **加载更多**：设置每次"加载更多提交"时的数量
        * **自动加载更多**：滚动到底部时自动加载更多提交
        * **静音**：
            * **非 HEAD 祖先的提交**：用淡色显示不属于当前分支的提交
            * **合并提交**：用淡色显示合并提交
        * **顺序**：设置图谱中提交的排序方式，[详见 git log](https://git-scm.com/docs/git-log#_commit_ordering)
        * **显示签名状态**：在提交详情视图中显示签名状态（仅限已签名提交），悬停显示签名详情
    * **获取并修剪**：获取远程前先修剪本地已失效的远程分支
    * **获取并修剪标签**：获取远程前先修剪本地已失效的标签
    * **包含 reflog 提及的提交**：在图谱中包含仅被 reflog 提及的提交（仅在显示所有分支时生效）
    * **加载时**：
        * **滚动到 HEAD**：加载仓库时自动滚动到 HEAD
        * **显示已检出分支**：加载仓库时显示已检出分支
        * **显示特定分支**：加载仓库时显示特定分支
    * **仅跟随第一个父分支**：仅跟随提交的第一个父分支，[详见 --first-parent](https://git-scm.com/docs/git-log#Documentation/git-log.txt---first-parent)
    * **仅显示被标签引用的提交**：仅显示被标签引用的提交
    * **默认显示远程分支**：默认显示远程分支
    * **显示远程 HEAD**：显示远程 HEAD 符号引用
    * **默认显示 stash**：默认显示 stash
    * **默认显示标签**：默认显示标签
    * **默认显示未提交更改**：默认显示未提交更改，大型仓库可关闭以提升加载速度
    * **显示未跟踪文件**：查看未提交更改时显示未跟踪文件，大型仓库可关闭以提升加载速度
    * **签名**：
        * **提交**：启用 GPG 或 X.509 提交签名
        * **标签**：启用 GPG 或 X.509 标签签名
    * **使用 mailmap**：显示作者和提交者时遵循 [.mailmap](https://git-scm.com/docs/git-check-mailmap#_mapping_authors) 文件
* **仓库下拉排序**：设置仓库下拉菜单的排序方式（仅在有多个仓库时可见）
* **隐藏时保留上下文**：切换标签时是否保留 Git Graph 视图上下文，开启后切换更快但占用更多内存
* **显示状态栏项**：显示状态栏按钮，点击可打开 Git Graph 视图
* **源代码提供商集成位置**：设置"查看 Git Graph"操作在 SCM 提供商标题栏的位置
* **标签页图标主题色**：设置 Git Graph 标签页图标的主题色

本扩展会读取以下设置：

* `git.path`：指定可移植 Git 安装的路径和文件名

## 扩展命令

本扩展提供以下命令：

* `git-graph.view`：Git Graph: 查看 Git 图谱
* `git-graph.addGitRepository`：Git Graph: 添加 Git 仓库...（用于添加子仓库）
* `git-graph.clearAvatarCache`：Git Graph: 清除头像缓存
* `git-graph.endAllWorkspaceCodeReviews`：Git Graph: 结束工作区所有代码评审
* `git-graph.endSpecificWorkspaceCodeReview`：Git Graph: 结束指定代码评审...（无需先打开即可结束）
* `git-graph.fetch`：Git Graph: 获取远程（打开视图并立即获取）
* `git-graph.removeGitRepository`：Git Graph: 移除 Git 仓库...（从 Git Graph 移除仓库）
* `git-graph.resumeWorkspaceCodeReview`：Git Graph: 恢复指定代码评审...（打开已在进行中的代码评审）
* `git-graph.version`：Git Graph: 获取版本信息

## 发布说明

详细发布说明见 [CHANGELOG.md](CHANGELOG.md)。

## Visual Studio Marketplace

本扩展已上架 [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)。

## 鸣谢

感谢所有为 Git Graph 发展做出贡献的开发者！

部分图标来自以下来源，感谢他们的优秀作品！
- [GitHub Octicons](https://octicons.github.com/) ([License](https://github.com/primer/octicons/blob/master/LICENSE))
- [Icons8](https://icons8.com/icon/pack/free-icons/ios11) ([License](https://icons8.com/license))