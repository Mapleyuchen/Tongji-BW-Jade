import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Microscope,
  Camera,
  Images,
  Gauge,
  ShieldAlert,
  BadgeCheck,
  Clock3
} from 'lucide-react';

function riskClass(riskLevel) {
  if (riskLevel === '低风险') return 'risk-low';
  if (riskLevel === '中等风险') return 'risk-mid';
  if (riskLevel === '高风险') return 'risk-high';
  return 'risk-unknown';
}

function riskIcon(riskLevel) {
  if (riskLevel === '低风险') return BadgeCheck;
  if (riskLevel === '高风险') return ShieldAlert;
  return AlertTriangle;
}

function PercentBar({ value, label = '置信度' }) {
  const percent = Math.round((Number(value) || 0) * 100);
  return (
    <div className="percent-wrap">
      <div className="percent-meta"><span>{label}</span><span>{percent}%</span></div>
      <div className="percent-track"><div style={{ width: `${percent}%` }} /></div>
    </div>
  );
}

function ScoreRing({ value, label }) {
  const percent = Math.round((Number(value) || 0) * 100);
  return (
    <div className="score-ring" style={{ '--score': `${percent * 3.6}deg` }}>
      <div>
        <strong>{percent}%</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function ListBlock({ icon, title, items, className = '' }) {
  const Icon = icon;
  if (!items || items.length === 0) return null;
  return (
    <div className={`report-block ${className}`}>
      <h3><Icon size={18} /> {title}</h3>
      <ul>
        {items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}
      </ul>
    </div>
  );
}

export function ReportPanel({ report, requestId }) {
  if (!report) {
    return (
      <section className="panel empty-report">
        <div className="empty-illustration">
          <ClipboardList size={44} />
        </div>
        <h2>等待生成鉴别报告</h2>
        <p>上传一张或多张图片并点击“开始智能鉴别”后，这里会展示完整报告。</p>
        <div className="empty-steps">
          <span>上传多角度图片</span>
          <span>AI 综合分析</span>
          <span>生成正式报告</span>
        </div>
      </section>
    );
  }

  const RiskIcon = riskIcon(report.riskLevel);
  const qualityItems = [
    ...(report.imageQuality?.issues || []),
    ...(report.imageQuality?.retakeAdvice || [])
  ];

  return (
    <section className="panel report-panel">
      <div className="report-header">
        <div>
          <p className="eyebrow"><Gauge size={14} /> AI 辅助鉴别报告</p>
          <h2>{report.material}</h2>
          <p>{report.authenticity}</p>
        </div>
        <div className={`risk-pill ${riskClass(report.riskLevel)}`}><RiskIcon size={18} /> {report.riskLevel}</div>
      </div>

      <div className="report-dashboard">
        <ScoreRing value={report.confidence} label="置信度" />
        <div className="summary-grid">
          <div className="summary-card">
            <span>疑似材质</span>
            <strong>{report.material}</strong>
          </div>
          <div className="summary-card">
            <span>真伪风险</span>
            <strong>{report.riskLevel}</strong>
          </div>
          <div className="summary-card">
            <span>分析图片</span>
            <strong>{report.imageCount || 1} 张</strong>
          </div>
          <div className="summary-card wide">
            <PercentBar value={report.imageQuality?.score} label="图片质量" />
          </div>
        </div>
      </div>

      <div className="report-grid">
        <ListBlock icon={Images} title="多图证据汇总" items={report.imageEvidence} className="wide-block" />
        <ListBlock icon={CheckCircle2} title="可见视觉特征" items={report.visualFeatures} />
        <ListBlock icon={AlertTriangle} title="疑点与风险提示" items={report.suspiciousPoints} />
        <ListBlock icon={Camera} title="图片质量与补拍建议" items={qualityItems} className="wide-block" />
      </div>

      <div className="professional-advice">
        <h3><Microscope size={18} /> 专业建议</h3>
        <p>{report.professionalAdvice}</p>
      </div>

      <footer className="report-footer">
        <span>请求编号：{requestId}</span>
        <span>模型：{report.provider} / {report.model}</span>
        <span><Clock3 size={13} /> 时间：{new Date(report.analyzedAt).toLocaleString()}</span>
      </footer>
    </section>
  );
}
