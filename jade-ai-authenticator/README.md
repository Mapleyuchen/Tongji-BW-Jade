# 玉石智能鉴别真伪模块 · 正式工程版

这是一个可直接接入小组玉石网站的「AI 玉石辅助鉴别」完整项目，包含 React 前端、Express 后端、真实视觉大模型调用、拖拽多图上传、结构化鉴别报告、错误处理、部署说明和小组接入文档。

> 重要定位：本系统是「图像辅助鉴别 + 风险评估 + 专业送检建议」，不能替代国家认可机构的珠宝玉石检测证书。

## 1. 已实现功能

- 支持点击选择、拖拽上传、粘贴图片上传。
- 支持一次上传多张图片，默认最多 6 张，字段名为 `images`。
- 支持拖动缩略图调整图片顺序。
- 前端支持 JPG / PNG / WEBP 校验、大小校验、重复图片跳过、预览删除、清空重选。
- 后端使用 Multer 内存上传，API Key 只保存在后端 `.env`，不会暴露到前端。
- 默认接入阿里云百炼 / 通义千问视觉模型 `qwen3-vl-flash`，兼容 OpenAI 视觉模型。
- AI Prompt 已强化多图综合逻辑，避免无依据地默认“中等风险”。
- 输出疑似材质、真伪风险、置信度、多图证据、视觉特征、疑点、补拍建议、专业送检建议。
- 页面包含动画、加载进度、玻璃拟态卡片、多图证据展示、免责声明。

## 2. 项目结构

```text
jade-ai-authenticator/
├── client/                 # React + Vite 前端
├── server/                 # Node.js + Express 后端
├── docs/                   # 接口、部署、接入说明
├── scripts/                # 辅助脚本
├── .env.example            # 环境变量模板
├── package.json            # 根项目脚本
└── README.md
```

## 3. 本地运行

### 3.1 安装依赖

```bash
cd jade-ai-authenticator
npm run install:all
```

Windows CMD 也可以直接执行同样命令。

### 3.2 配置环境变量

Windows CMD：

```bat
copy .env.example server\.env
notepad server\.env
```

Linux / macOS / PowerShell：

```bash
cp .env.example server/.env
```

阿里云百炼免费额度推荐配置：

```env
NODE_ENV=development
PORT=8080
CLIENT_ORIGIN=http://localhost:5173
MAX_IMAGE_MB=8
MAX_IMAGES=6

AI_PROVIDER=dashscope
DASHSCOPE_API_KEY=你的阿里云百炼APIKey
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
DASHSCOPE_MODEL=qwen3-vl-flash

AI_TEMPERATURE=0.1
AI_TIMEOUT_MS=60000
```

### 3.3 启动开发环境

```bash
npm run dev
```

访问：

```text
http://localhost:5173
```

后端地址：

```text
http://localhost:8080
```

## 4. 给小组主站接入

主站只需要调用：

```http
POST /api/jade/identify
Content-Type: multipart/form-data
```

表单字段：

- `images`：必填，玉石图片，可重复追加多张。
- `materialHint`：可选，用户填写的疑似材质，例如“翡翠”。
- `sceneHint`：可选，拍摄场景，例如“自然光、柜台灯、透光”。
- `description`：可选，用户补充描述。

兼容旧字段：`image` 和 `files`。

详见：`docs/API_SPEC.md` 和 `docs/INTEGRATION.md`。

## 5. 生产构建

```bash
npm run build
npm start
```

构建后，Express 会自动托管 `client/dist`，可直接访问后端域名。

## 6. 答辩介绍语

本模块采用前后端分离架构。前端负责多图拖拽上传、图片预览和报告展示，后端负责图片校验、密钥保护、调用视觉大模型并规范化返回结果。系统从颜色、透明度、光泽、纹理、裂隙、杂质和工艺痕迹等维度分析玉石图片，输出疑似材质、风险等级、置信度和送检建议。考虑到普通照片无法替代专业珠宝检测，本功能定位为 AI 辅助鉴别与风险提示，符合实际应用边界。

## 7. 免责声明

本系统基于图像识别与视觉大模型进行玉石特征分析，结果仅供学习、展示和初步参考，不能作为交易、定价、维权或法律意义上的专业鉴定依据。对于高价值玉石，应送至具有资质的珠宝玉石检测机构进行复检。
