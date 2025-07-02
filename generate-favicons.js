const fs = require('fs');
const path = require('path');

// Função para criar favicon SVG otimizado
function createFaviconSVG(size) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .logo-bg { fill: #fce7f3; }
      .logo-text { fill: #ec4899; font-family: 'Arial', sans-serif; font-weight: bold; }
      .logo-accent { fill: #d4af37; }
    </style>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2-1}" class="logo-bg" stroke="#ec4899" stroke-width="1"/>
  
  <!-- Letter S -->
  <text x="${size/2}" y="${size/2 + size/8}" text-anchor="middle" class="logo-text" font-size="${size*0.6}px">S</text>
  
  <!-- Decorative elements -->
  <circle cx="${size*0.25}" cy="${size*0.25}" r="${size*0.05}" class="logo-accent"/>
  <circle cx="${size*0.75}" cy="${size*0.25}" r="${size*0.05}" class="logo-accent"/>
  <circle cx="${size*0.25}" cy="${size*0.75}" r="${size*0.05}" class="logo-accent"/>
  <circle cx="${size*0.75}" cy="${size*0.75}" r="${size*0.05}" class="logo-accent"/>
</svg>`;
}

// Criar diretório para favicons se não existir
const faviconDir = path.join(__dirname, 'favicons');
if (!fs.existsSync(faviconDir)) {
    fs.mkdirSync(faviconDir);
}

// Gerar favicons em diferentes tamanhos
const sizes = [16, 32, 48, 64, 128, 192, 512];

sizes.forEach(size => {
    const svgContent = createFaviconSVG(size);
    const filename = `favicon-${size}x${size}.svg`;
    const filepath = path.join(faviconDir, filename);
    
    fs.writeFileSync(filepath, svgContent);
    console.log(`✓ Criado: ${filename}`);
});

// Criar favicon.ico alternativo (SVG)
const mainFavicon = createFaviconSVG(32);
fs.writeFileSync(path.join(__dirname, 'favicon.svg'), mainFavicon);
console.log('✓ Criado: favicon.svg');

// Criar apple-touch-icon otimizado
const appleTouchIcon = createFaviconSVG(180);
fs.writeFileSync(path.join(faviconDir, 'apple-touch-icon.svg'), appleTouchIcon);
console.log('✓ Criado: apple-touch-icon.svg');

console.log('\n🎉 Todos os favicons foram gerados com sucesso!');
console.log('📁 Arquivos criados em: ./favicons/');
console.log('\n📋 Próximos passos:');
console.log('1. Atualize as referências no HTML');
console.log('2. Atualize o manifest.json');
console.log('3. Teste os favicons no navegador');