// ==========================================================================
// MOTOR 3D Y NAVEGACIÓN: PRESENTACIÓN PP3 - GRUPO C (VERSIÓN 2)
// Libros de Tapa Dura de Alta Gama Inspirados en Stripe Press (press.stripe.com)
// - Estilo editorial hiper-detallado ("The Big Score" y "Nomad Letters")
// - Placas de circuitos electrónicos grabadas en cobre, xilografías y tramas finas
// - Transiciones fluidas orgánicas con física de resorte críticamente amortiguado
// - Rotación 3D continua matemáticamente sin saltos ni cortes abruptos
// - Perspectiva 3/4 permanente en el centro con órbita 3D interactiva libre
// - 100% en Español · Sin sonido · Sin encabezado ni pie de página
// ==========================================================================

window.APP = {
  currentSlideIndex: 0,
  slides: [],
  isModalOpen: false,

  // Three.js Core
  scene: null,
  camera: null,
  renderer: null,
  books: [],
  bookGroup: null,
  floorShadow: null,
  rovingLight: null,
  keyLight: null,
  raycaster: null,
  mouse: null,

  // Parallax con el cursor del mouse
  mouseX: 0,
  mouseY: 0,
  targetTiltX: 0,
  targetTiltY: 0,
  currentTiltX: 0,
  currentTiltY: 0,

  // Órbita 3D interactiva sobre el libro central (Stripe Press Drag Orbit)
  bookOrbitY: 0,
  targetBookOrbitY: 0,
  bookOrbitX: 0,
  targetBookOrbitX: 0,
  isOrbitingBook: false,
  orbitStartX: 0,
  orbitStartY: 0,
  orbitStartAngleY: 0,
  orbitStartAngleX: 0,

  // Física de Resorte Críticamente Amortiguado (Second-Order Smooth Damp)
  carouselPos: 0,
  targetCarouselPos: 0,
  carouselVel: 0,
  lastFrameTime: 0,

  // Arrastre del carrusel en el fondo
  isDraggingCarousel: false,
  dragStartX: 0,
  dragStartPos: 0,

  // Helper de ajuste de texto seguro
  wrapText: function(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return y;
    const words = String(text).split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, y);
    return y;
  },

  init: function() {
    this.slides = (window.PRESENTATION_DATA && window.PRESENTATION_DATA.slides) || [];
    this.initThree();
    this.renderTimelineTicks();
    this.bindEvents();
    this.goToSlide(0, true);
    this.lastFrameTime = performance.now();
    this.animate();
  },

  // --------------------------------------------------------------------------
  // INICIALIZACIÓN DE THREE.JS Y SISTEMA DE ILUMINACIÓN DE ESTUDIO
  // --------------------------------------------------------------------------
  initThree: function() {
    const container = document.getElementById('webgl-container');
    if (!container) return;

    // 1. Escena
    this.scene = new THREE.Scene();

    // 2. Cámara (focal length de 35mm para compresión cinematográfica)
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    this.camera.position.set(0, 0.15, 8.8);

    // 3. Renderizador WebGL de Alta Definición
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    container.appendChild(this.renderer.domElement);

    // 4. Luces de Estudio Tipo Stripe Press para Foil Metálico
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.88);
    this.scene.add(ambientLight);

    // Luz principal cálida (crea reflejos rasantes sobre el cobre/oro)
    this.keyLight = new THREE.DirectionalLight(0xfff8ee, 1.85);
    this.keyLight.position.set(5.5, 9.2, 7.2);
    this.scene.add(this.keyLight);

    // Luz de contorno fría izquierda que define el perfil del lomo
    const rimLight = new THREE.DirectionalLight(0x93c5fd, 1.15);
    rimLight.position.set(-7.5, 4.2, 5.8);
    this.scene.add(rimLight);

    // Luz de relleno inferior que ilumina el canto de páginas
    const fillLight = new THREE.DirectionalLight(0x475569, 0.55);
    fillLight.position.set(0, -6.5, 4.5);
    this.scene.add(fillLight);

    // Luz puntual móvil que sigue al cursor (hace brillar el foil en tiempo real)
    this.rovingLight = new THREE.PointLight(0xffffff, 1.65, 14);
    this.rovingLight.position.set(0, 0.5, 3.8);
    this.scene.add(this.rovingLight);

    // 5. Sombra de Contacto y Difusa en el Piso
    this.createFloorShadow();

    // 6. Grupo de Libros de Tapa Dura
    this.bookGroup = new THREE.Group();
    this.scene.add(this.bookGroup);

    this.createHardcoverBooks();

    // 7. Raycaster y Mouse
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener('resize', () => this.onWindowResize());
  },

  // --------------------------------------------------------------------------
  // SOMBRA EN EL PISO (CONTACT SHADOW + AMBIENT DROP SHADOW)
  // --------------------------------------------------------------------------
  createFloorShadow: function() {
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 1024;
    shadowCanvas.height = 384;
    const ctx = shadowCanvas.getContext('2d');

    const contactGrad = ctx.createRadialGradient(512, 192, 15, 512, 192, 440);
    contactGrad.addColorStop(0, 'rgba(0, 0, 0, 0.88)');
    contactGrad.addColorStop(0.25, 'rgba(0, 0, 0, 0.58)');
    contactGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.18)');
    contactGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = contactGrad;
    ctx.fillRect(0, 0, 1024, 384);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(21, 5.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false
    });

    this.floorShadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.floorShadow.rotation.x = -Math.PI / 2;
    this.floorShadow.position.set(0, -2.18, 0.6);
    this.scene.add(this.floorShadow);
  },

  // --------------------------------------------------------------------------
  // CREACIÓN DE LIBROS DE TAPA DURA (CONSTRUCCIÓN FÍSICA MULTIPARTE)
  // Tapa delantera con saliente + Tapa trasera + Lomo curvado con nervios +
  // Hendidura de bisagra (French Groove) + Bloque interior rehundido
  // --------------------------------------------------------------------------
  createHardcoverBooks: function() {
    const coverW = 2.45;
    const coverH = 3.70;
    const spineD = 0.52;
    const boardT = 0.052;

    const pagesW = coverW - 0.12;
    const pagesH = coverH - 0.16;
    const pagesD = spineD - boardT * 2.2;

    const pagesTexture = this.createPagesTexture();
    const pagesMat = new THREE.MeshStandardMaterial({
      map: pagesTexture,
      roughness: 0.94,
      metalness: 0.01
    });

    this.slides.forEach((slide, idx) => {
      const bookRoot = new THREE.Group();
      bookRoot.userData = { index: idx, slide: slide, isBookRoot: true };

      // Texturas PBR multicapa a resolución 1536x2304 para nitidez extrema
      const frontPBR = this.createCoverPBRTextures(slide, idx, 'front');
      const spinePBR = this.createCoverPBRTextures(slide, idx, 'spine');
      const backPBR = this.createCoverPBRTextures(slide, idx, 'back');

      // Tapa Frontal con Hot Foil reflectivo y micro-trama Buckram
      const frontCoverMat = new THREE.MeshStandardMaterial({
        map: frontPBR.map,
        metalnessMap: frontPBR.metalnessMap,
        roughnessMap: frontPBR.roughnessMap,
        bumpMap: frontPBR.bumpMap,
        bumpScale: 0.045,
        roughness: 0.58,
        metalness: 0.85
      });

      // Lomo con nervios y estampado vertical
      const spineCoverMat = new THREE.MeshStandardMaterial({
        map: spinePBR.map,
        metalnessMap: spinePBR.metalnessMap,
        roughnessMap: spinePBR.roughnessMap,
        bumpMap: spinePBR.bumpMap,
        bumpScale: 0.050,
        roughness: 0.58,
        metalness: 0.85
      });

      // Contratapa con código de barras y resumen
      const backCoverMat = new THREE.MeshStandardMaterial({
        map: backPBR.map,
        metalnessMap: backPBR.metalnessMap,
        roughnessMap: backPBR.roughnessMap,
        bumpMap: backPBR.bumpMap,
        bumpScale: 0.035,
        roughness: 0.68,
        metalness: 0.40
      });

      // Tela para cantos
      const clothPlainMat = new THREE.MeshStandardMaterial({
        color: slide.theme.spineColor || '#1e293b',
        roughness: 0.88,
        metalness: 0.03
      });

      // Papel de guardas interior
      const endpaperMat = new THREE.MeshStandardMaterial({
        color: 0x111622,
        roughness: 0.92,
        metalness: 0.02
      });

      // 1. TAPA DELANTERA (+Z)
      const frontBoardGeo = new THREE.BoxGeometry(coverW, coverH, boardT);
      const frontBoardMaterials = [
        clothPlainMat, clothPlainMat, clothPlainMat, clothPlainMat,
        frontCoverMat, // Cara exterior (+Z)
        endpaperMat    // Guarda interior (-Z)
      ];
      const frontBoard = new THREE.Mesh(frontBoardGeo, frontBoardMaterials);
      frontBoard.position.set(0, 0, spineD / 2 - boardT / 2);
      frontBoard.castShadow = true;
      frontBoard.receiveShadow = true;
      bookRoot.add(frontBoard);

      // 2. TAPA TRASERA (-Z)
      const backBoardGeo = new THREE.BoxGeometry(coverW, coverH, boardT);
      const backBoardMaterials = [
        clothPlainMat, clothPlainMat, clothPlainMat, clothPlainMat,
        endpaperMat,   // Guarda interior (+Z)
        backCoverMat   // Cara exterior (-Z)
      ];
      const backBoard = new THREE.Mesh(backBoardGeo, backBoardMaterials);
      backBoard.position.set(0, 0, -spineD / 2 + boardT / 2);
      backBoard.castShadow = true;
      backBoard.receiveShadow = true;
      bookRoot.add(backBoard);

      // 3. LOMO (Spine)
      const spineGeo = new THREE.BoxGeometry(boardT * 1.8, coverH, spineD);
      const spineMaterials = [
        spineCoverMat,
        spineCoverMat,
        clothPlainMat, clothPlainMat, clothPlainMat, clothPlainMat
      ];
      const spineMesh = new THREE.Mesh(spineGeo, spineMaterials);
      spineMesh.position.set(-coverW / 2 + boardT * 0.8, 0, 0);
      spineMesh.castShadow = true;
      spineMesh.receiveShadow = true;
      bookRoot.add(spineMesh);

      // 4. BLOQUE INTERIOR DE HOJAS
      const pagesGeo = new THREE.BoxGeometry(pagesW, pagesH, pagesD);
      const pagesMesh = new THREE.Mesh(pagesGeo, pagesMat);
      pagesMesh.position.set(0.045, 0, 0);
      pagesMesh.receiveShadow = true;
      bookRoot.add(pagesMesh);

      // 6. CINTA MARCAPÁGINAS DE SEDA
      const ribbonGeo = new THREE.PlaneGeometry(0.08, 0.95, 4, 10);
      const pos = ribbonGeo.attributes.position;
      for (let p = 0; p < pos.count; p++) {
        const py = pos.getY(p);
        pos.setZ(p, Math.sin(py * 4.8) * 0.035);
      }
      ribbonGeo.computeVertexNormals();

      const ribbonMat = new THREE.MeshStandardMaterial({
        color: slide.theme.accent || '#38bdf8',
        roughness: 0.32,
        metalness: 0.40,
        side: THREE.DoubleSide
      });
      const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbon.position.set(0.24, -coverH / 2 - 0.36, 0.05);
      ribbon.rotation.z = -0.14;
      bookRoot.add(ribbon);

      // 7. CABEZADAS DE TELA EN EL LOMO
      const headbandMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.85 });
      const topHb = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.035, pagesD * 0.95), headbandMat);
      topHb.position.set(-coverW / 2 + 0.14, pagesH / 2 + 0.015, 0);
      bookRoot.add(topHb);

      const btmHb = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.035, pagesD * 0.95), headbandMat);
      btmHb.position.set(-coverW / 2 + 0.14, -pagesH / 2 - 0.015, 0);
      bookRoot.add(btmHb);

      this.bookGroup.add(bookRoot);
      this.books.push(bookRoot);
    });
  },

  // --------------------------------------------------------------------------
  // GENERACIÓN DE TEXTURAS MULTIMAPA PBR A ALTA RESOLUCIÓN
  // (1536x2304 frontal para máxima definición en líneas de circuitos y xilografía)
  // --------------------------------------------------------------------------
  createCoverPBRTextures: function(slide, idx, type) {
    const isFront = (type === 'front');
    const isSpine = (type === 'spine');

    const width = isSpine ? 384 : (isFront ? 1536 : 768);
    const height = isSpine ? 2304 : (isFront ? 2304 : 1152);

    const colorCanvas = document.createElement('canvas');
    colorCanvas.width = width;
    colorCanvas.height = height;
    const ctx = colorCanvas.getContext('2d');

    const metalCanvas = document.createElement('canvas');
    metalCanvas.width = width;
    metalCanvas.height = height;
    const mCtx = metalCanvas.getContext('2d');

    const roughCanvas = document.createElement('canvas');
    roughCanvas.width = width;
    roughCanvas.height = height;
    const rCtx = roughCanvas.getContext('2d');

    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = width;
    bumpCanvas.height = height;
    const bCtx = bumpCanvas.getContext('2d');

    const theme = slide.theme || {};
    const baseCloth = theme.coverColor || '#0f172a';
    const foilColor = theme.accent || '#f59e0b';

    ctx.fillStyle = baseCloth;
    ctx.fillRect(0, 0, width, height);

    mCtx.fillStyle = '#000000';
    mCtx.fillRect(0, 0, width, height);

    rCtx.fillStyle = '#dedede';
    rCtx.fillRect(0, 0, width, height);

    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, width, height);

    // Micro-trama tejida de lino / Buckram
    this.drawWovenFabricPattern(ctx, bCtx, width, height);

    if (isFront) {
      this.renderFrontCoverStripeStyle(ctx, mCtx, rCtx, bCtx, slide, idx, foilColor, baseCloth, width, height);
    } else if (isSpine) {
      this.renderSpineCoverStripeStyle(ctx, mCtx, rCtx, bCtx, slide, idx, foilColor, theme.spineColor, width, height);
    } else {
      this.renderBackCoverStripeStyle(ctx, mCtx, rCtx, bCtx, slide, foilColor, width, height);
    }

    return {
      map: new THREE.CanvasTexture(colorCanvas),
      metalnessMap: new THREE.CanvasTexture(metalCanvas),
      roughnessMap: new THREE.CanvasTexture(roughCanvas),
      bumpMap: new THREE.CanvasTexture(bumpCanvas)
    };
  },

  drawWovenFabricPattern: function(ctx, bCtx, w, h) {
    const step = 6;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.024)';
    bCtx.fillStyle = 'rgba(255, 255, 255, 0.075)';

    for (let x = 0; x < w; x += step) {
      ctx.fillRect(x, 0, 1.4, h);
      bCtx.fillRect(x, 0, 1.4, h);
    }
    for (let y = 0; y < h; y += step) {
      ctx.fillRect(0, y, w, 1.4);
      bCtx.fillRect(0, y, w, 1.4);
    }
  },

  // --------------------------------------------------------------------------
  // CARÁTULA FRONTAL: ARTE EDITORIAL DE MUSEO (ESTILO THE BIG SCORE & NOMAD LETTERS)
  // Sin botones intrusivos: el arte abarca todo el lienzo con máximo detalle
  // --------------------------------------------------------------------------
  renderFrontCoverStripeStyle: function(ctx, mCtx, rCtx, bCtx, slide, idx, foilColor, baseCloth, W, H) {
    // 1. Viñeta perimetral de iluminación
    const vignette = ctx.createRadialGradient(W / 2, H / 2, W * 0.28, W / 2, H / 2, W * 0.92);
    vignette.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);

    // Sombra suave en la bisagra izquierda (French groove) renderizada en la textura
    const grooveGrad = ctx.createLinearGradient(0, 0, 130, 0);
    grooveGrad.addColorStop(0, 'rgba(0, 0, 0, 0.42)');
    grooveGrad.addColorStop(0.35, 'rgba(0, 0, 0, 0.16)');
    grooveGrad.addColorStop(0.75, 'rgba(0, 0, 0, 0.04)');
    grooveGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grooveGrad;
    ctx.fillRect(0, 0, 130, H);

    // 2. Insignia Monograma Stripe Press en la esquina superior derecha
    const badgeW = 110;
    const badgeH = 145;
    const badgeX = W - badgeW - 60;
    const badgeY = 60;

    // Placa metálica del badge
    ctx.fillStyle = '#090d16';
    ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
    mCtx.fillStyle = '#222222';
    mCtx.fillRect(badgeX, badgeY, badgeW, badgeH);
    rCtx.fillStyle = '#101010';
    rCtx.fillRect(badgeX, badgeY, badgeW, badgeH);

    ctx.strokeStyle = foilColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(badgeX + 12, badgeY + 14, badgeW - 24, badgeH - 28);
    ctx.fillStyle = foilColor;
    ctx.font = 'bold 38px "Cinzel", "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.fillText('GC', badgeX + badgeW / 2, badgeY + 86);

    mCtx.fillStyle = '#ffffff';
    mCtx.font = 'bold 38px serif';
    mCtx.textAlign = 'center';
    mCtx.fillText('GC', badgeX + badgeW / 2, badgeY + 86);

    // 3. Tipografía en Hot Foil estampado
    const drawFoilText = (text, x, y, font, align = 'left', letterSpacing = '0px') => {
      [ctx, mCtx, rCtx, bCtx].forEach(c => {
        c.font = font;
        c.textAlign = align;
        c.letterSpacing = letterSpacing;
      });
      ctx.fillStyle = foilColor;
      mCtx.fillStyle = '#ffffff';
      rCtx.fillStyle = '#121212';
      bCtx.fillStyle = '#ffffff';
      [ctx, mCtx, rCtx, bCtx].forEach(c => c.fillText(text, x, y));
    };

    // Margen izquierdo amplio para evitar cualquier colisión con el lomo / bisagra
    const leftMargin = 220;

    // Autor / Investigador
    const authorText = slide.author || 'GRUPO C';
    drawFoilText(authorText, leftMargin, 160, '500 44px "Playfair Display", "Cinzel", serif', 'left', '1.5px');

    // Filete divisorio delgado (—)
    [ctx, mCtx, rCtx, bCtx].forEach(c => {
      c.lineWidth = 3.5;
      c.strokeStyle = foilColor;
    });
    mCtx.strokeStyle = '#ffffff';
    rCtx.strokeStyle = '#121212';
    bCtx.strokeStyle = '#ffffff';
    [ctx, mCtx, rCtx, bCtx].forEach(c => {
      c.beginPath();
      c.moveTo(leftMargin, 190);
      c.lineTo(leftMargin + 110, 190);
      c.stroke();
    });

    // Título Principal en Monumental Serif
    const titleText = slide.slideTitle || slide.shortTitle || '';
    const drawFoilWrapTitle = (text, startX, startY, maxWidth, lineHeight) => {
      const words = text.split(' ');
      let line = '';
      let curY = startY;
      const font = 'bold 68px "Playfair Display", "Cinzel", "Georgia", serif';

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        ctx.font = font;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          drawFoilText(line.trim(), startX, curY, font);
          line = words[n] + ' ';
          curY += lineHeight;
          if (curY > startY + lineHeight * 2) break;
        } else {
          line = testLine;
        }
      }
      drawFoilText(line.trim(), startX, curY, font);
    };

    drawFoilWrapTitle(titleText, leftMargin, 280, W - leftMargin - 110, 84);

    // 4. OBRA DE ARTE HIPER-DETALLADA QUE ABARCA TODA LA PORTADA
    this.drawHyperDetailedArtwork(ctx, mCtx, rCtx, bCtx, idx, foilColor, baseCloth, W, H);

    // 5. Pie de portada (Sin fecha)
    drawFoilText(`PARTE ${slide.part || (idx + 1).toString().padStart(2, '0')}`, leftMargin, H - 90, 'bold 28px "JetBrains Mono", monospace');
    drawFoilText('GRUPO C · INVESTIGACIÓN PP3', W - 110, H - 90, 'bold 28px "JetBrains Mono", monospace', 'right');
  },

  // --------------------------------------------------------------------------
  // OBRAS DE ARTE HIPER-DETALLADAS (THE BIG SCORE, NOMAD LETTERS, KINTSUGI, ETC.)
  // --------------------------------------------------------------------------
  drawHyperDetailedArtwork: function(ctx, mCtx, rCtx, bCtx, idx, foilColor, baseCloth, W, H) {
    const cx = W / 2;
    const cy = H * 0.60;

    const setupFoil = (lineWidth = 3) => {
      [ctx, mCtx, rCtx, bCtx].forEach(c => {
        c.save();
        c.lineWidth = lineWidth;
        c.lineCap = 'round';
        c.lineJoin = 'round';
      });
      ctx.strokeStyle = foilColor;
      ctx.fillStyle = foilColor;
      mCtx.strokeStyle = '#ffffff';
      mCtx.fillStyle = '#ffffff';
      rCtx.strokeStyle = '#121212';
      rCtx.fillStyle = '#121212';
      bCtx.strokeStyle = '#ffffff';
      bCtx.fillStyle = '#ffffff';
    };

    const restoreFoil = () => {
      [ctx, mCtx, rCtx, bCtx].forEach(c => c.restore());
    };

    switch (idx) {
      // ----------------------------------------------------------------------
      // LIBRO 0: PORTADA GENERAL Y EQUIPO DE INVESTIGADORES
      // Homenaje fiel a "The Big Score": Placa madre completa con microprocesador,
      // pistas de circuito en cobre, disipador radial de turbina y chips de memoria
      // ----------------------------------------------------------------------
      case 0:
      case 10: // Demo RAG / LLM
        setupFoil(3.5);
        this.drawMotherboardCircuitArt(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor, idx === 0 ? 'GRUPO C · CORE NPU' : 'RAG PIPELINE · 64BIT');
        restoreFoil();
        break;

      // ----------------------------------------------------------------------
      // LIBRO 1: TEMA 1 - LLM AISLADOS (EMMANUEL VILLALBA)
      // Homenaje fiel a "Nomad Letters": Cielo degradé pastel tornasolado,
      // grabado xilográfico de cordillera, sendero en zigzag y caravana
      // ----------------------------------------------------------------------
      case 1:
        this.drawNomadLettersArt(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor);
        break;

      // ----------------------------------------------------------------------
      // LIBRO 2: TEMA 2 - AGENTES Y ARNÉS (EMMANUEL VILLALBA)
      // Plano técnico ISO arquitectónico con andamiaje constructivista Bauhaus,
      // trenes de engranajes y bucles cerrados de verificación y telemetría
      // ----------------------------------------------------------------------
      case 2:
        setupFoil(3);
        this.drawBlueprintHarnessArt(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor);
        restoreFoil();
        break;

      // ----------------------------------------------------------------------
      // LIBRO 3: TEMA 3 - PRUEBAS AUTOMÁTICAS Y CALIDAD (LAUTARO RASSO)
      // Metrología óptica, retículas concéntricas con divisiones angulares a 360°,
      // nonios micrométricos y la curva de aceleración Meta QA (+55.8%)
      // ----------------------------------------------------------------------
      case 3:
        setupFoil(3);
        this.drawMetrologyBenchmarkArt(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor);
        restoreFoil();
        break;

      // ----------------------------------------------------------------------
      // LIBRO 4: TEMA 4 - SEGURIDAD Y QUÉ NO DELEGAR (LAUTARO RASSO)
      // Homenaje a "Poor Charlie's Almanack": Escudo en frecuencias de scanlines
      // ópticas, cerrojo de bóveda criptográfica y matriz MITRE ATLAS
      // ----------------------------------------------------------------------
      case 4:
        setupFoil(2.5);
        this.drawSecurityFrequencyArt(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor);
        restoreFoil();
        break;

      // ----------------------------------------------------------------------
      // LIBRO 5: TEMA 5 - VENTAJAS EN EL TIEMPO (LUCA FORTIN)
      // Homenaje a "Maintenance: Of Everything": Fracturas Kintsugi de Oro 24k
      // con venas ramificadas e intrincado astrolabio astronómico
      // ----------------------------------------------------------------------
      case 5:
        setupFoil(4);
        this.drawKintsugiChronometryArt(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor);
        restoreFoil();
        break;

      // ----------------------------------------------------------------------
      // LIBRO 6: TEMA 6 - DESVENTAJAS Y DEUDA TÉCNICA (LUCA FORTIN)
      // Prisma geológico octaédrico fracturado a lo largo de planos de cizalla
      // revelando estratos de deuda técnica, dependencias fantasma y alucinaciones
      // ----------------------------------------------------------------------
      case 6:
        setupFoil(3);
        this.drawFaultMatrixArt(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor);
        restoreFoil();
        break;

      // ----------------------------------------------------------------------
      // LIBRO 7: TEMA 7 - APRENDIZAJE PARA PRINCIPIANTES (GRETA MIRANDA)
      // Cartografía del Laberinto Socrático: Dos senderos topográficos
      // divergentes (la ciénaga de la copia ciega vs la cima del dominio)
      // ----------------------------------------------------------------------
      case 7:
        setupFoil(3);
        this.drawSocraticPathArt(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor);
        restoreFoil();
        break;

      // ----------------------------------------------------------------------
      // LIBRO 8: TEMA 8 - EL FUTURO DEL ROL DEL PROGRAMADOR (GRETA MIRANDA)
      // La Sinfonía de Sistemas: Batuta orquestal gobernando ondas armónicas
      // de Fourier y constelación de agentes autónomos
      // ----------------------------------------------------------------------
      case 8:
        setupFoil(3.5);
        this.drawSymphonyConductorArt(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor);
        restoreFoil();
        break;

      // ----------------------------------------------------------------------
      // LIBRO 9: COMPARACIÓN PRÁCTICA - VIBECODING VS ASISTIDA (LUCA FORTIN)
      // La Gran Dualidad: Oleaje tempestuoso orgánico (Vibe Flow) colisionando
      // contra una retícula ortogonal de titanio con pruebas de software
      // ----------------------------------------------------------------------
      case 9:
        setupFoil(3);
        this.drawDualityMonolithArt(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor);
        restoreFoil();
        break;

      // ----------------------------------------------------------------------
      // LIBRO 11: CONCLUSIONES ESTRATÉGICAS Y VEREDICTO FINAL (GRUPO C)
      // Arco romano triunfal monumental con 4 columnas corintias y clave de bóveda
      // ----------------------------------------------------------------------
      case 11:
        setupFoil(3.5);
        this.drawKeystoneArchArt(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor);
        restoreFoil();
        break;

      // ----------------------------------------------------------------------
      // LIBRO 12 / DEFAULT: PREGUNTAS Y CIERRE (GRUPO C)
      // Colofón clásico renacentista con corona de laurel, astrolabio y sello
      // ----------------------------------------------------------------------
      default:
        setupFoil(3);
        this.drawColophonSealArt(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor);
        restoreFoil();
        break;
    }
  },

  // --------------------------------------------------------------------------
  // RUTINAS DE DIBUJO HIPER-DETALLADO (CIRCUITOS, PAISAJES, KINTSUGI, ETC.)
  // --------------------------------------------------------------------------

  // 1. PLACA MADRE DE CIRCUITOS IMPRESOS (HOMENAJE EXACTO A "THE BIG SCORE")
  drawMotherboardCircuitArt: function(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor, chipLabel) {
    const drawOnAll = (fn) => [ctx, mCtx, rCtx, bCtx].forEach(c => fn(c));

    // Marco de placa de circuito con bornes en las esquinas
    const bx = 110, by = 420, bw = W - 220, bh = H - 560;
    drawOnAll(c => {
      c.strokeRect(bx, by, bw, bh);
      c.strokeRect(bx + 14, by + 14, bw - 28, bh - 28);
      // Bornes de montaje en las 4 esquinas
      [
        [bx + 35, by + 35], [bx + bw - 35, by + 35],
        [bx + 35, by + bh - 35], [bx + bw - 35, by + bh - 35]
      ].forEach(([px, py]) => {
        c.beginPath(); c.arc(px, py, 18, 0, Math.PI * 2); c.stroke();
        c.beginPath(); c.arc(px, py, 8, 0, Math.PI * 2); c.fill();
      });
    });

    // CHIP PROCESADOR CENTRAL (CPU SOCKET)
    const cw = 340, ch = 340;
    drawOnAll(c => {
      c.strokeRect(cx - cw / 2, cy - ch / 2, cw, ch);
      c.strokeRect(cx - cw / 2 + 12, cy - ch / 2 + 12, cw - 24, ch - 24);
      // Pines del chip en los 4 costados (16 pines por lado)
      for (let i = 0; i < 16; i++) {
        const offset = -cw / 2 + 25 + i * 19;
        // Pines superiores e inferiores
        c.fillRect(cx + offset, cy - ch / 2 - 20, 6, 20);
        c.fillRect(cx + offset, cy + ch / 2, 6, 20);
        // Pines laterales
        c.fillRect(cx - cw / 2 - 20, cy + offset, 20, 6);
        c.fillRect(cx + cw / 2, cy + offset, 20, 6);
      }
    });

    // Texto dentro del chip central
    drawOnAll(c => {
      c.font = 'bold 32px "JetBrains Mono", monospace';
      c.textAlign = 'center';
      c.fillText(chipLabel, cx, cy - 25);
      c.font = '500 22px "JetBrains Mono", monospace';
      c.fillText('SYSTEM ARCHITECTURE', cx, cy + 18);
      c.fillText('PP3 · I.S.F.T. 179', cx, cy + 52);
    });

    // DISIPADOR RADIAL / TURBINA DE REFRIGERACIÓN SUPERIOR
    const fanY = cy - 420;
    const fanR = 140;
    drawOnAll(c => {
      c.beginPath(); c.arc(cx, fanY, fanR, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.arc(cx, fanY, 40, 0, Math.PI * 2); c.fill();
      // 24 Aspas radiales curvadas
      for (let a = 0; a < 24; a++) {
        const rad = (a * Math.PI) / 12;
        c.beginPath();
        c.moveTo(cx + Math.cos(rad) * 42, fanY + Math.sin(rad) * 42);
        c.quadraticCurveTo(
          cx + Math.cos(rad + 0.3) * 95, fanY + Math.sin(rad + 0.3) * 95,
          cx + Math.cos(rad) * fanR, fanY + Math.sin(rad) * fanR
        );
        c.stroke();
      }
    });

    // CHIPS SECUNDARIOS Y BANCOS DE MEMORIA
    const chips = [
      { x: bx + 50, y: cy - 280, w: 180, h: 100, label: 'LLM-NPU' },
      { x: bx + bw - 230, y: cy - 280, w: 180, h: 100, label: 'HARNESS' },
      { x: bx + 50, y: cy + 190, w: 180, h: 100, label: 'MITRE-SEC' },
      { x: bx + bw - 230, y: cy + 190, w: 180, h: 100, label: 'META-QA' }
    ];

    chips.forEach(chp => {
      drawOnAll(c => {
        c.strokeRect(chp.x, chp.y, chp.w, chp.h);
        c.font = 'bold 20px "JetBrains Mono", monospace';
        c.textAlign = 'center';
        c.fillText(chp.label, chp.x + chp.w / 2, chp.y + chp.h / 2 + 7);
        // Pines de conexión
        for (let p = 12; p < chp.w - 12; p += 16) {
          c.fillRect(chp.x + p, chp.y - 12, 4, 12);
          c.fillRect(chp.x + p, chp.y + chp.h, 4, 12);
        }
      });
    });

    // PISTAS DE CIRCUITO BUS A 45 GRADOS (PCB TRACES)
    drawOnAll(c => {
      const traces = [
        // Bus izquierdo superior
        [[bx + 230, cy - 230], [cx - cw / 2 - 20, cy - 80]],
        [[bx + 230, cy - 200], [cx - cw / 2 - 20, cy - 60]],
        [[bx + 230, cy - 170], [cx - cw / 2 - 20, cy - 40]],
        // Bus derecho superior
        [[bx + bw - 230, cy - 230], [cx + cw / 2 + 20, cy - 80]],
        [[bx + bw - 230, cy - 200], [cx + cw / 2 + 20, cy - 60]],
        [[bx + bw - 230, cy - 170], [cx + cw / 2 + 20, cy - 40]],
        // Bus izquierdo inferior
        [[bx + 230, cy + 240], [cx - cw / 2 - 20, cy + 60]],
        [[bx + 230, cy + 210], [cx - cw / 2 - 20, cy + 40]],
        // Bus derecho inferior
        [[bx + bw - 230, cy + 240], [cx + cw / 2 + 20, cy + 60]],
        [[bx + bw - 230, cy + 210], [cx + cw / 2 + 20, cy + 40]]
      ];

      traces.forEach(([p1, p2]) => {
        c.beginPath();
        c.moveTo(p1[0], p1[1]);
        const midX = p1[0] + (p2[0] - p1[0]) * 0.5;
        c.lineTo(midX, p1[1]);
        c.lineTo(midX + (p2[1] - p1[1]), p2[1]);
        c.lineTo(p2[0], p2[1]);
        c.stroke();
        // Vias (puntos circulares de soldadura)
        c.beginPath(); c.arc(p1[0], p1[1], 5, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.arc(p2[0], p2[1], 5, 0, Math.PI * 2); c.fill();
      });

      // Bancos de condensadores y resistencias SMD
      for (let y = cy - 80; y <= cy + 80; y += 30) {
        c.fillRect(cx - cw / 2 - 55, y - 4, 18, 8);
        c.fillRect(cx + cw / 2 + 37, y - 4, 18, 8);
      }
    });
  },

  // 2. PAISAJE XILOGRÁFICO Y CIELO TORNASOLADO (HOMENAJE A "NOMAD LETTERS")
  drawNomadLettersArt: function(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor) {
    // 1. Cielo con degradé pastel tornasolado idéntico a la foto
    const skyH = H * 0.55;
    const skyGrad = ctx.createLinearGradient(0, 0, 0, skyH);
    skyGrad.addColorStop(0, '#a5f3fc');    // Cyan luminoso
    skyGrad.addColorStop(0.35, '#c7d2fe'); // Lavanda suave
    skyGrad.addColorStop(0.70, '#fbcfe8'); // Rosa amanecer
    skyGrad.addColorStop(1, '#fed7aa');    // Melocotón
    ctx.fillStyle = skyGrad;
    ctx.fillRect(100, 360, W - 200, skyH - 360);

    // 2. Cordillera montañosa en grabado xilográfico de alta densidad
    const drawOnAll = (fn) => [ctx, mCtx, rCtx, bCtx].forEach(c => fn(c));

    drawOnAll(c => {
      c.save();
      c.lineWidth = 3;
      c.strokeStyle = '#1e2d24';
      c.fillStyle = '#1e2d24';
      mCtx.strokeStyle = '#202020';
      mCtx.fillStyle = '#202020';
      rCtx.strokeStyle = '#dedede';
      rCtx.fillStyle = '#dedede';

      // Silueta de picos montañosos principales
      c.beginPath();
      c.moveTo(100, H - 140);
      c.lineTo(100, cy + 80);
      c.lineTo(cx - 260, cy - 120);
      c.lineTo(cx - 160, cy - 40);
      c.lineTo(cx, cy - 280);      // Pico más alto
      c.lineTo(cx + 180, cy - 100);
      c.lineTo(cx + 340, cy - 220); // Segundo pico
      c.lineTo(W - 100, cy + 40);
      c.lineTo(W - 100, H - 140);
      c.closePath();
      c.fill();
      c.stroke();

      // Tramas de sombreado y crestas rocosas en foil metálico
      c.strokeStyle = foilColor;
      mCtx.strokeStyle = '#ffffff';
      rCtx.strokeStyle = '#121212';
      bCtx.strokeStyle = '#ffffff';

      // Sendero sinuoso en zigzag (The Path)
      c.lineWidth = 6;
      c.beginPath();
      c.moveTo(cx, cy - 260);
      c.lineTo(cx - 40, cy - 160);
      c.lineTo(cx + 50, cy - 80);
      c.lineTo(cx - 60, cy + 40);
      c.lineTo(cx + 80, cy + 180);
      c.lineTo(cx - 30, cy + 340);
      c.lineTo(cx, H - 140);
      c.stroke();

      // Caravana de caminantes / camello grabada en el sendero
      const walkers = [
        [cx - 30, cy - 140],
        [cx + 35, cy - 70],
        [cx - 45, cy + 50],
        [cx + 65, cy + 190]
      ];
      c.fillStyle = foilColor;
      mCtx.fillStyle = '#ffffff';
      walkers.forEach(([wx, wy]) => {
        c.beginPath(); c.arc(wx, wy - 10, 8, 0, Math.PI * 2); c.fill();
        c.fillRect(wx - 4, wy - 4, 8, 16);
      });

      // Líneas de cota topográfica y ondas de probabilidad en el cielo
      c.lineWidth = 2.5;
      for (let r = 0; r < 6; r++) {
        c.beginPath();
        for (let x = 120; x <= W - 120; x += 30) {
          const y = cy - 240 - r * 35 + Math.sin(x * 0.015 + r) * 20;
          if (x === 120) c.moveTo(x, y);
          else c.lineTo(x, y);
        }
        c.stroke();
      }

      c.restore();
    });
  },

  // 3. PLANO TÉCNICO ARQUITECTÓNICO Y ARNÉS (HOMENAJE A SCALING PEOPLE)
  drawBlueprintHarnessArt: function(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor) {
    const drawOnAll = (fn) => [ctx, mCtx, rCtx, bCtx].forEach(c => fn(c));

    // Retícula milimétrica técnica
    drawOnAll(c => {
      c.lineWidth = 1.2;
      for (let x = 120; x <= W - 120; x += 40) {
        c.beginPath(); c.moveTo(x, 420); c.lineTo(x, H - 200); c.stroke();
      }
      for (let y = 420; y <= H - 200; y += 40) {
        c.beginPath(); c.moveTo(120, y); c.lineTo(W - 120, y); c.stroke();
      }

      // Estructura isométrica de andamiaje y control loop
      c.lineWidth = 4;
      const s = 240;
      c.strokeRect(cx - s, cy - s, s * 2, s * 2);

      // Engranajes planetarios interconectados
      const gears = [
        { x: cx - 110, y: cy - 100, r: 75, teeth: 16 },
        { x: cx + 110, y: cy - 100, r: 75, teeth: 16 },
        { x: cx, y: cy + 90, r: 90, teeth: 20 }
      ];

      gears.forEach(g => {
        c.beginPath(); c.arc(g.x, g.y, g.r, 0, Math.PI * 2); c.stroke();
        c.beginPath(); c.arc(g.x, g.y, 24, 0, Math.PI * 2); c.fill();
        for (let t = 0; t < g.teeth; t++) {
          const a = (t * Math.PI * 2) / g.teeth;
          c.fillRect(g.x + Math.cos(a) * (g.r - 4) - 5, g.y + Math.sin(a) * (g.r - 4) - 5, 10, 10);
        }
      });

      // Flechas del bucle cerrado de verificación
      c.beginPath();
      c.arc(cx, cy, s + 35, -Math.PI * 0.4, Math.PI * 0.4);
      c.stroke();
      c.beginPath();
      c.arc(cx, cy, s + 35, Math.PI * 0.6, Math.PI * 1.4);
      c.stroke();
    });
  },

  // 4. METROLOGÍA ÓPTICA Y QA BENCHMARK (LAUTARO RASSO)
  drawMetrologyBenchmarkArt: function(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor) {
    const drawOnAll = (fn) => [ctx, mCtx, rCtx, bCtx].forEach(c => fn(c));

    drawOnAll(c => {
      // Retícula de mira óptica concéntrica con 360 graduaciones
      for (let r = 60; r <= 320; r += 52) {
        c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke();
      }
      for (let deg = 0; deg < 360; deg += 10) {
        const rad = (deg * Math.PI) / 180;
        const len = (deg % 30 === 0) ? 28 : 14;
        c.beginPath();
        c.moveTo(cx + Math.cos(rad) * 320, cy + Math.sin(rad) * 320);
        c.lineTo(cx + Math.cos(rad) * (320 - len), cy + Math.sin(rad) * (320 - len));
        c.stroke();
      }

      // Curva de Benchmark Meta QA (+55.8%)
      c.lineWidth = 6;
      c.beginPath();
      c.moveTo(cx - 260, cy + 200);
      c.bezierCurveTo(cx - 100, cy + 180, cx + 50, cy + 50, cx + 240, cy - 160);
      c.stroke();

      // Puntos de datos y etiqueta de aceleración
      for (let i = 0; i <= 5; i++) {
        const px = cx - 260 + i * 100;
        const py = cy + 200 - Math.pow(i, 1.8) * 22;
        c.beginPath(); c.arc(px, py, 12, 0, Math.PI * 2); c.fill();
      }

      c.font = 'bold 36px "JetBrains Mono", monospace';
      c.textAlign = 'center';
      c.fillText('+55.8% ACELERACIÓN', cx, cy - 220);
      c.font = '500 22px "JetBrains Mono", monospace';
      c.fillText('META VERIFIED BENCHMARK', cx, cy - 180);
    });
  },

  // 5. ESCUDO DE FRECUENCIAS Y CRIPTOGRAFÍA (POOR CHARLIE'S ALMANACK)
  drawSecurityFrequencyArt: function(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor) {
    const drawOnAll = (fn) => [ctx, mCtx, rCtx, bCtx].forEach(c => fn(c));

    drawOnAll(c => {
      // 90 Líneas verticales de frecuencia óptica (Scanlines ópticas)
      for (let i = 0; i <= 90; i++) {
        const x = cx - 360 + i * 8;
        const dist = Math.abs(x - cx);
        const shieldHeight = Math.max(0, 380 - (dist * dist) / 450);
        c.lineWidth = (i % 3 === 0) ? 3.5 : 1.5;
        c.beginPath();
        c.moveTo(x, cy - shieldHeight);
        c.lineTo(x, cy + shieldHeight);
        c.stroke();
      }

      // Cerrojo de bóveda criptográfica central
      c.lineWidth = 5;
      c.beginPath(); c.arc(cx, cy, 140, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.arc(cx, cy, 95, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.arc(cx, cy, 32, 0, Math.PI * 2); c.fill();

      // Dientes de combinación radiales
      for (let a = 0; a < 12; a++) {
        const rad = (a * Math.PI) / 6;
        c.fillRect(cx + Math.cos(rad) * 115 - 8, cy + Math.sin(rad) * 115 - 8, 16, 16);
      }
    });
  },

  // 6. FRACTURA KINTSUGI DE ORO 24K Y CRONOMETRÍA (MAINTENANCE: OF EVERYTHING)
  drawKintsugiChronometryArt: function(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor) {
    const drawOnAll = (fn) => [ctx, mCtx, rCtx, bCtx].forEach(c => fn(c));

    drawOnAll(c => {
      // Astrolabio astronómico concéntrico de fondo
      c.lineWidth = 2.5;
      for (let r = 80; r <= 320; r += 60) {
        c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke();
      }
      for (let a = 0; a < 24; a++) {
        const rad = (a * Math.PI) / 12;
        c.beginPath();
        c.moveTo(cx, cy);
        c.lineTo(cx + Math.cos(rad) * 320, cy + Math.sin(rad) * 320);
        c.stroke();
      }

      // FRACTURA PRINCIPAL KINTSUGI EN ORO METÁLICO
      c.lineWidth = 9;
      c.beginPath();
      c.moveTo(110, cy - 360);
      c.lineTo(cx - 160, cy - 240);
      c.lineTo(cx - 60, cy - 90);
      c.lineTo(cx + 80, cy + 40);
      c.lineTo(cx + 20, cy + 210);
      c.lineTo(cx + 260, cy + 380);
      c.stroke();

      // Ramas secundarias de oro
      c.lineWidth = 5;
      c.beginPath();
      c.moveTo(cx - 60, cy - 90);
      c.lineTo(cx + 190, cy - 140);
      c.lineTo(cx + 310, cy - 100);
      c.stroke();

      c.beginPath();
      c.moveTo(cx + 80, cy + 40);
      c.lineTo(cx - 180, cy + 120);
      c.lineTo(cx - 280, cy + 220);
      c.stroke();

      // Soldaduras doradas en las uniones
      [
        [cx - 160, cy - 240], [cx - 60, cy - 90],
        [cx + 80, cy + 40], [cx + 20, cy + 210]
      ].forEach(([px, py]) => {
        c.beginPath(); c.arc(px, py, 20, 0, Math.PI * 2); c.fill();
      });
    });
  },

  // 7. MATRIZ DE FALLAS Y DEUDA TÉCNICA (LUCA FORTIN)
  drawFaultMatrixArt: function(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor) {
    const drawOnAll = (fn) => [ctx, mCtx, rCtx, bCtx].forEach(c => fn(c));

    drawOnAll(c => {
      // Prisma octaédrico fracturado
      c.lineWidth = 5;
      const pts = [
        [cx, cy - 320], [cx + 280, cy + 220], [cx - 280, cy + 220]
      ];
      c.beginPath();
      c.moveTo(pts[0][0], pts[0][1]);
      c.lineTo(pts[1][0], pts[1][1]);
      c.lineTo(pts[2][0], pts[2][1]);
      c.closePath();
      c.stroke();

      // Estratos sísmicos de deuda técnica
      c.lineWidth = 3.5;
      for (let y = cy - 160; y <= cy + 180; y += 45) {
        c.beginPath();
        c.moveTo(cx - 200 + (y - cy) * 0.4, y);
        c.lineTo(cx + 200 - (y - cy) * 0.4, y);
        c.stroke();
      }

      // Símbolo de advertencia angular central
      c.beginPath();
      c.moveTo(cx, cy - 50); c.lineTo(cx, cy + 60);
      c.lineWidth = 12;
      c.stroke();
      c.beginPath(); c.arc(cx, cy + 115, 14, 0, Math.PI * 2); c.fill();
    });
  },

  // 8. SENDERO SOCRÁTICO Y BRÚJULA (GRETA MIRANDA)
  drawSocraticPathArt: function(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor) {
    const drawOnAll = (fn) => [ctx, mCtx, rCtx, bCtx].forEach(c => fn(c));

    drawOnAll(c => {
      // Rosa de los vientos de 16 puntas superior
      c.beginPath(); c.arc(cx, cy - 180, 110, 0, Math.PI * 2); c.stroke();
      for (let a = 0; a < 16; a++) {
        const rad = (a * Math.PI) / 8;
        const len = (a % 4 === 0) ? 140 : 110;
        c.beginPath();
        c.moveTo(cx, cy - 180);
        c.lineTo(cx + Math.cos(rad) * len, cy - 180 + Math.sin(rad) * len);
        c.stroke();
      }

      // Bifurcación topográfica de dos caminos
      c.lineWidth = 7;
      c.beginPath();
      c.moveTo(cx, cy + 340);
      c.lineTo(cx, cy + 140);
      c.bezierCurveTo(cx, cy + 40, cx - 240, cy + 60, cx - 240, cy - 60);
      c.stroke();

      c.beginPath();
      c.moveTo(cx, cy + 140);
      c.bezierCurveTo(cx, cy + 40, cx + 240, cy + 60, cx + 240, cy - 60);
      c.stroke();

      c.font = 'bold 24px "Cinzel", serif';
      c.textAlign = 'center';
      c.fillText('LA MULETA', cx - 240, cy - 85);
      c.fillText('EL TUTOR', cx + 240, cy - 85);
    });
  },

  // 9. LA SINFONÍA DE SISTEMAS (GRETA MIRANDA)
  drawSymphonyConductorArt: function(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor) {
    const drawOnAll = (fn) => [ctx, mCtx, rCtx, bCtx].forEach(c => fn(c));

    drawOnAll(c => {
      // Ondas armónicas de Fourier radiantes
      for (let r = 70; r <= 350; r += 45) {
        c.beginPath();
        c.ellipse(cx, cy + 40, r, r * 0.42, 0, 0, Math.PI * 2);
        c.stroke();
      }

      // Batuta diagonal de mando
      c.lineWidth = 10;
      c.beginPath();
      c.moveTo(cx - 200, cy + 240);
      c.lineTo(cx + 190, cy - 220);
      c.stroke();

      // Puntero estelar en la punta
      c.beginPath(); c.arc(cx + 190, cy - 220, 24, 0, Math.PI * 2); c.fill();

      // Red de agentes autónomos interconectados
      const agents = [
        [cx - 140, cy - 80], [cx + 120, cy - 40],
        [cx - 80, cy + 120], [cx + 160, cy + 140]
      ];
      agents.forEach(([ax, ay]) => {
        c.beginPath(); c.arc(ax, ay, 18, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.moveTo(cx + 190, cy - 220); c.lineTo(ax, ay); c.stroke();
      });
    });
  },

  // 10. LA GRAN DUALIDAD (LUCA FORTIN)
  drawDualityMonolithArt: function(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor) {
    const drawOnAll = (fn) => [ctx, mCtx, rCtx, bCtx].forEach(c => fn(c));

    drawOnAll(c => {
      c.lineWidth = 6;
      c.beginPath(); c.moveTo(cx, cy - 340); c.lineTo(cx, cy + 340); c.stroke();

      // Lado izquierdo: Olas fluidas orgánicas (Vibe Flow)
      for (let y = cy - 260; y <= cy + 260; y += 55) {
        c.beginPath();
        c.moveTo(cx - 300, y);
        c.bezierCurveTo(cx - 220, y - 45, cx - 120, y + 45, cx - 15, y);
        c.stroke();
      }

      // Lado derecho: Retícula de ingeniería y pruebas unitarias
      for (let x = cx + 50; x <= cx + 300; x += 55) {
        c.strokeRect(x, cy - 220, 38, 440);
      }
    });
  },

  // 11. ARCO ROMANO TRIUNFAL (GRUPO C)
  drawKeystoneArchArt: function(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor) {
    const drawOnAll = (fn) => [ctx, mCtx, rCtx, bCtx].forEach(c => fn(c));

    drawOnAll(c => {
      c.lineWidth = 5;
      // Frontón superior
      c.strokeRect(cx - 280, cy - 140, 560, 35);
      c.beginPath(); c.arc(cx, cy - 105, 230, Math.PI, 0); c.stroke();

      // 4 Columnas corintias
      const colX = [-210, -70, 70, 210];
      colX.forEach(ox => {
        c.strokeRect(cx + ox - 20, cy - 105, 40, 360);
      });
      // Base
      c.strokeRect(cx - 300, cy + 255, 600, 40);

      // Medallón central
      c.beginPath(); c.arc(cx, cy - 105, 50, 0, Math.PI * 2); c.fill();
    });
  },

  // 12. COLOFÓN DE CLAUSURA (GRUPO C)
  drawColophonSealArt: function(ctx, mCtx, rCtx, bCtx, cx, cy, W, H, foilColor) {
    const drawOnAll = (fn) => [ctx, mCtx, rCtx, bCtx].forEach(c => fn(c));

    drawOnAll(c => {
      c.lineWidth = 4;
      c.beginPath(); c.arc(cx, cy, 260, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.arc(cx, cy, 210, 0, Math.PI * 2); c.stroke();

      for (let a = 0; a < 8; a++) {
        const rad = (a * Math.PI) / 4;
        c.beginPath();
        c.moveTo(cx, cy);
        c.lineTo(cx + Math.cos(rad) * 160, cy + Math.sin(rad) * 160);
        c.stroke();
      }
      c.beginPath(); c.arc(cx, cy, 34, 0, Math.PI * 2); c.fill();
    });
  },

  // --------------------------------------------------------------------------
  // LOMO CON NERVIOS EN RELIEVE Y ESTAMPADO VERTICAL CONTINUO
  // --------------------------------------------------------------------------
  renderSpineCoverStripeStyle: function(ctx, mCtx, rCtx, bCtx, slide, idx, foilColor, spineBg, W, H) {
    const ribs = [110, 380, H - 420, H - 150];
    ribs.forEach(y => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, y + 8, W, 14);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.20)';
      ctx.fillRect(0, y - 8, W, 8);

      ctx.fillStyle = foilColor;
      mCtx.fillStyle = '#ffffff';
      rCtx.fillStyle = '#101010';
      bCtx.fillStyle = '#ffffff';
      [ctx, mCtx, rCtx, bCtx].forEach(c => c.fillRect(25, y - 3, W - 50, 6));
    });

    const drawFoilSpineText = (text, x, y, font, align = 'center') => {
      [ctx, mCtx, rCtx, bCtx].forEach(c => {
        c.font = font;
        c.textAlign = align;
      });
      ctx.fillStyle = foilColor;
      mCtx.fillStyle = '#ffffff';
      rCtx.fillStyle = '#101010';
      bCtx.fillStyle = '#ffffff';
      [ctx, mCtx, rCtx, bCtx].forEach(c => c.fillText(text, x, y));
    };

    drawFoilSpineText(`VOL. ${slide.part || (idx + 1).toString().padStart(2, '0')}`, W / 2, 260, 'bold 44px "JetBrains Mono", monospace');

    const spineTitle = slide.shortTitle || slide.slideTitle || '';
    [ctx, mCtx, rCtx, bCtx].forEach(c => {
      c.save();
      c.translate(W / 2, H / 2);
      c.rotate(Math.PI / 2);
    });

    drawFoilSpineText(spineTitle.toUpperCase(), 0, 16, 'bold 52px "Playfair Display", "Cinzel", serif', 'center');

    [ctx, mCtx, rCtx, bCtx].forEach(c => c.restore());

    const author = slide.author || 'GRUPO C';
    drawFoilSpineText(author.toUpperCase(), W / 2, H - 280, 'bold 32px "Inter", sans-serif');
    drawFoilSpineText('PP3', W / 2, H - 230, 'bold 28px "JetBrains Mono", monospace');
  },

  // --------------------------------------------------------------------------
  // CONTRATAPA CON CÓDIGO DE BARRAS, ISBN Y SÍNTESIS
  // --------------------------------------------------------------------------
  renderBackCoverStripeStyle: function(ctx, mCtx, rCtx, bCtx, slide, foilColor, W, H) {
    const grad = ctx.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.9);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.02)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.62)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = foilColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(W / 2 - 60, 120, 120, 120);
    ctx.fillStyle = foilColor;
    ctx.font = 'bold 48px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('GC', W / 2, 195);

    ctx.font = 'italic 28px "Playfair Display", serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    this.wrapText(ctx, `«${slide.slideSubtitle || slide.slideTitle}»`, W / 2, 330, W - 180, 46);

    const barX = W / 2 - 160;
    const barY = H - 260;
    const barW = 320;
    const barH = 130;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(barX, barY, barW, barH);

    ctx.fillStyle = '#000000';
    for (let x = barX + 20; x < barX + barW - 20; x += 8) {
      const barLineWidth = (x % 16 === 0) ? 4.5 : 2;
      ctx.fillRect(x, barY + 16, barLineWidth, 75);
    }
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`ISBN 978-987-179-${(slide.part || '01')}-0`, barX + barW / 2, barY + 118);
  },

  // --------------------------------------------------------------------------
  // TEXTURA DE PÁGINAS INTERIORES
  // --------------------------------------------------------------------------
  createPagesTexture: function() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f5f0e6';
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = 'rgba(100, 90, 75, 0.18)';
    for (let y = 0; y < 512; y += 3) {
      ctx.fillRect(0, y, 512, 1.2);
    }

    const rimGrad = ctx.createLinearGradient(0, 0, 60, 0);
    rimGrad.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
    rimGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rimGrad;
    ctx.fillRect(0, 0, 60, 512);

    return new THREE.CanvasTexture(canvas);
  },

  // --------------------------------------------------------------------------
  // BUCLE DE ANIMACIÓN CON FÍSICA DE RESORTE CRÍTICAMENTE AMORTIGUADO
  // Y ROTACIÓN MATEMÁTICAMENTE CONTINUA (C-INFINITO)
  // --------------------------------------------------------------------------
  animate: function() {
    requestAnimationFrame(() => this.animate());

    const now = performance.now();
    const dt = Math.min((now - this.lastFrameTime) / 1000, 0.04);
    this.lastFrameTime = now;

    // 1. FÍSICA ANALÍTICA DE RESORTE CRÍTICAMENTE AMORTIGUADO (Silky Smooth)
    // zeta = 1.0 (críticamente amortiguado: cero oscilación, deslizamiento orgánico)
    // omega = 4.2 rad/s (viaje elegante de ~0.7s)
    const omega = 4.2;
    const zeta = 1.0;
    const f = 1.0 + 2.0 * dt * zeta * omega;
    const oo = omega * omega;
    const hoo = dt * oo;
    const hhoo = dt * hoo;
    const detInv = 1.0 / (f + hhoo);

    const diff = this.targetCarouselPos - this.carouselPos;
    const newPos = (f * this.carouselPos + dt * this.carouselVel + hhoo * this.targetCarouselPos) * detInv;
    this.carouselVel = (this.carouselVel + hoo * diff) * detInv;
    this.carouselPos = newPos;

    // 2. Parallax de inclinación suave con el cursor del mouse
    this.currentTiltX += (this.targetTiltX - this.currentTiltX) * 0.08;
    this.currentTiltY += (this.targetTiltY - this.currentTiltY) * 0.08;

    // 3. Suavizado de la órbita interactiva del libro central
    if (!this.isOrbitingBook) {
      this.bookOrbitY += (this.targetBookOrbitY - this.bookOrbitY) * 0.08;
      this.bookOrbitX += (this.targetBookOrbitX - this.bookOrbitX) * 0.08;
    }

    // 4. Luz puntual móvil que sigue al cursor para destellos metálicos en tiempo real
    if (this.rovingLight) {
      this.rovingLight.position.x = this.mouseX * 4.2;
      this.rovingLight.position.y = this.mouseY * 2.8 + 0.5;
    }

    // 5. POSICIONAMIENTO MATEMÁTICO CONTINUO C^∞ PARA CADA LIBRO
    // Cero cortes abruptos: todas las funciones son suaves y diferenciables
    this.books.forEach((book, i) => {
      const bookDiff = i - this.carouselPos;
      const absDiff = Math.abs(bookDiff);

      // Ponderación campana de Gauss: 1.0 en el centro, declina suavemente a 0
      const centerWeight = Math.exp(-2.2 * bookDiff * bookDiff);
      // Paso continuo con tangente hiperbólica
      const smoothSign = Math.tanh(1.8 * bookDiff);

      // Desplazamiento X continuo
      const fanSpacing = 2.18 * Math.abs(smoothSign) + absDiff * 0.74;
      book.position.x = smoothSign * fanSpacing;

      // Profundidad en Z (Arco semicircular + prominencia frontal)
      book.position.z = 1.45 * centerWeight - (absDiff * 0.38 + Math.pow(absDiff, 1.2) * 0.16);

      // Elevación Y (el libro activo flota sutilmente más alto)
      book.position.y = 0.12 * centerWeight - absDiff * 0.035;

      // ROTACIÓN Y: FUNCIÓN CONTINUA C^∞ ENTRE ESTANTE Y ÁNGULO HÉROE 3/4
      // Ángulo de estante lateral (~1.26 rad)
      const shelfAngle = -smoothSign * (1.26 + Math.min(0.2, absDiff * 0.05));
      
      // La rotación interactiva del mouse se aplica ESTRICTAMENTE al libro activo en foco
      const isCenterHero = (i === this.currentSlideIndex);
      const activeOrbitY = isCenterHero ? this.bookOrbitY : 0;
      const activeOrbitX = isCenterHero ? this.bookOrbitX : 0;

      // Ángulo de lectura a 3/4 de Stripe Press (-0.36 rad ~ -20.6°) + órbita interactiva + parallax
      const heroAngle = -0.36 + activeOrbitY + this.currentTiltY * 0.45;

      // Fusión suave continua usando centerWeight
      book.rotation.y = (1 - centerWeight) * shelfAngle + centerWeight * heroAngle;

      // ROTACIÓN X: Fusión continua a cabeceo de perspectiva (+0.07 rad ~ +4°) + parallax
      const heroPitch = 0.07 + activeOrbitX + this.currentTiltX * 0.45;
      book.rotation.x = centerWeight * heroPitch;

      // ROTACIÓN Z: Alabeo cinético aerodinámico durante el movimiento
      const kineticBank = -this.carouselVel * 0.18;
      const shelfTiltZ = -smoothSign * 0.025 * (1 - centerWeight);
      book.rotation.z = shelfTiltZ + kineticBank * (0.4 + 0.6 * centerWeight);

      // Escala: se magnifica suavemente a 1.10 al centro
      const scale = 0.72 + 0.38 * centerWeight;
      book.scale.set(scale, scale, scale);
    });

    this.renderer.render(this.scene, this.camera);
  },

  // --------------------------------------------------------------------------
  // NAVEGACIÓN Y SINCRONIZACIÓN DE DIAPOSITIVAS
  // --------------------------------------------------------------------------
  goToSlide: function(idx, instant = false) {
    if (idx < 0 || idx >= this.slides.length) return;
    this.currentSlideIndex = idx;
    this.targetCarouselPos = idx;

    this.targetBookOrbitY = 0;
    this.targetBookOrbitX = 0;

    if (instant) {
      this.carouselPos = idx;
      this.carouselVel = 0;
      this.bookOrbitY = 0;
      this.bookOrbitX = 0;
    }

    const currentSlide = this.slides[idx];

    const infoBar = document.querySelector('.carousel-info-bar');
    if (infoBar) {
      infoBar.classList.add('is-changing');
      setTimeout(() => {
        const titleEl = document.getElementById('info-title');
        const subEl = document.getElementById('info-subtitle');
        const metaEl = document.getElementById('info-meta');

        if (titleEl) {
          titleEl.textContent = currentSlide.slideTitle;
          titleEl.style.fontSize = currentSlide.slideTitle.length > 55 ? '1.5rem' : '1.85rem';
        }
        if (subEl) subEl.textContent = `${currentSlide.author} · ${currentSlide.category}`;
        if (metaEl) metaEl.textContent = `PARTE ${currentSlide.part || (idx + 1).toString().padStart(2, '0')}`;

        infoBar.classList.remove('is-changing');
      }, 140);
    }

    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    if (btnPrev) btnPrev.disabled = (idx === 0);
    if (btnNext) btnNext.disabled = (idx === this.slides.length - 1);

    const total = this.slides.length;
    const pct = (idx / (total - 1)) * 100;
    const scrubberDot = document.getElementById('timeline-dot');
    if (scrubberDot) {
      scrubberDot.style.left = `${pct}%`;
    }

    this.slides.forEach((_, i) => {
      const tick = document.getElementById(`timeline-tick-${i}`);
      if (tick) {
        if (i === idx) tick.classList.add('active');
        else tick.classList.remove('active');
      }
    });

    if (this.isModalOpen) {
      this.updateModalContent(idx);
    }
  },

  nextSlide: function() {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.goToSlide(this.currentSlideIndex + 1);
    }
  },

  prevSlide: function() {
    if (this.currentSlideIndex > 0) {
      this.goToSlide(this.currentSlideIndex - 1);
    }
  },

  renderTimelineTicks: function() {
    const ticksContainer = document.getElementById('timeline-ticks');
    if (!ticksContainer) return;

    ticksContainer.innerHTML = '';

    this.slides.forEach((slide, idx) => {
      const tick = document.createElement('div');
      tick.className = `timeline-tick-item ${idx === 0 ? 'active' : ''}`;
      tick.id = `timeline-tick-${idx}`;
      const num = (idx + 1).toString().padStart(2, '0');
      tick.innerHTML = `<span>${num}</span>`;
      tick.title = `${slide.shortTitle || slide.slideTitle} (${slide.author || 'Grupo C'})`;

      tick.addEventListener('click', () => {
        this.goToSlide(idx);
      });

      ticksContainer.appendChild(tick);
    });
  },

  // --------------------------------------------------------------------------
  // MODAL / VISTA DE DIAPOSITIVA COMPLETA
  // --------------------------------------------------------------------------
  openSlideDetail: function(idx) {
    if (typeof idx === 'undefined') idx = this.currentSlideIndex;
    this.isModalOpen = true;
    this.updateModalContent(idx);

    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.add('is-open');
    }
  },

  closeSlideDetail: function() {
    this.isModalOpen = false;
    this.modalCurrentIdx = null;
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.remove('is-open');
    }
  },

  toggleSlideDetail: function() {
    if (this.isModalOpen) {
      this.closeSlideDetail();
    } else {
      this.openSlideDetail(this.currentSlideIndex);
    }
  },

  // --------------------------------------------------------------------------
  // LIGHTBOX DE IMÁGENES EN ALTA RESOLUCIÓN
  // --------------------------------------------------------------------------
  openLightbox: function(src, caption) {
    const overlay = document.getElementById('image-lightbox');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    if (!overlay || !img) return;

    img.src = src;
    if (cap) cap.textContent = caption || 'Esquema Técnico';
    overlay.classList.add('is-open');
    this.isLightboxOpen = true;
  },

  closeLightbox: function() {
    const overlay = document.getElementById('image-lightbox');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    this.isLightboxOpen = false;
  },

  updateModalContent: function(idx) {
    const slide = this.slides[idx];
    if (!slide) return;

    const prevIdx = (typeof this.modalCurrentIdx === 'number') ? this.modalCurrentIdx : idx;
    const isForward = idx >= prevIdx;
    const isSlideChanged = (typeof this.modalCurrentIdx === 'number' && this.modalCurrentIdx !== idx);
    this.modalCurrentIdx = idx;

    const modalBadge = document.getElementById('modal-badge');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalBody = document.getElementById('modal-body');
    const modalCounter = document.getElementById('modal-counter');

    if (modalBadge) modalBadge.textContent = `${slide.author} · PARTE ${(idx + 1).toString().padStart(2, '0')}`;
    if (modalTitle) modalTitle.textContent = slide.slideTitle;
    if (modalSubtitle) modalSubtitle.textContent = slide.slideSubtitle;
    if (modalCounter) modalCounter.textContent = `${idx + 1} / ${this.slides.length}`;

    if (modalBody) {
      const newHtml = window.APP_COMPONENTS.renderSlideContent(slide, idx);
      const existingContainer = modalBody.querySelector('.slide-page-transition');

      if (existingContainer && isSlideChanged) {
        // Transición direccional suave entre diapositivas (slide + fade + blur)
        const exitClass = isForward ? 'slide-exit-left' : 'slide-exit-right';
        const enterClass = isForward ? 'slide-enter-right' : 'slide-enter-left';

        existingContainer.className = `slide-page-transition ${exitClass}`;

        const newWrapper = document.createElement('div');
        newWrapper.className = `slide-page-transition ${enterClass}`;
        newWrapper.innerHTML = newHtml;

        setTimeout(() => {
          modalBody.innerHTML = '';
          modalBody.appendChild(newWrapper);
          modalBody.scrollTop = 0;

          // Forzar reflow para ejecutar animación fluida de entrada
          void newWrapper.offsetWidth;
          newWrapper.className = 'slide-page-transition slide-enter-active';
        }, 160);
      } else {
        modalBody.innerHTML = `<div class="slide-page-transition slide-enter-active">${newHtml}</div>`;
        modalBody.scrollTop = 0;
      }
    }

    const modalBtnPrev = document.getElementById('modal-btn-prev');
    const modalBtnNext = document.getElementById('modal-btn-next');
    if (modalBtnPrev) modalBtnPrev.disabled = (idx === 0);
    if (modalBtnNext) modalBtnNext.disabled = (idx === this.slides.length - 1);
  },

  onWindowResize: function() {
    const container = document.getElementById('webgl-container');
    if (!container || !this.renderer || !this.camera) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  },

  // --------------------------------------------------------------------------
  // BINDING DE EVENTOS
  // --------------------------------------------------------------------------
  bindEvents: function() {
    const container = document.getElementById('webgl-container');

    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      this.targetTiltX = -this.mouseY * 0.16;
      this.targetTiltY = this.mouseX * 0.20;
    });

    if (container) {
      let isClick = true;
      let startX = 0;
      let startY = 0;

      container.addEventListener('mousedown', (e) => {
        isClick = true;
        startX = e.clientX;
        startY = e.clientY;

        if (this.renderer && this.camera) {
          const rect = container.getBoundingClientRect();
          this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          this.raycaster.setFromCamera(this.mouse, this.camera);
          const intersects = this.raycaster.intersectObjects(this.bookGroup.children, true);

          if (intersects.length > 0) {
            let hit = intersects[0].object;
            while (hit.parent && !hit.userData.isBookRoot) {
              hit = hit.parent;
            }
            if (hit.userData.index === this.currentSlideIndex) {
              // Iniciar órbita 3D interactiva del libro central
              this.isOrbitingBook = true;
              this.orbitStartX = e.clientX;
              this.orbitStartY = e.clientY;
              this.orbitStartAngleY = this.bookOrbitY;
              this.orbitStartAngleX = this.bookOrbitX;
              return;
            }
          }
        }

        // Arrastre horizontal del carrusel en el fondo
        this.isDraggingCarousel = true;
        this.dragStartX = e.clientX;
        this.dragStartPos = this.targetCarouselPos;
      });

      window.addEventListener('mousemove', (e) => {
        if (Math.abs(e.clientX - startX) > 6 || Math.abs(e.clientY - startY) > 6) {
          isClick = false;
        }

        if (this.isOrbitingBook) {
          const deltaX = (e.clientX - this.orbitStartX) * 0.007;
          const deltaY = (e.clientY - this.orbitStartY) * 0.004;
          this.bookOrbitY = this.orbitStartAngleY + deltaX;
          this.bookOrbitX = Math.max(-0.35, Math.min(0.35, this.orbitStartAngleX + deltaY));
          return;
        }

        if (this.isDraggingCarousel) {
          const deltaX = (e.clientX - this.dragStartX) / window.innerWidth;
          this.targetCarouselPos = Math.max(0, Math.min(this.slides.length - 1, this.dragStartPos - deltaX * 3.4));
        }

        if (this.renderer && this.camera && !this.isDraggingCarousel && !this.isOrbitingBook) {
          const rect = container.getBoundingClientRect();
          this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          this.raycaster.setFromCamera(this.mouse, this.camera);
          const intersects = this.raycaster.intersectObjects(this.bookGroup.children, true);
          container.style.cursor = intersects.length > 0 ? 'pointer' : 'grab';
        }
      });

      window.addEventListener('mouseup', (e) => {
        if (this.isOrbitingBook) {
          this.isOrbitingBook = false;
          this.targetBookOrbitY = 0;
          this.targetBookOrbitX = 0;
        }

        if (this.isDraggingCarousel) {
          this.isDraggingCarousel = false;
          const nearest = Math.round(this.targetCarouselPos);
          this.goToSlide(nearest);
        }

        if (isClick && this.renderer && this.camera) {
          const rect = container.getBoundingClientRect();
          this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

          this.raycaster.setFromCamera(this.mouse, this.camera);
          const intersects = this.raycaster.intersectObjects(this.bookGroup.children, true);

          if (intersects.length > 0) {
            let hit = intersects[0].object;
            while (hit.parent && !hit.userData.isBookRoot) {
              hit = hit.parent;
            }
            const idx = hit.userData.index;

            if (idx === this.currentSlideIndex) {
              this.openSlideDetail(idx);
            } else {
              this.goToSlide(idx);
            }
          }
        }
      });

      // Gestos táctiles
      container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          this.isDraggingCarousel = true;
          this.dragStartX = e.touches[0].clientX;
          this.dragStartPos = this.targetCarouselPos;
        }
      }, { passive: true });

      container.addEventListener('touchmove', (e) => {
        if (this.isDraggingCarousel && e.touches.length === 1) {
          const deltaX = (e.touches[0].clientX - this.dragStartX) / window.innerWidth;
          this.targetCarouselPos = Math.max(0, Math.min(this.slides.length - 1, this.dragStartPos - deltaX * 3.4));
        }
      }, { passive: true });

      container.addEventListener('touchend', () => {
        if (this.isDraggingCarousel) {
          this.isDraggingCarousel = false;
          const nearest = Math.round(this.targetCarouselPos);
          this.goToSlide(nearest);
        }
      });
    }

    // Rueda del ratón
    let wheelTimeout = null;
    window.addEventListener('wheel', (e) => {
      if (this.isModalOpen) return;
      if (wheelTimeout) return;

      if (Math.abs(e.deltaX) > 16 || Math.abs(e.deltaY) > 16) {
        if (e.deltaY > 0 || e.deltaX > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
        wheelTimeout = setTimeout(() => {
          wheelTimeout = null;
        }, 280);
      }
    }, { passive: true });

    // Teclas
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        this.nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.toggleSlideDetail();
      } else if (e.key === 'Escape') {
        if (this.isLightboxOpen) {
          e.preventDefault();
          this.closeLightbox();
        } else if (this.isModalOpen) {
          e.preventDefault();
          this.closeSlideDetail();
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        this.goToSlide(this.slides.length - 1);
      }
    });

    const timelineBar = document.getElementById('timeline-bar');
    if (timelineBar) {
      timelineBar.addEventListener('click', (e) => {
        const rect = timelineBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        const targetIdx = Math.round(pct * (this.slides.length - 1));
        this.goToSlide(targetIdx);
      });
    }

    // Navegación con click en el Modal de Diapositiva (Reader UI):
    // Click izquierdo = Avanzar diapositiva siguiente
    // Click derecho = Retroceder diapositiva anterior
    window.addEventListener('contextmenu', (e) => {
      if (this.isModalOpen && !this.isLightboxOpen) {
        e.preventDefault();
        this.prevSlide();
      }
    });

    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        // En pantalla completa, las diapositivas no se cierran al clickear el fondo
        // para evitar salidas accidentales. Se cierran con el botón ✕ o la tecla Escape.

        // Click primario (izquierdo): avanzar a la siguiente diapositiva
        if (this.isModalOpen && !this.isLightboxOpen && e.button === 0) {
          // Si el clic fue en un elemento interactivo (botones, inputs, códigos, etc.), no avanzar
          if (e.target.closest('button, a, input, textarea, select, pre, code, .code-editor, .btn-skills-action, .btn-close-modal, .btn-modal-nav, [onclick]')) {
            return;
          }
          // Si el usuario seleccionó texto para copiar, no avanzar
          const selection = window.getSelection();
          if (selection && selection.toString().trim().length > 0) {
            return;
          }
          this.nextSlide();
        }
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.APP.init();
});
