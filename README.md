# AuraPulse™ Pro - Precision Smartwatch Storefront

Landing page de alta conversão para o **AuraPulse Pro**, um smartwatch de precisão com telemetria clínica e corpo em titânio aeroespacial, apresentando modelo 3D interativo WebGL em tempo real.

---

## 📌 Principais Funcionalidades

- **Visualizador 3D Interativo (WebGL / Three.js)**:
  - Rotação 360° com suporte a toque e mouse (*drag-to-rotate*) com física de inércia.
  - Iluminação PBR de estúdio com mapa de reflexo ambiental (IBL).
  - Vidro de safira abaulado 2.5D com refração física realista (IOR 1.76).
  - Tela AMOLED Retina dinâmica com relógio digital e linha de eletrocardiograma (ECG) animada a 60 FPS.
- **Seletor de Acabamentos e Tamanho**:
  - Sincronização em tempo real dos materiais 3D entre *Titânio Natural*, *Midnight Black* e *Starlight Silver*.
  - Alternância de tamanhos de caixa (41mm vs 45mm).
- **Modos Dinâmicos de Visor**:
  - *Cardio ECG*, *Modo Corrida/Performance* e *Notificações Inteligentes*.
- **Experiência Multissensorial**:
  - Síntese de áudio háptico tátil desenvolvida com a Web Audio API (com botão de controle de volume).
- **Calculadora Dinâmica de Economia e Parcelas**:
  - Cálculo instantâneo entre PIX (com 5% de desconto extra) e parcelamento no cartão de crédito em até 12x sem juros.
- **Consulta de Frete com API ViaCEP**:
  - Busca automática de CEP com confirmação de frete grátis por Sedex.
- **Tabela Comparativa e Prova Social**:
  - Comparativo técnico de superioridade contra relógios tradicionais e notificações flutuantes de compras recentes.
- **Modal de Checkout Rápido & Carrinho**:
  - Resumo de compra, opções de pagamento e confirmação com criptografia de ponta a ponta.

---

## 🛠️ Stack Tecnológica

- **Frontend Core**: HTML5 Semântico, CSS3 Moderno, JavaScript Vanilla (ES6+).
- **Gráficos 3D**: [Three.js](https://threejs.org/) (WebGL, PBR Shaders, PMREMGenerator).
- **Estilização**: Tailwind CSS (utilitários atômicos) e `assets/css/style.css` (design system tokens e glassmorphism).
- **Áudio**: Web Audio API nativa.
- **Acessibilidade**: WCAG 2.1 AA (alvos de toque de 44x44px, skip-link, labels e roles ARIA).
- **SEO**: Schema.org JSON-LD (Product, Offer, AggregateRating), Open Graph e Twitter Cards.

---

## 📋 Pré-requisitos

Para executar o projeto localmente, você precisa apenas de um navegador moderno compatível com WebGL (Chrome, Edge, Firefox, Safari) e uma das seguintes ferramentas:

- **Node.js** (v16 ou superior) OU
- **Python** (v3.8 ou superior)

---

## 🚀 Instalação e Execução

### 1. Clonar o Repositório
```bash
git clone https://github.com/matheusgoliveira7-hub/projeto_vendas.git
cd projeto_vendas
```

### 2. Executar em Desenvolvimento

**Utilizando Node.js / npx:**
```bash
npx serve . -p 3000
```

**Ou utilizando Python 3:**
```bash
python -m http.server 3000
```

Abra no navegador:
```text
http://localhost:3000/index.html
```

---

## 🧪 Testes e Validação Técnica

Para validar a integridade sintática do JavaScript e auditoria de acessibilidade:

```bash
# Validação de sintaxe dos scripts
npm test

# Auditoria de Acessibilidade WCAG
npm run lint
```

---

## ⚙️ Variáveis de Ambiente

O projeto é uma aplicação estática client-side e não requer variáveis de ambiente para funcionamento básico. Caso deseje conectar integrações futuras de gateway de pagamento:

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure as chaves necessárias no arquivo `.env`.

---

## 📦 Produção e Deploy

Como o projeto é composto por arquivos estáticos otimizados (`index.html`, `assets/`), ele pode ser implantado instantaneamente em plataformas como:

- **GitHub Pages**: Habilitar a publicação a partir do branch `main`.
- **Vercel**: Importar o repositório diretamente (Framework: *Other*).
- **Netlify**: Arrastar a pasta do projeto ou conectar ao repositório Git.

---

## 📁 Estrutura de Pastas

```text
├── assets/
│   ├── css/
│   │   └── style.css          # Design system, glassmorphism e animações
│   ├── js/
│   │   ├── main.js            # Lógica interativa, áudio háptico, ViaCEP e modal
│   │   ├── three.min.js       # Biblioteca Three.js local
│   │   └── watch3d.js         # Motor WebGL 3D do smartwatch
│   └── images/
│       ├── logo.png           # Logotipo oficial AuraPulse
│       ├── watch-hero.png     # Render original do produto
│       ├── watch-premium.jpg  # Render de alta resolução
│       ├── watch-sensors.jpg  # Fotografia macro dos sensores traseiros
│       └── watch-athlete.jpg  # Fotografia do atleta em treino
├── old/                       # Arquivos originais arquivados do Google Stitch
├── .doc/                      # Especificações do projeto
├── .gitignore                 # Regras de exclusão do Git
├── .env.example               # Exemplo de variáveis de ambiente
├── package.json               # Configurações e scripts do projeto
├── index.html                 # Página principal da aplicação
└── README.md                  # Documentação completa
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo de licença para mais detalhes.
