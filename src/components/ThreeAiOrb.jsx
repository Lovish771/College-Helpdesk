import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeAiOrb: 100% Authentic 3D WebGL Floating Robotic AI Sphere
 * Directly replicating the user's reference design:
 * - High-DPI retina WebGL 3D rendering (up to 2.5x pixel ratio)
 * - Pearlescent glossy metallic white armored shell with segmented robotic panel lines
 * - Bold graphite "AI" insignia cleanly embossed on the white forehead armor
 * - FRONT-FACING curved obsidian black glass visor with soft specular reflections
 * - Expressive glowing neon orange digital eyes (Idle, Hover, Listening, Thinking, Speaking)
 * - Large side headphone ear-pods with vibrant illuminated glowing orange neon rings
 * - Smooth arched white headband with graphite central antenna stem and orange sensor tip
 * - Recessed lower chin intake vent
 * - Under-orb holographic orange concentric ground projection energy rings
 * - Smooth 3D mouse/touch look-at tracking with organic floating buoyancy
 */
export default function ThreeAiOrb({
  state = 'idle', // 'idle' | 'hover' | 'listening' | 'thinking' | 'speaking'
  size = 120,     // Canvas dimension in px
  enableLookAt = true,
  onClick,
  className = '',
}) {
  const mountRef = useRef(null);
  const stateRef = useRef(state);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── 1. Scene, Camera, High-DPI Renderer ──
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    // Camera positioned in front (+Z) looking directly at the face
    camera.position.set(0, 0.08, 4.3);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(size, size);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // ── 2. Materials ──
    // Glossy pearlescent white metallic ceramic armor
    const whiteArmorMat = new THREE.MeshPhysicalMaterial({
      color: 0xf6f8fc,
      metalness: 0.18,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.92,
    });

    // Dark graphite metallic chassis / vents / seams
    const darkGraphiteMat = new THREE.MeshStandardMaterial({
      color: 0x141820,
      metalness: 0.88,
      roughness: 0.28,
    });

    // Front obsidian black glass face visor (deep dark glossy glass)
    const visorGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x06080e,
      metalness: 0.92,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.98,
    });

    // Vibrant Radiant Neon Orange for Ear Rings / Accents
    const neonOrangeBasicMat = new THREE.MeshBasicMaterial({
      color: 0xff6a00,
    });

    const neonOrangeInnerRingMat = new THREE.MeshBasicMaterial({
      color: 0xffa033,
    });

    // ── 3. High-Res Procedural Canvas Texture for Forehead "AI" Badge ──
    const foreheadCanvas = document.createElement('canvas');
    foreheadCanvas.width = 512;
    foreheadCanvas.height = 256;
    const foreheadCtx = foreheadCanvas.getContext('2d');
    foreheadCtx.clearRect(0, 0, 512, 256);
    foreheadCtx.fillStyle = '#141820';
    foreheadCtx.font = '900 130px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    foreheadCtx.textAlign = 'center';
    foreheadCtx.textBaseline = 'middle';
    foreheadCtx.fillText('AI', 256, 128);

    const foreheadTexture = new THREE.CanvasTexture(foreheadCanvas);
    foreheadTexture.anisotropy = 8;

    const foreheadBadgeMat = new THREE.MeshBasicMaterial({
      map: foreheadTexture,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });

    // ── 4. High-Res Canvas Texture for Glowing Digital Eyes (1024x1024) ──
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 1024;
    faceCanvas.height = 1024;
    const faceCtx = faceCanvas.getContext('2d');

    const faceTexture = new THREE.CanvasTexture(faceCanvas);
    faceTexture.anisotropy = 8;

    const faceScreenMat = new THREE.MeshBasicMaterial({
      map: faceTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.FrontSide,
    });

    // ── 5. Constructing the Authentic 3D Robot Orb ──
    const orbRoot = new THREE.Group();
    scene.add(orbRoot);

    // Inner head pivot group (for micro tilts and organic look-at)
    const headPivot = new THREE.Group();
    orbRoot.add(headPivot);

    // (A) Main Pearlescent White Sphere Head
    const headGeom = new THREE.SphereGeometry(1.0, 64, 64);
    const headMesh = new THREE.Mesh(headGeom, whiteArmorMat);
    headPivot.add(headMesh);

    // (B) Dark Graphite Inner Visor Bezel / Rim Frame (positioned in FRONT at +Z)
    // In Three.js SphereGeometry: +Z center is at phi = Math.PI / 2.
    // Span: 96° horizontal (phiStart: 0.233*PI, phiLength: 0.534*PI), 58° vertical (thetaStart: 0.28*PI, thetaLength: 0.32*PI)
    const bezelGeom = new THREE.SphereGeometry(
      1.006,
      48,
      48,
      Math.PI * 0.22,
      Math.PI * 0.56,
      Math.PI * 0.26,
      Math.PI * 0.36
    );
    const bezelMesh = new THREE.Mesh(bezelGeom, darkGraphiteMat);
    headPivot.add(bezelMesh);

    // (C) Front Obsidian Glass Visor (Radius 1.012 - sitting cleanly outside white helmet in front)
    const visorGeom = new THREE.SphereGeometry(
      1.012,
      48,
      48,
      Math.PI * 0.235,
      Math.PI * 0.53,
      Math.PI * 0.28,
      Math.PI * 0.32
    );
    const visorMesh = new THREE.Mesh(visorGeom, visorGlassMat);
    headPivot.add(visorMesh);

    // (D) Expressive Glowing Digital Eyes Overlay Plane (Radius 1.018 - just outside the glass visor)
    const eyeDisplayGeom = new THREE.SphereGeometry(
      1.018,
      48,
      48,
      Math.PI * 0.235,
      Math.PI * 0.53,
      Math.PI * 0.28,
      Math.PI * 0.32
    );
    const eyeDisplayMesh = new THREE.Mesh(eyeDisplayGeom, faceScreenMat);
    headPivot.add(eyeDisplayMesh);

    // (E) Forehead "AI" Insignia Plane (positioned tangent to white forehead armor above visor)
    const foreheadBadgeGeom = new THREE.PlaneGeometry(0.36, 0.18);
    const foreheadBadgeMesh = new THREE.Mesh(foreheadBadgeGeom, foreheadBadgeMat);
    foreheadBadgeMesh.position.set(0, 0.76, 0.66);
    foreheadBadgeMesh.rotation.x = -0.72;
    headPivot.add(foreheadBadgeMesh);

    // (F) Lower Chin Graphite Inset Vent (matching reference below the visor)
    const chinVentGeom = new THREE.BoxGeometry(0.38, 0.055, 0.14);
    const chinVentMesh = new THREE.Mesh(chinVentGeom, darkGraphiteMat);
    chinVentMesh.position.set(0, -0.56, 0.84);
    chinVentMesh.rotation.x = 0.55;
    headPivot.add(chinVentMesh);

    // Inner Chin Accent Slot
    const chinSlotGeom = new THREE.BoxGeometry(0.24, 0.02, 0.15);
    const chinSlotMesh = new THREE.Mesh(chinSlotGeom, new THREE.MeshBasicMaterial({ color: 0x050608 }));
    chinSlotMesh.position.set(0, -0.56, 0.85);
    chinSlotMesh.rotation.x = 0.55;
    headPivot.add(chinSlotMesh);

    // (G) Headband / Antenna Arch Over Head
    const bandCurve = new THREE.EllipseCurve(0, 0, 1.04, 1.07, 0, Math.PI, false, 0);
    const bandPoints = bandCurve.getPoints(42);
    const bandShape = new THREE.CatmullRomCurve3(
      bandPoints.map((p) => new THREE.Vector3(p.x, p.y, 0))
    );
    const bandGeom = new THREE.TubeGeometry(bandShape, 54, 0.048, 16, false);
    const bandMesh = new THREE.Mesh(bandGeom, whiteArmorMat);
    bandMesh.position.set(0, -0.01, 0);
    headPivot.add(bandMesh);

    // Antenna Graphite Central Stem
    const antennaStemGeom = new THREE.CylinderGeometry(0.018, 0.022, 0.14, 16);
    const antennaStem = new THREE.Mesh(antennaStemGeom, darkGraphiteMat);
    antennaStem.position.set(0, 1.11, 0);
    headPivot.add(antennaStem);

    // Antenna Glowing Orange Tip
    const antennaTipGeom = new THREE.SphereGeometry(0.034, 16, 16);
    const antennaTip = new THREE.Mesh(antennaTipGeom, neonOrangeBasicMat);
    antennaTip.position.set(0, 1.18, 0);
    headPivot.add(antennaTip);

    // (H) Dual Illuminated Ear Rings (Left & Right Earphone Pods)
    const earGroup = new THREE.Group();
    headPivot.add(earGroup);

    const createEarAssembly = (isRight = false) => {
      const earSub = new THREE.Group();
      const posX = (isRight ? 1 : -1) * 0.98;
      earSub.position.set(posX, 0.05, 0);
      earSub.rotation.y = isRight ? Math.PI / 2 : -Math.PI / 2;

      // 1. Outer White Armored Cup
      const baseCap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.39, 0.39, 0.09, 36),
        whiteArmorMat
      );
      baseCap.rotation.x = Math.PI / 2;
      earSub.add(baseCap);

      // 2. Inset Graphite Bezel
      const innerRim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.33, 0.33, 0.10, 36),
        darkGraphiteMat
      );
      innerRim.rotation.x = Math.PI / 2;
      earSub.add(innerRim);

      // 3. Vibrant Glowing Neon Orange Outer Ring
      const neonRingOuter = new THREE.Mesh(
        new THREE.TorusGeometry(0.24, 0.042, 18, 48),
        neonOrangeBasicMat
      );
      neonRingOuter.position.z = 0.06;
      earSub.add(neonRingOuter);

      // 4. Fine High-Intensity Inner Amber Core Ring
      const neonRingInner = new THREE.Mesh(
        new THREE.TorusGeometry(0.24, 0.02, 16, 48),
        neonOrangeInnerRingMat
      );
      neonRingInner.position.z = 0.065;
      earSub.add(neonRingInner);

      // 5. Center Graphite Core Hub
      const centerHub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.13, 0.08, 28),
        darkGraphiteMat
      );
      centerHub.rotation.x = Math.PI / 2;
      centerHub.position.z = 0.04;
      earSub.add(centerHub);

      return { earSub, neonRingOuter, neonRingInner };
    };

    const leftEar = createEarAssembly(false);
    const rightEar = createEarAssembly(true);
    earGroup.add(leftEar.earSub);
    earGroup.add(rightEar.earSub);

    // (I) Under-Orb Holographic Concentric Ground Energy Rings
    const groundPedestalGroup = new THREE.Group();
    groundPedestalGroup.position.set(0, -1.34, 0);
    groundPedestalGroup.rotation.x = Math.PI / 2;
    orbRoot.add(groundPedestalGroup);

    // Outer Thin Holographic Halo
    const ringOuterGeom = new THREE.RingGeometry(0.58, 0.75, 64);
    const ringOuterMat = new THREE.MeshBasicMaterial({
      color: 0xff6a00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ringOuter = new THREE.Mesh(ringOuterGeom, ringOuterMat);
    groundPedestalGroup.add(ringOuter);

    // Middle Radiant Amber Ring
    const ringMiddleGeom = new THREE.RingGeometry(0.38, 0.48, 64);
    const ringMiddleMat = new THREE.MeshBasicMaterial({
      color: 0xff8c00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.70,
    });
    const ringMiddle = new THREE.Mesh(ringMiddleGeom, ringMiddleMat);
    groundPedestalGroup.add(ringMiddle);

    // Inner Core High-Intensity Ring
    const ringInnerGeom = new THREE.RingGeometry(0.18, 0.25, 48);
    const ringInnerMat = new THREE.MeshBasicMaterial({
      color: 0xffa033,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const ringInner = new THREE.Mesh(ringInnerGeom, ringInnerMat);
    groundPedestalGroup.add(ringInner);

    // ── 6. Studio Cinematic Lighting Rig ──
    const ambientLight = new THREE.AmbientLight(0xdce6f2, 1.3);
    scene.add(ambientLight);

    // Key Light (Clean top-front directional reflection)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(2.5, 4.0, 4.5);
    scene.add(keyLight);

    // Cool Rim Light (Subtle metallic edge specular from back-left)
    const rimLight = new THREE.DirectionalLight(0xa5c2eb, 1.6);
    rimLight.position.set(-4, 2.5, -2.5);
    scene.add(rimLight);

    // Warm Orange Upward Glow (Signature under-lighting)
    const orangeUpLight = new THREE.PointLight(0xff6a00, 2.8, 5);
    orangeUpLight.position.set(0, -1.2, 0.9);
    scene.add(orangeUpLight);

    // Direct Visor Eye Illuminator
    const visorAccentLight = new THREE.PointLight(0xff7700, 1.2, 3.5);
    visorAccentLight.position.set(0, 0, 1.8);
    scene.add(visorAccentLight);

    // ── 7. Dynamic Drawing Routine for the 5 Expressive Eye States ──
    const drawFaceState = (currentState, time) => {
      faceCtx.clearRect(0, 0, 1024, 1024);

      const eyeColor = '#FF7A00';
      const eyeCoreColor = '#FFE8B0';
      const glowColor = 'rgba(255, 115, 0, 0.95)';

      const drawCurvedEye = (cx, cy, radius, strokeW, startAng, endAng) => {
        // Outer soft glow layer
        faceCtx.save();
        faceCtx.shadowColor = glowColor;
        faceCtx.shadowBlur = 48;
        faceCtx.strokeStyle = eyeColor;
        faceCtx.lineWidth = strokeW + 14;
        faceCtx.lineCap = 'round';
        faceCtx.beginPath();
        faceCtx.arc(cx, cy, radius, startAng, endAng, false);
        faceCtx.stroke();
        faceCtx.restore();

        // Main radiant orange stroke
        faceCtx.save();
        faceCtx.shadowColor = glowColor;
        faceCtx.shadowBlur = 26;
        faceCtx.strokeStyle = eyeColor;
        faceCtx.lineWidth = strokeW;
        faceCtx.lineCap = 'round';
        faceCtx.beginPath();
        faceCtx.arc(cx, cy, radius, startAng, endAng, false);
        faceCtx.stroke();
        faceCtx.restore();

        // Inner hot core
        faceCtx.save();
        faceCtx.strokeStyle = eyeCoreColor;
        faceCtx.lineWidth = Math.max(5, strokeW * 0.35);
        faceCtx.lineCap = 'round';
        faceCtx.beginPath();
        faceCtx.arc(cx, cy, radius, startAng, endAng, false);
        faceCtx.stroke();
        faceCtx.restore();
      };

      // Eyes vertical center on 1024x1024 canvas
      const eyeY = 500;
      const leftEyeX = 320;
      const rightEyeX = 704;

      if (currentState === 'hover') {
        // ── HOVER STATE: Wider happy arch eyes with energetic bounce ──
        const bounce = Math.sin(time * 6.5) * 6;
        [leftEyeX, rightEyeX].forEach((x) => {
          drawCurvedEye(x, eyeY + bounce + 14, 96, 42, Math.PI * 1.14, Math.PI * 1.86);
        });
      } else if (currentState === 'listening') {
        // ── LISTENING STATE: Dynamic dancing audio frequency equalizer ──
        const bars = 9;
        const totalWidth = 560;
        const startX = 512 - totalWidth / 2;
        const barSpacing = totalWidth / (bars - 1);

        for (let i = 0; i < bars; i++) {
          const bx = startX + i * barSpacing;
          const h =
            Math.sin(time * 12 + i * 0.95) * 70 +
            Math.cos(time * 7 + i * 1.5) * 40 +
            85;

          faceCtx.save();
          faceCtx.shadowColor = glowColor;
          faceCtx.shadowBlur = 34;
          faceCtx.strokeStyle = eyeColor;
          faceCtx.lineWidth = 32;
          faceCtx.lineCap = 'round';
          faceCtx.beginPath();
          faceCtx.moveTo(bx, eyeY - h / 2);
          faceCtx.lineTo(bx, eyeY + h / 2);
          faceCtx.stroke();

          // Hot inner line
          faceCtx.strokeStyle = eyeCoreColor;
          faceCtx.lineWidth = 12;
          faceCtx.beginPath();
          faceCtx.moveTo(bx, eyeY - h / 2 + 6);
          faceCtx.lineTo(bx, eyeY + h / 2 - 6);
          faceCtx.stroke();
          faceCtx.restore();
        }
      } else if (currentState === 'thinking') {
        // ── THINKING STATE: 3 Glowing orange processing dots pulsing ──
        const dotCount = 3;
        const spacing = 135;
        const startDotX = 512 - ((dotCount - 1) * spacing) / 2;

        for (let i = 0; i < dotCount; i++) {
          const dx = startDotX + i * spacing;
          const wave = Math.sin(time * 8.5 - i * 1.2);
          const radius = 32 + Math.max(0, wave * 16);
          const alpha = 0.45 + Math.max(0, wave * 0.55);

          faceCtx.save();
          faceCtx.globalAlpha = alpha;
          faceCtx.shadowColor = glowColor;
          faceCtx.shadowBlur = 44;
          faceCtx.fillStyle = eyeColor;
          faceCtx.beginPath();
          faceCtx.arc(dx, eyeY, radius, 0, Math.PI * 2);
          faceCtx.fill();

          // Bright center
          faceCtx.fillStyle = eyeCoreColor;
          faceCtx.beginPath();
          faceCtx.arc(dx, eyeY, radius * 0.45, 0, Math.PI * 2);
          faceCtx.fill();
          faceCtx.restore();
        }
      } else if (currentState === 'speaking') {
        // ── SPEAKING STATE: Happy arched eyes + side acoustic soundwaves ──
        const eyeWiggle = Math.sin(time * 10) * 5;
        [leftEyeX, rightEyeX].forEach((x) => {
          drawCurvedEye(x, eyeY + eyeWiggle + 12, 88, 40, Math.PI * 1.16, Math.PI * 1.84);
        });

        // Left soundwave bracket
        const wavePulse = (Math.sin(time * 14) + 1) * 0.5;
        faceCtx.save();
        faceCtx.globalAlpha = 0.45 + wavePulse * 0.55;
        faceCtx.shadowColor = glowColor;
        faceCtx.shadowBlur = 26;
        faceCtx.strokeStyle = eyeColor;
        faceCtx.lineWidth = 20;
        faceCtx.lineCap = 'round';
        faceCtx.beginPath();
        faceCtx.arc(155, eyeY + 8, 62, Math.PI * 0.65, Math.PI * 1.35, false);
        faceCtx.stroke();

        // Right soundwave bracket
        faceCtx.beginPath();
        faceCtx.arc(869, eyeY + 8, 62, -Math.PI * 0.35, Math.PI * 0.35, false);
        faceCtx.stroke();
        faceCtx.restore();
      } else {
        // ── IDLE STATE: Calm smiling curved eyes with natural periodic blink ──
        const blinkCycle = time % 4.5;
        const isBlinking = blinkCycle > 4.15 && blinkCycle < 4.35;

        if (isBlinking) {
          [leftEyeX, rightEyeX].forEach((x) => {
            faceCtx.save();
            faceCtx.shadowColor = glowColor;
            faceCtx.shadowBlur = 28;
            faceCtx.strokeStyle = eyeColor;
            faceCtx.lineWidth = 36;
            faceCtx.lineCap = 'round';
            faceCtx.beginPath();
            faceCtx.moveTo(x - 74, eyeY + 18);
            faceCtx.lineTo(x + 74, eyeY + 18);
            faceCtx.stroke();

            faceCtx.strokeStyle = eyeCoreColor;
            faceCtx.lineWidth = 12;
            faceCtx.beginPath();
            faceCtx.moveTo(x - 66, eyeY + 18);
            faceCtx.lineTo(x + 66, eyeY + 18);
            faceCtx.stroke();
            faceCtx.restore();
          });
        } else {
          [leftEyeX, rightEyeX].forEach((x) => {
            drawCurvedEye(x, eyeY + 16, 92, 40, Math.PI * 1.15, Math.PI * 1.85);
          });
        }
      }

      faceTexture.needsUpdate = true;
    };

    // ── 8. Mouse / Touch Pointer Tracking for Organic 3D Head Look-At ──
    const handlePointerMove = (e) => {
      if (!enableLookAt) return;
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rawX = (e.clientX - centerX) / (window.innerWidth / 2);
      const rawY = (e.clientY - centerY) / (window.innerHeight / 2);

      mouseRef.current.targetX = THREE.MathUtils.clamp(rawX, -1, 1);
      mouseRef.current.targetY = THREE.MathUtils.clamp(rawY, -1, 1);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // ── 9. Animation & Render Loop ──
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const curState = stateRef.current;

      // Smooth Lerp for Mouse Look-At
      mouseRef.current.x = THREE.MathUtils.lerp(
        mouseRef.current.x,
        mouseRef.current.targetX,
        0.08
      );
      mouseRef.current.y = THREE.MathUtils.lerp(
        mouseRef.current.y,
        mouseRef.current.targetY,
        0.08
      );

      // Organic Floating Breathing Motion
      let floatAmp = 0.07;
      let floatFreq = 1.9;
      if (curState === 'hover') {
        floatAmp = 0.11;
        floatFreq = 3.0;
      } else if (curState === 'speaking') {
        floatAmp = 0.06;
        floatFreq = 3.8;
      }

      orbRoot.position.y = Math.sin(elapsedTime * floatFreq) * floatAmp;

      // Gentle Head Tilt & Yaw
      const idleYaw = Math.sin(elapsedTime * 0.8) * 0.05;
      const targetRotY = idleYaw + mouseRef.current.x * 0.35;
      const targetRotX = mouseRef.current.y * -0.22;

      headPivot.rotation.y = THREE.MathUtils.lerp(headPivot.rotation.y, targetRotY, 0.07);
      headPivot.rotation.x = THREE.MathUtils.lerp(headPivot.rotation.x, targetRotX, 0.07);
      headPivot.rotation.z = mouseRef.current.x * -0.06;

      // Illuminated Pulse for Ear Rings and Halo Light
      const pulse = Math.sin(elapsedTime * 4.2);
      const lightBoost = curState === 'hover' ? 1.45 : curState === 'listening' ? 1.25 : 1.0;
      orangeUpLight.intensity = (2.4 + pulse * 0.4) * lightBoost;
      ringMiddle.scale.setScalar(1.0 + pulse * 0.04);
      ringOuter.scale.setScalar(1.0 - pulse * 0.03);

      // Redraw Dynamic Face Texture
      drawFaceState(curState, elapsedTime);

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    // ── 10. Clean Disposal on Unmount ──
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      headGeom.dispose();
      bezelGeom.dispose();
      visorGeom.dispose();
      eyeDisplayGeom.dispose();
      foreheadBadgeGeom.dispose();
      chinVentGeom.dispose();
      chinSlotGeom.dispose();
      bandGeom.dispose();
      antennaStemGeom.dispose();
      antennaTipGeom.dispose();
      ringOuterGeom.dispose();
      ringMiddleGeom.dispose();
      ringInnerGeom.dispose();
      whiteArmorMat.dispose();
      darkGraphiteMat.dispose();
      visorGlassMat.dispose();
      neonOrangeBasicMat.dispose();
      neonOrangeInnerRingMat.dispose();
      foreheadBadgeMat.dispose();
      faceScreenMat.dispose();
      foreheadTexture.dispose();
      faceTexture.dispose();
    };
  }, [size, enableLookAt]);

  return (
    <div
      ref={mountRef}
      onClick={onClick}
      style={{
        width: size,
        height: size,
        pointerEvents: 'auto',
      }}
      className={`relative flex items-center justify-center select-none ${className}`}
    />
  );
}
