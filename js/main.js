/**
 * 玉韵 - 古典玉石鉴赏平台
 * 主交互逻辑脚本
 */

// ============================================
// 玉石数据
// ============================================
const jadeData = [
    {
        id: 1,
        name: '玻璃种翡翠观音',
        category: 'feicui',
        categoryName: '翡翠',
        origin: '缅甸',
        description: '此观音吊坠采用顶级玻璃种翡翠雕制，通透如水，光华内敛。观音面相端庄慈祥，衣纹飘逸流畅，雕工精细入微，是难得一见的珍品。',
        image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=600&h=450&fit=crop',
        tags: ['玻璃种', '观音', '收藏级'],
        price: '¥888,000'
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
        price: '¥128,000'
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
        price: '¥68,000'
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
        price: '¥258,000'
    },
    {
        id: 5,
        name: '独山玉摆件-福禄寿',
        category: 'dushan',
        categoryName: '独山玉',
        origin: '河南南阳',
        description: '独山玉雕福禄寿三星，色彩丰富，雕工精湛。三位神仙神态各异，栩栩如生，寓意福禄寿齐全，是贺寿送礼的上品。',
        image: 'https://images.unsplash.com/photo-1514454709136-54a427617d1b?w=600&h=450&fit=crop',
        imageAlt: 'https://images.unsplash.com/photo-1608501078713-8e445a709b39?w=600&h=450&fit=crop',
        tags: ['福禄寿', '摆件', '独山玉'],
        price: '¥188,000'
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
        price: '¥1,280,000'
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
        price: '¥98,000'
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
        price: '¥168,000'
    }
];

// ============================================
// DOM 元素缓存
// ============================================
const DOM = {
    header: document.getElementById('header'),
    menuToggle: document.getElementById('menuToggle'),
    mainNav: document.getElementById('mainNav'),
    heroCarousel: document.getElementById('heroCarousel'),
    jadeGrid: document.getElementById('jadeGrid'),
    filterTags: document.getElementById('filterTags'),
    lightbox: document.getElementById('lightbox'),
    lightboxImage: document.getElementById('lightboxImage'),
    lightboxTitle: document.querySelector('.lightbox-title'),
    lightboxDesc: document.querySelector('.lightbox-desc'),
    leftSidebar: document.getElementById('leftSidebar'),
    rightSidebar: document.getElementById('rightSidebar'),
    categoryLinks: document.querySelectorAll('.category-link')
};

// ============================================
// 轮播组件
// ============================================
class Carousel {
    constructor(element) {
        this.carousel = element;
        this.track = element.querySelector('.carousel-track');
        this.slides = element.querySelectorAll('.carousel-slide');
        this.dots = element.querySelectorAll('.dot');
        this.prevBtn = element.querySelector('.carousel-btn.prev');
        this.nextBtn = element.querySelector('.carousel-btn.next');
        
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;
        
        this.init();
    }
    
    init() {
        // 绑定按钮事件
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // 绑定圆点事件
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });
        
        // 触摸滑动支持
        this.initTouchEvents();
        
        // 自动播放
        this.startAutoplay();
        
        // 鼠标悬停暂停
        this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    initTouchEvents() {
        let startX = 0;
        let endX = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.stopAutoplay();
        }, { passive: true });
        
        this.carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            this.startAutoplay();
        }, { passive: true });
    }
    
    goTo(index) {
        // 更新幻灯片
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        // 更新圆点
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        this.currentIndex = index;
    }
    
    prev() {
        const newIndex = this.currentIndex === 0 
            ? this.slides.length - 1 
            : this.currentIndex - 1;
        this.goTo(newIndex);
    }
    
    next() {
        const newIndex = this.currentIndex === this.slides.length - 1 
            ? 0 
            : this.currentIndex + 1;
        this.goTo(newIndex);
    }
    
    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// ============================================
// 玉石卡片渲染
// ============================================
class JadeGallery {
    constructor(container, data) {
        this.container = container;
        this.data = data;
        this.currentFilter = 'all';
        this.currentIndex = 0;
        
        this.render();
        this.bindEvents();
    }
    
    render() {
        const filteredData = this.currentFilter === 'all' 
            ? this.data 
            : this.data.filter(item => item.category === this.currentFilter);
        
        this.container.innerHTML = filteredData.map((jade, index) => `
            <article class="jade-card" data-id="${jade.id}" data-index="${index}">
                <div class="jade-card-image">
                    <img src="${jade.image}" alt="${jade.name}" loading="lazy">
                    <span class="jade-card-category">${jade.categoryName}</span>
                    <div class="jade-card-overlay">
                        <button class="view-detail-btn">查看详情</button>
                    </div>
                </div>
                <div class="jade-card-content">
                    <h3 class="jade-card-title">${jade.name}</h3>
                    <p class="jade-card-desc">${jade.description}</p>
                    <div class="jade-card-tags">
                        ${jade.tags.map(tag => `<span class="jade-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </article>
        `).join('');
        
        // 重新绑定点击事件
        this.bindCardEvents();
    }
    
    bindEvents() {
        // 过滤标签事件
        DOM.filterTags.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-tag')) {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
                
                // 更新左侧边栏的分类链接状态
                DOM.categoryLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.category === filter);
                });
            }
        });
        
        // 左侧边栏分类链接事件
        DOM.leftSidebar.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-link')) {
                e.preventDefault();
                const filter = e.target.dataset.category;
                this.setFilter(filter);
                
                // 更新过滤标签状态
                DOM.filterTags.querySelectorAll('.filter-tag').forEach(tag => {
                    tag.classList.toggle('active', tag.dataset.filter === filter);
                });
            }
        });
    }
    
    bindCardEvents() {
        const cards = this.container.querySelectorAll('.jade-card');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                const jade = this.data.find(item => item.id === id);
                if (jade) {
                    this.openLightbox(jade);
                }
            });
        });
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        this.render();
    }
    
    openLightbox(jade) {
        DOM.lightboxImage.src = jade.image;
        DOM.lightboxImage.alt = jade.name;
        DOM.lightboxTitle.textContent = jade.name;
        DOM.lightboxDesc.textContent = jade.description;
        DOM.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // 保存当前显示的玉石数据
        this.currentJade = jade;
        this.filteredData = this.currentFilter === 'all' 
            ? this.data 
            : this.data.filter(item => item.category === this.currentFilter);
    }
    
    closeLightbox() {
        DOM.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    navigateLightbox(direction) {
        if (!this.filteredData) return;
        
        const currentIndex = this.filteredData.findIndex(j => j.id === this.currentJade.id);
        let newIndex;
        
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % this.filteredData.length;
        } else {
            newIndex = (currentIndex - 1 + this.filteredData.length) % this.filteredData.length;
        }
        
        const newJade = this.filteredData[newIndex];
        this.openLightbox(newJade);
    }
}

// ============================================
// 灯箱控制器
// ============================================
class LightboxController {
    constructor(gallery) {
        this.gallery = gallery;
        this.init();
    }
    
    init() {
        const closeBtn = DOM.lightbox.querySelector('.lightbox-close');
        const prevBtn = DOM.lightbox.querySelector('.lightbox-nav.prev');
        const nextBtn = DOM.lightbox.querySelector('.lightbox-nav.next');
        
        closeBtn.addEventListener('click', () => this.close());
        prevBtn.addEventListener('click', () => this.gallery.navigateLightbox('prev'));
        nextBtn.addEventListener('click', () => this.gallery.navigateLightbox('next'));
        
        // 点击背景关闭
        DOM.lightbox.addEventListener('click', (e) => {
            if (e.target === DOM.lightbox) {
                this.close();
            }
        });
        
        // ESC 键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.lightbox.classList.contains('active')) {
                this.close();
            }
            if (e.key === 'ArrowLeft' && DOM.lightbox.classList.contains('active')) {
                this.gallery.navigateLightbox('prev');
            }
            if (e.key === 'ArrowRight' && DOM.lightbox.classList.contains('active')) {
                this.gallery.navigateLightbox('next');
            }
        });
    }
    
    close() {
        this.gallery.closeLightbox();
    }
}

// ============================================
// 导航控制器
// ============================================
class NavigationController {
    constructor() {
        this.init();
    }
    
    init() {
        // 移动端菜单切换
        DOM.menuToggle.addEventListener('click', () => this.toggleMenu());
        
        // 滚动效果
        window.addEventListener('scroll', () => this.handleScroll());
        
        // 平滑滚动到锚点
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleAnchorClick(e));
        });
        
        // 更新导航状态
        this.updateActiveNav();
    }
    
    toggleMenu() {
        DOM.menuToggle.classList.toggle('active');
        DOM.mainNav.classList.toggle('active');
    }
    
    handleScroll() {
        // 头部滚动效果
        if (window.scrollY > 50) {
            DOM.header.classList.add('scrolled');
        } else {
            DOM.header.classList.remove('scrolled');
        }
        
        // 更新当前活动导航
        this.updateActiveNav();
    }
    
    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                    if (item.querySelector(`a[href="#${sectionId}"]`)) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    handleAnchorClick(e) {
        const href = e.currentTarget.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                // 关闭移动端菜单
                DOM.menuToggle.classList.remove('active');
                DOM.mainNav.classList.remove('active');
                
                // 平滑滚动
                const headerOffset = DOM.header.offsetHeight;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }
}

// ============================================
// 滚动动画观察器
// ============================================
class ScrollAnimation {
    constructor() {
        this.init();
    }
    
    init() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // 观察需要动画的元素
        document.querySelectorAll('.culture-card, .quote-item, .about-content').forEach(el => {
            observer.observe(el);
        });
    }
}

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // 初始化轮播
    const carousel = new Carousel(DOM.heroCarousel);
    
    // 初始化玉石展示
    const gallery = new JadeGallery(DOM.jadeGrid, jadeData);
    
    // 初始化灯箱控制器
    new LightboxController(gallery);
    
    // 初始化导航控制器
    new NavigationController();
    
    // 初始化滚动动画
    new ScrollAnimation();
    
    console.log('玉韵 - 玉石鉴赏平台已加载完成');
});

// ============================================
// 工具函数
// ============================================
const Utils = {
    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};
