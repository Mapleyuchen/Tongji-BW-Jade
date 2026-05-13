import { useRef, useState } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Plus,
  Trash2,
  Sparkles,
  ArrowLeftRight,
  ClipboardCheck,
  Feather,
  WandSparkles
} from 'lucide-react';

const SHOT_TIPS = [
  '自然光正面图',
  '透光图',
  '局部纹理近景',
  '侧面厚度/孔道图'
];

function formatMb(file) {
  if (!file) return '0.00 MB';
  return `${(file.size / 1024 / 1024).toFixed(2)} MB`;
}

export function UploadPanel({
  images,
  previewUrls,
  form,
  onFilesSelect,
  onReorderImages,
  onRemoveImage,
  onClearImages,
  onFormChange,
  onSubmit,
  loading,
  maxImages = 6,
  maxImageSizeMb = 8,
  uploadCompleteness,
  analysisStage,
  analysisProgress = 0
}) {
  const inputRef = useRef(null);
  const dragDepthRef = useRef(0);
  const [dragActive, setDragActive] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const hasImages = images.length > 0;
  const canAddMore = images.length < maxImages;

  function openFileDialog(event) {
    event?.stopPropagation?.();
    if (!loading && canAddMore) inputRef.current?.click();
  }

  function handleInputChange(event) {
    onFilesSelect(Array.from(event.target.files || []));
    event.target.value = '';
  }

  function handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();
    const isFileDrag = Array.from(event.dataTransfer?.types || []).includes('Files');
    if (!isFileDrag) return;
    dragDepthRef.current += 1;
    if (!loading) setDragActive(true);
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    const isFileDrag = Array.from(event.dataTransfer?.types || []).includes('Files');
    if (!isFileDrag) return;
    if (!loading) {
      event.dataTransfer.dropEffect = 'copy';
      setDragActive(true);
    }
  }

  function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setDragActive(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = 0;
    setDragActive(false);
    if (loading) return;

    const files = Array.from(event.dataTransfer?.files || []);
    if (files.length > 0) onFilesSelect(files);
  }

  function handlePaste(event) {
    if (loading) return;
    const files = Array.from(event.clipboardData?.files || []).filter((file) => file.type.startsWith('image/'));
    if (files.length > 0) onFilesSelect(files);
  }

  function movePreview(from, to) {
    if (from === null || to === null || from === to || loading) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onReorderImages(next);
    setDraggingIndex(null);
  }

  return (
    <section className="panel upload-panel" onPaste={handlePaste}>
      <div className="panel-title-row">
        <div>
          <p className="eyebrow"><Feather size={14} /> 专业鉴定</p>
          <h2>上传鉴别素材</h2>
          <p className="subhead">请尽量提供同一件玉石的多角度照片。图片越接近自然光、透光和局部纹理，报告越具体。</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="form-grid">
        <div
          className={`dropzone ${hasImages ? 'has-files' : ''} ${dragActive ? 'drag-active' : ''} ${loading ? 'is-loading' : ''}`}
          onClick={!hasImages ? openFileDialog : undefined}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if ((event.key === 'Enter' || event.key === ' ') && !hasImages) openFileDialog(event);
          }}
        >
          <input
            ref={inputRef}
            className="upload-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleInputChange}
          />

          <div className="drop-glow" />
          {dragActive && (
            <div className="drag-overlay">
              <UploadCloud size={44} />
              <strong>松开鼠标，立即添加图片</strong>
              <span>支持一次拖入多张 JPG / PNG / WEBP</span>
            </div>
          )}

          {hasImages ? (
            <div className="preview-wrap" onClick={(event) => event.stopPropagation()}>
              <div className="preview-header">
                <div>
                  <strong>已选择 {images.length} / {maxImages} 张图片</strong>
                  <span>{uploadCompleteness}</span>
                </div>
                <div className="preview-actions">
                  <button type="button" className="ghost-btn" onClick={openFileDialog} disabled={loading || !canAddMore}>
                    <Plus size={16} /> 继续添加
                  </button>
                  <button type="button" className="ghost-btn danger" onClick={onClearImages} disabled={loading}>
                    <Trash2 size={16} /> 清空
                  </button>
                </div>
              </div>

              <div className="shot-guide compact">
                {SHOT_TIPS.map((tip, index) => (
                  <span key={tip} className={images.length > index ? 'shot-done' : ''}>
                    <ClipboardCheck size={14} /> {tip}
                  </span>
                ))}
              </div>

              <div className="preview-grid">
                {previewUrls.map((url, index) => (
                  <figure
                    className={`preview-card ${draggingIndex === index ? 'is-dragging-card' : ''}`}
                    key={`${images[index]?.name}-${images[index]?.lastModified}-${index}`}
                    draggable={!loading}
                    onDragStart={(event) => {
                      setDraggingIndex(index);
                      event.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      movePreview(draggingIndex, index);
                    }}
                    onDragEnd={() => setDraggingIndex(null)}
                  >
                    <div className="preview-index">{index + 1}</div>
                    <img src={url} alt={`玉石图片预览 ${index + 1}`} />
                    <figcaption>
                      <span title={images[index]?.name}>{images[index]?.name}</span>
                      <small>{formatMb(images[index])}</small>
                    </figcaption>
                    <button
                      type="button"
                      className="preview-remove"
                      onClick={() => onRemoveImage(index)}
                      aria-label={`移除第 ${index + 1} 张图片`}
                      disabled={loading}
                    >
                      <X size={16} />
                    </button>
                  </figure>
                ))}
              </div>

              <div className="drop-hint">
                <ArrowLeftRight size={18} /> 可以继续拖入图片追加上传，也可以拖动缩略图调整顺序
              </div>
            </div>
          ) : (
            <div className="dropzone-content">
              <div className="upload-orb"><UploadCloud size={48} /></div>
              <strong>{dragActive ? '松开鼠标即可上传' : '点击选择或拖入多张玉石图片'}</strong>
              <span>支持 JPG / PNG / WEBP，最多 {maxImages} 张，单张不超过 {maxImageSizeMb}MB</span>
              <div className="shot-guide">
                {SHOT_TIPS.map((tip) => <span key={tip}><ClipboardCheck size={14} /> {tip}</span>)}
              </div>
            </div>
          )}
        </div>

        <div className="field-group">
          <div className="form-card-title">
            <span>辅助信息</span>
            <small>可选填写，用于提升报告针对性</small>
          </div>

          <label>
            疑似材质
            <input
              value={form.materialHint}
              onChange={(e) => onFormChange('materialHint', e.target.value)}
              placeholder="例如：翡翠、和田玉、玛瑙"
              disabled={loading}
            />
          </label>

          <label>
            拍摄场景
            <input
              value={form.sceneHint}
              onChange={(e) => onFormChange('sceneHint', e.target.value)}
              placeholder="例如：自然光、柜台灯、透光拍摄"
              disabled={loading}
            />
          </label>

          <label>
            补充描述
            <textarea
              value={form.description}
              onChange={(e) => onFormChange('description', e.target.value)}
              placeholder="例如：手镯，绿色，购买时商家称为 A 货翡翠"
              rows={4}
              disabled={loading}
            />
          </label>

          <button disabled={!hasImages || loading} type="submit" className="primary-btn">
            {loading ? <span className="spinner" /> : <WandSparkles size={18} />}
            {loading ? '正在生成鉴别报告...' : '开始智能鉴别'}
          </button>

          {loading && (
            <div className="analysis-progress" aria-live="polite">
              <div className="analysis-meta">
                <strong>{analysisStage}</strong>
                <span>{Math.round(analysisProgress * 100)}%</span>
              </div>
              <div className="analysis-track"><div style={{ width: `${analysisProgress * 100}%` }} /></div>
            </div>
          )}

          <div className="tip-card">
            <ImageIcon size={18} />
            <p>建议一次上传 3–6 张同一件玉石的不同角度照片。普通照片只能做辅助判断，无法替代专业仪器检测。</p>
          </div>
        </div>
      </form>
    </section>
  );
}
