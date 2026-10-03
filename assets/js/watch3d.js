/**
 * AuraPulse Ultra-Realistic 3D WebGL Engine
 * Desenvolvido com Three.js com iluminação PBR de estúdio (IBL Environment Map),
 * Vidro de Safira 2.5D com refração Fresnel, Carcaça em Titânio Grau 5 com parafusos usinados,
 * Protetor de coroa, botão de ação tático, pulseira tubular Ocean Loop e display AMOLED Retina.
 */

(function () {
  let scene, camera, renderer, watchGroup, shadowPlane;
  let caseMesh, bezelMesh, screenMesh, glassMesh, crownMesh, actionBtnMesh;
  let strapTopGroup, strapBottomGroup;
  let torxScrews = [];
  let screenCanvas, screenCtx, screenTexture;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotation = { x: 0.12, y: -0.28 };
  let currentRotation = { x: 0.12, y: -0.28 };
  let autoRotate = true;
  let currentScreenMode = 'cardio';
  let ecgOffset = 0;
  let animFrameId = null;

  // Acabamentos PBR de alta fidelidade para Titânio Grau 5
  const finishes = {
    titanium: {
      name: 'Titânio Aeroespacial (Natural)',
      caseColor: 0x9ea9b3,
      bezelColor: 0xc8d2dc,
      actionBtnColor: 0x00dbe9,
      strapColor: 0x18202d,
      buckleColor: 0xb0bac5,
      metalness: 0.88,
      roughness: 0.28
    },
    midnight: {
      name: 'Midnight Black (Preto Fosco)',
      caseColor: 0x16181f,
      bezelColor: 0x242833,
      actionBtnColor: 0xff3b30,
      strapColor: 0x0a0c11,
      buckleColor: 0x282c37,
      metalness: 0.92,
      roughness: 0.22
    },
    starlight: {
      name: 'Starlight Silver (Prata Cirúrgica)',
      caseColor: 0xe2e8f0,
      bezelColor: 0xf8fafc,
      actionBtnColor: 0x00f0ff,
      strapColor: 0x2c3548,
      buckleColor: 0xe2e8f0,
      metalness: 0.82,
      roughness: 0.18
    }
  };

  let activeFinish = finishes.titanium;

  function init3D() {
    const container = document.getElementById('watch-3d-canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    // 1. Cena com fundo transparente
    scene = new THREE.Scene();

    // 2. Câmera com ângulo de teleobjetiva para evitar distorção de perspectiva
    camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.2);

    // 3. Renderer de Alta Performance e Fidelidade PBR
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.cursor = 'grab';

    // 4. Criação do Environment Map de Estúdio Sintético (Chave do Realismo Metálico)
    setupStudioEnvironment();

    // 5. Iluminação de Estúdio Fotográfico Comercial (3-Point Lighting)
    setupStudioLights();

    // 6. Textura Dinâmica AMOLED Retina (1024x1024)
    setupScreenCanvas();

    // 7. Geometria Detalhada do Smartwatch
    buildUltraRealisticWatch();

    // 8. Sombra de Contato Suave no Solo
    buildContactShadow();

    // 9. Interatividade por Ponteiro (Mouse & Touch)
    setupInteraction(renderer.domElement);

    // 10. Loop de Renderização 60 FPS
    animate();

    window.addEventListener('resize', onWindowResize);
  }

  /**
   * Gera um Environment Map (IBL) de estúdio fotográfico proceduralmente
   * Isso faz o titânio e o vidro refletirem softboxes e luzes de borda reais!
   */
  function setupStudioEnvironment() {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();

    // Luzes de Softbox e gradientes de estúdio no ambiente
    const softbox1 = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    softbox1.position.set(5, 5, 5);
    softbox1.lookAt(0, 0, 0);
    envScene.add(softbox1);

    const softboxCyan = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    softboxCyan.position.set(-6, 2, 3);
    softboxCyan.lookAt(0, 0, 0);
    envScene.add(softboxCyan);

    const softboxEmerald = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      new THREE.MeshBasicMaterial({ color: 0x4edea3 })
    );
    softboxEmerald.position.set(4, -5, 3);
    softboxEmerald.lookAt(0, 0, 0);
    envScene.add(softboxEmerald);

    const studioTarget = pmremGenerator.fromScene(envScene, 0.04);
    scene.environment = studioTarget.texture;
    pmremGenerator.dispose();
  }

  /**
   * Configuração de Luzes Físicas Direcionais de Estúdio
   */
  function setupStudioLights() {
    const ambientLight = new THREE.AmbientLight(0x182436, 1.4);
    scene.add(ambientLight);

    // Key Light frontal superior brilhante
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4.5, 7, 6.5);
    scene.add(keyLight);

    // Rim Light Ciano AuraPulse
    const cyanRim = new THREE.DirectionalLight(0x00f0ff, 3.2);
    cyanRim.position.set(-7, 2.5, 3);
    scene.add(cyanRim);

    // Fill Light suave esmeralda
    const emeraldFill = new THREE.DirectionalLight(0x4edea3, 1.6);
    emeraldFill.position.set(4, -6, 3);
    scene.add(emeraldFill);

    // Luz de recorte traseiro para a silhueta da coroa
    const backRim = new THREE.DirectionalLight(0xd9f8ff, 1.2);
    backRim.position.set(0, 3, -7);
    scene.add(backRim);
  }

  /**
   * Cria o Canvas 2D em alta resolução (1024x1024) para a tela AMOLED Retina
   */
  function setupScreenCanvas() {
    screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 1024;
    screenCtx = screenCanvas.getContext('2d');
    screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.generateMipmaps = true;
    screenTexture.minFilter = THREE.LinearMipmapLinearFilter;
    screenTexture.anisotropy = 16;
  }

  /**
   * Renderiza a interface interna do smartwatch no Canvas Retina com efeitos de glow
   */
  function updateScreenTexture() {
    if (!screenCtx) return;
    const ctx = screenCtx;
    const w = 1024;
    const h = 1024;

    // Fundo Preto Profundo AMOLED Real
    ctx.fillStyle = '#05070d';
    ctx.fillRect(0, 0, w, h);

    // Grade sutil técnica de bússola circular
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 450, 0, Math.PI * 2);
    ctx.stroke();

    // Marcadores graduados de 60 segundos no bisel interno
    for (let i = 0; i < 60; i++) {
      const angle = (i * Math.PI) / 30;
      const isFive = i % 5 === 0;
      const r1 = isFive ? 450 : 455;
      const r2 = 465;

      ctx.strokeStyle = isFive ? '#00f0ff' : 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = isFive ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(w / 2 + Math.cos(angle) * r1, h / 2 + Math.sin(angle) * r1);
      ctx.lineTo(w / 2 + Math.cos(angle) * r2, h / 2 + Math.sin(angle) * r2);
      ctx.stroke();
    }

    // Topo da tela: Nome do Produto e Indicadores de Hardware
    ctx.fillStyle = '#00f0ff';
    ctx.font = '800 40px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AURAPULSE PRO', w / 2, 170);

    // Badges de Status (Bateria 88%, GPS Ativo, Titânio)
    ctx.fillStyle = '#4edea3';
    ctx.font = '700 28px "Inter", sans-serif';
    ctx.fillText('⚡ 88% • GPS 5ATM • TITÂNIO G5', w / 2, 225);

    // Horário Digital Central em Display Ultra Definido
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 160px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${hours}:${minutes}`, w / 2, 430);

    ctx.fillStyle = '#849495';
    ctx.font = '600 44px "Inter", sans-serif';
    ctx.fillText(`${seconds}s • SÁB, 03 OUT • 24°C`, w / 2, 510);

    // Painel Inferior de Telemetria com base no modo
    if (currentScreenMode === 'cardio') {
      // Modo Cardio & Eletrocardiograma
      ctx.fillStyle = 'rgba(255, 59, 48, 0.12)';
      ctx.beginPath();
      ctx.roundRect(140, 600, 744, 280, 40);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 59, 48, 0.3)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Onda de ECG com Glow de Neon
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 15;
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 8;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();

      const startX = 180;
      const endX = 844;
      const centerY = 715;

      ctx.moveTo(startX, centerY);
      for (let x = startX; x <= endX; x += 6) {
        const relX = (x - startX + ecgOffset) % 320;
        let y = centerY;
        if (relX > 110 && relX < 140) y -= 24;
        else if (relX >= 140 && relX < 170) y += 75;
        else if (relX >= 170 && relX < 210) y -= 105;
        else if (relX >= 210 && relX < 235) y += 32;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset do glow

      // Frequência Cardíaca e Status Clínico
      ctx.fillStyle = '#ff4b4b';
      ctx.font = '800 68px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('♥ 138 BPM', 190, 835);

      ctx.fillStyle = '#4edea3';
      ctx.font = '700 36px "Inter", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('ECG RITMO REGULAR', 835, 835);

    } else if (currentScreenMode === 'sport') {
      // Modo Esporte / Performance
      ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.beginPath();
      ctx.roundRect(140, 600, 744, 280, 40);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#00f0ff';
      ctx.font = '800 64px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏃 14.350 PASSOS', w / 2, 700);

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 40px "Inter", sans-serif';
      ctx.fillText('Pace: 3:18/km • 640 Kcal • 8.4 Km', w / 2, 775);

      ctx.fillStyle = '#4edea3';
      ctx.font = '800 32px "Inter", sans-serif';
      ctx.fillText('ZONA CARDIOVASCULAR ALTA', w / 2, 835);

    } else {
      // Modo Notificações Executivas
      ctx.fillStyle = 'rgba(78, 222, 163, 0.12)';
      ctx.beginPath();
      ctx.roundRect(140, 600, 744, 280, 40);
      ctx.fill();
      ctx.strokeStyle = 'rgba(78, 222, 163, 0.3)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#4edea3';
      ctx.font = '800 50px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💬 WhatsApp Notificação', w / 2, 695);

      ctx.fillStyle = '#ffffff';
      ctx.font = '500 38px "Inter", sans-serif';
      ctx.fillText('"Estou a caminho da reunião"', w / 2, 765);

      ctx.fillStyle = '#b9cacb';
      ctx.font = '700 30px "Inter", sans-serif';
      ctx.fillText('Toque duplo para atender via microfone HD', w / 2, 830);
    }

    screenTexture.needsUpdate = true;
    ecgOffset += 5;
  }

  /**
   * Constrói a geometria 3D detalhada de precisão aeroespacial
   */
  function buildUltraRealisticWatch() {
    watchGroup = new THREE.Group();

    // 1. Materiais PBR Metálicos com Environment Map aplicado
    const caseMaterial = new THREE.MeshStandardMaterial({
      color: activeFinish.caseColor,
      metalness: activeFinish.metalness,
      roughness: activeFinish.roughness,
      envMapIntensity: 1.4
    });

    const bezelMaterial = new THREE.MeshStandardMaterial({
      color: activeFinish.bezelColor,
      metalness: 0.94,
      roughness: 0.15,
      envMapIntensity: 1.8
    });

    const actionBtnMaterial = new THREE.MeshStandardMaterial({
      color: activeFinish.actionBtnColor,
      metalness: 0.85,
      roughness: 0.25,
      envMapIntensity: 1.5
    });

    const strapMaterial = new THREE.MeshStandardMaterial({
      color: activeFinish.strapColor,
      metalness: 0.04,
      roughness: 0.72,
      envMapIntensity: 0.6
    });

    const buckleMaterial = new THREE.MeshStandardMaterial({
      color: activeFinish.buckleColor,
      metalness: 0.9,
      roughness: 0.2,
      envMapIntensity: 1.6
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
      map: screenTexture,
      roughness: 0.08,
      metalness: 0.02,
      emissive: 0x00f0ff,
      emissiveMap: screenTexture,
      emissiveIntensity: 0.65
    });

    // Vidro de Safira Abaulado 2.5D com Clearcoat e Transmissão
    const sapphireGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.28,
      roughness: 0.04,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.9,
      transmission: 0.82,
      ior: 1.76, // Índice de refração do cristal de safira sintético
      envMapIntensity: 2.0
    });

    // 2. Caixa Monobloco em Titânio com Chanfros Suaves
    const caseWidth = 2.45;
    const caseHeight = 2.9;
    const caseDepth = 0.58;
    const cornerRadius = 0.58;

    const shape = new THREE.Shape();
    const x = -caseWidth / 2;
    const y = -caseHeight / 2;

    shape.moveTo(x + cornerRadius, y);
    shape.lineTo(x + caseWidth - cornerRadius, y);
    shape.quadraticCurveTo(x + caseWidth, y, x + caseWidth, y + cornerRadius);
    shape.lineTo(x + caseWidth, y + caseHeight - cornerRadius);
    shape.quadraticCurveTo(x + caseWidth, y + caseHeight, x + caseWidth - cornerRadius, y + caseHeight);
    shape.lineTo(x + cornerRadius, y + caseHeight);
    shape.quadraticCurveTo(x, y + caseHeight, x, y + caseHeight - cornerRadius);
    shape.lineTo(x, y + cornerRadius);
    shape.quadraticCurveTo(x, y, x + cornerRadius, y);

    const extrudeSettings = {
      depth: caseDepth,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 3,
      bevelSize: 0.16,
      bevelThickness: 0.16
    };

    const caseGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    caseGeom.center();
    caseMesh = new THREE.Mesh(caseGeom, caseMaterial);
    watchGroup.add(caseMesh);

    // 3. Bisel Elevado de Proteção da Safira
    const bezelOuterShape = shape;
    const bezelSettings = {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 5,
      bevelSize: 0.06,
      bevelThickness: 0.06
    };
    const bezelGeom = new THREE.ExtrudeGeometry(bezelOuterShape, bezelSettings);
    bezelGeom.center();
    bezelMesh = new THREE.Mesh(bezelGeom, bezelMaterial);
    bezelMesh.position.z = caseDepth / 2 + 0.17;
    bezelMesh.scale.set(0.97, 0.97, 1);
    watchGroup.add(bezelMesh);

    // 4. Tela AMOLED Curvada
    const screenGeom = new THREE.PlaneGeometry(2.14, 2.52, 16, 16);
    screenMesh = new THREE.Mesh(screenGeom, screenMaterial);
    screenMesh.position.z = caseDepth / 2 + 0.165;
    watchGroup.add(screenMesh);

    // 5. Vidro Safira Frontal 2.5D com Curvatura
    const glassGeom = new THREE.PlaneGeometry(2.2, 2.6, 16, 16);
    // Aplica leve curvatura parabólica nos vértices do vidro
    const posAttr = glassGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const distFromCenter = Math.sqrt(vx * vx + vy * vy);
      posAttr.setZ(i, -Math.pow(distFromCenter * 0.12, 2));
    }
    glassGeom.computeVertexNormals();

    glassMesh = new THREE.Mesh(glassGeom, sapphireGlassMaterial);
    glassMesh.position.z = caseDepth / 2 + 0.19;
    watchGroup.add(glassMesh);

    // 6. Parafusos Torx de Titânio nos 4 Cantos (Estilo Ultra Militar)
    const screwPositions = [
      [-caseWidth / 2 + 0.22, -caseHeight / 2 + 0.22],
      [caseWidth / 2 - 0.22, -caseHeight / 2 + 0.22],
      [-caseWidth / 2 + 0.22, caseHeight / 2 - 0.22],
      [caseWidth / 2 - 0.22, caseHeight / 2 - 0.22]
    ];

    torxScrews = [];
    screwPositions.forEach(([sx, sy]) => {
      const screwHeadGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16);
      screwHeadGeom.rotateX(Math.PI / 2);
      const screwSlotGeom = new THREE.BoxGeometry(0.1, 0.025, 0.08);

      const screwHead = new THREE.Mesh(screwHeadGeom, bezelMaterial);
      const screwSlot = new THREE.Mesh(screwSlotGeom, caseMaterial);
      screwHead.add(screwSlot);

      screwHead.position.set(sx, sy, caseDepth / 2 + 0.195);
      watchGroup.add(screwHead);
      torxScrews.push(screwHead);
    });

    // 7. Protetor de Coroa Usinado (Crown Guard) na Lateral Direita
    const guardGeom = new THREE.BoxGeometry(0.3, 0.9, caseDepth + 0.2);
    const guardMesh = new THREE.Mesh(guardGeom, caseMaterial);
    guardMesh.position.set(caseWidth / 2 + 0.14, 0.42, 0);
    watchGroup.add(guardMesh);

    // Coroa Digital de Alta Precisão com Ranhuras Estriadas
    const crownOuterGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.42, 32);
    crownOuterGeom.rotateZ(Math.PI / 2);
    crownMesh = new THREE.Mesh(crownOuterGeom, bezelMaterial);
    crownMesh.position.set(caseWidth / 2 + 0.32, 0.42, 0);
    watchGroup.add(crownMesh);

    // Miolo central da coroa com anel colorido
    const crownCoreGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.44, 24);
    crownCoreGeom.rotateZ(Math.PI / 2);
    const crownCoreMesh = new THREE.Mesh(crownCoreGeom, actionBtnMaterial);
    crownCoreMesh.position.set(caseWidth / 2 + 0.32, 0.42, 0);
    watchGroup.add(crownCoreMesh);

    // Botão Lateral Direito (Power / Multitarefa)
    const rightBtnGeom = new THREE.BoxGeometry(0.12, 0.6, 0.24);
    const rightBtnMesh = new THREE.Mesh(rightBtnGeom, bezelMaterial);
    rightBtnMesh.position.set(caseWidth / 2 + 0.16, -0.42, 0);
    watchGroup.add(rightBtnMesh);

    // 8. Botão de Ação Tático Laranja/Ciano na Lateral Esquerda (Action Button)
    const actionBtnGeom = new THREE.BoxGeometry(0.16, 0.72, 0.28);
    actionBtnMesh = new THREE.Mesh(actionBtnGeom, actionBtnMaterial);
    actionBtnMesh.position.set(-(caseWidth / 2 + 0.14), 0.3, 0);
    watchGroup.add(actionBtnMesh);

    // Grelha de Alto-falante na Lateral Esquerda (Micro-furos de titânio)
    for (let f = -0.3; f <= 0.1; f += 0.08) {
      const holeGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 8);
      holeGeom.rotateZ(Math.PI / 2);
      const holeMesh = new THREE.Mesh(holeGeom, new THREE.MeshBasicMaterial({ color: 0x07090f }));
      holeMesh.position.set(-(caseWidth / 2 + 0.15), f - 0.2, 0);
      watchGroup.add(holeMesh);
    }

    // 9. Sensores Biométricos de Cerâmica na Tampa Traseira
    const sensorBaseGeom = new THREE.CylinderGeometry(0.85, 0.85, 0.16, 36);
    sensorBaseGeom.rotateX(Math.PI / 2);
    const sensorCeramicMat = new THREE.MeshStandardMaterial({
      color: 0x06080e,
      roughness: 0.12,
      metalness: 0.85,
      envMapIntensity: 1.5
    });
    const sensorBase = new THREE.Mesh(sensorBaseGeom, sensorCeramicMat);
    sensorBase.position.z = -(caseDepth / 2 + 0.17);
    watchGroup.add(sensorBase);

    // Lentes e LEDs de Fotopletismografia (4 feixes de pulso)
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const ledGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.18, 16);
      ledGeom.rotateX(Math.PI / 2);
      const isGreen = i % 2 === 0;
      const ledMat = new THREE.MeshBasicMaterial({
        color: isGreen ? 0x4edea3 : 0xff3b30
      });
      const ledMesh = new THREE.Mesh(ledGeom, ledMat);
      ledMesh.position.set(Math.cos(angle) * 0.44, Math.sin(angle) * 0.44, -(caseDepth / 2 + 0.18));
      watchGroup.add(ledMesh);
    }

    // Anel Gravado de Especificações Suíças na Tampa Traseira
    const textRingGeom = new THREE.RingGeometry(0.62, 0.76, 32);
    const textRingMat = new THREE.MeshStandardMaterial({
      color: 0x849495,
      metalness: 0.9,
      roughness: 0.3
    });
    const textRing = new THREE.Mesh(textRingGeom, textRingMat);
    textRing.position.z = -(caseDepth / 2 + 0.185);
    watchGroup.add(textRing);

    // 10. Pulseira de Silicone Tubular "Ocean Loop" com Gomos 3D
    buildOceanStrap(strapMaterial, buckleMaterial, caseHeight);

    // Posição e rotação inicial
    watchGroup.rotation.x = targetRotation.x;
    watchGroup.rotation.y = targetRotation.y;
    scene.add(watchGroup);
  }

  /**
   * Constrói a pulseira com gomos tubulares e fivela de titânio (Estilo Ocean Loop)
   */
  function buildOceanStrap(strapMaterial, buckleMaterial, caseHeight) {
    strapTopGroup = new THREE.Group();
    strapBottomGroup = new THREE.Group();

    const strapWidth = 1.76;
    const numTubes = 7;
    const tubeRadius = 0.13;
    const tubeSpacing = 0.34;

    // Gomos da Pulseira Superior
    for (let i = 0; i < numTubes; i++) {
      const tubeGeom = new THREE.CylinderGeometry(tubeRadius, tubeRadius, strapWidth, 16);
      tubeGeom.rotateZ(Math.PI / 2);
      const tubeMesh = new THREE.Mesh(tubeGeom, strapMaterial);
      const curY = i * tubeSpacing + 0.2;
      const curZ = -Math.pow(i * 0.2, 1.4) - 0.05;
      tubeMesh.position.set(0, curY, curZ);
      strapTopGroup.add(tubeMesh);

      // Nervura de conexão entre os tubos
      if (i > 0) {
        const bridgeGeom = new THREE.BoxGeometry(strapWidth - 0.1, tubeSpacing, tubeRadius * 1.5);
        const bridgeMesh = new THREE.Mesh(bridgeGeom, strapMaterial);
        bridgeMesh.position.set(0, curY - tubeSpacing / 2, curZ);
        strapTopGroup.add(bridgeMesh);
      }
    }

    // Fivela de Titânio G-Hook Superior
    const buckleGeom = new THREE.BoxGeometry(strapWidth + 0.15, 0.25, 0.35);
    const buckleMesh = new THREE.Mesh(buckleGeom, buckleMaterial);
    buckleMesh.position.set(0, (numTubes - 1) * tubeSpacing + 0.35, -Math.pow((numTubes - 1) * 0.2, 1.4));
    strapTopGroup.add(buckleMesh);

    strapTopGroup.position.set(0, caseHeight / 2, 0);
    watchGroup.add(strapTopGroup);

    // Gomos da Pulseira Inferior
    for (let i = 0; i < numTubes; i++) {
      const tubeGeom = new THREE.CylinderGeometry(tubeRadius, tubeRadius, strapWidth, 16);
      tubeGeom.rotateZ(Math.PI / 2);
      const tubeMesh = new THREE.Mesh(tubeGeom, strapMaterial);
      const curY = -(i * tubeSpacing + 0.2);
      const curZ = -Math.pow(i * 0.2, 1.4) - 0.05;
      tubeMesh.position.set(0, curY, curZ);
      strapBottomGroup.add(tubeMesh);

      if (i > 0) {
        const bridgeGeom = new THREE.BoxGeometry(strapWidth - 0.1, tubeSpacing, tubeRadius * 1.5);
        const bridgeMesh = new THREE.Mesh(bridgeGeom, strapMaterial);
        bridgeMesh.position.set(0, curY + tubeSpacing / 2, curZ);
        strapBottomGroup.add(bridgeMesh);
      }
    }

    strapBottomGroup.position.set(0, -caseHeight / 2, 0);
    watchGroup.add(strapBottomGroup);
  }

  /**
   * Sombra de Contato Tridimensional Suave
   */
  function buildContactShadow() {
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');

    const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(0.3, 'rgba(0, 240, 255, 0.15)');
    grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeom = new THREE.PlaneGeometry(4.2, 4.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });

    shadowPlane = new THREE.Mesh(shadowGeom, shadowMat);
    shadowPlane.position.set(0, -2.6, -0.6);
    shadowPlane.rotation.x = -Math.PI / 2.3;
    scene.add(shadowPlane);
  }

  /**
   * Interações Táteis e com Mouse com Inércia Suave
   */
  function setupInteraction(domElement) {
    function onPointerDown(e) {
      isDragging = true;
      autoRotate = false;
      domElement.style.cursor = 'grabbing';
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.013;
      targetRotation.x += deltaY * 0.013;

      // Limita inclinação vertical para ângulo ergonômico
      targetRotation.x = Math.max(-0.95, Math.min(0.95, targetRotation.x));

      previousMousePosition = { x: clientX, y: clientY };
    }

    function onPointerUp() {
      isDragging = false;
      domElement.style.cursor = 'grab';
    }

    domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Botões de Rotação Automática e Reset
    const autoSpinBtn = document.getElementById('auto-spin-3d-btn');
    if (autoSpinBtn) {
      autoSpinBtn.addEventListener('click', () => {
        autoRotate = !autoRotate;
        autoSpinBtn.classList.toggle('bg-primary-container', autoRotate);
        autoSpinBtn.classList.toggle('text-slate-950', autoRotate);
        autoSpinBtn.classList.toggle('bg-surface-container-high', !autoRotate);
        autoSpinBtn.classList.toggle('text-on-surface-variant', !autoRotate);
      });
    }

    const resetViewBtn = document.getElementById('reset-3d-view-btn');
    if (resetViewBtn) {
      resetViewBtn.addEventListener('click', () => {
        targetRotation = { x: 0.12, y: -0.28 };
        autoRotate = false;
      });
    }
  }

  /**
   * Loop de Animação em 60 FPS com Damping e Flutuação Tridimensional
   */
  function animate() {
    animFrameId = requestAnimationFrame(animate);

    if (autoRotate && !isDragging) {
      targetRotation.y += 0.007;
    }

    // Interpolação suave (Damping Físico)
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.085;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.085;

    if (watchGroup) {
      watchGroup.rotation.x = currentRotation.x;
      watchGroup.rotation.y = currentRotation.y;

      // Flutuação orgânica senoidal
      const time = performance.now() * 0.0018;
      const floatOffset = Math.sin(time) * 0.12;
      watchGroup.position.y = floatOffset;
      watchGroup.position.z = Math.cos(time * 0.7) * 0.06;

      // Sombra de contato reage à flutuação
      if (shadowPlane) {
        shadowPlane.scale.setScalar(1 - floatOffset * 0.25);
        shadowPlane.material.opacity = 0.85 - floatOffset * 0.4;
      }
    }

    // Atualiza a tela AMOLED Retina animada
    updateScreenTexture();

    renderer.render(scene, camera);
  }

  function onWindowResize() {
    const container = document.getElementById('watch-3d-canvas-container');
    if (!container || !renderer || !camera) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  /**
   * Métodos Públicos expostos para a página
   */
  window.setWatchVariant3D = function (variantKey) {
    if (!finishes[variantKey]) return;
    activeFinish = finishes[variantKey];

    if (caseMesh && bezelMesh) {
      caseMesh.material.color.setHex(activeFinish.caseColor);
      caseMesh.material.metalness = activeFinish.metalness;
      caseMesh.material.roughness = activeFinish.roughness;

      bezelMesh.material.color.setHex(activeFinish.bezelColor);
      if (crownMesh) crownMesh.material.color.setHex(activeFinish.bezelColor);
      if (actionBtnMesh) actionBtnMesh.material.color.setHex(activeFinish.actionBtnColor);

      torxScrews.forEach(screw => {
        screw.material.color.setHex(activeFinish.bezelColor);
      });

      // Atualiza a cor de todos os gomos das pulseiras
      if (strapTopGroup && strapBottomGroup) {
        strapTopGroup.traverse(child => {
          if (child.isMesh && child.geometry.type === 'CylinderGeometry') {
            child.material.color.setHex(activeFinish.strapColor);
          }
        });
        strapBottomGroup.traverse(child => {
          if (child.isMesh && child.geometry.type === 'CylinderGeometry') {
            child.material.color.setHex(activeFinish.strapColor);
          }
        });
      }
    }
  };

  window.setWatchScreenMode3D = function (modeKey) {
    currentScreenMode = modeKey;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3D);
  } else {
    init3D();
  }
})();
