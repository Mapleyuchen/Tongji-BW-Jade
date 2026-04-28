export async function identifyJade({ images, materialHint, sceneHint, description }) {
  const formData = new FormData();
  images.forEach((image) => formData.append('images', image));
  formData.append('materialHint', materialHint || '');
  formData.append('sceneHint', sceneHint || '');
  formData.append('description', description || '');

  const response = await fetch('/api/jade/identify', {
    method: 'POST',
    body: formData
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) {
    const message = payload?.error?.message || '鉴别请求失败，请检查服务配置。';
    const code = payload?.error?.code || 'REQUEST_FAILED';
    throw new Error(`${message}（${code}）`);
  }

  return payload;
}
