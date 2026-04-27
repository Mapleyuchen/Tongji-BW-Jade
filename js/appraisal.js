/**
 * 专业鉴定页面脚本
 */

// DOM 元素
const uploadArea = document.getElementById('uploadArea');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const uploadPreview = document.getElementById('uploadPreview');
const previewGrid = document.getElementById('previewGrid');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const changeImageBtn = document.getElementById('changeImageBtn');
const identifyBtn = document.getElementById('identifyBtn');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resultSection = document.getElementById('resultSection');

// 状态
let uploadedFiles = [];
let isProcessing = false;

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initUpload();
    initIdentify();
    initResultActions();
    initNavigation();
});

// ============================================
// 上传功能
// ============================================
function initUpload() {
    // 点击上传按钮
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 选择文件
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    // 更换图片
    changeImageBtn.addEventListener('click', () => {
        fileInput.click();
    });
}

function handleFiles(files) {
    const validFiles = Array.from(files).filter(file => {
        if (!file.type.startsWith('image/')) {
            showNotification('请上传图片文件', 'error');
            return false;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB
            showNotification('图片大小不能超过10MB', 'error');
            return false;
        }
        return true;
    });
    
    if (uploadedFiles.length + validFiles.length > 5) {
        showNotification('最多上传5张图片', 'error');
        return;
    }
    
    validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedFiles.push({
                file: file,
                url: e.target.result
            });
            updatePreview();
        };
        reader.readAsDataURL(file);
    });
}

function updatePreview() {
    if (uploadedFiles.length === 0) {
        uploadPlaceholder.style.display = 'block';
        uploadPreview.style.display = 'none';
        identifyBtn.disabled = true;
        return;
    }
    
    uploadPlaceholder.style.display = 'none';
    uploadPreview.style.display = 'block';
    identifyBtn.disabled = false;
    
    previewGrid.innerHTML = uploadedFiles.map((item, index) => `
        <div class="preview-item" data-index="${index}">
            <img src="${item.url}" alt="预览 ${index + 1}">
            <button class="remove-btn" data-index="${index}">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    `).join('');
    
    // 绑定删除按钮
    previewGrid.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            uploadedFiles.splice(index, 1);
            updatePreview();
        });
    });
}

// ============================================
// 鉴定功能
// ============================================
function initIdentify() {
    identifyBtn.addEventListener('click', startIdentification);
}

async function startIdentification() {
    if (isProcessing || uploadedFiles.length === 0) return;
    
    isProcessing = true;
    identifyBtn.disabled = true;
    identifyBtn.classList.add('processing');
    identifyBtn.innerHTML = `
        <svg class="ai-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
        </svg>
        鉴定中...
    `;
    
    // 模拟 AI 鉴定过程
    const steps = [
        { text: '正在分析图片质量...', delay: 800 },
        { text: '正在识别玉石种类...', delay: 1200 },
        { text: '正在检测颜色特征...', delay: 1000 },
        { text: '正在评估透明度...', delay: 900 },
        { text: '正在分析纹理结构...', delay: 1100 },
        { text: '正在生成鉴定报告...', delay: 700 }
    ];
    
    for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
    }
    
    // 生成随机鉴定结果
    const result = generateMockResult();
    
    // 显示结果
    displayResult(result);
    
    isProcessing = false;
    identifyBtn.classList.remove('processing');
    identifyBtn.disabled = false;
    identifyBtn.innerHTML = `
        <svg class="ai-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
        </svg>
        重新鉴定
    `;
}

function generateMockResult() {
    const jadeTypes = ['翡翠', '和田玉', '碧玉', '独山玉'];
    const origins = ['缅甸', '新疆和田', '俄罗斯', '河南南阳', '加拿大'];
    const colors = ['帝王绿', '玻璃种', '阳绿', '苹果绿', '菠菜绿'];
    const grades = ['A', 'B+', 'A-', 'AA'];
    
    const type = jadeTypes[Math.floor(Math.random() * jadeTypes.length)];
    const baseScore = 70 + Math.floor(Math.random() * 25);
    const isNatural = Math.random() > 0.1;
    
    return {
        score: baseScore,
        grade: baseScore >= 90 ? '优质' : baseScore >= 75 ? '良好' : '一般',
        type: type,
        origin: origins[Math.floor(Math.random() * origins.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        transparency: ['透明', '半透明', '微透明', '不透明'][Math.floor(Math.random() * 4)],
        texture: ['细腻', '致密', '中等', '粗糙'][Math.floor(Math.random() * 4)],
        craft: ['精细', '良好', '一般', '简单'][Math.floor(Math.random() * 4)],
        isNatural: isNatural,
        authenticity: isNatural ? '天然翡翠 A货' : '处理翡翠 B+C货',
        price: Math.floor(Math.random() * 200 + 10) * 10000,
        advice: isNatural ? '这件玉石品质优良，天然无处理，具有一定的收藏价值。建议在正规渠道购买，并索要权威鉴定证书。' : '这件玉石经过化学处理，价值大打折扣。购买时请务必索要正规鉴定证书，谨慎决策。',
        careTips: [
            '避免与硬物碰撞，防止划伤',
            '定期用软布擦拭，保持光泽',
            '避免长时间暴露在阳光下',
            '不佩戴时可放入首饰盒保存',
            '避免接触化学试剂，如香水、洗涤剂'
        ]
    };
}

function displayResult(result) {
    resultSection.style.display = 'block';
    
    // 动画显示分数
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreValue = document.getElementById('scoreValue');
    const gradeBadge = document.getElementById('resultGrade');
    
    // 设置分数圆环
    const scorePercent = result.score;
    scoreCircle.style.background = `conic-gradient(var(--accent) ${scorePercent * 3.6}deg, var(--border-light) ${scorePercent * 3.6}deg)`;
    
    // 动画数字
    let currentScore = 0;
    const scoreInterval = setInterval(() => {
        if (currentScore < result.score) {
            currentScore++;
            scoreValue.textContent = currentScore;
        } else {
            clearInterval(scoreInterval);
        }
    }, 20);
    
    // 设置等级
    gradeBadge.innerHTML = `<span class="grade-badge ${result.grade === '优质' ? 'excellent' : result.grade === '良好' ? 'good' : 'average'}">${result.grade}</span>`;
    
    // 设置详细信息
    document.getElementById('jadeType').textContent = result.type;
    document.getElementById('jadeOrigin').textContent = result.origin;
    document.getElementById('colorGrade').textContent = result.color;
    document.getElementById('transparency').textContent = result.transparency;
    document.getElementById('textureGrade').textContent = result.texture;
    document.getElementById('craftGrade').textContent = result.craft;
    
    // 设置真伪鉴别
    const authResult = document.getElementById('authenticityResult');
    authResult.innerHTML = `
        <div class="auth-badge ${result.isNatural ? 'real' : 'fake'}">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                ${result.isNatural 
                    ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
                    : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
                }
            </svg>
            <span>${result.authenticity}</span>
        </div>
    `;
    
    // 设置价格评估
    document.querySelector('.price-value').textContent = `¥${result.price.toLocaleString()}`;
    document.getElementById('priceLow').textContent = `¥${Math.floor(result.price * 0.6).toLocaleString()}`;
    document.getElementById('priceHigh').textContent = `¥${Math.floor(result.price * 1.4).toLocaleString()}`;
    
    // 设置建议
    document.getElementById('purchaseAdvice').textContent = result.advice;
    document.getElementById('careTips').innerHTML = result.careTips.map(tip => `<li>${tip}</li>`).join('');
    
    // 滚动到结果区域
    resultSection.scrollIntoView({ behavior: 'smooth' });
    
    showNotification('鉴定完成！');
}

// ============================================
// 结果操作
// ============================================
function initResultActions() {
    // 重新鉴定
    resetBtn.addEventListener('click', () => {
        uploadedFiles = [];
        updatePreview();
        resultSection.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // 下载报告
    downloadBtn.addEventListener('click', () => {
        downloadReport();
    });
}

function downloadReport() {
    const resultGrade = document.getElementById('resultGrade').textContent.trim();
    const jadeType = document.getElementById('jadeType').textContent;
    const jadeOrigin = document.getElementById('jadeOrigin').textContent;
    const priceValue = document.querySelector('.price-value').textContent;
    const scoreValue = document.getElementById('scoreValue').textContent;
    const authenticity = document.querySelector('.auth-badge span')?.textContent || '—';
    
    const reportContent = `
玉石鉴定报告
=====================================

鉴定编号：WD-${Date.now().toString().slice(-8)}
鉴定日期：${new Date().toLocaleDateString('zh-CN')}

【综合评分】
评分：${scoreValue}分
等级：${resultGrade}

【玉石信息】
种类：${jadeType}
产地：${jadeOrigin}
真伪：${authenticity}

【价格评估】
市场价值：${priceValue}

【免责声明】
本报告由AI智能鉴定系统生成，仅供参考。
如需权威鉴定，请咨询专业鉴定机构。

=====================================
玉韵 JadeCharm
    `.trim();
    
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `玉石鉴定报告_${Date.now()}.txt`;
    link.click();
    
    showNotification('报告已下载');
}

// ============================================
// 工具函数
// ============================================
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            ${type === 'success' 
                ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
                : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
            }
        </svg>
        ${message}
    `;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? 'var(--primary)' : '#dc3545'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes slideDown {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(20px); }
    }
    .dragover {
        background: rgba(45, 90, 74, 0.1) !important;
        border-color: var(--primary) !important;
    }
`;
document.head.appendChild(style);

// ============================================
// 导航
// ============================================
function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const header = document.getElementById('header');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}
