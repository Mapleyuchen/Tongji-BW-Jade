# 小组主站接入说明

本模块既可以作为独立页面运行，也可以作为小组玉石网站的一个功能页接入。

## 1. 后端接口

推荐接入接口：

```http
POST /api/jade/identify
Content-Type: multipart/form-data
```

正式图片字段名：`images`，支持多张图片。后端同时兼容 `image` 和 `files`。

## 2. 前端接入示例

```js
async function identifyJade(selectedImages) {
  const formData = new FormData();
  selectedImages.forEach((file) => formData.append('images', file));
  formData.append('materialHint', '翡翠');
  formData.append('sceneHint', '自然光/透光');
  formData.append('description', '用户补充描述');

  const res = await fetch('/api/jade/identify', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.error.message);
  return data.result;
}
```

## 3. 部署方式

### 方案 A：作为独立服务

主站通过反向代理转发：

```text
/jade-ai/* -> jade-ai-authenticator 服务
/api/jade/* -> jade-ai-authenticator 服务
```

### 方案 B：只接后端接口

如果小组已有统一前端，只复制上传组件逻辑即可，调用本模块后端接口。

### 方案 C：合并前端页面

将 `client/src/components/UploadPanel.jsx`、`ReportPanel.jsx`、`api/jadeApi.js` 和相关 CSS 移入小组前端项目。

## 4. 接入注意事项

- API Key 必须放在后端 `.env`，不能写进前端。
- 上传多图时必须重复 append 同一个字段名 `images`。
- 课程展示建议至少上传 3 张图片：自然光正面图、透光图、局部纹理图。
- AI 结果应展示“辅助判断”和“风险等级”，不要展示“绝对真/假”。
