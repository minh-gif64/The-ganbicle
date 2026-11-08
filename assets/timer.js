'use strict';
const INSPECTION_DEFAULT = 15;
const CUBE_TYPES = ["Wca Cubes", "Big Cubes", "Other Wca Puzzles"];
const WCA_CUBE_LABELS = ["2x2", "3x3", "4x4", "5x5", "6x6", "7x7"];
const BIG_CUBE_LABELS = ["8x8", "9x9", "10x10"];
const OTHER_WCA_LABELS = ["Pyraminx", "Megaminx", "Skewb", "Square-1", "Clock"];
const PLACEHOLDER = "Press New scramble to begin";

const F2L = {
  "Free_Pairs_1": "F R' F' R",
  "Free_Pairs_2": "R' F R F'",
  "Free_Pairs_3": "F' U F",
  "Free_Pairs_4": "R U' R'",
  "Disconnected_Pairs_1": "R U R' U2' R U' R' U",
  "Disconnected_Pairs_2": "F' U' F U2' F' U F U'",
  "Disconnected_Pairs_3": "R U R' U2' R U2' R' U",
  "Disconnected_Pairs_4": "r' U' R2 U' R2' U2' r",
  "Disconnected_Pairs_5": "F' U F U' R U R' U",
  "Disconnected_Pairs_6": "R U' R' U' R U' R' U",
  "Disconnected_Pairs_7": "R U R' U' R U2' R' U'",
  "Disconnected_Pairs_8": "R U R' F R' F' R2' U R' U",
  "Disconnected_Pairs_9": "R U' R' U2' R U R'",
  "Disconnected_Pairs_10": "F' L' U2' L F",
  "Connected_Pairs_1": "F' U F U' R U2' R' U",
  "Connected_Pairs_2": "R U R' U2' R U R' U' R U R'",
  "Connected_Pairs_3": "r U2' R' U R U' R' U M",
  "Connected_Pairs_4": "R U' R' U' R U R' U",
  "Connected_Pairs_5": "R U R' U' R U R' U2' R U' R'",
  "Connected_Pairs_6": "F' U F U2' R U R'",
  "Connected_Pairs_7": "R U' R' U R U2' R'",
  "Connected_Pairs_8": "R U R' U' R U R' F R' F' R",
  "Connected_Pairs_9": "R U' R' U R U' R' U2' R U' R'",
  "Connected_Pairs_10": "R U R' F R U R' U' F'",
  "Corner_In_Slot_1": "F' R U R' U' R' F R",
  "Corner_In_Slot_2": "F' U' F U R U R' U'",
  "Corner_In_Slot_3": "R U R' U' R U R'",
  "Corner_In_Slot_4": "R' F R F' U R U' R'",
  "Corner_In_Slot_5": "F R' F' R F R' F' R",
  "Corner_In_Slot_6": "R U' R' U R U' R'",
  "Edge_In_Slot_1": "R U R' F R' F' R U",
  "Edge_In_Slot_2": "R U' R' U R U' R' U R U' R'",
  "Edge_In_Slot_3": "R U R' U2' R U R' U",
  "Edge_In_Slot_4": "R U' R' U2' R U' R' U'",
  "Edge_In_Slot_5": "F' U F U' R U' R' U",
  "Edge_In_Slot_6": "R U' R' U2' F R' F' R U2'",
  "Pieces_In_Slot_1": "R U' R U2' F R2' F' U2' R2'",
  "Pieces_In_Slot_2": "R U' R' U R U2' R' U R U' R'",
  "Pieces_In_Slot_3": "R U' R' U' R U R' U2' R U' R'",
  "Pieces_In_Slot_4": "R U R' F U R U' R' F' R U R'",
  "Pieces_In_Slot_5": "R F U R U' R' F' U' R'"
};

const OLL = {
  "Cross 1": "R U2 R' U' R U' R'",
  "Cross 2": "R U R' U R U2 R'",
  "Cross 3": "R U R' U R U' R' U R U2 R'",
  "Cross 4": "R U2 R2 U' R2 U' R2 U2 R",
  "Cross 5": "R U2 R D R' U2 R D' R2",
  "Cross 6": "F R' F' r U R U' r'",
  "Cross 7": "B' R' F R B R' F' R",
  "H-Shaped": "r U R' U' M U R U' R'",
  "T-Shaped 1": "F U R U' R' F'",
  "T-Shaped 2": "F R U' R' U' R U R' F'",
  "Big Lightning Bolt 1": "R' U' F U R U' R' F' R U2",
  "Big Lightning Bolt 2": "L U F' U' L' U L F L' U2",
  "C-Shaped 1": "R' U' F R' F' R U R",
  "C-Shaped 2": "F U R' U' R' F' R U R2' U' R'",
  "Knight-Moved-Shaped 1": "F' U' F r U' r' U r U r'",
  "Knight-Moved-Shaped 2": "F U F' R' F R U' R' F' R",
  "Knight-Moved-Shaped 3": "r U r' U R U' R' r U' r' U2",
  "Knight-Moved-Shaped 4": "r' U' r U' R' U R r' U r",
  "Line 1": "f U R U' R' U R U' R' f'",
  "Line 2": "F R' F' U2' R U R' U R2' U2' R'",
  "Line 3": "F R U R' d R' U' R U' R'",
  "Line 4": "r U r' R U R' U' R U R' U' r U' r'",
  "Arrow-Shaped": "R U R' U' M' U R U' r'",
  "P-Shaped 1": "f U R U' R' f'",
  "P-Shaped 2": "f R' F' R U R U' R' S'",
  "P-Shaped 3": "f' U' L' U L f U2",
  "P-Shaped 4": "R' F R U R' U' F' U R",
  "Small Lightning Bolt 1": "r U2' R' U' R U' r'",
  "Small Lightning Bolt 2": "r' U2' R U R' U r",
  "Small Lightning Bolt 3": "F U R U' R' F' U' F U R U' R' F' U'",
  "Small Lightning Bolt 4": "M U' R U2' R' U' R U' R2' r",
  "W-Shaped 1": "F R' F' R U R U R' U' R U' R'",
  "W-Shaped 2": "F' L F L' U' L' U' L U L' U L",
  "Awkward-Shaped 1": "M F R' F' R U R U' R' U' M'",
  "Awkward-Shaped 2": "F U R U2' R' U R U2' R' U' F'",
  "Awkward-Shaped 3": "F U R U' R' F' R U2' R' U' R U' R'",
  "Awkward-Shaped 4": "F U R U' R' F' R' U2' R U R' U R U",
  "Fish-Shaped 1": "F U R U' R2' F' R U R U' R'",
  "Fish-Shaped 2": "R U2' R' F R' F' R U' R U' R'",
  "Fish-Shaped 3": "F R U' R' U R U R' F'",
  "Fish-Shaped 4": "R U2' R' F R' F' R2' U2' R'",
  "Square-Shaped 1": "r U R' U R U2' r'",
  "Square-Shaped 2": "r' U' R U' R' U2' r",
  "Hook-Shape 1": "F U R U' R' U R U' R' F'",
  "Hook-Shape 2": "F' U' L' U L U' L' U L F",
  "Hook-Shape 3": "r U2' R' U' R U R' U' R U' r'",
  "Hook-Shape 4": "r' U2' R U R' U' R U R' U r",
  "Hook-Shape 5": "r' U r2' U' r2' U' r2' U r' y2'",
  "Hook-Shape 6": "r U' r2' U r2' U r2' U' r",
  "Dot-Case 1": "F R' F' R U2' F R' F' R2' U2' R'",
  "Dot-Case 2": "f U R U' R' f' F U R U' R' F'",
  "Dot-Case 3": "F U R U' R' F' U' f U R U' R' f'",
  "Dot-Case 4": "F U R U' R' F' U f U R U' R' f'",
  "Dot-Case 5": "F R' F' R U2' F R' F' R U' R U' R'",
  "Dot-Case 6": "r' U2' R U R' U r2' U2' R' U' R U' r'",
  "Dot-Case 7": "F R' F' R M U R U' R' U' M'",
  "Dot-Case 8": "r U R' U' M2' U R U' R' U' M'"
};

const PLL = {
  "Ua": "M2' U' M' U2' M U' M2'",
  "Ub": "M2' U M' U2' M U M2'",
  "Z": "M U2' M2' U2' M U' M2' U' M2' U2",
  "H": "M2' U' M2' U2' M2' U' M2'",
  "Aa": "x R2' D2' R U R' D2' R U' R x'",
  "Ab": "x R' U R' D2' R U' R' D2' R2' x'",
  "E": "x' D R U R' D' R U' R' D R U' R' D' R U R' x",
  "T": "F R U' R' U R U R2' F' R U R U' R'",
  "F": "R' U' R U' R' U R U R2' F' R U R U' R' F U R",
  "Ja": "L' R' U2' R U R' U2' L U' R U",
  "Jb": "R U R2' F' R U R U' R' F R U' R'",
  "Ra": "R U2' R D R' U R D' R' U' R' U R U R'",
  "Rb": "R' U R U R' U' R' D' R U R' D R U2' R",
  "V": "D2' R' U R D' R2' U' R' U R' U R' D' R U2' R'",
  "Y": "F R' F' R U R U' R' F R U' R' U R U R' F'",
  "Na": "R U R' U2' R U R2' F' R U R U' R' F R U' R' U' R U' R'",
  "Nb": "F r' F' r U r U' r2' D' F r U r' F' D r",
  "Ga": "R' U' R D' U R2' U R' U R U' R U' R2' D",
  "Gb": "R2' U R' U R' U' R U' R2' D U' R' U R D'",
  "Gc": "D' R U R' U' D R2' U' R U' R' U R' U R2'",
  "Gd": "R2' U' R U' R U R' U R2' D' U R U' R' D"
};

/* ------------------------- storage ------------------------- */
let pbData = store.get('rubik_pb', {});
let pbHistory = store.get('rubik_pb_history', {});
let sessionData = store.get('rubik_sessions', { sessions: [] });
if (!sessionData || typeof sessionData !== 'object' || !Array.isArray(sessionData.sessions)) sessionData = { sessions: [] };
const savePb = () => store.set('rubik_pb', pbData);
const savePbHistory = () => store.set('rubik_pb_history', pbHistory);
const saveSessions = () => store.set('rubik_sessions', sessionData);

/* ------------------------- small utils ------------------------- */
const choice = arr => arr[Math.floor(Math.random() * arr.length)];
const randint = (a, b) => a + Math.floor(Math.random() * (b - a + 1)); // inclusive
const round3 = x => Math.round(x * 1000) / 1000;
const degToRad = d => d * Math.PI / 180;

function formatTimer(seconds) {
  if (seconds === Infinity) return "DNF";
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return String(minutes).padStart(2, '0') + ':' + secs.toFixed(2).padStart(5, '0');
}

function invertScramble(moves) {
  const result = [];
  for (let i = moves.length - 1; i >= 0; i--) {
    const m = moves[i];
    if (m.endsWith("2")) result.push(m);
    else if (m.endsWith("'")) result.push(m.slice(0, -1));
    else result.push(m + "'");
  }
  return result;
}

function naturalKey(s) {
  return s.split(/(\d+)/).map(c => (/^\d+$/.test(c) ? Number(c) : c.toLowerCase()));
}
function naturalCompare(a, b) {
  const ka = naturalKey(a), kb = naturalKey(b);
  for (let i = 0; i < Math.max(ka.length, kb.length); i++) {
    const x = ka[i], y = kb[i];
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    if (typeof x === 'number' && typeof y === 'number') { if (x !== y) return x - y; }
    else { const xs = String(x), ys = String(y); if (xs !== ys) return xs < ys ? -1 : 1; }
  }
  return 0;
}

/* Remap an F2L algorithm to a different slot (port of _remap_f2l_alg). */
function remapF2LAlg(algStr, slot) {
  if (slot === "Front Right") return algStr;
  const MAPS = {
    "Front Left": {
      'R': ['F', false], 'L': ['B', false], 'F': ['L', false], 'B': ['R', false],
      'r': ['f', false], 'l': ['b', false], 'f': ['l', false], 'b': ['r', false],
      'M': ['S', true], 'S': ['M', true], 'E': ['E', false]
    },
    "Back Left": {
      'R': ['L', false], 'L': ['R', false], 'F': ['B', false], 'B': ['F', false],
      'r': ['l', false], 'l': ['r', false], 'f': ['b', false], 'b': ['f', false],
      'M': ['M', true], 'S': ['S', true], 'E': ['E', false]
    },
    "Back Right": {
      'R': ['B', false], 'L': ['F', false], 'F': ['R', false], 'B': ['L', false],
      'r': ['b', false], 'l': ['f', false], 'f': ['r', false], 'b': ['l', false],
      'M': ['S', false], 'S': ['M', false], 'E': ['E', false]
    }
  };
  const fmap = MAPS[slot];
  if (!fmap) return algStr;
  const tokens = algStr.trim().split(/\s+/);
  const result = [];
  for (const tok of tokens) {
    const m = tok.match(/^([RLFBUDrlfbudMES])(w?)([2']*)$/);
    if (m) {
      const [, face, wide, suffix] = m;
      if (face in fmap) {
        const [newFace, flip] = fmap[face];
        let newSuffix = suffix;
        if (flip) {
          if (suffix === "'") newSuffix = "";
          else if (suffix === "") newSuffix = "'";
        }
        result.push(newFace + wide + newSuffix);
      } else result.push(tok);
    } else result.push(tok);
  }
  return result.join(' ');
}
/* =====================================================================
   CubeView — canvas port of the Rubik3D QOpenGLWidget
   ===================================================================== */
const FACE_NORMALS = {
  R: [1, 0, 0], L: [-1, 0, 0], U: [0, 1, 0], D: [0, -1, 0], F: [0, 0, 1], B: [0, 0, -1]
};
const FACE_COLORS = {
  U: [1, 1, 0], D: [1, 1, 1], F: [1, 0, 0], B: [1, 0.5, 0], L: [0, 0, 1], R: [0, 1, 0]
};
const WCA_ORIENTATIONS = {
  Red:    { F: [1, 0, 0], B: [1, .5, 0], U: [1, 1, 0], D: [1, 1, 1], L: [0, 0, 1], R: [0, 1, 0] },
  Orange: { F: [1, .5, 0], B: [1, 0, 0], U: [1, 1, 0], D: [1, 1, 1], L: [0, 1, 0], R: [0, 0, 1] },
  Yellow: { F: [1, 1, 0], B: [1, 1, 1], U: [1, .5, 0], D: [1, 0, 0], L: [0, 0, 1], R: [0, 1, 0] },
  White:  { F: [1, 1, 1], B: [1, 1, 0], U: [1, 0, 0], D: [1, .5, 0], L: [0, 0, 1], R: [0, 1, 0] },
  Green:  { F: [0, 1, 0], B: [0, 0, 1], U: [1, 1, 0], D: [1, 1, 1], L: [1, 0, 0], R: [1, .5, 0] },
  Blue:   { F: [0, 0, 1], B: [0, 1, 0], U: [1, 1, 0], D: [1, 1, 1], L: [1, .5, 0], R: [1, 0, 0] }
};
const CUBIE_FACES = [
  // [corner indices, face name] — same winding as the Python renderer
  [[0, 1, 2, 3], 'B'],
  [[4, 5, 6, 7], 'F'],
  [[0, 4, 7, 3], 'L'],
  [[1, 5, 6, 2], 'R'],
  [[3, 2, 6, 7], 'U'],
  [[0, 1, 5, 4], 'D']
];

function rodrigues(v, axisVec, angleDeg) {
  const [ax, ay, az] = axisVec;
  const mag = Math.sqrt(ax * ax + ay * ay + az * az);
  if (mag === 0) return v;
  const ux = ax / mag, uy = ay / mag, uz = az / mag;
  const theta = degToRad(angleDeg);
  const cosT = Math.cos(theta), sinT = Math.sin(theta);
  const [x, y, z] = v;
  const crossX = uy * z - uz * y;
  const crossY = uz * x - ux * z;
  const crossZ = ux * y - uy * x;
  const dot = ux * x + uy * y + uz * z;
  let rx = x * cosT + crossX * sinT + ux * dot * (1 - cosT);
  let ry = y * cosT + crossY * sinT + uy * dot * (1 - cosT);
  let rz = z * cosT + crossZ * sinT + uz * dot * (1 - cosT);
  const eps = 1e-8;
  return [Math.abs(rx) < eps ? 0 : rx, Math.abs(ry) < eps ? 0 : ry, Math.abs(rz) < eps ? 0 : rz];
}

function colorCss(c) {
  return `rgb(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)})`;
}

class CubeView {
  constructor(canvas, N = 3) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.angleX = 30;
    this.angleY = -30;
    this.angleZ = 0;
    this.lastMouse = null;
    this.dragDist = 0;

    this.N = null;
    this.coords = [];
    this.cubies = new Map();          // key "x,y,z" -> {pos:[x,y,z], stickers:{face:[r,g,b]}}
    this.faceColors = Object.assign({}, FACE_COLORS);

    this.moveQueue = [];
    this.currentMove = null;
    this.currentAngle = 0;
    this.stepDeg = 5;
    this.camDist = 6;        // camera distance along -Z
    this.fill = 0.95;        // fraction of the canvas the cube may occupy
    this.zoom = 1;           // user zoom (mouse wheel), multiplies `fill`
    this._timer = null;
    this.onFinished = null;           // scramble_finished signal
    this.onColorRequested = null;     // color_scheme_requested signal

    this._bindMouse();
    this.setCubeSize(N);
  }

  _key(x, y, z) { return x + ',' + y + ',' + z; }

  get animating() { return this._timer !== null; }

  isBusy() { return this.animating || this.moveQueue.length > 0; }

  setCubeSize(N) {
    this.N = N;
    this._populateCoords();
    this._initCubies();
    this.draw();
  }

  _populateCoords() {
    if (this.N % 2 === 1) {
      const k = (this.N - 1) / 2;
      this.coords = [];
      for (let i = -k; i <= k; i++) this.coords.push(i);
    } else {
      const half = this.N / 2;
      const start = -half + 0.5;
      this.coords = [];
      for (let i = 0; i < this.N; i++) this.coords.push(start + i);
    }
  }

  _initCubies() {
    this.cubies.clear();
    const fc = this.faceColors;
    const mx = Math.max(...this.coords), mn = Math.min(...this.coords);
    const eps = 1e-6;
    for (const x of this.coords) for (const y of this.coords) for (const z of this.coords) {
      const stickers = {};
      if (Math.abs(x - mx) < eps) stickers.R = fc.R;
      if (Math.abs(x - mn) < eps) stickers.L = fc.L;
      if (Math.abs(y - mx) < eps) stickers.U = fc.U;
      if (Math.abs(y - mn) < eps) stickers.D = fc.D;
      if (Math.abs(z - mx) < eps) stickers.F = fc.F;
      if (Math.abs(z - mn) < eps) stickers.B = fc.B;
      if (Object.keys(stickers).length === 0) continue;  // interior cubies are never visible
      this.cubies.set(this._key(x, y, z), { pos: [x, y, z], stickers });
    }
    this.moveQueue = [];
    this.currentMove = null;
    this.currentAngle = 0;
    this._stopTimer();
  }

  setFaceColors(colorsDict) {
    const oldColorToFace = {};
    for (const [face, color] of Object.entries(this.faceColors)) oldColorToFace[color.join(',')] = face;
    this.faceColors = Object.assign({}, colorsDict);
    for (const cubie of this.cubies.values()) {
      const newStickers = {};
      for (const [facePos, color] of Object.entries(cubie.stickers)) {
        const originalFace = oldColorToFace[color.join(',')];
        if (originalFace !== undefined && originalFace in this.faceColors) {
          newStickers[facePos] = this.faceColors[originalFace];
        } else newStickers[facePos] = color;
      }
      cubie.stickers = newStickers;
    }
    this.draw();
  }

  /* ---------------- scramble parsing (ported) ---------------- */

  _axisVector(axis) {
    if (axis === 'x') return [1, 0, 0];
    if (axis === 'y') return [0, 1, 0];
    return [0, 0, 1];
  }

  applyScrambleFromText(text) {
    if (!text) return;
    const tokens = text.trim().split(/\s+/);
    this.moveQueue = [];

    for (const token of tokens) {
      if (/^[xyzXYZ]['2]?$/.test(token)) {
        const axis = token[0].toLowerCase();
        const suffix = token.length > 1 ? token.slice(1) : "";
        let angle = suffix.includes("2") ? 180 : (suffix.includes("'") ? -90 : 90);
        if (axis === 'x') angle = -angle;
        const allLayers = this.coords.slice();
        const cubieKeys = Array.from(this.cubies.keys());
        const splits = Math.abs(angle) === 180 ? [90, 90] : [angle];
        for (const ang of splits) {
          this.moveQueue.push({
            axis, layerCoords: allLayers, angleTarget: ang,
            cubieKeys, isCubeRotation: true, token
          });
        }
      } else {
        const moves = this.parseScramble(token);
        for (const mv of moves) {
          const { axis, layerCoords, angle } = mv;
          const splits = Math.abs(angle) === 180 ? [90, 90] : [angle];
          for (const ang of splits) {
            const cubieKeys = [];
            for (const [k, c] of this.cubies) if (this._coordInLayers(c.pos, axis, layerCoords)) cubieKeys.push(k);
            this.moveQueue.push({
              axis, layerCoords, angleTarget: ang,
              cubieKeys, isCubeRotation: false, token
            });
          }
        }
      }
    }
    if (this.moveQueue.length && !this.animating) this._startTimer();
  }

  parseScramble(s) {
    const tokens = s.trim().split(/\s+/);
    const parsed = [];
    for (const tok of tokens) {
      let m = tok.match(/^(\d+)?([RLUDFBrludfb])w?(['2]*)'?$/);
      if (m) {
        let [, num, face, suf] = m;
        if (suf === "2'") suf = "2";
        else if (suf.includes("'")) suf = "'";
        const isLower = face === face.toLowerCase() && face !== face.toUpperCase();
        const faceUp = face.toUpperCase();
        const wide = isLower || tok.includes('w');
        const prefixNum = num ? parseInt(num, 10) : (wide && this.N >= 3 ? 2 : 1);
        parsed.push(this._tokenToMove(faceUp, prefixNum, wide, suf));
        continue;
      }
      m = tok.match(/^([RLUDFBMS])(['2]*)'?$/);
      if (m) {
        let [, face, suf] = m;
        if (suf === "2'") suf = "2";
        else if (suf.includes("'")) suf = "'";
        if ('MES'.includes(face)) parsed.push(this._sliceTokenToMove(face, suf));
        else parsed.push(this._tokenToMove(face, 1, false, suf));
        continue;
      }
      m = tok.match(/^(\d+)([RLUDFB])w(['2]*)'?$/);
      if (m) {
        let [, num, face, suf] = m;
        if (suf === "2'") suf = "2";
        else if (suf.includes("'")) suf = "'";
        parsed.push(this._tokenToMove(face, parseInt(num, 10), true, suf));
        continue;
      }
      m = tok.match(/^([RLUDFB])(['2]*)'?$/);
      if (m) {
        let [, face, suf] = m;
        if (suf === "2'") suf = "2";
        else if (suf.includes("'")) suf = "'";
        parsed.push(this._tokenToMove(face, 1, false, suf));
        continue;
      }
    }
    return parsed.flat();
  }

  _tokenToMove(face, count, explicitWide, suffix) {
    const faceUp = face.toUpperCase();
    const axis = { R: 'x', L: 'x', U: 'y', D: 'y', F: 'z', B: 'z' }[faceUp];
    const maxc = this.coords.length ? Math.max(...this.coords) : 0;
    const minc = this.coords.length ? Math.min(...this.coords) : 0;
    const side = ['R', 'U', 'F'].includes(faceUp) ? maxc : minc;

    let layers;
    if (count <= 1 && !explicitWide) {
      layers = [side];
    } else {
      const sorted = this.coords.slice().sort((a, b) => side > 0 ? b - a : a - b);
      layers = sorted.slice(0, count);
    }

    let angle;
    if (suffix.includes("2")) angle = 180;
    else if (suffix.includes("'")) angle = -90;
    else angle = 90;
    if (['R', 'U', 'F'].includes(faceUp)) angle = -angle;

    return { axis, layerCoords: layers, angle, face: faceUp, suffix };
  }

  _sliceTokenToMove(token, suffix) {
    let axis;
    if (token === 'M') axis = 'x';
    else if (token === 'E') axis = 'y';
    else axis = 'z';

    let coords;
    if (this.N % 2 === 1) coords = [0];
    else {
      const mid = Math.floor(this.coords.length / 2);
      coords = [this.coords[mid - 1], this.coords[mid]];
    }

    let angle;
    if (suffix === "'") angle = -90;
    else if (suffix === '2') angle = 180;
    else angle = 90;
    if (token === 'S') angle = -angle;

    return { axis, layerCoords: coords, angle, face: token, suffix };
  }

  _coordInLayers(pos, axis, layers) {
    const idx = { x: 0, y: 1, z: 2 }[axis];
    const val = pos[idx];
    for (const l of layers) if (Math.abs(val - l) < 1e-6) return true;
    return false;
  }

  /* ---------------- animation ---------------- */

  _startTimer() {
    if (this._timer !== null) return;
    this._timer = setInterval(() => this._animStep(), 20);
  }
  _stopTimer() {
    if (this._timer !== null) { clearInterval(this._timer); this._timer = null; }
  }

  _animStep() {
    if (!this.currentMove && this.moveQueue.length) {
      this.currentMove = this.moveQueue.shift();
      this.currentAngle = 0;
    }
    if (!this.currentMove) {
      this._stopTimer();
      return;
    }
    const target = this.currentMove.angleTarget;
    const dirSign = target >= 0 ? 1 : -1;
    this.currentAngle += dirSign * this.stepDeg;
    if ((dirSign > 0 && this.currentAngle >= target) || (dirSign < 0 && this.currentAngle <= target)) {
      this.currentAngle = target;
      this._commitCurrentMove();
      this.currentMove = null;
      this.currentAngle = 0;
      if (!this.moveQueue.length) {
        this._stopTimer();
        this.draw();
        if (this.onFinished) this.onFinished();
        return;
      }
    }
    this.draw();
  }

  _snap(v, allowed) {
    let best = allowed[0], bestd = Math.abs(v - best);
    for (const c of allowed) {
      const d = Math.abs(v - c);
      if (d < bestd) { bestd = d; best = c; }
    }
    return best;
  }

  _normalToFace(normal) {
    const [x, y, z] = normal;
    const eps = 1e-5;
    for (const [face, fn] of Object.entries(FACE_NORMALS)) {
      if (Math.abs(x - fn[0]) < eps && Math.abs(y - fn[1]) < eps && Math.abs(z - fn[2]) < eps) return face;
    }
    const ax = Math.abs(x), ay = Math.abs(y), az = Math.abs(z);
    if (ax >= ay && ax >= az) return x > 0 ? 'R' : 'L';
    if (ay >= ax && ay >= az) return y > 0 ? 'U' : 'D';
    return z > 0 ? 'F' : 'B';
  }

  _commitCurrentMove() {
    const m = this.currentMove;
    if (!m) return;
    const axis = m.axis;
    const ang = m.angleTarget;
    const axisVec = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] }[axis];
    const layers = m.layerCoords;
    const avg = layers.reduce((a, b) => a + b, 0) / layers.length;

    const newMap = new Map();
    for (const cubie of this.cubies.values()) {
      const pos = cubie.pos;
      if (this._coordInLayers(pos, axis, layers)) {
        let nx, ny, nz;
        if (axis === 'x') {
          const [rx, ry, rz] = rodrigues([pos[0] - avg, pos[1], pos[2]], [1, 0, 0], ang);
          nx = rx + avg; ny = ry; nz = rz;
        } else if (axis === 'y') {
          const [rx, ry, rz] = rodrigues([pos[0], pos[1] - avg, pos[2]], [0, 1, 0], ang);
          nx = rx; ny = ry + avg; nz = rz;
        } else {
          const [rx, ry, rz] = rodrigues([pos[0], pos[1], pos[2] - avg], [0, 0, 1], ang);
          nx = rx; ny = ry; nz = rz + avg;
        }
        nx = this._snap(nx, this.coords);
        ny = this._snap(ny, this.coords);
        nz = this._snap(nz, this.coords);

        const newStickers = {};
        const snapN = v => {
          if (Math.abs(v - 1) < 1e-4) return 1;
          if (Math.abs(v + 1) < 1e-4) return -1;
          if (Math.abs(v) < 1e-4) return 0;
          return v;
        };
        for (const [face, color] of Object.entries(cubie.stickers)) {
          const rotated = rodrigues(FACE_NORMALS[face], axisVec, ang);
          const rn = [snapN(rotated[0]), snapN(rotated[1]), snapN(rotated[2])];
          const newFace = this._normalToFace(rn);
          if (newFace) newStickers[newFace] = color;
        }
        cubie.pos = [nx, ny, nz];
        cubie.stickers = newStickers;
      }
      newMap.set(this._key(cubie.pos[0], cubie.pos[1], cubie.pos[2]), cubie);
    }
    this.cubies = newMap;
  }

  /* ---------------- rendering ---------------- */

  _resizeToDisplay() {
    const dpr = window.devicePixelRatio || 1;
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (w === 0 || h === 0) return false;
    const pw = Math.round(w * dpr), ph = Math.round(h * dpr);
    if (this.canvas.width !== pw || this.canvas.height !== ph) {
      this.canvas.width = pw;
      this.canvas.height = ph;
    }
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  }

  draw() {
    if (!this._resizeToDisplay()) return;
    const ctx = this.ctx;
    const W = this.canvas.clientWidth, H = this.canvas.clientHeight;
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--cube-bg').trim() || '#0b0e13';
    ctx.fillRect(0, 0, W, H);

    const unit = 1.6 / this.N;
    const gap = unit * 0.06;
    const size = unit - gap;
    const half = size / 2;

    // view rotation (GL order: Rz, then Ry, then Rx, then translate -camDist)
    const D = this.camDist;
    const ax = degToRad(this.angleX), ay = degToRad(this.angleY), az = degToRad(this.angleZ);
    const cx_ = Math.cos(ax), sx_ = Math.sin(ax);
    const cy_ = Math.cos(ay), sy_ = Math.sin(ay);
    const cz_ = Math.cos(az), sz_ = Math.sin(az);
    const view = (x, y, z) => {
      let x1 = x * cz_ - y * sz_, y1 = x * sz_ + y * cz_, z1 = z;
      let x2 = x1 * cy_ + z1 * sy_, y2 = y1, z2 = -x1 * sy_ + z1 * cy_;
      let x3 = x2, y3 = y2 * cx_ - z2 * sx_, z3 = y2 * sx_ + z2 * cx_;
      return [x3, y3, z3 - D];
    };
    // Scale to fit: the cube's bounding sphere (radius 0.8·√3, unchanged by
    // any face/slice/whole-cube turn) is mapped to `fill` of the smaller
    // canvas dimension, so it fills the panel without ever clipping when
    // rotated. Keying off min(W,H) instead of H alone is what stops the
    // corners from running off the sides on a narrow panel.
    const R = 0.8 * Math.SQRT2 * Math.sqrt(1.5);          // = 0.8·√3
    const maxTan = R / Math.sqrt(D * D - R * R);
    const S = (Math.min(W, H) / 2) * this.fill * this.zoom / maxTan;
    const project = (p) => {
      const iz = -1 / p[2];
      return [W / 2 + p[0] * iz * S, H / 2 - p[1] * iz * S];
    };

    // current-move rotation
    let rotSet = null, moveAxisVec = null, moveAngle = 0, center = [0, 0, 0];
    if (this.currentMove) {
      rotSet = new Set(this.currentMove.cubieKeys);
      moveAxisVec = this._axisVector(this.currentMove.axis);
      moveAngle = this.currentAngle;
      const layers = this.currentMove.layerCoords;
      const avg = layers.reduce((a, b) => a + b, 0) / layers.length;
      if (this.currentMove.axis === 'x') center = [avg * unit, 0, 0];
      else if (this.currentMove.axis === 'y') center = [0, avg * unit, 0];
      else center = [0, 0, avg * unit];
    }

    const corners = [
      [-half, -half, -half], [half, -half, -half], [half, half, -half], [-half, half, -half],
      [-half, -half, half], [half, -half, half], [half, half, half], [-half, half, half]
    ];

    const polys = [];
    for (const [key, cubie] of this.cubies) {
      const [gx, gy, gz] = cubie.pos;
      const wx = gx * unit, wy = gy * unit, wz = gz * unit;
      const rotating = rotSet !== null && rotSet.has(key);

      // world-space corners of this cubelet
      const worldCorners = new Array(8);
      for (let i = 0; i < 8; i++) {
        const c = corners[i];
        if (rotating) {
          const local = [wx - center[0] + c[0], wy - center[1] + c[1], wz - center[2] + c[2]];
          const r = rodrigues(local, moveAxisVec, moveAngle);
          worldCorners[i] = [center[0] + r[0], center[1] + r[1], center[2] + r[2]];
        } else {
          worldCorners[i] = [wx + c[0], wy + c[1], wz + c[2]];
        }
      }

      for (const [inds, fname] of CUBIE_FACES) {
        const sticker = cubie.stickers[fname];
        const camPts = new Array(4);
        let depth = 0, behind = false;
        for (let i = 0; i < 4; i++) {
          const wc = worldCorners[inds[i]];
          const cp = view(wc[0], wc[1], wc[2]);
          if (cp[2] > -0.5) { behind = true; break; }
          camPts[i] = cp;
          depth += cp[2];
        }
        if (behind) continue;
        depth /= 4;
        const pts = camPts.map(project);
        polys.push({ pts, depth, fill: sticker ? colorCss(sticker) : '#0d0d0d', sticker: !!sticker });
      }
    }

    polys.sort((a, b) => a.depth - b.depth);   // farthest (most negative) first
    for (const p of polys) {
      ctx.beginPath();
      ctx.moveTo(p.pts[0][0], p.pts[0][1]);
      for (let i = 1; i < 4; i++) ctx.lineTo(p.pts[i][0], p.pts[i][1]);
      ctx.closePath();
      ctx.fillStyle = p.fill;
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = p.sticker ? 1.4 : 1;
      ctx.stroke();
    }
  }

  /* ---------------- mouse ---------------- */

  _bindMouse() {
    const cv = this.canvas;
    cv.addEventListener('mousedown', e => {
      this.lastMouse = [e.clientX, e.clientY];
      this.dragDist = 0;
      e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
      if (!this.lastMouse) return;
      const dx = e.clientX - this.lastMouse[0];
      const dy = e.clientY - this.lastMouse[1];
      this.dragDist += Math.abs(dx) + Math.abs(dy);
      if (e.buttons & 1) {
        this.angleX += dy * 0.5;
        this.angleY += dx * 0.5;
      } else if (e.buttons & 2) {
        this.angleZ += dx * 0.5;
        this.angleX += dy * 0.5;
      } else { this.lastMouse = null; return; }
      this.lastMouse = [e.clientX, e.clientY];
      this.draw();
    });
    window.addEventListener('mouseup', () => { this.lastMouse = null; });
    cv.addEventListener('wheel', e => {
      e.preventDefault();
      this.zoom = Math.min(2.2, Math.max(0.6, this.zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1)));
      this.draw();
    }, { passive: false });
    cv.addEventListener('dblclick', () => {
      this.zoom = 1;
      this.angleX = 30; this.angleY = -30; this.angleZ = 0;
      this.draw();
    });
    cv.addEventListener('contextmenu', e => {
      e.preventDefault();
      if (this.dragDist < 6 && this.onColorRequested) this.onColorRequested();
    });
  }
}
/* =====================================================================
   Scramble generators (ported)
   ===================================================================== */
function generateWCAScramble(N) {
  const wcaLengths = { 2: randint(4, 10), 3: 20, 4: 40, 5: 60, 6: 80, 7: 100, 8: 125, 9: 125, 10: 125 };
  const baseFaces = ['R', 'L', 'U', 'D', 'F', 'B'];
  const modifiers = ["", "'", "2"];
  const length = wcaLengths[N] !== undefined ? wcaLengths[N] : 25;

  let pool;
  if (N <= 3) pool = baseFaces;
  else {
    pool = baseFaces.slice();
    const maxPrefix = Math.max(2, Math.floor(N / 2));
    for (let i = 2; i <= maxPrefix; i++) for (const f of baseFaces) pool.push(`${i}${f}w`);
    for (const f of baseFaces) pool.push(f + 'w');
  }

  const axisOfToken = tok => {
    const m = tok.toUpperCase().match(/([RLUDFB])/);
    return m ? { R: 'x', L: 'x', U: 'y', D: 'y', F: 'z', B: 'z' }[m[1]] : null;
  };

  const moves = [];
  let prevAxis = null;
  while (moves.length < length) {
    const tok = choice(pool);
    const ax = axisOfToken(tok);
    if (!ax || ax === prevAxis) continue;
    prevAxis = ax;
    moves.push(tok + choice(modifiers));
  }
  return moves.join(' ');
}

function generatePyraminxScramble() {
  const faces = ['U', 'L', 'R', 'B'], tips = ['u', 'l', 'r', 'b'];
  const moves = [];
  let prev = null;
  for (let i = 0; i < 11; i++) {
    const f = choice(faces.filter(x => x !== prev));
    prev = f;
    moves.push(f + choice(['', "'"]));
  }
  for (const t of tips) {
    const c = choice(['', '', t, t + "'"]);
    if (c) moves.push(c);
  }
  return moves.join(' ');
}

function generateMegaminxScramble() {
  const lines = [];
  for (let i = 0; i < 7; i++) {
    const seq = [];
    for (let j = 0; j < 5; j++) {
      seq.push('R' + choice(['++', '--']));
      seq.push('D' + choice(['++', '--']));
    }
    seq.push('U' + choice(['', "'"]));
    lines.push(seq.join(' '));
  }
  return lines.join('\n');
}

function generateSkewbScramble() {
  const faces = ['R', 'L', 'U', 'B'];
  const moves = [];
  let prev = null;
  const n = randint(8, 11);
  for (let i = 0; i < n; i++) {
    const f = choice(faces.filter(x => x !== prev));
    prev = f;
    moves.push(f + choice(['', "'"]));
  }
  return moves.join(' ');
}

function generateSquare1Scramble() {
  const parts = [];
  const count = randint(11, 13);
  for (let i = 0; i < count; i++) {
    parts.push(`(${randint(-5, 6)},${randint(-5, 6)})`);
    if (i < count - 1) parts.push('/');
  }
  return parts.join(' ');
}

function generateClockScramble() {
  const amt = () => `${randint(0, 6)}${choice(['+', '-'])}`;
  const front = ['UR', 'DR', 'DL', 'UL', 'U', 'R', 'D', 'L', 'ALL'];
  const back = ['U', 'R', 'D', 'L', 'ALL'];
  let parts = front.map(p => p + amt());
  parts.push('y2');
  parts = parts.concat(back.map(p => p + amt()));
  parts = parts.concat(['UR', 'DR', 'DL', 'UL'].filter(() => Math.random() < 0.5));
  return parts.join(' ');
}

function generateOtherPuzzleScramble(name) {
  const generators = {
    "Pyraminx": generatePyraminxScramble,
    "Megaminx": generateMegaminxScramble,
    "Skewb": generateSkewbScramble,
    "Square-1": generateSquare1Scramble,
    "Clock": generateClockScramble
  };
  const gen = generators[name];
  return gen ? gen() : `No scrambler available for ${name}`;
}

/* The Python app used the external `cubescrambler` package for F2L
   scrambles. Here we build one by inverting random F2L insertions in
   all four slots, which leaves the cross solved. */
function generateF2LScramble() {
  const slots = ["Front Right", "Front Left", "Back Left", "Back Right"];
  const algs = Object.values(F2L);
  const seq = [];
  for (const slot of slots) {
    const u = choice(["U", "U'", "U2", ""]);
    if (u) seq.push(u);
    seq.push(remapF2LAlg(choice(algs), slot));
  }
  const moves = seq.join(' ').trim().split(/\s+/);
  return invertScramble(moves).join(' ');
}

/* =====================================================================
   Modal system
   ===================================================================== */
/* Barrier shown for features that aren't shipping yet. */
function nextUpdateNotice(featureName, detail) {
  setStatus(`${featureName} is coming in the next update`);
  return infoModal("Coming in the next update",
    `${featureName} isn't available yet.\n\n${detail}\n\nIt'll be unlocked in the next update — thanks for your patience!`);
}

function penaltyModal() {
  return new Promise(resolve => {
    openModal((dlg, close) => {
      dlg.appendChild(el('h3', { text: 'Penalty' }));
      dlg.appendChild(el('div', { class: 'msg', text: 'Did this solve have any penalties?', style: 'text-align:center;font-weight:bold;font-size:15px' }));
      dlg.appendChild(el('div', { class: 'row' },
        el('button', { class: 'pen-ok', text: 'No penalty', onclick: () => { close(); resolve('None'); } }),
        el('button', { class: 'pen-p2', text: '+2', onclick: () => { close(); resolve('+2'); } }),
        el('button', { class: 'pen-dnf', text: 'DNF', onclick: () => { close(); resolve('DNF'); } })));
    }, { width: '440px' });
  });
}

/* =====================================================================
   ButtonGroupCombo port
   ===================================================================== */
class ButtonGroup {
  constructor(container, items, onChange, opts = {}) {
    this.container = container;
    this.items = [];
    this.current = "";
    this.buttons = {};
    this.onChange = onChange || null;
    this.enabled = true;
    this.labels = opts.labels || {};            // value -> display text
    this.locked = new Set(opts.locked || []);   // values that can't be selected yet
    this.onLocked = opts.onLocked || null;
    for (const text of items) this._addButton(text);
    const firstOpen = this.items.find(t => !this.locked.has(t));
    if (firstOpen) this.setCurrentText(firstOpen, false);
  }
  _addButton(text) {
    const btn = document.createElement('button');
    const isLocked = this.locked.has(text);
    btn.className = 'grp-btn' + (isLocked ? ' locked' : '');
    btn.textContent = this.labels[text] || text;
    if (isLocked) {
      btn.title = 'Coming in a future update';
      btn.addEventListener('click', () => { if (this.onLocked) this.onLocked(text); });
    } else {
      btn.addEventListener('click', () => this.setCurrentText(text));
    }
    this.container.appendChild(btn);
    this.items.push(text);
    this.buttons[text] = btn;
  }
  currentText() { return this.current; }
  setCurrentText(text, fire = true) {
    if (!(text in this.buttons) || text === this.current) return;
    if (this.locked.has(text)) return;
    this.current = text;
    for (const [t, btn] of Object.entries(this.buttons)) {
      if (!this.locked.has(t)) btn.classList.toggle('checked', t === text);
    }
    if (fire && this.onChange) this.onChange(text);
  }
  setEnabled(enabled) {
    this.enabled = enabled;
    for (const [t, btn] of Object.entries(this.buttons)) {
      if (!this.locked.has(t)) btn.disabled = !enabled;
    }
  }
  setDisabled(disabled) { this.setEnabled(!disabled); }
}

/* =====================================================================
   ScramblePickerButton port
   ===================================================================== */
const SCRAMBLE_DISPLAY = {
  "Wca scramble": "WCA scramble",
  "CFOP Cross": "CFOP · Cross",
  "CFOP F2L": "CFOP · F2L",
  "CFOP LL": "CFOP · LL",
  "CFOP OLL": "CFOP · OLL",
  "CFOP PLL": "CFOP · PLL",
  "CFOP F2L Algs": "CFOP · F2L algs"
};

class ScramblePicker {
  constructor(onChange) {
    this.current = "Wca scramble";
    this.onChange = onChange || null;
    this.btn = $('scrBtn');
    this.popup = $('scrPopup');
    this.subCfop = $('subCfop');
    this.subAlgs = $('subAlgs');
    this.divider = $('scrDivider');
    this._refreshLabel();

    for (const [label, val] of [["Cross", "CFOP Cross"], ["F2L", "CFOP F2L"], ["LL", "CFOP LL"]]) {
      const b = document.createElement('button');
      b.textContent = label;
      b.addEventListener('click', () => this._select(val));
      this.subCfop.appendChild(b);
    }
    for (const [label, val] of [["F2L", "CFOP F2L Algs"], ["OLL", "CFOP OLL"], ["PLL", "CFOP PLL"]]) {
      const b = document.createElement('button');
      b.textContent = label;
      b.addEventListener('click', () => this._select(val));
      this.subAlgs.appendChild(b);
    }

    this.btn.addEventListener('click', e => { e.stopPropagation(); this._toggle(); });
    $('scrWca').addEventListener('click', () => this._select("Wca scramble"));
    $('scrCfop').addEventListener('click', () => this._toggleSub(this.subCfop));
    $('scrAlgs').addEventListener('click', () => this._toggleSub(this.subAlgs));
    document.addEventListener('click', e => {
      if (!this.popup.contains(e.target) && e.target !== this.btn) this._hide();
    });
  }
  currentText() { return this.current; }
  setCurrentText(text) {
    if (!(text in SCRAMBLE_DISPLAY) || text === this.current) return;
    this.current = text;
    this._refreshLabel();
    if (this.onChange) this.onChange(text);
  }
  _refreshLabel() { this.btn.textContent = `${SCRAMBLE_DISPLAY[this.current]}  ⌄`; }
  _toggle() {
    if (this.popup.classList.contains('open')) this._hide();
    else {
      this.subCfop.classList.remove('open');
      this.subAlgs.classList.remove('open');
      this.divider.style.display = 'none';
      this.popup.classList.add('open');
    }
  }
  _hide() { this.popup.classList.remove('open'); }
  _toggleSub(sub) {
    const other = sub === this.subCfop ? this.subAlgs : this.subCfop;
    sub.classList.toggle('open');
    other.classList.remove('open');
    this.divider.style.display =
      (this.subCfop.classList.contains('open') || this.subAlgs.classList.contains('open')) ? 'block' : 'none';
  }
  _select(text) {
    this._hide();
    this.setCurrentText(text);
  }
}

/* =====================================================================
   Time graph (canvas port of the matplotlib widget)
   ===================================================================== */
function updateGraph(times) {
  const canvas = $('graphCanvas');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth, H = canvas.clientHeight;
  if (!W || !H) return;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const cs = getComputedStyle(document.body);
  const v = n => cs.getPropertyValue(n).trim();
  const bg = v('--surface');
  const textCol = v('--text-dim');
  const faintCol = v('--text-faint');
  const gridCol = v('--border');
  const lineCol = v('--accent');
  const markCol = v('--accent');

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const m = { l: 46, r: 14, t: 24, b: 30 };
  const pw = W - m.l - m.r, ph = H - m.t - m.b;

  ctx.fillStyle = textCol;
  ctx.font = '500 13px Segoe UI, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Solve times', m.l, 15);
  ctx.font = '11px Segoe UI, sans-serif';
  ctx.fillStyle = faintCol;
  ctx.textAlign = 'center';
  ctx.fillText('Solve', m.l + pw / 2, H - 5);
  ctx.save();
  ctx.translate(12, m.t + ph / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Seconds', 0, 0);
  ctx.restore();

  const data = [];
  times.forEach((t, i) => { if (t !== Infinity) data.push([i + 1, t]); });

  let xMin = 1, xMax = 2, yMin = 0, yMax = 1;
  if (data.length) {
    xMin = 1;
    xMax = Math.max(2, data[data.length - 1][0]);
    const ys = data.map(d => d[1]);
    yMin = Math.min(...ys); yMax = Math.max(...ys);
    if (yMin === yMax) { yMin -= 0.5; yMax += 0.5; }
    const pad = (yMax - yMin) * 0.1;
    yMin -= pad; yMax += pad;
  }
  const px = x => m.l + (x - xMin) / (xMax - xMin) * pw;
  const py = y => m.t + ph - (y - yMin) / (yMax - yMin) * ph;

  // grid + ticks
  ctx.strokeStyle = gridCol;
  ctx.lineWidth = 1;
  ctx.fillStyle = faintCol;
  ctx.font = '10px Segoe UI, sans-serif';
  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const yv = yMin + (yMax - yMin) * i / yTicks;
    const yy = py(yv);
    ctx.beginPath(); ctx.moveTo(m.l, yy); ctx.lineTo(m.l + pw, yy); ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(yv.toFixed(1), m.l - 4, yy + 3);
  }
  const xTickCount = Math.min(10, Math.max(1, Math.round(xMax - xMin)));
  for (let i = 0; i <= xTickCount; i++) {
    const xv = xMin + (xMax - xMin) * i / xTickCount;
    if (Math.abs(xv - Math.round(xv)) > 1e-9) continue;
    ctx.textAlign = 'center';
    ctx.fillText(String(Math.round(xv)), px(xv), m.t + ph + 14);
  }

  if (data.length) {
    ctx.strokeStyle = lineCol;
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach(([x, y], i) => { i ? ctx.lineTo(px(x), py(y)) : ctx.moveTo(px(x), py(y)); });
    ctx.stroke();
    ctx.fillStyle = markCol;
    for (const [x, y] of data) {
      ctx.beginPath();
      ctx.arc(px(x), py(y), 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
/* =====================================================================
   RubikTimer application state (port of the RubikTimer QWidget)
   ===================================================================== */
const modeMap = { "Single": 1, "Ao5": 5, "Ao12": 12 };
const app = {
  darkMode: false, running: false, inspecting: false, inspectionDone: false,
  startTime: 0, elapsed: 0, pendingAction: null,
  inspectionRemaining: 0, currentRun: 0, runCount: 1, runTimes: [],
  pbPending: false, lastPbKey: null, lastPbOldValue: null, lastPbSolveIndex: null,
  selectedOll: null, selectedPll: null, selectedF2l: null, selectedF2lSlot: "Front Right",
  currentSession: null, currentSessionSolves: [],
  solverActive: false, displayInterval: null, inspectionInterval: null
};

const setStatus = t => { $('statusLabel').textContent = t; };
const setInspect = t => { $('inspectLabel').textContent = t; };
const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

function setActionButtonsEnabled(enabled) {
  for (const id of ['btnInspect', 'btnSolve', 'btnNext']) $(id).disabled = !enabled;
}
function isScrambleAnimating() { return cubeView.isBusy(); }

/* ---------------- sessions ---------------- */
function nowStamp() {
  const d = new Date(), p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
function startNewSession() {
  const cubeType = typeGroup.currentText();
  let cube;
  if (cubeType === "Wca Cubes") cube = wcaGroup.currentText();
  else if (cubeType === "Other Wca Puzzles") cube = otherGroup.currentText();
  else cube = bigGroup.currentText();
  app.currentSession = {
    date: nowStamp(), cube, mode: modeGroup.currentText(),
    scramble_type: scramblePicker.currentText(), solves: []
  };
  app.currentSessionSolves = [];
}
function addSolveToSession(timeValue, penalty = "None") {
  if (app.currentSession === null) startNewSession();
  const solve = penalty === "DNF" ? { penalty: "DNF" } : { time: round3(timeValue), penalty };
  app.currentSession.solves.push(solve);
  app.currentSessionSolves.push(solve);
}
function saveCurrentSession() {
  if (app.currentSession && app.currentSession.solves.length > 0) {
    sessionData.sessions.push(app.currentSession);
    saveSessions();
  }
}

/* ---------------- PB lists ---------------- */
function refreshPbList() {
  const lists = { normal: $('pbNormal'), oll: $('pbOll'), pll: $('pbPll') };
  for (const l of Object.values(lists)) l.innerHTML = '';
  for (const k of Object.keys(pbData).sort()) {
    const v = pbData[k];
    // Everything that isn't an OLL/PLL case belongs in the first column —
    // the original only listed keys containing "Single", which quietly hid
    // every Mo3/Ao5/Ao12 record.
    let target = lists.normal;
    if (k.startsWith("OLL_")) target = lists.oll;
    else if (k.startsWith("PLL_")) target = lists.pll;
    target.appendChild(el('div', { class: 'item', text: `${k.replace(/_/g, ' ')}   ${formatTimer(v)}` }));
  }
  for (const [name, box] of Object.entries(lists)) {
    if (!box.children.length) box.appendChild(el('div', { class: 'item', text: 'No records yet' }));
  }
}
function restorePbFromHistory(key) {
  const history = pbHistory[key] || [];
  if (history.length) {
    pbData[key] = history.pop();
    if (!history.length) delete pbHistory[key];
  }
}

/* ---------------- scramble generation ---------------- */
async function generateScramble() {
  if (app.inspectionInterval) { clearInterval(app.inspectionInterval); app.inspectionInterval = null; }
  app.inspectionRemaining = 0;
  app.inspecting = false;
  app.inspectionDone = false;
  setInspect("");
  resetCube();
  setActionButtonsEnabled(false);
  if (app.pendingAction === null) {
    app.pendingAction = "manual";
    setStatus("Generating scramble — wait for the animation to finish…");
  }
  try {
    if (typeGroup.currentText() === "Other Wca Puzzles") {
      const puzzle = otherGroup.currentText();
      $('scrambleText').value = generateOtherPuzzleScramble(puzzle);
      setStatus(`${puzzle} scramble generated.`);
      app.pendingAction = null;                     // no 3D animation for these puzzles
      setActionButtonsEnabled(true);
      return;
    }
    const cubeLabel = typeGroup.currentText() === "Wca Cubes" ? wcaGroup.currentText() : bigGroup.currentText();
    let cubeSize = parseInt(cubeLabel.toLowerCase().trim().split('x')[0], 10);
    if (isNaN(cubeSize)) cubeSize = 3;
    const scrambleType = scramblePicker.currentText();
    let text = "";

    if (scrambleType === "Wca scramble") {
      text = generateWCAScramble(cubeSize);
      cubeView.applyScrambleFromText(text.split('\n')[0]);

    } else if (scrambleType === "CFOP Cross") {
      wcaGroup.setCurrentText("3x3");
      text = generateWCAScramble(3) + "\n(Solve White Cross on Bottom)";
      cubeView.applyScrambleFromText(text.split('\n')[0]);

    } else if (scrambleType === "CFOP F2L") {
      const f2lScramble = generateF2LScramble();
      text = f2lScramble;
      cubeView.applyScrambleFromText(f2lScramble.split('\n')[0]);

    } else if (scrambleType === "CFOP OLL") {
      wcaGroup.setCurrentText("3x3");
      if (!app.selectedOll) app.selectedOll = await chooseOllCase();
      if (app.selectedOll) {
        const alg = OLL[app.selectedOll];
        text = `OLL ${app.selectedOll}: ${alg}`;
        cubeView.applyScrambleFromText(alg);
      } else text = "No OLL case selected";

    } else if (scrambleType === "CFOP PLL") {
      wcaGroup.setCurrentText("3x3");
      if (!app.selectedPll) app.selectedPll = await choosePllCase();
      if (app.selectedPll) {
        const alg = PLL[app.selectedPll];
        text = `PLL ${app.selectedPll}: ${alg}`;
        cubeView.applyScrambleFromText(alg);
      } else text = "No PLL case selected";

    } else if (scrambleType === "CFOP F2L Algs") {
      wcaGroup.setCurrentText("3x3");
      if (!app.selectedF2l) app.selectedF2l = await chooseF2lCase();
      if (app.selectedF2l) {
        const alg = remapF2LAlg(F2L[app.selectedF2l], app.selectedF2lSlot);
        text = `F2L ${app.selectedF2l} (${app.selectedF2lSlot}): ${alg}`;
        cubeView.applyScrambleFromText(alg);
      } else text = "No F2L case selected";

    } else if (scrambleType === "CFOP LL") {
      wcaGroup.setCurrentText("3x3");
      const ollCase = choice(Object.keys(OLL));
      const pllCase = choice(Object.keys(PLL));
      text = `${PLL[pllCase]} ${OLL[ollCase]}`;
      cubeView.applyScrambleFromText(text);
    }

    $('scrambleText').value = text;
    setStatus("Scramble generated.");
  } catch (e) {
    $('scrambleText').value = `Error generating scramble: ${e}`;
    setStatus("Error while generating scramble");
  }
  // If nothing got queued (e.g. no case selected), don't leave the UI frozen.
  if (!cubeView.isBusy()) { app.pendingAction = null; setActionButtonsEnabled(true); }
}

function resetCube() {
  if (app.currentSession && (app.currentSession.solves || []).length > 0) saveCurrentSession();
  startNewSession();
  try {
    let size = 3;
    if (typeGroup.currentText() === "Wca Cubes") size = parseInt(wcaGroup.currentText().split('x')[0], 10);
    else if (typeGroup.currentText() === "Big Cubes") size = parseInt(bigGroup.currentText().split('x')[0], 10);
    if (isNaN(size)) size = 3;
    cubeView.setCubeSize(size);
  } catch (e) {
    setStatus(`Cube reset failed: ${e}`);
  }
}

function modeChanged(text) {
  app.runCount = modeMap[text] || 1;
  app.currentRun = 0;
  app.runTimes = [];
  if (app.displayInterval) { clearInterval(app.displayInterval); app.displayInterval = null; }
  app.running = false;
  app.elapsed = 0;
  $('timeLabel').textContent = "00:00.00";
  updateGraph([]);
  resetStats();
  setStatus(`Mode set to ${text} — ${app.runCount} solve${app.runCount === 1 ? '' : 's'} per session`);
  resetCube();
}

function onScrambleAnimationDone() {
  setActionButtonsEnabled(true);
  if (app.pendingAction !== null) {
    const action = app.pendingAction;
    app.pendingAction = null;
    if (action === "inspection") startInspection();
    else if (action === "solve") startSolve();
    else setStatus("Scramble ready — press SPACE or click Start Inspection/Solve");
  } else {
    setStatus("Scramble ready — press SPACE or click Start Inspection/Solve");
  }
}

/* ---------------- solving ---------------- */
function startInspection() {
  if (app.pendingAction !== null) { setStatus("Wait for the scramble animation to finish"); return; }
  if ($('scrambleText').value.trim() === PLACEHOLDER) {
    generateScramble();
    app.pendingAction = "inspection";
    setStatus("Generating scramble — wait for the animation to finish…");
    return;
  }
  const secs = parseInt($('inspectSpin').value, 10) || 0;
  if (secs <= 0) { setStatus("No inspection — ready to start solve"); return; }
  app.inspecting = true;
  app.inspectionRemaining = secs;
  setInspect(`Inspection: ${secs} s`);
  app.inspectionInterval = setInterval(updateInspection, 1000);
}

function updateInspection() {
  app.inspectionRemaining -= 1;
  if (app.inspectionRemaining >= 0) {
    setInspect(`Inspection: ${app.inspectionRemaining} s`);
  } else {
    clearInterval(app.inspectionInterval);
    app.inspectionInterval = null;
    app.inspecting = false;
    app.inspectionDone = true;
    setInspect("Inspection finished — press SPACE to start solve");
  }
}

function startSolve() {
  if (app.pendingAction !== null) { setStatus("Wait for the scramble animation to finish"); return; }
  app.pbPending = false;
  app.lastPbKey = null;
  app.lastPbOldValue = null;
  app.lastPbSolveIndex = null;
  if ($('scrambleText').value.trim() === PLACEHOLDER) {
    generateScramble();
    app.pendingAction = "solve";
    setStatus("Generating scramble — wait for the animation to finish…");
    return;
  }
  const inspectSecs = parseInt($('inspectSpin').value, 10) || 0;
  if (inspectSecs > 0 && !app.inspecting && !app.inspectionDone) {
    startInspection();
    setStatus("Inspection started — press start again to solve");
    return;
  }
  if (app.inspecting) { setStatus("Finish inspection first"); return; }
  if (app.running) return;
  app.running = true;
  app.startTime = performance.now();
  app.displayInterval = setInterval(updateDisplay, 20);
  setStatus("Timing...");
}

function updateDisplay() {
  if (!app.running) return;
  app.elapsed = (performance.now() - app.startTime) / 1000;
  $('timeLabel').textContent = formatTimer(app.elapsed);
}

async function stopSolve() {
  if (!app.running) return;
  clearInterval(app.displayInterval);
  app.displayInterval = null;
  app.running = false;

  let final = (performance.now() - app.startTime) / 1000;
  $('timeLabel').textContent = formatTimer(final);

  const penaltyResult = await penaltyModal();
  if (penaltyResult === "DNF") final = Infinity;
  else if (penaltyResult === "+2") final += 2;
  $('timeLabel').textContent = formatTimer(final);

  app.runTimes.push(final);
  app.currentRun += 1;
  addSolveToSession(final, penaltyResult);

  const mode = modeGroup.currentText();
  if ((mode === "Ao5" || mode === "Ao12") && app.currentRun === 3) maybeUpdateMo3Pb();

  setStatus(`Solve recorded: ${formatTimer(final)} (run ${app.currentRun}/${app.runCount})`);
  updateGraph(app.runTimes);
  refreshSessionStats();

  if (app.currentRun >= app.runCount) {
    if (mode === "Ao5" || mode === "Ao12") {
      const avg = calculateAverage(app.runTimes);
      if (avg !== null) {
        setStatus(`${mode} complete — average: ${formatTimer(avg)}`);
        maybeUpdatePb(avg);
      }
    } else {
      maybeUpdatePb(final);
    }
    setStatus($('statusLabel').textContent + " | Session finished");
    saveCurrentSession();
  }
  app.inspectionDone = false;
}

function nextSolve() {
  app.currentRun += 1;
  $('timeLabel').textContent = "00:00.00";
  generateScramble();
  setStatus(`Ready for Solve #${app.currentRun}`);
}

function handleSpaceAction() {
  if (app.pendingAction !== null) { setStatus("Wait for the scramble animation to finish"); return; }
  if (app.running) { stopSolve(); return; }
  if ($('scrambleText').value.trim() === PLACEHOLDER) { generateScramble(); return; }
  startSolve();
}

/* ---------------- averages & PBs ---------------- */
function calculateMo3(times) {
  if (times.length < 3) return null;
  const first3 = times.slice(0, 3);
  return round3(first3.reduce((a, b) => a + b, 0) / 3);
}

function calculateAverage(times, n) {
  if (!times.length) return null;
  if (n === undefined || n === null) n = times.length;
  if (times.length < n || n <= 2) return null;
  const subset = times.slice(-n);
  if (subset.length < 3) return null;
  const sorted = subset.slice().sort((a, b) => a - b);
  const trimmed = sorted.slice(1, -1);
  return trimmed.length ? round3(trimmed.reduce((a, b) => a + b, 0) / trimmed.length) : null;
}

function maybeUpdateMo3Pb() {
  const mo3 = calculateMo3(app.runTimes);
  if (mo3 === null || mo3 === Infinity || isNaN(mo3)) return;
  const scrambleType = scramblePicker.currentText();
  const cube = wcaGroup.currentText();
  let pbKey;
  if (scrambleType === "CFOP Cross") pbKey = "Cross_Mo3";
  else if (scrambleType === "CFOP F2L") pbKey = "F2L_Mo3";
  else if (scrambleType === "CFOP OLL") { if (!app.selectedOll) return; pbKey = `OLL_${app.selectedOll}_Mo3`; }
  else if (scrambleType === "CFOP PLL") { if (!app.selectedPll) return; pbKey = `PLL_${app.selectedPll}_Mo3`; }
  else if (scrambleType === "CFOP F2L Algs") { if (!app.selectedF2l) return; pbKey = `F2LAlgs_${app.selectedF2l}_Mo3`; }
  else if (scrambleType === "CFOP LL") pbKey = "LL_Mo3";
  else pbKey = `${cube}_Mo3`;

  const oldPb = pbData[pbKey];
  if (oldPb === undefined || mo3 < oldPb) {
    if (oldPb !== undefined) {
      (pbHistory[pbKey] = pbHistory[pbKey] || []).push(oldPb);
      savePbHistory();
    }
    pbData[pbKey] = mo3;
    savePb();
    refreshPbList();
    setStatus(`New Mo3 personal best — ${pbKey}: ${formatTimer(mo3)}`);
  }
}

function maybeUpdatePb(final) {
  if (final === Infinity || isNaN(final)) return;
  const scrambleType = scramblePicker.currentText();
  const modeName = capitalize(modeGroup.currentText());
  const cube = wcaGroup.currentText();
  let pbKey;
  if (scrambleType === "CFOP Cross") pbKey = `Cross_${modeName}`;
  else if (scrambleType === "CFOP F2L") pbKey = `F2L_${modeName}`;
  else if (scrambleType === "CFOP OLL") { if (!app.selectedOll) return; pbKey = `OLL_${app.selectedOll}_${modeName}`; }
  else if (scrambleType === "CFOP PLL") { if (!app.selectedPll) return; pbKey = `PLL_${app.selectedPll}_${modeName}`; }
  else if (scrambleType === "CFOP F2L Algs") { if (!app.selectedF2l) return; pbKey = `F2LAlgs_${app.selectedF2l}_${modeName}`; }
  else if (scrambleType === "CFOP LL") pbKey = `LL_${modeName}`;
  else pbKey = `${cube}_${modeName}`;

  const oldPb = pbData[pbKey];
  if (oldPb === undefined || final < oldPb) {
    app.lastPbKey = pbKey;
    app.lastPbOldValue = oldPb === undefined ? null : oldPb;
    app.lastPbSolveIndex = app.currentRun - 1;
    app.pbPending = true;
    if (oldPb !== undefined) {
      (pbHistory[pbKey] = pbHistory[pbKey] || []).push(oldPb);
      savePbHistory();
    }
    pbData[pbKey] = final;
    savePb();
    refreshPbList();
    setStatus(`New personal best — ${pbKey}: ${formatTimer(final)}`);
  }
}

const DASH = "—";

function resetStats() {
  $('statBest').textContent = DASH;
  $('statMo3').textContent = DASH;
  $('statAo5').textContent = DASH;
  $('statCount').textContent = "0";
}

function refreshSessionStats() {
  const times = app.runTimes;
  if (!times.length) { resetStats(); return; }
  const valid = times.filter(t => t !== Infinity);
  const dnfCount = times.length - valid.length;
  const mean = n => {
    if (times.length < n) return null;
    const subset = times.slice(-n);
    const sorted = subset.slice().sort((a, b) => a - b);
    const trimmed = n > 2 ? sorted.slice(1, -1) : sorted;
    if (trimmed.some(t => t === Infinity)) return Infinity;
    return trimmed.length ? round3(trimmed.reduce((a, b) => a + b, 0) / trimmed.length) : null;
  };
  const fmtMean = v => v === null ? DASH : formatTimer(v);
  $('statBest').textContent = valid.length ? formatTimer(Math.min(...valid)) : "DNF";
  $('statMo3').textContent = fmtMean(mean(3));
  // Ao5 slot shows Ao12 instead once a full Ao12 is available
  const ao12 = mean(12);
  $('statAo5').textContent = ao12 !== null ? fmtMean(ao12) : fmtMean(mean(5));
  $('statAo5').previousElementSibling.textContent = ao12 !== null ? 'Ao12' : 'Ao5';
  $('statCount').textContent = dnfCount ? `${times.length}  (${dnfCount} DNF)` : String(times.length);
}

/* ---------------- scramble-type & cube-type handlers ---------------- */
function scrambleTypeChanged(text) {
  resetCube();
  const cfopTypes = ["CFOP Cross", "CFOP F2L", "CFOP OLL", "CFOP PLL", "CFOP LL", "CFOP F2L Algs"];
  if (cfopTypes.includes(text)) {
    typeGroup.setCurrentText("Wca Cubes");
    wcaGroup.setCurrentText("3x3");
    typeGroup.setDisabled(true);
    wcaGroup.setDisabled(true);
    bigGroup.setDisabled(true);
    otherGroup.setDisabled(true);
  } else {
    typeGroup.setDisabled(false);
    const currentType = typeGroup.currentText();
    wcaGroup.setDisabled(currentType !== "Wca Cubes");
    bigGroup.setDisabled(currentType !== "Big Cubes");
    otherGroup.setDisabled(currentType !== "Other Wca Puzzles");
  }
  $('btnChangeOll').hidden = text !== "CFOP OLL";
  $('btnChangePll').hidden = text !== "CFOP PLL";
  $('btnChangeF2l').hidden = text !== "CFOP F2L Algs";

  const noInspect = ["CFOP F2L", "CFOP OLL", "CFOP PLL", "CFOP LL", "CFOP F2L Algs"];
  if (noInspect.includes(text)) {
    $('inspectSpin').value = 0;
    $('inspectSpin').disabled = true;
  } else {
    $('inspectSpin').disabled = false;
  }

  if (text === "CFOP OLL") setTimeout(autoGenerateOll, 0);
  else if (text === "CFOP PLL") setTimeout(autoGeneratePll, 0);
  else if (text === "CFOP F2L Algs") setTimeout(autoGenerateF2l, 0);
}

async function autoGenerateOll() {
  const c = await chooseOllCase();
  if (c) { app.selectedOll = c; generateScramble(); }
}
async function autoGeneratePll() {
  const c = await choosePllCase();
  if (c) { app.selectedPll = c; generateScramble(); }
}
async function autoGenerateF2l() {
  const c = await chooseF2lCase();
  if (c) { app.selectedF2l = c; generateScramble(); }
}

/* Only the size row for the active puzzle family is shown. */
function syncSizeGroups() {
  const t = typeGroup.currentText();
  $('sizeWca').hidden = t !== "Wca Cubes";
  $('sizeBig').hidden = t !== "Big Cubes";
}

function onCubeTypeChanged(text) {
  if (text === "Wca Cubes") {
    wcaGroup.setEnabled(true); bigGroup.setEnabled(false); otherGroup.setEnabled(false);
    wcaGroup.setCurrentText("3x3");
    setStatus("WCA cubes, 2x2 to 7x7");
    cubeView.setCubeSize(3);
  } else if (text === "Big Cubes") {
    wcaGroup.setEnabled(false); bigGroup.setEnabled(true); otherGroup.setEnabled(false);
    bigGroup.setCurrentText("8x8");
    setStatus("Big cubes, 8x8 to 10x10");
    cubeView.setCubeSize(8);
  } else if (text === "Other Wca Puzzles") {
    wcaGroup.setEnabled(false); bigGroup.setEnabled(false); otherGroup.setEnabled(true);
    setStatus(`Using ${otherGroup.currentText()} — text scramble only, the 3D view stays on a 3x3`);
    cubeView.setCubeSize(3);
  }
  syncSizeGroups();
}

function onCubeChanged(text) {
  try {
    const size = parseInt(text.toLowerCase().split('x')[0], 10);
    if (!isNaN(size)) cubeView.setCubeSize(size);
  } catch (e) { /* ignore */ }
}

function onOtherPuzzleChanged(text) {
  if (typeGroup.currentText() === "Other Wca Puzzles") {
    setStatus(`Using ${text} (text scramble only — the 3D view stays on a 3x3)`);
  }
}

/* ---------------- case chooser dialogs ---------------- */
function chooseOllCase() {
  return new Promise(resolve => {
    openModal((dlg, close) => {
      dlg.appendChild(el('h3', { text: 'Choose an OLL case' }));
      const grid = el('div', { class: 'grid', style: 'grid-template-columns:repeat(6,1fr)' });
      for (const c of Object.keys(OLL).sort()) {
        grid.appendChild(el('button', {
          class: 'case-btn', text: c, title: OLL[c],
          onclick: () => { close(); resolve(c); }
        }));
      }
      dlg.appendChild(grid);
      dlg.appendChild(el('div', { class: 'row', style: 'margin-top:10px' },
        el('button', {
          class: 'plain', text: '?', title: 'Show help for OLL setup', style: 'width:40px',
          onclick: () => infoModal('OLL Help', "Pick an OLL case setup alg.\n\nLearn ur OLL setup algs here.")
        }),
        el('button', { class: 'plain', text: 'Cancel', onclick: () => { close(); resolve(null); } })));
    }, { width: '1000px' });
  });
}

function choosePllCase() {
  return new Promise(resolve => {
    openModal((dlg, close) => {
      dlg.appendChild(el('h3', { text: 'Choose a PLL case' }));
      const grid = el('div', { class: 'grid', style: 'grid-template-columns:repeat(6,1fr)' });
      for (const c of Object.keys(PLL).sort()) {
        grid.appendChild(el('button', {
          class: 'case-btn', text: c, title: PLL[c], style: 'min-width:60px',
          onclick: () => { close(); resolve(c); }
        }));
      }
      dlg.appendChild(grid);
      dlg.appendChild(el('div', { class: 'row', style: 'margin-top:10px' },
        el('button', {
          class: 'plain', text: '?', title: 'Show help for PLL setup', style: 'width:40px',
          onclick: () => infoModal('PLL Help', "Pick a PLL case setup alg.\n\nLearn ur PLL setup algs here")
        }),
        el('button', { class: 'plain', text: 'Cancel', onclick: () => { close(); resolve(null); } })));
    }, { width: '520px' });
  });
}

function chooseF2lSlotDialog() {
  return new Promise(resolve => {
    openModal((dlg, close) => {
      dlg.appendChild(el('h3', { text: 'Which direction do you want your pair to face?' }));
      dlg.appendChild(el('div', { class: 'msg', text: 'The algorithm will be remapped to insert the pair into the chosen direction.', style: 'text-align:center' }));
      const slots = [
        ["Back Left", "Back Left"], ["Back Right", "Back Right"],
        ["Front Left", "Front Left"], ["Front Right", "Front Right (current)"]
      ];
      const grid = el('div', { class: 'grid', style: 'grid-template-columns:repeat(2,1fr)' });
      for (const [slotId, label] of slots) {
        const b = el('button', { class: 'case-btn', text: label, style: 'min-height:44px' });
        if (slotId === app.selectedF2lSlot) b.style.fontWeight = 'bold';
        b.addEventListener('click', () => { close(); resolve(slotId); });
        grid.appendChild(b);
      }
      dlg.appendChild(grid);
      dlg.appendChild(el('div', { class: 'row', style: 'margin-top:10px' },
        el('button', { class: 'plain', text: 'Cancel', onclick: () => { close(); resolve(null); } })));
    }, { width: '450px' });
  });
}

async function chooseF2lCase() {
  const c = await new Promise(resolve => {
    openModal((dlg, close) => {
      dlg.appendChild(el('h3', { text: 'Choose an F2L case' }));
      const grid = el('div', { class: 'grid', style: 'grid-template-columns:repeat(5,1fr)' });
      for (const cs of Object.keys(F2L).sort(naturalCompare)) {
        grid.appendChild(el('button', {
          class: 'case-btn', text: cs.replace(/_/g, ' '), title: F2L[cs],
          onclick: () => { close(); resolve(cs); }
        }));
      }
      dlg.appendChild(grid);
      dlg.appendChild(el('div', { class: 'row', style: 'margin-top:10px' },
        el('button', {
          class: 'plain', text: '?', title: 'Show help for F2L setup', style: 'width:40px',
          onclick: () => infoModal('F2L Algs Help', "Pick an F2L case to practice its setup alg.\n\nHover over each button to preview the algorithm.")
        }),
        el('button', { class: 'plain', text: 'Cancel', onclick: () => { close(); resolve(null); } })));
    }, { width: '1100px' });
  });
  if (c) {
    app.selectedF2l = c;
    const slot = await chooseF2lSlotDialog();
    if (slot) app.selectedF2lSlot = slot;
    return c;
  }
  return null;
}

async function changeOllCase() {
  const c = await chooseOllCase();
  if (c) {
    app.selectedOll = c;
    const alg = OLL[c];
    $('scrambleText').value = `OLL ${c}: ${alg}`;
    setStatus(`OLL case changed to ${c}`);
    resetCube();
    cubeView.applyScrambleFromText(alg);
  }
}

async function changePllCase() {
  const c = await choosePllCase();
  if (c) {
    app.selectedPll = c;
    const alg = PLL[c];
    $('scrambleText').value = `PLL ${c}: ${alg}`;
    setStatus(`PLL case changed to ${c}`);
    resetCube();
    cubeView.applyScrambleFromText(alg);
  }
}

async function changeF2lCase() {
  const c = await chooseF2lCase();
  if (c) {
    app.selectedF2l = c;
    const alg = remapF2LAlg(F2L[c], app.selectedF2lSlot);
    $('scrambleText').value = `F2L ${c} (${app.selectedF2lSlot}): ${alg}`;
    setStatus(`F2L case changed to ${c.replace(/_/g, ' ')} — ${app.selectedF2lSlot}`);
    resetCube();
    cubeView.applyScrambleFromText(alg);
  }
}

/* ---------------- color scheme dialog ---------------- */
function openColorSchemeDialog() {
  const colorOptions = [
    ["Red", "#e53e3e", "#ffffff"], ["Orange", "#dd6b20", "#ffffff"],
    ["Yellow", "#d69e2e", "#000000"], ["White", "#f7fafc", "#000000"],
    ["Green", "#38a169", "#ffffff"], ["Blue", "#3182ce", "#ffffff"]
  ];
  let currentFront = null;
  const curF = (cubeView.faceColors.F || []).join(',');
  for (const [name, orient] of Object.entries(WCA_ORIENTATIONS)) {
    if (orient.F.join(',') === curF) { currentFront = name; break; }
  }
  openModal((dlg, close) => {
    dlg.appendChild(el('h3', { text: 'Which color is facing you (Front)?' }));
    dlg.appendChild(el('div', { class: 'msg', text: 'The other 5 faces will follow the standard WCA color scheme.', style: 'text-align:center' }));
    const grid = el('div', { class: 'grid', style: 'grid-template-columns:repeat(2,1fr);justify-items:center' });
    for (const [name, hex, txt] of colorOptions) {
      const isCur = name === currentFront;
      const b = el('button', {
        class: 'color-btn' + (isCur ? ' current' : ''),
        text: (isCur ? '✔  ' : '') + name
      });
      b.style.background = hex;
      b.style.color = txt;
      b.addEventListener('click', () => {
        cubeView.setFaceColors(WCA_ORIENTATIONS[name]);
        setStatus(`Color scheme set: ${name} facing front.`);
        close();
      });
      grid.appendChild(b);
    }
    dlg.appendChild(grid);
    dlg.appendChild(el('div', { class: 'row', style: 'margin-top:12px' },
      el('button', { class: 'plain', text: 'Cancel', onclick: close })));
  }, { width: '440px' });
}

/* ---------------- dark mode & help ---------------- */
onThemeChange(() => {
  cubeView.draw();
  solverView.draw();
  updateGraph(app.runTimes);
});

function toggleGraph() {
  const wrap = $('graphWrap');
  wrap.hidden = !wrap.hidden;
  $('btnGraph').classList.toggle('on', !wrap.hidden);
  if (!wrap.hidden) updateGraph(app.runTimes);
}

function showKeyboardShortcuts() {
  infoModal("Keyboard shortcuts",
    "Space — start or stop the solve\n" +
    "G or S — new scramble\n" +
    "I — start inspection\n" +
    "N — next solve (Ao5 and Ao12)\n" +
    "Ctrl + D — switch theme\n\n" +
    "On the cube: drag to rotate, scroll to zoom, double-click to reset, right-click for colours.");
}

function showHelpManual() {
  infoModal("How to use the timer",
    "1. Pick your puzzle, mode and inspection time along the top.\n" +
    "2. Press New scramble, or G. The cube animates the scramble.\n" +
    "3. Press Inspect, or I, if you want the countdown.\n" +
    "4. Hit space to start, and space again to stop.\n" +
    "5. Mark the solve as +2 or DNF if needed.\n" +
    "6. In Ao5 or Ao12, press Next solve to continue the session.\n\n" +
    "Personal bests save automatically and survive a refresh.");
}

function showHelpMenu() {
  openModal((dlg, close) => {
    dlg.appendChild(el('h3', { text: 'Help & Info' }));
    dlg.appendChild(el('div', { class: 'msg', text: 'Select what you want to view:' }));
    dlg.appendChild(el('button', { class: 'help-menu-btn', text: 'How to use the timer', onclick: () => { close(); showHelpManual(); } }));
    dlg.appendChild(el('button', { class: 'help-menu-btn', text: 'Keyboard shortcuts', onclick: () => { close(); showKeyboardShortcuts(); } }));
    dlg.appendChild(el('button', { class: 'help-menu-btn hm-close', text: 'Close', onclick: close }));
  }, { width: '360px' });
}

/* ---------------- manage PBs dialog ---------------- */
function managePbs() {
  const categories = {
    "Single PBs": ["Single"],
    "Average PBs": ["Mo3", "Ao5", "Ao12"],
    "Cross PBs": ["Cross"],
    "F2L PBs": ["F2L"],
    "OLL PBs": ["OLL"],
    "PLL PBs": ["PLL"],
    "LL PBs": ["LL"]
  };
  const catNames = Object.keys(categories);
  const listKeysFor = cat => {
    const kws = categories[cat];
    return Object.keys(pbData).sort().filter(key =>
      kws.some(kw => key.includes(kw)) &&
      !(cat === "LL PBs" && (key.includes("OLL") || key.includes("PLL"))));
  };

  openModal((dlg, close) => {
    dlg.appendChild(el('h3', { text: 'Manage personal bests' }));
    dlg.appendChild(el('div', { class: 'msg', text: 'Select PBs you want to delete (organized by category):' }));

    const tabBar = el('div', { class: 'tab-bar' });
    const paneWrap = el('div');
    const panes = {};
    let active = catNames[0];
    const tabBtns = {};

    for (const cat of catNames) {
      const pane = el('div', { class: 'pb-check-list' });
      pane.style.display = 'none';
      for (const key of listKeysFor(cat)) {
        const cb = el('input', { type: 'checkbox' });
        cb.dataset.key = key;
        pane.appendChild(el('label', {}, cb, `${key}: ${formatTimer(pbData[key])}`));
      }
      panes[cat] = pane;
      paneWrap.appendChild(pane);

      const tb = el('button', { text: cat });
      tb.addEventListener('click', () => {
        active = cat;
        for (const c of catNames) panes[c].style.display = c === cat ? 'block' : 'none';
        for (const c of catNames) tabBtns[c].classList.toggle('active', c === cat);
      });
      tabBtns[cat] = tb;
      tabBar.appendChild(tb);
    }
    dlg.appendChild(tabBar);
    dlg.appendChild(paneWrap);
    panes[active].style.display = 'block';
    tabBtns[active].classList.add('active');

    const stats = el('div', { class: 'msg', style: 'margin-top:8px;font-size:12.5px' });
    stats.textContent = `Total PBs: ${Object.keys(pbData).length} | ` +
      catNames.map(cat => `${cat.replace(' PBs', '')}: ${listKeysFor(cat).length}`).join(' | ');
    dlg.appendChild(stats);

    const deleteKeys = keys => {
      for (const k of keys) {
        delete pbData[k];
        restorePbFromHistory(k);
      }
      savePb(); savePbHistory(); refreshPbList();
      close();
      managePbs();
    };

    const bDel = el('button', { class: 'plain', text: 'Delete selected' });
    bDel.addEventListener('click', async () => {
      const keys = [];
      paneWrap.querySelectorAll('input[type=checkbox]').forEach(cb => { if (cb.checked) keys.push(cb.dataset.key); });
      if (!keys.length) { await infoModal('Nothing Selected', 'No PBs selected.'); return; }
      if (await confirmModal('Confirm Delete', `Delete ${keys.length} selected PB(s)?`)) deleteKeys(keys);
    });
    const bCat = el('button', { class: 'plain', text: 'Clear this category' });
    bCat.addEventListener('click', async () => {
      const keys = listKeysFor(active);
      if (!keys.length) { await infoModal('No PBs', `No PBs in ${active}.`); return; }
      if (await confirmModal('Clear Category', `Delete all ${keys.length} PB(s) in ${active}?`)) deleteKeys(keys);
    });
    const bAll = el('button', { class: 'plain', text: 'Clear all PBs' });
    bAll.addEventListener('click', async () => {
      if (await confirmModal('Clear all PBs', "This permanently deletes every personal best.\n\nContinue?")) {
        pbData = {};
        pbHistory = {};
        savePb(); savePbHistory(); refreshPbList();
        close();
      }
    });
    const bCancel = el('button', { class: 'plain', text: 'Cancel', onclick: close });
    dlg.appendChild(el('div', { class: 'row', style: 'margin-top:8px' }, bDel, bCat, bAll, bCancel));
  }, { width: '880px' });
}

/* =====================================================================
   Cube Solver page (port of CubeSolverPage)
   ===================================================================== */
const solver = { scrambleMoves: [], solving: false };
const SOLVER_VALID_MOVE = /^[2-9]?[RLUDFB]w?[2']?$|^[MESxyz][2']?$/;

function solverGenerate() {
  if (solverView.isBusy()) return;
  const n = parseInt($('solverSize').value.split('x')[0], 10);
  solverView.setCubeSize(n);
  const scramble = generateWCAScramble(n);
  solver.scrambleMoves = scramble.trim().split(/\s+/);
  $('solverScramble').value = scramble;
  $('btnSolverGen').disabled = true;
  $('btnSolverApply').disabled = true;
  $('btnSolverSolve').disabled = true;
  $('solverStatus').textContent = "Scrambling…";
  solver.solving = false;
  solverView.applyScrambleFromText(scramble);
}

function solverApply() {
  if (solverView.isBusy()) return;
  const raw = $('solverScramble').value.trim();
  if (!raw) { $('solverStatus').textContent = "Type or paste a scramble first"; return; }
  const moves = raw.split(/\s+/);
  const bad = moves.filter(m => !SOLVER_VALID_MOVE.test(m));
  if (bad.length) {
    $('solverStatus').textContent = `Unrecognised move(s): ${bad.slice(0, 5).join(', ')}${bad.length > 5 ? '…' : ''}`;
    return;
  }
  const n = parseInt($('solverSize').value.split('x')[0], 10);
  solverView.setCubeSize(n);
  solver.scrambleMoves = moves;
  $('solverScramble').value = moves.join(' ');
  $('btnSolverGen').disabled = true;
  $('btnSolverApply').disabled = true;
  $('btnSolverSolve').disabled = true;
  $('solverStatus').textContent = "Scrambling…";
  solver.solving = false;
  solverView.applyScrambleFromText(moves.join(' '));
}

function solverSolve() {
  if (!solver.scrambleMoves.length) return;
  if (solverView.isBusy()) return;
  const solution = invertScramble(solver.scrambleMoves);
  $('btnSolverGen').disabled = true;
  $('btnSolverApply').disabled = true;
  $('btnSolverSolve').disabled = true;
  $('solverStatus').textContent = "Solving…";
  solver.solving = true;
  solverView.applyScrambleFromText(solution.join(' '));
}

function solverOnDone() {
  if (solver.solving) {
    solver.scrambleMoves = [];
    $('solverScramble').value = "Solved";
    $('solverStatus').textContent = "Cube solved! Generate a new scramble to continue.";
    $('btnSolverSolve').disabled = true;
  } else {
    $('solverStatus').textContent = "Scramble applied. Ready to solve.";
    $('btnSolverSolve').disabled = false;
  }
  $('btnSolverGen').disabled = false;
  $('btnSolverApply').disabled = false;
  solver.solving = false;
}

function solverOnSizeChanged() {
  const n = parseInt($('solverSize').value.split('x')[0], 10);
  solverView.setCubeSize(n);
  solver.scrambleMoves = [];
  $('solverScramble').value = "";
  $('btnSolverSolve').disabled = true;
  $('btnSolverApply').disabled = false;
  $('solverStatus').textContent = "";
}

function solverHandleSpace() {
  if (isModalOpen()) return;
  if (solverView.isBusy()) return;
  if (!$('btnSolverSolve').disabled) solverSolve();
  else if (!$('btnSolverGen').disabled) solverGenerate();
}

function showSolver(show) {
  app.solverActive = show;
  $('timerPage').style.display = show ? 'none' : 'block';
  $('solverPage').style.display = show ? 'block' : 'none';
  if (show) solverView.draw();
  else { cubeView.draw(); updateGraph(app.runTimes); }
}

/* =====================================================================
   Init (port of RubikTimer.__init__ / init_ui)
   ===================================================================== */
const cubeView = new CubeView($('cubeCanvas'), 3);
const solverView = new CubeView($('solverCanvas'), 3);

const typeGroup = new ButtonGroup($('typeGroup'), CUBE_TYPES, onCubeTypeChanged, {
  labels: { "Wca Cubes": "WCA", "Big Cubes": "Big cubes", "Other Wca Puzzles": "Other · next update" },
  locked: ["Other Wca Puzzles"],
  onLocked: () => nextUpdateNotice("Other WCA puzzles",
    "Pyraminx, Megaminx, Skewb, Square-1 and Clock support is built but still being tested.")
});
const wcaGroup = new ButtonGroup($('wcaGroup'), WCA_CUBE_LABELS, onCubeChanged);
const bigGroup = new ButtonGroup($('bigGroup'), BIG_CUBE_LABELS, onCubeChanged);
// Kept off-screen: the puzzle list is hidden until "Other Puzzles" is unlocked,
// but the rest of the app still reads from this group.
const otherGroup = new ButtonGroup(document.createElement('div'), OTHER_WCA_LABELS, onOtherPuzzleChanged);
const modeGroup = new ButtonGroup($('modeGroup'), Object.keys(modeMap), modeChanged);
const scramblePicker = new ScramblePicker(scrambleTypeChanged);

wcaGroup.setCurrentText("3x3", false);
wcaGroup.setEnabled(true);
bigGroup.setEnabled(false);
otherGroup.setEnabled(false);

cubeView.onFinished = onScrambleAnimationDone;
cubeView.onColorRequested = openColorSchemeDialog;
solverView.onFinished = solverOnDone;

$('scrambleText').value = PLACEHOLDER;

$('btnHelp').addEventListener('click', showHelpMenu);
$('btnGenerate').addEventListener('click', () => generateScramble());
$('btnInspect').addEventListener('click', startInspection);
$('btnSolve').addEventListener('click', startSolve);
$('btnStop').addEventListener('click', () => stopSolve());
$('btnNext').addEventListener('click', nextSolve);
$('btnManagePbs').addEventListener('click', managePbs);
$('btnGraph').addEventListener('click', toggleGraph);
$('btnCubeSolver').addEventListener('click', () => nextUpdateNotice("The Cube Solver",
  "The step-by-step solver page is still in progress."));
$('btnBack').addEventListener('click', () => showSolver(false));
$('btnColor').addEventListener('click', openColorSchemeDialog);
$('btnChangeOll').addEventListener('click', changeOllCase);
$('btnChangePll').addEventListener('click', changePllCase);
$('btnChangeF2l').addEventListener('click', changeF2lCase);

$('speedSlider').addEventListener('input', e => {
  const v = +e.target.value;
  cubeView.stepDeg = v;
  $('speedVal').textContent = `${v}°/frame`;
  setStatus(`Cube speed set to ${v}° per frame`);
});
$('solverSpeed').addEventListener('input', e => {
  const v = +e.target.value;
  solverView.stepDeg = v;
  $('solverSpeedVal').textContent = `${v}°/frame`;
});
$('solverSize').addEventListener('change', solverOnSizeChanged);
$('btnSolverGen').addEventListener('click', solverGenerate);
$('btnSolverApply').addEventListener('click', solverApply);
$('btnSolverSolve').addEventListener('click', solverSolve);

document.addEventListener('keydown', e => {
  if (isModalOpen()) return;
  if (app.solverActive) {
    if (e.code === 'Space') {
      if (document.activeElement === $('solverScramble')) return;
      e.preventDefault();
      solverHandleSpace();
    }
    return;
  }
  if (e.code === 'Space') {
    e.preventDefault();
    if (isScrambleAnimating()) { setStatus("Wait for the scramble animation to finish"); return; }
    handleSpaceAction();
    return;
  }
  if (isScrambleAnimating()) { setStatus("Wait for the scramble animation to finish"); return; }
  if (app.running) return;
  const k = e.key.toLowerCase();
  if (k === 'g' || k === 's') generateScramble();
  else if (k === 'n') nextSolve();
  else if (k === 'i') startInspection();
});

window.addEventListener('resize', () => {
  if (app.solverActive) solverView.draw();
  else { cubeView.draw(); updateGraph(app.runTimes); }
});
window.addEventListener('beforeunload', () => {
  if (app.currentSession && app.currentSession.solves.length > 0) saveCurrentSession();
});

syncSizeGroups();
modeChanged(modeGroup.currentText());
refreshPbList();
resetStats();


