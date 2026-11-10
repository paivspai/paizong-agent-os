---
name: pai-capability-gate
description: 验证用户提交的新 Skill、Agent、工具、案例能否对现有业务流程产生净增益；以真实运行、可验收产物与同稿 A/B 对比决定替换、补强、观察或淘汰。
version: "1.0.0"
---

# 派总能力验收 Skill

## 触发语义
用户粘贴自媒体文章、工具介绍、GitHub 项目、视频或本地 Skill，并说“学习”“看看”“研究”“加入网站”“榨干”“验证”时，默认建立候选任务。不要只摘要或转述安装指引。

## 岗位分工
- ChatGPT 负责采集、分析目标、任务调度、核数、记录证据、验收裁决。
- GitHub Actions 用固定源码 commit 在隔离环境跑免费公共用例；不可携带私有资料或生产秘钥。
- Codex 只在工具实际接通时负责代码适配、运行、修复和回归；生成 commit 和真实日志。
- Work 只在实际使用 Work 浏览器和网页登录环境时负责网页操作；无权限不冒充已运行。
- Mac / GPU 节点负责本地系统、配音和真实视频速度/质量测试；云 Linux 不可代替。

## 八道门
1. 来源与许可证、发行版本及 commit SHA 验证。
2. 业务目标、目标用户、现有已跑通基线、替代范围写明。
3. 制作安全样本，实际运行目标功能，不接收费 API 或私有数据。
4. 至少跑一个边界或失败样本，留下终端退出码、日志和错误定位。
5. 检查实体交付物：文本完整性、PNG 分辨率、HTML 内容、MP4 尺寸/音频、数字来源。
6. 同输入 A/B：质量、成本、速度、人工返工、可维护性，不因新颖而替换基线。
7. 核数、素材权利与平台合规独立通过；用户机密与客户资料隔离。
8. 输出验收结论、替代决策、生产 SOP 与下次回归条件，入网站 Skill 库。

## 统一记录
`source.json`（版本、许可证、来源、哈希）
`task.md`（用户、任务、基线、输入输出、验收阈值）
`run.json`（实际环境、执行者、命令、时间、退出码、成本）
`artifacts/`（文件 + SHA256）
`qa.json`（自动验收与人工抽检）
`comparison.md`（同稿 A/B）
`decision.json`（replace / assist / observe / reject）
`SOP.md`（通过后才进入正式生产）

## 状态机
discovered → inspected → test_pending → testing → tested_pass → integrated → regression_pass。
任意阶段可 blocked 或 rejected。没有可核对的执行证据，禁止使用 verified / 已验收。

## 首例验证
article2media 2.0.1 SHA `5e752bea`；普通文章公众号与卡片通过，但标题 `### 1.` 会造成原文校验失败。PR #2 SHA `03ee9bff` 在相同 Linux 样本下将两项边界测试改为 0 错误。完整证据：https://github.com/paivspai/paizong-agent-os/actions/runs/42726272107 。视频/Mac/发布/生产接入未测试，禁止整体替换旧链路。

详细标准参见 `docs/skill-agent-acceptance-standard-v1.md`。
