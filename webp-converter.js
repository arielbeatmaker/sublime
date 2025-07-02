// Conversor de Imagens para WebP
class WebPConverter {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.supportedFormats = ['jpg', 'jpeg', 'png'];
        this.conversionQueue = [];
        this.isProcessing = false;
        
        this.init();
    }

    // Inicializa o conversor
    init() {
        this.scanAndConvertImages();
        console.log('WebP Converter initialized');
    }

    // Escaneia e converte imagens existentes
    scanAndConvertImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            const src = img.src || img.dataset.src;
            if (src && this.shouldConvert(src)) {
                this.queueForConversion(src, img);
            }
        });
        
        this.processQueue();
    }

    // Verifica se a imagem deve ser convertida
    shouldConvert(src) {
        const extension = src.split('.').pop().toLowerCase();
        return this.supportedFormats.includes(extension) && !src.includes('.webp');
    }

    // Adiciona imagem à fila de conversão
    queueForConversion(src, imgElement) {
        this.conversionQueue.push({ src, imgElement });
    }

    // Processa fila de conversão
    async processQueue() {
        if (this.isProcessing || this.conversionQueue.length === 0) return;
        
        this.isProcessing = true;
        
        while (this.conversionQueue.length > 0) {
            const { src, imgElement } = this.conversionQueue.shift();
            await this.convertToWebP(src, imgElement);
            
            // Pausa entre conversões para não sobrecarregar
            await this.delay(100);
        }
        
        this.isProcessing = false;
    }

    // Converte imagem para WebP
    async convertToWebP(src, imgElement) {
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    try {
                        // Calcula dimensões otimizadas
                        const { width, height } = this.calculateOptimalDimensions(img);
                        
                        this.canvas.width = width;
                        this.canvas.height = height;
                        
                        // Desenha imagem no canvas
                        this.ctx.drawImage(img, 0, 0, width, height);
                        
                        // Converte para WebP com qualidade baseada na conexão
                        const quality = this.getOptimalQuality();
                        const webpDataUrl = this.canvas.toDataURL('image/webp', quality);
                        
                        // Verifica se a conversão resultou em arquivo menor
                        if (this.isConversionBeneficial(src, webpDataUrl)) {
                            this.applyWebPImage(imgElement, webpDataUrl, src);
                        }
                        
                        resolve();
                    } catch (error) {
                        console.warn('Erro na conversão WebP:', error);
                        reject(error);
                    }
                };
                
                img.onerror = () => {
                    console.warn('Erro ao carregar imagem para conversão:', src);
                    reject(new Error('Falha ao carregar imagem'));
                };
                
                img.src = src;
            });
        } catch (error) {
            console.warn('Erro na conversão WebP:', error);
        }
    }

    // Calcula dimensões otimizadas
    calculateOptimalDimensions(img) {
        const maxWidth = this.getMaxWidth();
        const maxHeight = this.getMaxHeight();
        
        let { width, height } = img;
        
        // Mantém aspect ratio
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        
        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }
        
        return {
            width: Math.round(width),
            height: Math.round(height)
        };
    }

    // Obtém largura máxima baseada no dispositivo
    getMaxWidth() {
        const screenWidth = window.innerWidth;
        
        if (screenWidth <= 480) return 480;
        if (screenWidth <= 768) return 768;
        if (screenWidth <= 1024) return 1024;
        return 1200;
    }

    // Obtém altura máxima baseada no dispositivo
    getMaxHeight() {
        const screenHeight = window.innerHeight;
        
        if (screenHeight <= 600) return 400;
        if (screenHeight <= 800) return 600;
        return 800;
    }

    // Obtém qualidade ótima baseada na conexão
    getOptimalQuality() {
        const connection = navigator.connection;
        
        if (!connection) return 0.8;
        
        switch (connection.effectiveType) {
            case 'slow-2g':
            case '2g':
                return 0.5;
            case '3g':
                return 0.7;
            case '4g':
                return connection.downlink > 10 ? 0.9 : 0.8;
            default:
                return 0.8;
        }
    }

    // Verifica se a conversão é benéfica
    isConversionBeneficial(originalSrc, webpDataUrl) {
        // Estima tamanho do arquivo original (aproximação)
        const originalEstimatedSize = originalSrc.length * 0.75; // Aproximação
        const webpSize = webpDataUrl.length;
        
        // Só aplica se WebP for pelo menos 20% menor
        return webpSize < originalEstimatedSize * 0.8;
    }

    // Aplica imagem WebP ao elemento
    applyWebPImage(imgElement, webpDataUrl, originalSrc) {
        // Cria elemento picture para fallback
        if (imgElement.parentElement.tagName !== 'PICTURE') {
            const picture = document.createElement('picture');
            const source = document.createElement('source');
            
            source.srcset = webpDataUrl;
            source.type = 'image/webp';
            
            // Move imagem para dentro do picture
            imgElement.parentElement.insertBefore(picture, imgElement);
            picture.appendChild(source);
            picture.appendChild(imgElement);
            
            // Mantém src original como fallback
            imgElement.src = originalSrc;
        } else {
            // Atualiza source existente
            const source = imgElement.parentElement.querySelector('source[type="image/webp"]');
            if (source) {
                source.srcset = webpDataUrl;
            }
        }
        
        imgElement.dataset.webpConverted = 'true';
    }

    // Utilitário para delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Converte imagem específica
    async convertImage(src, imgElement) {
        if (this.shouldConvert(src)) {
            await this.convertToWebP(src, imgElement);
        }
    }

    // Converte todas as imagens da página
    async convertAllImages() {
        const images = document.querySelectorAll('img:not([data-webp-converted])');
        
        for (const img of images) {
            const src = img.src || img.dataset.src;
            if (src) {
                await this.convertImage(src, img);
                await this.delay(50); // Pausa entre conversões
            }
        }
    }

    // Limpa conversões (para debug)
    clearConversions() {
        const pictures = document.querySelectorAll('picture');
        pictures.forEach(picture => {
            const img = picture.querySelector('img');
            if (img) {
                picture.parentElement.insertBefore(img, picture);
                picture.remove();
                img.dataset.webpConverted = '';
            }
        });
    }

    // Estatísticas de conversão
    getConversionStats() {
        const totalImages = document.querySelectorAll('img').length;
        const convertedImages = document.querySelectorAll('img[data-webp-converted="true"]').length;
        const pictureElements = document.querySelectorAll('picture').length;
        
        return {
            total: totalImages,
            converted: convertedImages,
            pictureElements: pictureElements,
            conversionRate: totalImages > 0 ? (convertedImages / totalImages * 100).toFixed(1) + '%' : '0%'
        };
    }
}

// Inicializa automaticamente se WebP for suportado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Só inicializa se WebP for suportado
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        
        if (supportsWebP) {
            window.webpConverter = new WebPConverter();
        }
    });
} else {
    // Verifica suporte WebP
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    if (supportsWebP) {
        window.webpConverter = new WebPConverter();
    }
}

// Exporta para uso global
window.WebPConverter = WebPConverter;