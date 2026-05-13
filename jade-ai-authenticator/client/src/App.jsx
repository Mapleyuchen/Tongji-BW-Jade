import { useEffect, useMemo, useState } from 'react';
import { Sparkles, ShieldCheck, Gem, ScrollText } from 'lucide-react';
import { UploadPanel } from './components/UploadPanel.jsx';
import { ReportPanel } from './components/ReportPanel.jsx';
import { identifyJade } from './api/jadeApi.js';

const initialForm = {
  materialHint: '',
  sceneHint: '',
  description: ''
};

const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE_MB = 8;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const ANALYSIS_STAGES = [
  '正在校验图片格式与大小',
  '正在上传多角度图片',
  '正在识别颜色、光泽与透明度',
  '正在比对纹理、裂纹与异常痕迹',
  '正在综合多图证据生成报告'
];

function makeFileKey(file) {
  return `${file.name}_${file.size}_${file.lastModified}`;
}

function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand-mark" href="/" aria-label="玉韵首页">
          <span className="brand-seal">玉</span>
          <span>
            <strong>玉韵</strong>
            <small>JADE CHARM · CLASSIC APPRECIATION</small>
          </span>
        </a>
        <nav className="site-nav" aria-label="主导航">
          <a href="/">首页</a>
          <a href="/gallery">玉石鉴赏</a>
          <a href="/culture">文化典藏</a>
          <a href="/creation">玉石创作</a>
          <a href="/appraisal" className="active">专业鉴定</a>
        </nav>
      </div>
      <div className="wave-divider" aria-hidden="true" />
    </header>
  );
}

export default function App() {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [analysisStageIndex, setAnalysisStageIndex] = useState(0);
  const [error, setError] = useState('');
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    const preventBrowserOpen = (event) => {
      event.preventDefault();
    };

    window.addEventListener('dragover', preventBrowserOpen);
    window.addEventListener('drop', preventBrowserOpen);
    return () => {
      window.removeEventListener('dragover', preventBrowserOpen);
      window.removeEventListener('drop', preventBrowserOpen);
    };
  }, []);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  useEffect(() => {
    if (!loading) {
      setAnalysisStageIndex(0);
      return undefined;
    }

    const timer = window.setInterval(() => {
      setAnalysisStageIndex((index) => Math.min(index + 1, ANALYSIS_STAGES.length - 1));
    }, 1350);

    return () => window.clearInterval(timer);
  }, [loading]);

  const fileSummary = useMemo(() => {
    if (images.length === 0) return '尚未选择图片';
    const totalMb = images.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024;
    return `已选择 ${images.length} 张图片 · 合计 ${totalMb.toFixed(2)} MB`;
  }, [images]);

  const uploadCompleteness = useMemo(() => {
    if (images.length >= 4) return '多角度材料充足，模型更容易给出明确风险等级';
    if (images.length >= 2) return '已有多张图片，建议再补充透光或局部纹理图';
    if (images.length === 1) return '只有单张图片时，系统会更容易判为信息不足或中等风险';
    return '建议至少上传 3 张：自然光正面图、透光图、局部纹理图';
  }, [images.length]);

  function handleFilesSelect(filesInput) {
    const incoming = Array.from(filesInput || []);
    const messages = [];
    const validFiles = [];

    incoming.forEach((file) => {
      if (!ALLOWED_TYPES.has(file.type)) {
        messages.push(`${file.name} 格式不支持，仅支持 JPG、PNG、WEBP。`);
        return;
      }
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        messages.push(`${file.name} 超过 ${MAX_IMAGE_SIZE_MB}MB，已跳过。`);
        return;
      }
      validFiles.push(file);
    });

    setImages((prev) => {
      const existingKeys = new Set(prev.map(makeFileKey));
      const deduplicated = validFiles.filter((file) => !existingKeys.has(makeFileKey(file)));

      if (deduplicated.length < validFiles.length) {
        messages.push('已自动跳过重复选择的图片。');
      }

      const remainingSlots = MAX_IMAGES - prev.length;
      if (remainingSlots <= 0) {
        messages.push(`最多只能上传 ${MAX_IMAGES} 张图片。`);
        return prev;
      }
      if (deduplicated.length > remainingSlots) {
        messages.push(`最多只能上传 ${MAX_IMAGES} 张图片，本次只添加前 ${remainingSlots} 张有效图片。`);
      }

      const selected = deduplicated.slice(0, remainingSlots);
      if (selected.length > 0) setPayload(null);
      return [...prev, ...selected];
    });

    setError(messages.join(' '));
  }

  function handleReorderImages(nextImages) {
    setImages(nextImages);
    setPayload(null);
  }

  function handleRemoveImage(index) {
    setImages((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    setPayload(null);
    setError('');
  }

  function handleClearImages() {
    setImages([]);
    setPayload(null);
    setError('');
  }

  function handleFormChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (images.length === 0 || loading) return;

    setLoading(true);
    setError('');
    setAnalysisStageIndex(0);

    try {
      const result = await identifyJade({ images, ...form });
      setPayload(result);
    } catch (err) {
      setError(err.message || '鉴别失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="site-page">
      <SiteHeader />

      <section className="app-hero" aria-labelledby="hero-title">
        <div className="hero-vertical">鉴玉 · 辨真</div>
        <div className="hero-content">
          <p className="hero-kicker"><Gem size={16} /> AI JADE APPRAISAL</p>
          <h1 id="hero-title">玉石智能鉴别</h1>
          <p>上传玉石多角度照片，系统将从颜色、光泽、透明度、纹理和异常痕迹等方面生成辅助鉴别报告。</p>
          <div className="hero-note">
            <ShieldCheck size={18} />
            <span>仅作图像辅助分析，重要藏品仍建议送专业检测机构复核。</span>
          </div>
        </div>
        <div className="hero-card" aria-hidden="true">
          <div className="jade-disc disc-one" />
          <div className="jade-disc disc-two" />
          <div className="jade-disc disc-three" />
          <ScrollText size={38} />
          <span>结构化报告</span>
        </div>
      </section>

      <div className="content-wrap">
        <UploadPanel
          images={images}
          previewUrls={previewUrls}
          form={form}
          maxImages={MAX_IMAGES}
          maxImageSizeMb={MAX_IMAGE_SIZE_MB}
          uploadCompleteness={uploadCompleteness}
          analysisStage={ANALYSIS_STAGES[analysisStageIndex]}
          analysisProgress={loading ? ((analysisStageIndex + 1) / ANALYSIS_STAGES.length) : 0}
          onFilesSelect={handleFilesSelect}
          onReorderImages={handleReorderImages}
          onRemoveImage={handleRemoveImage}
          onClearImages={handleClearImages}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          loading={loading}
        />

        <div className="status-row">
          <span>{fileSummary}</span>
          <span>{uploadCompleteness}</span>
        </div>

        {error && <div className="error-banner" role="alert">{error}</div>}

        <ReportPanel report={payload?.result} requestId={payload?.requestId} />

        <section className="disclaimer">
          <strong>免责声明：</strong>
          本系统仅基于图片进行 AI 辅助分析，不能作为交易、定价、维权或法律意义上的专业鉴定依据。高价值玉石请送至具备资质的珠宝玉石检测机构复检。
        </section>
      </div>
    </main>
  );
}
