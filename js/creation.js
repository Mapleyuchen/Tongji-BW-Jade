/**
 * 玉石创作页面脚本
 */

// 当前设计状态
const designState = {
    shape: 'circle',
    material: 'feicui',
    color: '#2E8B57',
    pattern: 'guashi',
    width: 100,
    height: 100,
    ringSize: 14
};

// DOM 元素
const canvas = document.getElementById('creationCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const shapeGrid = document.getElementById('shapeGrid');
const materialGrid = document.getElementById('materialGrid');
const patternGrid = document.getElementById('patternGrid');
const widthSlider = document.getElementById('widthSlider');
const heightSlider = document.getElementById('heightSlider');
const widthValue = document.getElementById('widthValue');
const heightValue = document.getElementById('heightValue');
const resetBtn = document.getElementById('resetBtn');
const saveBtn = document.getElementById('saveBtn');
const uploadBtn = document.getElementById('uploadBtn');
const submitForm = document.getElementById('submitForm');

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    bindEvents();
    drawPreview();
});

// ============================================
// Canvas 初始化
// ============================================
function initCanvas() {
    if (!canvas) return;
    
    canvas.width = 400;
    canvas.height = 400;
    drawPreview();
}

// ============================================
// 绑定事件
// ============================================
function bindEvents() {
    // 形状选择
    if (shapeGrid) {
        shapeGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.shape-btn');
            if (!btn) return;
            
            shapeGrid.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            designState.shape = btn.dataset.shape;
            drawPreview();
        });
    }
    
    // 材质选择
    if (materialGrid) {
        materialGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.material-btn');
            if (!btn) return;
            
            materialGrid.querySelectorAll('.material-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            designState.material = btn.dataset.material;
            designState.color = btn.dataset.color;
            drawPreview();
        });
    }
    
    // 图案选择
    if (patternGrid) {
        patternGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.pattern-btn');
            if (!btn) return;
            
            patternGrid.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            designState.pattern = btn.dataset.pattern;
            drawPreview();
        });
    }
    
    // 尺寸滑块
    if (widthSlider) {
        widthSlider.addEventListener('input', (e) => {
            designState.width = parseInt(e.target.value);
            widthValue.textContent = designState.width;
            drawPreview();
        });
    }
    
    if (heightSlider) {
        heightSlider.addEventListener('input', (e) => {
            designState.height = parseInt(e.target.value);
            heightValue.textContent = designState.height;
            drawPreview();
        });
    }
    
    // 戒指尺寸
    document.querySelectorAll('.ring-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.ring-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            designState.ringSize = parseInt(btn.dataset.size);
        });
    });
    
    // 重置按钮
    if (resetBtn) {
        resetBtn.addEventListener('click', resetDesign);
    }
    
    // 保存按钮
    if (saveBtn) {
        saveBtn.addEventListener('click', saveDesign);
    }
    
    // 上传按钮
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => handleImageUpload(e);
            input.click();
        });
    }
    
    // 提交表单
    if (submitForm) {
        submitForm.addEventListener('submit', handleSubmit);
    }
    
    // 工具按钮
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // 初始化导航
    initNavigation();
}

// ============================================
// 绘制预览
// ============================================
function drawPreview() {
    if (!ctx) return;
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 计算位置和大小
    const scale = Math.min(canvas.width / designState.width, canvas.height / designState.height) * 0.6;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const w = designState.width * scale;
    const h = designState.height * scale;
    
    // 创建渐变
    const gradient = ctx.createLinearGradient(
        centerX - w/2, centerY - h/2,
        centerX + w/2, centerY + h/2
    );
    gradient.addColorStop(0, lightenColor(designState.color, 30));
    gradient.addColorStop(0.5, designState.color);
    gradient.addColorStop(1, darkenColor(designState.color, 20));
    
    // 绘制形状
    ctx.beginPath();
    
    switch (designState.shape) {
        case 'circle':
            ctx.arc(centerX, centerY, Math.min(w, h) / 2, 0, Math.PI * 2);
            break;
        case 'oval':
            ctx.ellipse(centerX, centerY, w / 2, h / 2, 0, 0, Math.PI * 2);
            break;
        case 'rectangle':
            roundRect(ctx, centerX - w/2, centerY - h/2, w, h, 20);
            break;
        case 'drop':
            drawDropShape(ctx, centerX, centerY, w, h);
            break;
        case 'leaf':
            drawLeafShape(ctx, centerX, centerY, w, h);
            break;
        case 'bamboo':
            drawBambooShape(ctx, centerX, centerY, w, h);
            break;
        default:
            ctx.arc(centerX, centerY, Math.min(w, h) / 2, 0, Math.PI * 2);
    }
    
    ctx.closePath();
    
    // 填充渐变
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // 添加高光效果
    const highlightGradient = ctx.createRadialGradient(
        centerX - w/4, centerY - h/4, 0,
        centerX, centerY, Math.max(w, h) / 2
    );
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = highlightGradient;
    ctx.fill();
    
    // 绘制边框
    ctx.strokeStyle = darkenColor(designState.color, 30);
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 绘制图案
    if (designState.pattern && designState.pattern !== 'none') {
        drawPattern();
    }
}

function drawDropShape(ctx, x, y, w, h) {
    ctx.moveTo(x, y - h/2);
    ctx.bezierCurveTo(x + w/2, y - h/4, x + w/2, y + h/4, x, y + h/2);
    ctx.bezierCurveTo(x - w/2, y + h/4, x - w/2, y - h/4, x, y - h/2);
}

function drawLeafShape(ctx, x, y, w, h) {
    ctx.moveTo(x, y - h/2);
    ctx.bezierCurveTo(x + w, y - h/4, x + w, y + h/4, x, y + h/2);
    ctx.bezierCurveTo(x - w, y + h/4, x - w, y - h/4, x, y - h/2);
}

function drawBambooShape(ctx, x, y, w, h) {
    // 简化的竹节形状
    const segments = 3;
    const segHeight = h / segments;
    
    for (let i = 0; i < segments; i++) {
        const segY = y - h/2 + i * segHeight;
        ctx.moveTo(x - w/3, segY);
        ctx.lineTo(x - w/3, segY + segHeight);
        ctx.lineTo(x + w/3, segY + segHeight);
        ctx.lineTo(x + w/3, segY);
        ctx.lineTo(x - w/3, segY);
    }
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
}

function drawPattern() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const fontSize = Math.min(designState.width, designState.height) * 0.4;
    
    ctx.font = `bold ${fontSize}px "Noto Serif SC", serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const patterns = {
        'guashi': '☰',
        'lianhua': '莲',
        'ruyi': '如意',
        'shou': '寿',
        'fu': '福',
        'lu': '禄',
        'bi': '璧'
    };
    
    const text = patterns[designState.pattern] || '';
    if (text) {
        ctx.fillText(text, centerX, centerY);
    }
}

// 颜色处理函数
function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

// ============================================
// 设计操作
// ============================================
function resetDesign() {
    designState.shape = 'circle';
    designState.material = 'feicui';
    designState.color = '#2E8B57';
    designState.pattern = 'guashi';
    designState.width = 100;
    designState.height = 100;
    designState.ringSize = 14;
    
    // 重置 UI
    shapeGrid.querySelectorAll('.shape-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.shape === 'circle');
    });
    materialGrid.querySelectorAll('.material-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.material === 'feicui');
    });
    patternGrid.querySelectorAll('.pattern-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.pattern === 'guashi');
    });
    
    if (widthSlider) widthSlider.value = 100;
    if (heightSlider) heightSlider.value = 100;
    if (widthValue) widthValue.textContent = '100';
    if (heightValue) heightValue.textContent = '100';
    
    document.querySelectorAll('.ring-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.size === '14');
    });
    
    drawPreview();
}

function saveDesign() {
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `jade-design-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    showNotification('设计已保存为图片');
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 绘制上传的图片
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;
            
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            showNotification('草图已上传');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('designName'),
        userName: formData.get('userName'),
        phone: formData.get('userPhone'),
        email: formData.get('userEmail'),
        note: formData.get('designNote'),
        design: designState
    };
    
    console.log('提交的设计:', data);
    
    showNotification('设计已提交，我们会尽快与您联系！');
    e.target.reset();
}

// ============================================
// 工具函数
// ============================================
function showNotification(message) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        ${message}
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary);
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
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
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
