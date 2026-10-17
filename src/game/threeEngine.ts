/**
 * Three.js 3D Match Engine for PES & eFootball 2027 / PSP Simulator.
 * Features procedural turf, 3D stadium floodlights, crowd grandstands,
 * 22 player figures, ball physics, goal nets, and camera tracking.
 */

import * as THREE from 'three';
import {
  stepBallPhysics,
  calculatePassVector,
  calculateShotVector,
  checkGoalScored,
  calculateFC27PowerShotVector,
  evaluateTimedFinishing,
  calculateDribbleVelocity,
} from '../logic/physics.ts';
import type { BallState, GoalDimensions, Vector3D } from '../logic/physics.ts';
import { soundFX } from './soundFX.ts';

export interface Player3D {
  id: string;
  name: string;
  number: number;
  team: 'A' | 'B';
  isGK: boolean;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  rotationY: number;
  homePos: { x: number; z: number };
  mesh: THREE.Group;
  stamina: number;
  animTimer: number;
  playStyle?: string;
}

export interface MatchEngineCallbacks {
  onScoreUpdate: (scoreA: number, scoreB: number, scorer: string) => void;
  onTimeUpdate: (matchMinute: number) => void;
  onPowerChange: (powerFraction: number) => void;
  onStaminaChange: (staminaFraction: number) => void;
  onPossessionChange: (team: 'A' | 'B', playerName: string) => void;
  onCommentary: (text: string) => void;
  onRadarUpdate: (
    players: Array<{ x: number; z: number; team: 'A' | 'B'; isControlled: boolean }>,
    ball: { x: number; z: number }
  ) => void;
  onTimedFinishFeedback?: (grade: 'PERFECT_GREEN' | 'EARLY_YELLOW' | 'LATE_RED', label: string) => void;
  onPlayStyleTrigger?: (playStyleName: string) => void;
}

export class Match3DEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animFrameId: number | null = null;
  private clock: THREE.Clock;
  private isDestroyed: boolean = false;

  // Ball
  private ballMesh: THREE.Mesh;
  private ballShadow: THREE.Mesh;
  private ballState: BallState;
  private prevBallPos: Vector3D;

  // Players
  private players: Player3D[] = [];
  private controlledPlayerIndex: number = 0;
  private teamPossession: 'A' | 'B' = 'A';
  private playerChevron: THREE.Mesh;

  // Match state
  private scoreA: number = 0;
  private scoreB: number = 0;
  private matchSeconds: number = 0;
  private callbacks: MatchEngineCallbacks;
  private teamAColor: string;
  private teamBColor: string;

  // Controls input
  public inputVector: { x: number; z: number } = { x: 0, z: 0 };
  public isSprinting: boolean = false;
  public isControlledSprinting: boolean = false;
  public sprintMode: 'NONE' | 'CONTROLLED_R1' | 'FULL_BURST_R2' = 'NONE';
  public shotCharging: boolean = false;
  public shotChargePower: number = 0;
  public isPowerShotMode: boolean = false;
  public shotStartTime: number = 0;
  public timedFinishGrade: 'PERFECT_GREEN' | 'EARLY_YELLOW' | 'LATE_RED' | null = null;
  public cameraShakeTrauma: number = 0;
  public powerShotZoom: number = 0;

  // Camera settings
  public cameraMode: 'TV' | 'PSP' | 'PLAYER' | 'TACTICAL' = 'TV';

  // Pitch definitions
  private readonly PITCH_WIDTH = 48; // X: -24 to +24
  private readonly PITCH_LENGTH = 72; // Z: -36 to +36
  private readonly homeGoal: GoalDimensions = {
    minX: -3.66,
    maxX: 3.66,
    minY: 0,
    maxY: 2.44,
    goalZ: -36,
    depthZ: -2,
  };
  private readonly awayGoal: GoalDimensions = {
    minX: -3.66,
    maxX: 3.66,
    minY: 0,
    maxY: 2.44,
    goalZ: 36,
    depthZ: 2,
  };

  constructor(
    container: HTMLElement,
    teamAColor: string = '#C8102E', // e.g. Al Ahly Red
    teamBColor: string = '#FFFFFF', // e.g. Real Madrid White / Al Hilal Blue
    callbacks: MatchEngineCallbacks
  ) {
    this.container = container;
    this.teamAColor = teamAColor;
    this.teamBColor = teamBColor;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // 1. Scene & Camera setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a101a);
    this.scene.fog = new THREE.FogExp2(0x0a101a, 0.008);

    const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.5, 300);
    this.camera.position.set(0, 24, 28);
    this.camera.lookAt(0, 0, 0);

    // 2. Renderer setup
    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    this.renderer = new THREE.WebGLRenderer({
      antialias: !isHeadless,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(
      isHeadless ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !isHeadless;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 3. Lighting Rig
    this.setupLighting();

    // 4. Stadium & Pitch
    this.createPitchAndStadium();

    // 5. Goals
    this.createGoalNets();

    // 6. Ball
    const ballSetup = this.createBall();
    this.ballMesh = ballSetup.mesh;
    this.ballShadow = ballSetup.shadow;
    this.ballState = {
      position: { x: 0, y: 0.22, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      inAir: false,
    };
    this.prevBallPos = { ...this.ballState.position };

    // 7. Player Indicator Chevron
    this.playerChevron = this.createChevron();
    this.scene.add(this.playerChevron);

    // 8. Spawn 22 Players
    this.spawnPlayers();

    // 9. Resize listener
    window.addEventListener('resize', this.onResize);

    // 10. Start simulation loop
    this.tick = this.tick.bind(this);
    this.animFrameId = requestAnimationFrame(this.tick);

    soundFX.startAmbientStadium();
    this.callbacks.onCommentary('Welcome to the match! Kick-off in the 2027 arena.');
  }

  private setupLighting() {
    // Ambient / Hemisphere fill
    const hemiLight = new THREE.HemisphereLight(0x90b0e0, 0x1f2e18, 0.65);
    this.scene.add(hemiLight);

    // 4 Floodlight corner towers
    const floodlightPositions = [
      { x: -35, y: 22, z: -45 },
      { x: 35, y: 22, z: -45 },
      { x: -35, y: 22, z: 45 },
      { x: 35, y: 22, z: 45 },
    ];

    floodlightPositions.forEach((pos, idx) => {
      // Physical pylon mast
      const pylonGeo = new THREE.CylinderGeometry(0.3, 0.6, 22, 6);
      const pylonMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.8,
        roughness: 0.3,
      });
      const pylon = new THREE.Mesh(pylonGeo, pylonMat);
      pylon.position.set(pos.x, 11, pos.z);
      this.scene.add(pylon);

      // Light bank at top
      const bankGeo = new THREE.BoxGeometry(4, 2, 1);
      const bankMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const bank = new THREE.Mesh(bankGeo, bankMat);
      bank.position.set(pos.x, 22, pos.z);
      bank.lookAt(0, 0, 0);
      this.scene.add(bank);

      // Spot light
      const spot = new THREE.SpotLight(0xf8fafc, 2.4, 110, Math.PI / 4, 0.4, 1.2);
      spot.position.set(pos.x, 22, pos.z);
      spot.target.position.set(0, 0, 0);
      if (idx === 0) {
        spot.castShadow = true;
        spot.shadow.mapSize.width = 1024;
        spot.shadow.mapSize.height = 1024;
        spot.shadow.bias = -0.0005;
      }
      this.scene.add(spot);
      this.scene.add(spot.target);
    });
  }

  private createPitchAndStadium() {
    // 1. Procedural Turf Canvas Texture with mowing patterns & pitch markings
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1536;
    const ctx = canvas.getContext('2d')!;

    // Grass strips
    const stripeCount = 18;
    const stripeHeight = canvas.height / stripeCount;
    for (let i = 0; i < stripeCount; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#1b4d24' : '#235e2c';
      ctx.fillRect(0, i * stripeHeight, canvas.width, stripeHeight);
    }

    // White Pitch Lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 7;
    ctx.lineCap = 'square';

    // Touchlines
    const padX = 50;
    const padY = 50;
    const pitchW = canvas.width - padX * 2;
    const pitchH = canvas.height - padY * 2;
    ctx.strokeRect(padX, padY, pitchW, pitchH);

    // Halfway line
    const midY = canvas.height / 2;
    ctx.beginPath();
    ctx.moveTo(padX, midY);
    ctx.lineTo(canvas.width - padX, midY);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, midY, 110, 0, Math.PI * 2);
    ctx.stroke();
    // Center spot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, midY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Top Penalty Area (Away)
    const penAreaW = pitchW * 0.58;
    const penAreaH = pitchH * 0.17;
    const penX = (canvas.width - penAreaW) / 2;
    ctx.strokeRect(penX, padY, penAreaW, penAreaH);
    // Goal area top
    const goalAreaW = pitchW * 0.28;
    const goalAreaH = pitchH * 0.065;
    ctx.strokeRect((canvas.width - goalAreaW) / 2, padY, goalAreaW, goalAreaH);

    // Bottom Penalty Area (Home)
    ctx.strokeRect(penX, canvas.height - padY - penAreaH, penAreaW, penAreaH);
    // Goal area bottom
    ctx.strokeRect(
      (canvas.width - goalAreaW) / 2,
      canvas.height - padY - goalAreaH,
      goalAreaW,
      goalAreaH
    );

    const turfTexture = new THREE.CanvasTexture(canvas);
    turfTexture.colorSpace = THREE.SRGBColorSpace;
    turfTexture.anisotropy = 4;

    const pitchGeo = new THREE.PlaneGeometry(this.PITCH_WIDTH, this.PITCH_LENGTH);
    const pitchMat = new THREE.MeshStandardMaterial({
      map: turfTexture,
      roughness: 0.85,
      metalness: 0.1,
    });
    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.rotation.x = -Math.PI / 2;
    pitch.receiveShadow = true;
    this.scene.add(pitch);

    // Extended outer grass run-off
    const outerGeo = new THREE.PlaneGeometry(80, 110);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x143b1c,
      roughness: 0.95,
      metalness: 0.05,
    });
    const outerPitch = new THREE.Mesh(outerGeo, outerMat);
    outerPitch.rotation.x = -Math.PI / 2;
    outerPitch.position.y = -0.02;
    this.scene.add(outerPitch);

    // LED Ad Boards around pitch perimeter
    this.createAdBoards();

    // Grandstand crowd stadium
    this.createGrandstands();
  }

  private createAdBoards() {
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x1e293b,
      emissiveIntensity: 0.4,
      roughness: 0.4,
    });

    const createSegment = (w: number, x: number, z: number, rotY: number) => {
      const geo = new THREE.BoxGeometry(w, 0.9, 0.2);
      const mesh = new THREE.Mesh(geo, boardMat);
      mesh.position.set(x, 0.45, z);
      mesh.rotation.y = rotY;
      this.scene.add(mesh);
    };

    // Sidelines
    createSegment(this.PITCH_LENGTH + 2, -this.PITCH_WIDTH / 2 - 2, 0, Math.PI / 2);
    createSegment(this.PITCH_LENGTH + 2, this.PITCH_WIDTH / 2 + 2, 0, -Math.PI / 2);
    // Behind goals (with opening for goal net)
    createSegment(18, -14, -this.PITCH_LENGTH / 2 - 2, 0);
    createSegment(18, 14, -this.PITCH_LENGTH / 2 - 2, 0);
    createSegment(18, -14, this.PITCH_LENGTH / 2 + 2, 0);
    createSegment(18, 14, this.PITCH_LENGTH / 2 + 2, 0);
  }

  private createGrandstands() {
    // 4 Grandstands (North, South, East, West)
    const standMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
    });
    const crowdMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.9,
    });

    // Lateral stands
    [-34, 34].forEach((xPos) => {
      const tierGeo = new THREE.BoxGeometry(14, 12, this.PITCH_LENGTH + 20);
      const tier = new THREE.Mesh(tierGeo, standMat);
      tier.position.set(xPos, 5, 0);
      tier.rotation.z = xPos < 0 ? 0.35 : -0.35;
      this.scene.add(tier);

      // Crowd surface layer
      const crowdGeo = new THREE.PlaneGeometry(12, this.PITCH_LENGTH + 18);
      const crowd = new THREE.Mesh(crowdGeo, crowdMat);
      crowd.position.set(xPos < 0 ? xPos + 2 : xPos - 2, 6.5, 0);
      crowd.rotation.x = -Math.PI / 2;
      crowd.rotation.y = xPos < 0 ? 0.35 : -0.35;
      this.scene.add(crowd);
    });

    // Behind-the-goal stands
    [-46, 46].forEach((zPos) => {
      const tierGeo = new THREE.BoxGeometry(this.PITCH_WIDTH + 14, 12, 14);
      const tier = new THREE.Mesh(tierGeo, standMat);
      tier.position.set(0, 5, zPos);
      tier.rotation.x = zPos < 0 ? -0.35 : 0.35;
      this.scene.add(tier);
    });
  }

  private createGoalNets() {
    const postMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.4,
    });
    const netMat = new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });

    const buildGoal = (zPos: number, isAway: boolean) => {
      const group = new THREE.Group();

      // Uprights
      const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.44, 12);
      const postL = new THREE.Mesh(postGeo, postMat);
      postL.position.set(-3.66, 1.22, 0);
      const postR = new THREE.Mesh(postGeo, postMat);
      postR.position.set(3.66, 1.22, 0);
      group.add(postL);
      group.add(postR);

      // Crossbar
      const barGeo = new THREE.CylinderGeometry(0.08, 0.08, 7.32, 12);
      const crossbar = new THREE.Mesh(barGeo, postMat);
      crossbar.rotation.z = Math.PI / 2;
      crossbar.position.set(0, 2.44, 0);
      group.add(crossbar);

      // Net box
      const netBoxGeo = new THREE.BoxGeometry(7.32, 2.44, 2.0);
      const net = new THREE.Mesh(netBoxGeo, netMat);
      net.position.set(0, 1.22, isAway ? 1.0 : -1.0);
      group.add(net);

      group.position.set(0, 0, zPos);
      this.scene.add(group);
    };

    buildGoal(this.homeGoal.goalZ, false);
    buildGoal(this.awayGoal.goalZ, true);
  }

  private createBall() {
    // Procedural Official FIFA 2026 Triunfo Ball texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Crisp white leather
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 256);

      // Red Adidas panel (Mexico motif)
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(100, 128, 62, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(80, 100); ctx.lineTo(100, 150);
      ctx.moveTo(95, 95); ctx.lineTo(115, 145);
      ctx.moveTo(110, 90); ctx.lineTo(130, 140);
      ctx.stroke();

      // Royal Blue FIFA 2026 capsule panel
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(220, 60, 80, 136, [36]);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('26', 260, 125);
      ctx.font = '900 15px sans-serif';
      ctx.fillText('FIFA', 260, 160);

      // Sky Blue Star panel (USA motif)
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(400, 90, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0369a1';
      ctx.font = '900 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★', 400, 102);

      // Emerald Green panel (Triunfo 14)
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(420, 190, 46, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TRIUNFO 14', 420, 194);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const ballGeo = new THREE.SphereGeometry(0.22, 24, 24);
    const ballMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.35,
      metalness: 0.1,
    });
    const ballMesh = new THREE.Mesh(ballGeo, ballMat);
    ballMesh.castShadow = true;
    this.scene.add(ballMesh);

    // Contact shadow
    const shadowGeo = new THREE.CircleGeometry(0.24, 16);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x050d06,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const ballShadow = new THREE.Mesh(shadowGeo, shadowMat);
    ballShadow.rotation.x = -Math.PI / 2;
    ballShadow.position.y = 0.015;
    this.scene.add(ballShadow);

    return { mesh: ballMesh, shadow: ballShadow };
  }

  private createChevron(): THREE.Mesh {
    const geo = new THREE.ConeGeometry(0.25, 0.45, 4);
    const mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const cone = new THREE.Mesh(geo, mat);
    cone.rotation.x = Math.PI; // pointing downwards
    cone.position.set(0, 2.4, 0);
    return cone;
  }

  /**
   * Spawns 22 procedural 3D player models (11 vs 11).
   */
  private spawnPlayers() {
    // 4-3-3 Home Team (A)
    const teamAFormations = [
      { name: 'Goalkeeper', num: 1, pos: { x: 0, z: -32 }, isGK: true },
      { name: 'Right Back', num: 2, pos: { x: 14, z: -22 }, isGK: false },
      { name: 'Center Back L', num: 4, pos: { x: -6, z: -24 }, isGK: false },
      { name: 'Center Back R', num: 5, pos: { x: 6, z: -24 }, isGK: false },
      { name: 'Left Back', num: 3, pos: { x: -14, z: -22 }, isGK: false },
      { name: 'Def Mid', num: 6, pos: { x: 0, z: -14 }, isGK: false },
      { name: 'Cen Mid R', num: 8, pos: { x: 8, z: -8 }, isGK: false },
      { name: 'Cen Mid L', num: 10, pos: { x: -8, z: -8 }, isGK: false },
      { name: 'Right Wing', num: 7, pos: { x: 16, z: 2 }, isGK: false },
      { name: 'Striker', num: 9, pos: { x: 0, z: 4 }, isGK: false },
      { name: 'Left Wing', num: 11, pos: { x: -16, z: 2 }, isGK: false },
    ];

    // 4-3-3 Away Team (B)
    const teamBFormations = [
      { name: 'Keeper B', num: 1, pos: { x: 0, z: 32 }, isGK: true },
      { name: 'Right Back B', num: 2, pos: { x: -14, z: 22 }, isGK: false },
      { name: 'Center Back B1', num: 4, pos: { x: -6, z: 24 }, isGK: false },
      { name: 'Center Back B2', num: 5, pos: { x: 6, z: 24 }, isGK: false },
      { name: 'Left Back B', num: 3, pos: { x: 14, z: 22 }, isGK: false },
      { name: 'Def Mid B', num: 6, pos: { x: 0, z: 14 }, isGK: false },
      { name: 'Mid B1', num: 8, pos: { x: -8, z: 8 }, isGK: false },
      { name: 'Mid B2', num: 10, pos: { x: 8, z: 8 }, isGK: false },
      { name: 'Right Wing B', num: 7, pos: { x: -16, z: -2 }, isGK: false },
      { name: 'Striker B', num: 9, pos: { x: 0, z: -4 }, isGK: false },
      { name: 'Left Wing B', num: 11, pos: { x: 16, z: -2 }, isGK: false },
    ];

    const teamAMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.teamAColor),
      roughness: 0.6,
    });
    const teamBMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.teamBColor),
      roughness: 0.6,
    });
    const gkAMat = new THREE.MeshStandardMaterial({ color: 0x10b981 });
    const gkBMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd4a373 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1c1917 });
    const bootsMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

    const createPlayerFigure = (
      name: string,
      num: number,
      team: 'A' | 'B',
      isGK: boolean,
      homePos: { x: number; z: number }
    ): Player3D => {
      const group = new THREE.Group();

      // Torso / Jersey
      const torsoGeo = new THREE.CylinderGeometry(0.32, 0.28, 0.72, 10);
      const jerseyMat = isGK
        ? team === 'A'
          ? gkAMat
          : gkBMat
        : team === 'A'
        ? teamAMat
        : teamBMat;
      const torso = new THREE.Mesh(torsoGeo, jerseyMat);
      torso.position.y = 1.15;
      torso.castShadow = true;
      group.add(torso);

      // Head
      const headGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const head = new THREE.Mesh(headGeo, skinMat);
      head.position.y = 1.68;
      group.add(head);

      // Hair
      const hairGeo = new THREE.SphereGeometry(0.19, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      const hair = new THREE.Mesh(hairGeo, hairMat);
      hair.position.y = 1.74;
      group.add(hair);

      // Legs / Shorts
      const legGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.75, 8);
      const legL = new THREE.Mesh(legGeo, jerseyMat);
      legL.position.set(-0.16, 0.42, 0);
      legL.name = 'legL';
      const legR = new THREE.Mesh(legGeo, jerseyMat);
      legR.position.set(0.16, 0.42, 0);
      legR.name = 'legR';
      group.add(legL);
      group.add(legR);

      // Boots
      const bootGeo = new THREE.BoxGeometry(0.12, 0.1, 0.26);
      const bootL = new THREE.Mesh(bootGeo, bootsMat);
      bootL.position.set(-0.16, 0.05, 0.04);
      bootL.name = 'bootL';
      const bootR = new THREE.Mesh(bootGeo, bootsMat);
      bootR.position.set(0.16, 0.05, 0.04);
      bootR.name = 'bootR';
      group.add(bootL);
      group.add(bootR);

      group.position.set(homePos.x, 0, homePos.z);
      group.rotation.y = team === 'A' ? 0 : Math.PI;
      this.scene.add(group);

      return {
        id: `P_${team}_${num}`,
        name,
        number: num,
        team,
        isGK,
        position: { x: homePos.x, y: 0, z: homePos.z },
        velocity: { x: 0, y: 0, z: 0 },
        rotationY: team === 'A' ? 0 : Math.PI,
        homePos,
        mesh: group,
        stamina: 100,
        animTimer: Math.random() * 10,
      };
    };

    // Spawn Team A
    teamAFormations.forEach((p) => {
      this.players.push(createPlayerFigure(p.name, p.num, 'A', p.isGK, p.pos));
    });

    // Spawn Team B
    teamBFormations.forEach((p) => {
      this.players.push(createPlayerFigure(p.name, p.num, 'B', p.isGK, p.pos));
    });

    // Controlled player defaults to Striker (number 9 of Team A, index 9)
    this.controlledPlayerIndex = 9;
  }

  /**
   * Action: Pass (✕ Button)
   */
  public triggerPass() {
    const userPlayer = this.players[this.controlledPlayerIndex];
    if (!userPlayer) return;

    // Check if user is close enough to ball
    const distToBall = Math.hypot(
      userPlayer.position.x - this.ballState.position.x,
      userPlayer.position.z - this.ballState.position.z
    );

    if (distToBall > 3.0) return; // not close enough

    // Find best teammate in input direction
    const bestTeammate = this.findBestTeammate(userPlayer, false);
    if (!bestTeammate) return;

    const passVel = calculatePassVector(
      this.ballState.position,
      bestTeammate.position,
      false,
      1.1
    );

    this.ballState.velocity = passVel;
    soundFX.playKick(0.85);

    // Switch controlled player to receiving teammate
    const newIdx = this.players.indexOf(bestTeammate);
    if (newIdx !== -1) {
      setTimeout(() => {
        this.controlledPlayerIndex = newIdx;
        this.callbacks.onPossessionChange('A', bestTeammate.name);
      }, 250);
    }
  }

  /**
   * Action: Through Ball (△ Button)
   */
  public triggerThroughBall() {
    const userPlayer = this.players[this.controlledPlayerIndex];
    if (!userPlayer) return;

    const distToBall = Math.hypot(
      userPlayer.position.x - this.ballState.position.x,
      userPlayer.position.z - this.ballState.position.z
    );

    if (distToBall > 3.0) return;

    const bestTeammate = this.findBestTeammate(userPlayer, true);
    if (!bestTeammate) return;

    // Target ahead into space
    const targetInSpace = {
      x: bestTeammate.position.x * 0.8,
      y: 0,
      z: bestTeammate.position.z + 10,
    };

    const throughVel = calculatePassVector(
      this.ballState.position,
      targetInSpace,
      true,
      1.25
    );

    this.ballState.velocity = throughVel;
    soundFX.playKick(1.0);
    this.callbacks.onCommentary('Splendid vision with the through ball!');

    const newIdx = this.players.indexOf(bestTeammate);
    if (newIdx !== -1) {
      setTimeout(() => {
        this.controlledPlayerIndex = newIdx;
        this.callbacks.onPossessionChange('A', bestTeammate.name);
      }, 300);
    }
  }

  /**
   * Action: Lob Pass / Cross (Square ▢ in FC 27 standard)
   */
  public triggerLobCross() {
    const userPlayer = this.players[this.controlledPlayerIndex];
    if (!userPlayer) return;

    const distToBall = Math.hypot(
      userPlayer.position.x - this.ballState.position.x,
      userPlayer.position.z - this.ballState.position.z
    );
    if (distToBall > 3.0) return;

    // Whipped cross target towards far post
    const target = {
      x: userPlayer.position.x > 0 ? -12 : 12,
      y: 0,
      z: this.awayGoal.goalZ - 8,
    };

    const crossVel = calculatePassVector(this.ballState.position, target, true, 1.4);
    crossVel.y = 5.2; // High looping whip

    this.ballState.velocity = crossVel;
    soundFX.playKick(1.1);
    this.callbacks.onPlayStyleTrigger?.('Whipped Pass+');
    this.callbacks.onCommentary('Whipped delivery floated into the danger area!');
  }

  /**
   * Action: Start Charging Shot (with optional FC 27 Power Shot modifier)
   */
  public startChargeShot(isPowerShot: boolean = false) {
    this.shotCharging = true;
    this.isPowerShotMode = isPowerShot;
    this.shotChargePower = 0.15;
    this.shotStartTime = performance.now() / 1000;
    this.timedFinishGrade = null;

    if (isPowerShot) {
      this.callbacks.onPlayStyleTrigger?.('Power Shot+');
      this.callbacks.onCommentary('Winding up for the HyperMotion Power Shot!');
    }
  }

  /**
   * Action: Timed Finishing 2nd Tap (FC 27 mechanic)
   */
  public triggerTimedFinishingTap() {
    if (!this.shotCharging) return;
    const elapsed = performance.now() / 1000 - this.shotStartTime;
    const result = evaluateTimedFinishing(elapsed);
    this.timedFinishGrade = result.grade;
    this.callbacks.onTimedFinishFeedback?.(result.grade, result.label);

    if (result.grade === 'PERFECT_GREEN') {
      soundFX.playGreenTimedFinish();
      this.callbacks.onCommentary('PERFECT GREEN TIMING! Superb contact on the release!');
    }
  }

  /**
   * Action: Release Shot (▢ or ◯)
   */
  public releaseShot() {
    if (!this.shotCharging) return;
    this.shotCharging = false;

    const userPlayer = this.players[this.controlledPlayerIndex];
    if (!userPlayer) return;

    const distToBall = Math.hypot(
      userPlayer.position.x - this.ballState.position.x,
      userPlayer.position.z - this.ballState.position.z
    );

    if (distToBall > 3.0) {
      this.shotChargePower = 0;
      this.isPowerShotMode = false;
      this.callbacks.onPowerChange(0);
      return;
    }

    // Aim at away goal corners
    const goalCenter = {
      x: (Math.random() - 0.5) * 5.6,
      y: 1.2 + this.shotChargePower * 1.0,
      z: this.awayGoal.goalZ,
    };

    let shotVel: Vector3D;
    const isGreen = this.timedFinishGrade === 'PERFECT_GREEN';

    if (this.isPowerShotMode) {
      shotVel = calculateFC27PowerShotVector(
        this.ballState.position,
        goalCenter,
        this.shotChargePower,
        isGreen
      );
      soundFX.playPowerShot();
      this.cameraShakeTrauma = 0.55;
      this.callbacks.onCommentary('WHAT A ROCKET! Tremendous Power Shot strike!');
    } else {
      shotVel = calculateShotVector(
        this.ballState.position,
        goalCenter,
        this.shotChargePower * (isGreen ? 1.25 : 1.0)
      );
      soundFX.playKick(1.0 + this.shotChargePower * 0.5);

      if (this.shotChargePower > 0.6) {
        this.callbacks.onCommentary('Fierce strike towards the top corner!');
      } else {
        this.callbacks.onCommentary('Takes the shot towards goal!');
      }
    }

    this.ballState.velocity = shotVel;
    this.shotChargePower = 0;
    this.isPowerShotMode = false;
    this.callbacks.onPowerChange(0);
  }

  /**
   * Action: Finesse Shot (R1 + Shoot)
   */
  public triggerFinesseShot() {
    const userPlayer = this.players[this.controlledPlayerIndex];
    if (!userPlayer) return;

    const distToBall = Math.hypot(
      userPlayer.position.x - this.ballState.position.x,
      userPlayer.position.z - this.ballState.position.z
    );
    if (distToBall > 3.0) return;

    // Top-corner curling trajectory
    const cornerGoal = {
      x: userPlayer.position.x > 0 ? -3.2 : 3.2,
      y: 2.1,
      z: this.awayGoal.goalZ,
    };

    const shotVel = calculateShotVector(
      this.ballState.position,
      cornerGoal,
      0.65,
      userPlayer.position.x > 0 ? 0.8 : -0.8
    );

    this.ballState.velocity = shotVel;
    soundFX.playKick(0.9);
    this.callbacks.onPlayStyleTrigger?.('Finesse Shot+');
    this.callbacks.onCommentary('Curling finesse strike looking for the top corner!');
  }

  /**
   * Action: Switch Player (L1 Button)
   */
  public switchControlledPlayer() {
    const candidates = this.players.filter(
      (p, idx) => p.team === 'A' && !p.isGK && idx !== this.controlledPlayerIndex
    );

    let nearest = candidates[0];
    let minDist = 999;
    candidates.forEach((c) => {
      const d = Math.hypot(
        c.position.x - this.ballState.position.x,
        c.position.z - this.ballState.position.z
      );
      if (d < minDist) {
        minDist = d;
        nearest = c;
      }
    });

    if (nearest) {
      this.controlledPlayerIndex = this.players.indexOf(nearest);
      this.callbacks.onPossessionChange('A', nearest.name);
    }
  }

  private findBestTeammate(fromPlayer: Player3D, forwardBias: boolean = false): Player3D | null {
    const teammates = this.players.filter(
      (p) => p.team === fromPlayer.team && p.id !== fromPlayer.id && !p.isGK
    );

    let best: Player3D | null = null;
    let bestScore = -9999;

    teammates.forEach((t) => {
      const dx = t.position.x - fromPlayer.position.x;
      const dz = t.position.z - fromPlayer.position.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 3) return; // too close

      // Alignment with input vector or forward direction
      const forwardScore = forwardBias ? dz * 2.0 : dz * 0.8;
      const inputAlign =
        (this.inputVector.x * (dx / dist) + this.inputVector.z * (dz / dist)) * 25;

      const score = inputAlign + forwardScore - dist * 0.4;
      if (score > bestScore) {
        bestScore = score;
        best = t;
      }
    });

    return best || teammates[0] || null;
  }

  /**
   * Main simulation frame tick
   */
  private tick() {
    if (this.isDestroyed) return;

    const rawDt = this.clock.getDelta();
    const dt = Math.min(rawDt, 0.05);

    // Update match time
    this.matchSeconds += dt * 8; // Accelerated game clock: ~6 minutes match
    const currentMinute = Math.min(90, Math.floor(this.matchSeconds / 60));
    this.callbacks.onTimeUpdate(currentMinute);

    // Charge shot if held
    if (this.shotCharging) {
      this.shotChargePower = Math.min(1.0, this.shotChargePower + dt * 1.5);
      this.callbacks.onPowerChange(this.shotChargePower);
    }

    // Step Ball Physics
    this.prevBallPos = { ...this.ballState.position };
    this.ballState = stepBallPhysics(this.ballState, dt);

    // Sync 3D ball mesh & shadow
    this.ballMesh.position.set(
      this.ballState.position.x,
      this.ballState.position.y,
      this.ballState.position.z
    );
    this.ballShadow.position.set(
      this.ballState.position.x,
      0.015,
      this.ballState.position.z
    );

    // Ball rotation
    this.ballMesh.rotation.x += this.ballState.velocity.z * dt * 2.5;
    this.ballMesh.rotation.z -= this.ballState.velocity.x * dt * 2.5;

    // Check goal scoring
    this.checkGoals();

    // Update Players AI & Movements
    this.updatePlayers(dt);

    // Update Chevron Position
    const activePlayer = this.players[this.controlledPlayerIndex];
    if (activePlayer) {
      this.playerChevron.position.set(
        activePlayer.position.x,
        activePlayer.position.y + 2.3,
        activePlayer.position.z
      );
    }

    // Update Camera
    this.updateCamera(dt);

    // Render
    this.renderer.render(this.scene, this.camera);

    // Send radar update
    this.callbacks.onRadarUpdate(
      this.players.map((p, idx) => ({
        x: p.position.x,
        z: p.position.z,
        team: p.team,
        isControlled: idx === this.controlledPlayerIndex,
      })),
      { x: this.ballState.position.x, z: this.ballState.position.z }
    );

    this.animFrameId = requestAnimationFrame(this.tick);
  }

  private updatePlayers(dt: number) {
    const userPlayer = this.players[this.controlledPlayerIndex];

    this.players.forEach((p, idx) => {
      p.animTimer += dt * 8;
      const isUser = idx === this.controlledPlayerIndex;

      if (isUser) {
        // FC 27 Dribble and Sprint movement
        const currentSprintMode =
          this.sprintMode !== 'NONE'
            ? this.sprintMode
            : this.isControlledSprinting
            ? 'CONTROLLED_R1'
            : this.isSprinting
            ? 'FULL_BURST_R2'
            : 'NONE';

        const dribble = calculateDribbleVelocity(this.inputVector, currentSprintMode);

        if (currentSprintMode === 'FULL_BURST_R2' && (this.inputVector.x !== 0 || this.inputVector.z !== 0)) {
          p.stamina = Math.max(0, p.stamina - dt * 15);
          this.callbacks.onStaminaChange(p.stamina / 100);
        } else if (currentSprintMode === 'CONTROLLED_R1' && (this.inputVector.x !== 0 || this.inputVector.z !== 0)) {
          p.stamina = Math.max(0, p.stamina - dt * 6);
          this.callbacks.onStaminaChange(p.stamina / 100);
          this.callbacks.onPlayStyleTrigger?.('Technical+');
        } else if (p.stamina < 100) {
          p.stamina = Math.min(100, p.stamina + dt * 7);
          this.callbacks.onStaminaChange(p.stamina / 100);
        }

        p.velocity.x = dribble.velocity.x;
        p.velocity.z = dribble.velocity.z;

        if (this.inputVector.x !== 0 || this.inputVector.z !== 0) {
          p.rotationY = Math.atan2(this.inputVector.x, this.inputVector.z);
        }

        // Dribble ball if close
        const dBall = Math.hypot(
          p.position.x - this.ballState.position.x,
          p.position.z - this.ballState.position.z
        );
        if (dBall < dribble.touchDistance + 0.3 && !this.ballState.inAir) {
          const pushX = Math.sin(p.rotationY) * dribble.touchDistance;
          const pushZ = Math.cos(p.rotationY) * dribble.touchDistance;
          this.ballState.position.x = p.position.x + pushX;
          this.ballState.position.z = p.position.z + pushZ;
          this.ballState.velocity.x = p.velocity.x * 0.95;
          this.ballState.velocity.z = p.velocity.z * 0.95;
        }
      } else {
        // AI Behavior for Teammates & Opponents
        this.updateAIPlayer(p, dt);
      }

      // Apply velocity and clamp to pitch boundaries
      p.position.x += p.velocity.x * dt;
      p.position.z += p.velocity.z * dt;

      p.position.x = Math.max(-23, Math.min(23, p.position.x));
      p.position.z = Math.max(-35, Math.min(35, p.position.z));

      // Update mesh transforms
      p.mesh.position.set(p.position.x, 0, p.position.z);
      p.mesh.rotation.y = p.rotationY;

      // Leg running animation
      const isMoving = Math.hypot(p.velocity.x, p.velocity.z) > 0.4;
      const legL = p.mesh.getObjectByName('legL');
      const legR = p.mesh.getObjectByName('legR');
      if (legL && legR) {
        if (isMoving) {
          legL.rotation.x = Math.sin(p.animTimer) * 0.55;
          legR.rotation.x = -Math.sin(p.animTimer) * 0.55;
        } else {
          legL.rotation.x = 0;
          legR.rotation.x = 0;
        }
      }
    });
  }

  private updateAIPlayer(p: Player3D, dt: number) {
    if (p.isGK) {
      // Goalkeeper AI: stays on goal line, tracks ball X, dives when shot comes
      const targetZ = p.team === 'A' ? -34 : 34;
      const targetX = Math.max(-3.2, Math.min(3.2, this.ballState.position.x * 0.5));
      p.velocity.x = (targetX - p.position.x) * 3.5;
      p.velocity.z = (targetZ - p.position.z) * 2.0;
      p.rotationY = p.team === 'A' ? 0 : Math.PI;

      // Save deflection
      const distToBall = Math.hypot(
        p.position.x - this.ballState.position.x,
        p.position.z - this.ballState.position.z
      );
      if (distToBall < 1.6 && Math.abs(this.ballState.velocity.z) > 10) {
        // Parried save!
        this.ballState.velocity.x = (Math.random() - 0.5) * 12;
        this.ballState.velocity.z = -this.ballState.velocity.z * 0.4;
        soundFX.playKick(0.7);
        this.callbacks.onCommentary(`Sensational reflex save by ${p.name}!`);
      }
      return;
    }

    // Outfield AI
    const distToBall = Math.hypot(
      p.position.x - this.ballState.position.x,
      p.position.z - this.ballState.position.z
    );

    if (p.team === 'B') {
      // Opponent AI
      if (distToBall < 7.0) {
        // Close opponent closes down the ball
        const dirX = (this.ballState.position.x - p.position.x) / distToBall;
        const dirZ = (this.ballState.position.z - p.position.z) / distToBall;
        p.velocity.x = dirX * 4.6;
        p.velocity.z = dirZ * 4.6;
        p.rotationY = Math.atan2(dirX, dirZ);

        // Tackle attempt
        if (distToBall < 0.95 && Math.random() < 0.04) {
          this.ballState.velocity.x = (Math.random() - 0.5) * 10;
          this.ballState.velocity.z = (Math.random() - 0.5) * 10;
          soundFX.playKick(0.7);
          this.callbacks.onCommentary('Strong interception in the midfield!');
        }
      } else {
        // Return to tactical zone
        const targetX = p.homePos.x + (this.ballState.position.x - p.homePos.x) * 0.25;
        const targetZ = p.homePos.z + (this.ballState.position.z - p.homePos.z) * 0.25;
        p.velocity.x = (targetX - p.position.x) * 1.5;
        p.velocity.z = (targetZ - p.position.z) * 1.5;
        p.rotationY = Math.atan2(p.velocity.x, p.velocity.z);
      }
    } else {
      // Friendly Teammate AI: dynamic support runs
      const targetX = p.homePos.x + (this.ballState.position.x - p.homePos.x) * 0.35;
      const targetZ = p.homePos.z + (this.ballState.position.z - p.homePos.z) * 0.35;
      p.velocity.x = (targetX - p.position.x) * 2.0;
      p.velocity.z = (targetZ - p.position.z) * 2.0;
      p.rotationY = Math.atan2(p.velocity.x, p.velocity.z);
    }
  }

  private checkGoals() {
    // Check Away Goal (Score for Team A)
    if (checkGoalScored(this.ballState.position, this.prevBallPos, this.awayGoal)) {
      this.scoreA++;
      soundFX.playGoalScore();
      const scorer = this.players[this.controlledPlayerIndex]?.name || 'Al Ahly Striker';
      this.callbacks.onScoreUpdate(this.scoreA, this.scoreB, scorer);
      this.callbacks.onCommentary(`GOOOAL! Sensational finish by ${scorer}! What a strike!`);
      this.resetKickOff('B');
    }

    // Check Home Goal (Score for Team B)
    if (checkGoalScored(this.ballState.position, this.prevBallPos, this.homeGoal)) {
      this.scoreB++;
      soundFX.playGoalScore();
      this.callbacks.onScoreUpdate(this.scoreA, this.scoreB, 'Opponent Winger');
      this.callbacks.onCommentary('Goal! An emphatic finish into the bottom corner!');
      this.resetKickOff('A');
    }
  }

  private resetKickOff(receivingTeam: 'A' | 'B') {
    this.ballState = {
      position: { x: 0, y: 0.22, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      inAir: false,
    };
    this.controlledPlayerIndex = receivingTeam === 'A' ? 9 : 9;
  }

  private updateCamera(dt: number) {
    const userPlayer = this.players[this.controlledPlayerIndex];
    if (!userPlayer) return;

    let targetCamPos = { x: 0, y: 22, z: 28 };
    let lookTarget = { x: this.ballState.position.x * 0.6, y: 0.5, z: this.ballState.position.z * 0.6 };

    switch (this.cameraMode) {
      case 'TV':
        // TV Broadcast: tracks ball horizontally and zooms subtly
        targetCamPos = {
          x: this.ballState.position.x * 0.45,
          y: 20 + Math.abs(this.ballState.position.z) * 0.12,
          z: this.ballState.position.z * 0.35 + 26,
        };
        break;
      case 'PSP':
        // Classic PSP elevated handheld camera
        targetCamPos = {
          x: this.ballState.position.x * 0.6,
          y: 16,
          z: this.ballState.position.z * 0.5 + 20,
        };
        break;
      case 'PLAYER':
        // Behind striker
        targetCamPos = {
          x: userPlayer.position.x - Math.sin(userPlayer.rotationY) * 7.5,
          y: 3.5,
          z: userPlayer.position.z - Math.cos(userPlayer.rotationY) * 7.5,
        };
        lookTarget = {
          x: userPlayer.position.x,
          y: 1.5,
          z: userPlayer.position.z,
        };
        break;
      case 'TACTICAL':
        // High birds-eye tactical board
        targetCamPos = { x: 0, y: 44, z: 1 };
        lookTarget = { x: 0, y: 0, z: 0 };
        break;
    }

    // FC 27 HyperMotion Power Shot dynamic camera zoom
    if (this.isPowerShotMode) {
      this.powerShotZoom = THREE.MathUtils.damp(this.powerShotZoom, 1.0, 8, dt);
    } else {
      this.powerShotZoom = THREE.MathUtils.damp(this.powerShotZoom, 0, 6, dt);
    }

    if (this.powerShotZoom > 0.05) {
      targetCamPos.y -= this.powerShotZoom * 6;
      targetCamPos.z -= this.powerShotZoom * 8;
    }

    // Camera shake decay (decaying trauma * trauma)
    if (this.cameraShakeTrauma > 0.01) {
      const shake = this.cameraShakeTrauma * this.cameraShakeTrauma * 0.65;
      targetCamPos.x += (Math.random() - 0.5) * shake;
      targetCamPos.y += (Math.random() - 0.5) * shake;
      this.cameraShakeTrauma = Math.max(0, this.cameraShakeTrauma - dt * 2.5);
    }

    // Smooth exponential damping
    const factor = 1 - Math.exp(-6 * dt);
    this.camera.position.x += (targetCamPos.x - this.camera.position.x) * factor;
    this.camera.position.y += (targetCamPos.y - this.camera.position.y) * factor;
    this.camera.position.z += (targetCamPos.z - this.camera.position.z) * factor;
    this.camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z);
  }

  private onResize = () => {
    if (!this.container || this.isDestroyed) return;
    const w = this.container.clientWidth;
    const h = Math.max(this.container.clientHeight, 1);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  public destroy() {
    this.isDestroyed = true;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
