/**
 * 玉石鉴赏页面专用脚本
 */

// ============================================
// 玉石数据
// ============================================
const jadeItems = [
    {
        id: 1,
        name: '玻璃种翡翠观音',
        category: 'feicui',
        categoryName: '翡翠',
        origin: '缅甸',
        description: '此观音吊坠采用顶级玻璃种翡翠雕制，通透如水，光华内敛。观音面相端庄慈祥，衣纹飘逸流畅，雕工精细入微，是难得一见的珍品。',
        image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=600&h=450&fit=crop',
        tags: ['玻璃种', '观音', '收藏级'],
        price: 888000
    },
    {
        id: 2,
        name: '羊脂白玉平安扣',
        category: 'hetian',
        categoryName: '和田玉',
        origin: '新疆和田',
        description: '和田羊脂白玉，温润如羊脂，质地细腻缜密。平安扣造型古朴典雅，寓意平安吉祥，是传统玉饰中的经典款式。',
        image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&h=450&fit=crop',
        tags: ['羊脂白', '平安扣', '和田玉'],
        price: 128000
    },
    {
        id: 3,
        name: '菠菜绿碧玉手镯',
        category: 'biyu',
        categoryName: '碧玉',
        origin: '俄罗斯',
        description: '菠菜绿碧玉手镯，颜色深沉浓绿，如菠菜叶般鲜嫩欲滴。镯身宽厚饱满，佩戴舒适，是气质优雅女士的首选。',
        image: 'https://images.unsplash.com/photo-1598618356794-eb1720430eb4?w=600&h=450&fit=crop',
        tags: ['菠菜绿', '手镯', '碧玉'],
        price: 68000
    },
    {
        id: 4,
        name: '紫罗兰翡翠手链',
        category: 'feicui',
        categoryName: '翡翠',
        origin: '缅甸',
        description: '紫罗兰翡翠珠串，颜色淡雅怡人，如春日紫藤。珠子圆润饱满，串珠整齐，是兼具收藏与佩戴价值的佳品。',
        image: 'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?w=600&h=450&fit=crop',
        tags: ['紫罗兰', '手链', '珠串'],
        price: 258000
    },
    {
        id: 5,
        name: '独山玉摆件-福禄寿',
        category: 'dushan',
        categoryName: '独山玉',
        origin: '河南南阳',
        description: '独山玉雕福禄寿三星，色彩丰富，雕工精湛。三位神仙神态各异，栩栩如生，寓意福禄寿齐全，是贺寿送礼的上品。',
        image: 'https://images.unsplash.com/photo-1514454709136-54a427617d1b?w=600&h=450&fit=crop',
        tags: ['福禄寿', '摆件', '独山玉'],
        price: 188000
    },
    {
        id: 6,
        name: '帝王绿翡翠蛋面戒指',
        category: 'feicui',
        categoryName: '翡翠',
        origin: '缅甸',
        description: '帝王绿翡翠蛋面，翠色浓郁纯正，帝王之气尽显。18K金镶嵌，钻石环绕，火彩璀璨，奢华典雅。',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=450&fit=crop',
        tags: ['帝王绿', '戒指', '18K金'],
        price: 1280000
    },
    {
        id: 7,
        name: '和田白玉弥勒佛',
        category: 'hetian',
        categoryName: '和田玉',
        origin: '新疆和田',
        description: '和田白玉雕大肚弥勒，笑口常开，神态慈祥。白玉质地纯净，温润细腻，寓意笑口常开、乐观豁达。',
        image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&h=450&fit=crop',
        tags: ['白玉', '弥勒佛', '和田玉'],
        price: 98000
    },
    {
        id: 8,
        name: '猫眼碧玉吊坠',
        category: 'biyu',
        categoryName: '碧玉',
        origin: '加拿大',
        description: '罕见猫眼碧玉，猫眼效果灵动，随光而动。简约水滴造型，凸显玉石本身的魅力，适合日常佩戴。',
        image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=450&fit=crop',
        tags: ['猫眼', '吊坠', '碧玉'],
        price: 168000
    }
];

// ============================================
// DOM 元素
// ============================================
const galleryGrid = document.getElementById('galleryGrid');
const jadeCount = document.getElementById('jadeCount');
const sortSelect = document.getElementById('sortSelect');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxOrigin = document.getElementById('lightboxOrigin');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxTags = document.getElementById('lightboxTags');
const lightboxPrice = document.getElementById('lightboxPrice');

// 当前状态
let currentFilter = 'all';
let currentColor = 'all';
let currentPrice = 'all';
let currentSort = 'default';
let currentItems = [...jadeItems];
let currentIndex = 0;

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // 渲染初始数据
    renderGallery();
    
    // 绑定筛选事件
    bindFilterEvents();
    
    // 绑定排序事件
    sortSelect.addEventListener('change', handleSortChange);
    
    // 绑定灯箱事件
    bindLightboxEvents();
    
    // 初始化导航
    initNavigation();
});

// ============================================
// 渲染玉石网格
// ============================================
function renderGallery() {
    // 应用筛选
    currentItems = jadeItems.filter(item => {
        const categoryMatch = currentFilter === 'all' || item.category === currentFilter;
        const colorMatch = currentColor === 'all' || checkColorMatch(item, currentColor);
        const priceMatch = checkPriceMatch(item, currentPrice);
        return categoryMatch && colorMatch && priceMatch;
    });
    
    // 应用排序
    sortItems();
    
    // 更新数量
    jadeCount.textContent = currentItems.length;
    
    // 渲染
    if (currentItems.length === 0) {
        galleryGrid.innerHTML = `
            <div class="empty-state">
                <p>暂无符合条件的玉石</p>
            </div>
        `;
        return;
    }
    
    galleryGrid.innerHTML = currentItems.map((item, index) => `
        <article class="gallery-item" data-index="${index}">
            <div class="gallery-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <span class="gallery-item-badge">${item.categoryName}</span>
                <div class="gallery-item-overlay">
                    <button class="gallery-item-btn">查看详情</button>
                </div>
            </div>
            <div class="gallery-item-content">
                <h3 class="gallery-item-title">${item.name}</h3>
                <p class="gallery-item-desc">${item.description}</p>
                <div class="gallery-item-meta">
                    <div class="gallery-item-tags">
                        ${item.tags.map(tag => `<span class="gallery-item-tag">${tag}</span>`).join('')}
                    </div>
                    <span class="gallery-item-price">¥${formatPrice(item.price)}</span>
                </div>
            </div>
        </article>
    `).join('');
    
    // 绑定卡片点击事件
    bindCardEvents();
}

// ============================================
// 筛选逻辑
// ============================================
function bindFilterEvents() {
    // 种类筛选
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderGallery();
        });
    });
    
    // 颜色筛选
    document.querySelectorAll('[data-color]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-color]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentColor = btn.dataset.color;
            renderGallery();
        });
    });
    
    // 价格筛选
    document.querySelectorAll('[data-price]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-price]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPrice = btn.dataset.price;
            renderGallery();
        });
    });
}

function checkColorMatch(item, color) {
    if (color === 'all') return true;
    const colorMap = {
        'green': ['feicui', 'biyu'],
        'white': ['hetian'],
        'purple': ['feicui'],
        'yellow': ['hetian', 'dushan']
    };
    return colorMap[color]?.includes(item.category) || false;
}

function checkPriceMatch(item, price) {
    if (price === 'all') return true;
    if (price === 'low') return item.price < 100000;
    if (price === 'mid') return item.price >= 100000 && item.price < 500000;
    if (price === 'high') return item.price >= 500000;
    return true;
}

// ============================================
// 排序逻辑
// ============================================
function handleSortChange(e) {
    currentSort = e.target.value;
    renderGallery();
}

function sortItems() {
    switch (currentSort) {
        case 'price-asc':
            currentItems.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            currentItems.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            currentItems.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
            break;
        default:
            currentItems.sort((a, b) => a.id - b.id);
    }
}

function formatPrice(price) {
    return price.toLocaleString('zh-CN');
}

// ============================================
// 卡片事件
// ============================================
function bindCardEvents() {
    document.querySelectorAll('.gallery-item').forEach(card => {
        card.addEventListener('click', () => {
            const index = parseInt(card.dataset.index);
            openLightbox(index);
        });
    });
}

// ============================================
// 灯箱逻辑
// ============================================
function bindLightboxEvents() {
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
    const nextBtn = lightbox.querySelector('.lightbox-nav.next');
    
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox('prev'));
    nextBtn.addEventListener('click', () => navigateLightbox('next'));
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
        if (e.key === 'ArrowRight') navigateLightbox('next');
    });
}

function openLightbox(index) {
    const item = currentItems[index];
    if (!item) return;
    
    currentIndex = index;
    
    lightboxImage.src = item.image;
    lightboxImage.alt = item.name;
    lightboxTitle.textContent = item.name;
    lightboxOrigin.textContent = `产地：${item.origin}`;
    lightboxDesc.textContent = item.description;
    lightboxTags.innerHTML = item.tags.map(tag => 
        `<span class="lightbox-tag">${tag}</span>`
    ).join('');
    lightboxPrice.textContent = `¥${formatPrice(item.price)}`;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % currentItems.length;
    } else {
        currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    }
    openLightbox(currentIndex);
}

// ============================================
// 导航
// ============================================
function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const header = document.getElementById('header');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}
