# API 接口说明

## 1. 健康检查

```http
GET /api/health
```

成功响应：

```json
{
  "success": true,
  "status": "ok",
  "service": "jade-ai-authenticator",
  "time": "2026-04-28T00:00:00.000Z"
}
```

## 2. 玉石智能鉴别

```http
POST /api/jade/identify
Content-Type: multipart/form-data
```

### 请求字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| images | File[] | 是 | 玉石图片，可一次上传多张，支持 JPG / PNG / WEBP |
| materialHint | string | 否 | 用户自填疑似材质，如“翡翠” |
| sceneHint | string | 否 | 拍摄场景，如“自然光、柜台灯、透光” |
| description | string | 否 | 用户补充描述 |

说明：正式字段名是 `images`。后端也兼容旧版字段 `image` 和常见字段 `files`。

### JavaScript 调用示例

```js
const formData = new FormData();
selectedImages.forEach((file) => formData.append('images', file));
formData.append('materialHint', '翡翠');
formData.append('sceneHint', '自然光 + 透光');
formData.append('description', '手镯，商家称为 A 货');

const response = await fetch('/api/jade/identify', {
  method: 'POST',
  body: formData
});
const payload = await response.json();
```

### 成功响应

```json
{
  "success": true,
  "requestId": "AbCdEf123456",
  "result": {
    "material": "疑似翡翠",
    "authenticity": "图片显示其具有部分天然玉石视觉特征，但无法仅凭照片确认是否为天然或处理品。",
    "riskLevel": "低风险",
    "confidence": 0.76,
    "imageCount": 4,
    "imageEvidence": [
      "第 1 张（正面）：颜色和光泽较自然，未见明显气泡。",
      "第 2 张（透光）：可见一定半透明感，未见明显塑料感。"
    ],
    "visualFeatures": [
      "颜色呈绿色，局部分布不完全均匀",
      "表面有较强反光，接近玻璃光泽",
      "局部可见棉絮状或颗粒状结构"
    ],
    "suspiciousPoints": [
      "普通照片仍无法排除酸洗、注胶或染色处理"
    ],
    "imageQuality": {
      "score": 0.82,
      "issues": ["图片清晰度较好"],
      "retakeAdvice": ["若用于交易，建议补充自然光近景和证书照片"]
    },
    "professionalAdvice": "如涉及购买、转售或高价值收藏，建议送具备资质的珠宝玉石检测机构复检。",
    "disclaimer": "本结果仅基于图片进行 AI 辅助分析，不能替代专业珠宝玉石鉴定证书。",
    "provider": "dashscope",
    "model": "qwen3-vl-flash",
    "analyzedAt": "2026-04-28T00:00:00.000Z"
  }
}
```

### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "IMAGE_REQUIRED",
    "message": "请上传玉石图片，字段名为 images，可一次上传多张。"
  }
}
```

常见错误码：

| 错误码 | 含义 |
|---|---|
| IMAGE_REQUIRED | 没有上传图片 |
| UNSUPPORTED_IMAGE_TYPE | 图片格式不支持 |
| INVALID_FORM_FIELDS | 表单字段格式不正确 |
| AI_KEY_NOT_CONFIGURED | 没有配置真实 AI API Key |
| AI_TIMEOUT | AI 服务响应超时 |
| AI_PROVIDER_ERROR | AI 服务调用失败 |
| INVALID_AI_JSON | AI 返回内容不是合法 JSON |
| RATE_LIMITED | 请求过于频繁 |
