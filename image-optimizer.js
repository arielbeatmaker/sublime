// Sistema de Otimização e Compressão de Imagens
class ImageOptimizer {
    constructor() {
        this.supportsWebP = this.checkWebPSupport();
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.compressionLevels = {
            high: 0.9,
            medium: 0.7,
            low: 0.5,
            minimal: 0.3
        };
        
        this.init();
    }

    // Verifica suporte ao WebP
    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    // Inicializa o otimizador
    init() {
        this.optimizeExistingImages();
        this.setupImageObserver();
        this.createWebPVersions();
        
        console.log('Image Optimizer initialized. WebP support:', this.supportsWebP);
    }

    // Otimiza imagens existentes na página
    optimizeExistingImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            this.optimizeImage(img);
        });
    }

    // Configura observer para novas imagens
    setupImageObserver() {
        if ('MutationObserver' in window) {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            const images = node.tagName === 'IMG' ? [node] : node.querySelectorAll('img');
                            images.forEach(img => this.optimizeImage(img));
                        }
                    });
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // Otimiza uma imagem específica
    optimizeImage(img) {
        if (img.dataset.optimized) return;
        
        const originalSrc = img.src || img.dataset.src;
        if (!originalSrc) return;
        
        // Detecta qualidade necessária baseada na conexão
        const quality = this.getOptimalQuality();
        
        // Aplica otimizações
        this.applyImageOptimizations(img, quality);
        
        // Tenta carregar versão WebP se disponível
        if (this.supportsWebP) {
            this.loadWebPVersion(img, originalSrc);
        }
        
        img.dataset.optimized = 'true';
    }

    // Determina qualidade ótima baseada na conexão
    getOptimalQuality() {
        const connection = navigator.connection;
        
        if (!connection) return 'medium';
        
        switch (connection.effectiveType) {
            case 'slow-2g':
            case '2g':
                return 'minimal';
            case '3g':
                return 'low';
            case '4g':
                return connection.downlink > 10 ? 'high' : 'medium';
            default:
                return 'medium';
        }
    }

    // Aplica otimizações na imagem
    applyImageOptimizations(img, quality) {
        // Configurações baseadas na qualidade
        switch (quality) {
            case 'minimal':
                img.style.imageRendering = 'pixelated';
                img.style.filter = 'blur(0.5px) contrast(1.1)';
                img.loading = 'lazy';
                img.decoding = 'async';
                break;
                
            case 'low':
                img.style.imageRendering = 'auto';
                img.style.filter = 'contrast(1.05)';
                img.loading = 'lazy';
                img.decoding = 'async';
                break;
                
            case 'medium':
                img.loading = 'lazy';
                img.decoding = 'async';
                break;
                
            case 'high':
                img.loading = 'eager';
                img.decoding = 'sync';
                break;
        }
        
        // Adiciona dimensões se não especificadas
        if (!img.width && !img.height) {
            this.setOptimalDimensions(img);
        }
    }

    // Define dimensões ótimas para a imagem
    setOptimalDimensions(img) {
        const container = img.parentElement;
        if (!container) return;
        
        const containerWidth = container.offsetWidth || 300;
        const maxWidth = Math.min(containerWidth, window.innerWidth);
        
        // Define largura máxima baseada no container
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        
        // Para imagens de produto, mantém aspect ratio 1:1
        if (img.closest('.product-image')) {
            img.style.aspectRatio = '1 / 1';
            img.style.objectFit = 'cover';
        }
    }

    // Tenta carregar versão WebP
    loadWebPVersion(img, originalSrc) {
        const webpSrc = this.generateWebPUrl(originalSrc);
        
        // Testa se versão WebP existe
        const testImg = new Image();
        testImg.onload = () => {
            img.src = webpSrc;
            img.dataset.format = 'webp';
        };
        testImg.onerror = () => {
            // Se WebP não existe, tenta criar uma versão comprimida
            this.createCompressedVersion(img, originalSrc);
        };
        testImg.src = webpSrc;
    }

    // Gera URL para versão WebP
    generateWebPUrl(originalSrc) {
        return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }

    // Cria versão comprimida da imagem
    createCompressedVersion(img, originalSrc) {
        const tempImg = new Image();
        tempImg.crossOrigin = 'anonymous';
        
        tempImg.onload = () => {
            const quality = this.getOptimalQuality();
            const compressionLevel = this.compressionLevels[quality];
            
            // Redimensiona se necessário
            const { width, height } = this.calculateOptimalSize(tempImg);
            
            this.canvas.width = width;
            this.canvas.height = height;
            
            // Desenha imagem redimensionada
            this.ctx.drawImage(tempImg, 0, 0, width, height);
            
            // Converte para formato otimizado
            const optimizedDataUrl = this.canvas.toDataURL('image/jpeg', compressionLevel);
            
            // Aplica apenas se o resultado for menor
            if (optimizedDataUrl.length < originalSrc.length * 0.8) {
                img.src = optimizedDataUrl;
                img.dataset.compressed = 'true';
            }
        };
        
        tempImg.src = originalSrc;
    }

    // Calcula tamanho ótimo para a imagem
    calculateOptimalSize(img) {
        const maxWidth = window.innerWidth > 768 ? 800 : 400;
        const maxHeight = window.innerHeight > 600 ? 600 : 300;
        
        let { width, height } = img;
        
        // Reduz tamanho se muito grande
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        
        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }
        
        return { width: Math.round(width), height: Math.round(height) };
    }

    // Cria versões WebP para todas as imagens
    createWebPVersions() {
        if (!this.supportsWebP) return;
        
        const images = document.querySelectorAll('img[src*=".jpg"], img[src*=".jpeg"], img[src*=".png"]');
        
        images.forEach(img => {
            if (!img.dataset.webpProcessed) {
                this.processImageForWebP(img);
                img.dataset.webpProcessed = 'true';
            }
        });
    }

    // Processa imagem para WebP
    processImageForWebP(img) {
        const originalSrc = img.src;
        const webpSrc = this.generateWebPUrl(originalSrc);
        
        // Cria elemento picture para fallback
        if (!img.parentElement.tagName === 'PICTURE') {
            const picture = document.createElement('picture');
            const source = document.createElement('source');
            
            source.srcset = webpSrc;
            source.type = 'image/webp';
            
            picture.appendChild(source);
            img.parentElement.insertBefore(picture, img);
            picture.appendChild(img);
        }
    }

    // Método público para forçar otimização
    forceOptimization(level = 'auto') {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.dataset.optimized = '';
            this.optimizeImage(img);
        });
    }

    // Método para limpar cache de imagens
    clearImageCache() {
        if ('caches' in window) {
            caches.open('sublime-images-v2').then(cache => {
                cache.keys().then(keys => {
                    keys.forEach(key => cache.delete(key));
                });
            });
        }
    }

    // Estatísticas de otimização
    getOptimizationStats() {
        const images = document.querySelectorAll('img');
        const optimized = document.querySelectorAll('img[data-optimized="true"]');
        const webp = document.querySelectorAll('img[data-format="webp"]');
        const compressed = document.querySelectorAll('img[data-compressed="true"]');
        
        return {
            total: images.length,
            optimized: optimized.length,
            webp: webp.length,
            compressed: compressed.length,
            webpSupport: this.supportsWebP
        };
    }
}

// Inicializa automaticamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.imageOptimizer = new ImageOptimizer();
    });
} else {
    window.imageOptimizer = new ImageOptimizer();
}

// Exporta para uso global
window.ImageOptimizer = ImageOptimizer;