// Sistema de Otimização de Performance Automática
class PerformanceOptimizer {
    constructor() {
        this.connectionType = this.detectConnection();
        this.deviceCapability = this.detectDeviceCapability();
        this.isLowEndDevice = this.deviceCapability.isLowEnd;
        this.isSlowConnection = this.connectionType.isSlow;
        
        this.init();
    }

    // Detecta tipo de conexão
    detectConnection() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (!connection) {
            return { type: 'unknown', isSlow: false, effectiveType: '4g' };
        }

        const slowConnections = ['slow-2g', '2g', '3g'];
        const isSlow = slowConnections.includes(connection.effectiveType);
        
        return {
            type: connection.type,
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            isSlow: isSlow || connection.downlink < 1.5
        };
    }

    // Detecta capacidade do dispositivo
    detectDeviceCapability() {
        const memory = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        const isTouch = 'ontouchstart' in window;
        
        // Detecta dispositivos muito antigos
        const isVeryOld = !window.CSS || !window.CSS.supports || !('IntersectionObserver' in window);
        
        const isLowEnd = memory <= 2 || cores <= 2 || isVeryOld;
        const isMidRange = memory <= 4 && cores <= 4 && !isLowEnd;
        
        return {
            memory,
            cores,
            isTouch,
            isLowEnd,
            isMidRange,
            isVeryOld,
            supportsWebP: this.supportsWebP(),
            supportsGrid: this.supportsGrid()
        };
    }

    // Verifica suporte ao WebP
    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    // Verifica suporte ao CSS Grid
    supportsGrid() {
        return window.CSS && CSS.supports('display', 'grid');
    }

    // Inicializa otimizações
    init() {
        this.optimizeImages();
        this.optimizeAnimations();
        this.optimizeCSS();
        this.setupAdaptiveLoading();
        this.monitorConnection();
        
        console.log('Performance Optimizer initialized:', {
            connection: this.connectionType,
            device: this.deviceCapability
        });
    }

    // Otimiza imagens baseado na conexão e dispositivo
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Aplica compressão baseada na conexão
            if (this.isSlowConnection || this.isLowEndDevice) {
                this.applyImageOptimization(img, 'low');
            } else if (this.connectionType.effectiveType === '3g') {
                this.applyImageOptimization(img, 'medium');
            } else {
                this.applyImageOptimization(img, 'high');
            }
        });
    }

    // Aplica otimização específica para imagem
    applyImageOptimization(img, quality) {
        const originalSrc = img.src || img.dataset.src;
        
        if (!originalSrc) return;
        
        // Para conexões lentas, reduz qualidade
        if (quality === 'low') {
            img.style.imageRendering = 'pixelated';
            img.style.filter = 'blur(0.5px)';
            img.loading = 'lazy';
        }
        
        // Adiciona fallback para WebP
        if (this.deviceCapability.supportsWebP && !originalSrc.includes('.webp')) {
            const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            
            // Testa se WebP existe
            const testImg = new Image();
            testImg.onload = () => {
                img.src = webpSrc;
            };
            testImg.onerror = () => {
                // Mantém imagem original se WebP não existir
            };
            testImg.src = webpSrc;
        }
    }

    // Otimiza animações baseado na performance
    optimizeAnimations() {
        const root = document.documentElement;
        
        if (this.isLowEndDevice || this.isSlowConnection) {
            // Reduz drasticamente animações
            root.style.setProperty('--animation-duration', '0.1s');
            root.style.setProperty('--transition-duration', '0.1s');
            
            // Remove animações complexas
            const animatedElements = document.querySelectorAll('[class*="animate"], .slide');
            animatedElements.forEach(el => {
                el.style.animation = 'none';
                el.style.transition = 'none';
            });
            
            // Desabilita parallax e efeitos pesados
            document.body.classList.add('reduced-motion');
        } else if (this.deviceCapability.isMidRange) {
            // Reduz moderadamente
            root.style.setProperty('--animation-duration', '0.3s');
            root.style.setProperty('--transition-duration', '0.2s');
        }
    }

    // Otimiza CSS baseado no suporte do navegador
    optimizeCSS() {
        const root = document.documentElement;
        
        // Fallback para CSS Grid
        if (!this.deviceCapability.supportsGrid) {
            root.classList.add('no-grid');
            
            // Adiciona CSS fallback
            const fallbackCSS = `
                .no-grid .products-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .no-grid .product-card {
                    flex: 1 1 calc(50% - 0.5rem);
                    min-width: 280px;
                }
                @media (max-width: 768px) {
                    .no-grid .product-card {
                        flex: 1 1 100%;
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = fallbackCSS;
            document.head.appendChild(style);
        }
        
        // Otimizações para dispositivos muito antigos
        if (this.deviceCapability.isVeryOld) {
            root.classList.add('legacy-device');
            
            // Remove gradientes e sombras complexas
            const legacyCSS = `
                .legacy-device * {
                    box-shadow: none !important;
                    background-image: none !important;
                    filter: none !important;
                }
                .legacy-device .product-card {
                    border: 1px solid #ddd;
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = legacyCSS;
            document.head.appendChild(style);
        }
    }

    // Configura carregamento adaptativo
    setupAdaptiveLoading() {
        // Preload seletivo baseado na capacidade
        if (!this.isLowEndDevice && !this.isSlowConnection) {
            this.preloadCriticalResources();
        }
        
        // Lazy loading mais agressivo para dispositivos lentos
        if (this.isLowEndDevice || this.isSlowConnection) {
            this.setupAggressiveLazyLoading();
        }
    }

    // Preload recursos críticos
    preloadCriticalResources() {
        const criticalImages = [
            './img/logomarcasublime.png',
            './img/promocional1.png'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Lazy loading agressivo
    setupAggressiveLazyLoading() {
        // Aumenta margem do intersection observer
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '10px 0px', // Margem menor para economizar dados
                threshold: 0.1
            });
            
            images.forEach(img => observer.observe(img));
        }
    }

    // Monitora mudanças na conexão
    monitorConnection() {
        if ('connection' in navigator) {
            navigator.connection.addEventListener('change', () => {
                const newConnection = this.detectConnection();
                
                if (newConnection.isSlow !== this.connectionType.isSlow) {
                    this.connectionType = newConnection;
                    this.isSlowConnection = newConnection.isSlow;
                    
                    // Reaplica otimizações
                    this.optimizeImages();
                    this.optimizeAnimations();
                    
                    console.log('Connection changed, reoptimizing:', newConnection);
                }
            });
        }
    }

    // Método público para forçar otimização
    forceOptimization(level = 'auto') {
        if (level === 'low' || level === 'auto' && (this.isLowEndDevice || this.isSlowConnection)) {
            this.isLowEndDevice = true;
            this.isSlowConnection = true;
        }
        
        this.optimizeImages();
        this.optimizeAnimations();
        this.optimizeCSS();
    }
}

// Inicializa automaticamente quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.performanceOptimizer = new PerformanceOptimizer();
    });
} else {
    window.performanceOptimizer = new PerformanceOptimizer();
}

// Exporta para uso global
window.PerformanceOptimizer = PerformanceOptimizer;