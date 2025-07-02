# 🦋 Sublime - Plataforma de E-commerce de Moda Íntima

## 📌 Visão Geral
Projeto PWA (Progressive Web App) para loja virtual especializada em moda íntima, com:
- Catálogo de produtos organizado por categorias
- Sistema de promoções dinâmicas
- Vídeo promocional em destaque
- Otimização de performance para imagens

## ✨ Funcionalidades Principais
✅ **PWA Features:**
- Offline-first com Service Worker
- Instalação em dispositivos móveis
- Notificações push

✅ **Otimizações:**
- Conversão automática de imagens para WebP
- Geração de favicons multi-tamanho
- Compressão de assets

✅ **Recursos Visuais:**
- Design responsivo com paleta rosa
- Animações suaves de hover
- Galeria interativa de produtos

## 🛠️ Tecnologias
```
<mcfile name="index.html"></mcfile>    → Estrutura principal
<mcfile name="styles.css"></mcfile>   → Estilos customizados
<mcfile name="script.js"></mcfile>    → Lógica do PWA
<mcfile name="sw.js"></mcfile>       → Service Worker
```

## 🚀 Como Executar
1. Clone o repositório
```bash
git clone https://exemplo.com/sublime.git
```
2. Instale as dependências:
```bash
npm install -g live-server
```
3. Inicie o servidor:
```bash
live-server --port=8000
```

## 🔧 Scripts de Otimização
- `generate-favicons.js`: Gera diferentes tamanhos de ícone
- `image-optimizer.js`: Processa imagens da pasta `/img`
- `webp-converter.js`: Converte PNG/JPG para WebP

⚠️ **Nota:** Imagens originais devem estar em `/img/produtos`

## 🌐 Deploy
Configuração pronta para:
![Vercel](https://img.shields.io/badge/Deploy-Vercel-%23000000)
![Netlify](https://img.shields.io/badge/Deploy-Netlify-%2300C7B7)

## 📂 Estrutura de Arquivos
```
sublime/
├── img/           → Assets visuais
├── videos/        → Conteúdo multimídia
├── scripts/       → Lógica do e-commerce
└── utils/         → Ferramentas de build
```

## 📄 Licença
MIT License © 2024 [Sublime Intimate Wear](https://sublime.com)