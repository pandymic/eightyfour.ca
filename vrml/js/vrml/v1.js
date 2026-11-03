// VRML 1.0 support. 1.0 is Open Inventor's file format with the serial
// numbers filed off: a traversal state machine where a Material node
// changes the color of everything that comes after it in the same
// Separator. We parse it, walk it once with a state stack, and emit
// equivalent VRML 2.0 nodes. Static scenes only, which is fine, because
// VRML 1.0 had no way to move anything anyway.

import { Schema } from './node.js';
import { mat4 } from './math.js';
import { cloneValue } from './fields.js';

const f = (type, name, value) => ({ kind: 'field', type, name, value });

const V1 = {
  AsciiText: [f('MFString', 'string', ['']), f('SFFloat', 'spacing', 1), f('SFEnum', 'justification', 'LEFT'), f('MFFloat', 'width', [0])],
  Cone: [f('SFBitMask', 'parts', ['ALL']), f('SFFloat', 'bottomRadius', 1), f('SFFloat', 'height', 2)],
  Coordinate3: [f('MFVec3f', 'point', [[0, 0, 0]])],
  Cube: [f('SFFloat', 'width', 2), f('SFFloat', 'height', 2), f('SFFloat', 'depth', 2)],
  Cylinder: [f('SFBitMask', 'parts', ['ALL']), f('SFFloat', 'radius', 1), f('SFFloat', 'height', 2)],
  DirectionalLight: [f('SFBool', 'on', true), f('SFFloat', 'intensity', 1), f('SFColor', 'color', [1, 1, 1]), f('SFVec3f', 'direction', [0, 0, -1])],
  FontStyle: [f('SFFloat', 'size', 10), f('SFEnum', 'family', 'SERIF'), f('SFBitMask', 'style', ['NONE'])],
  Group: [],
  IndexedFaceSet: [f('MFLong', 'coordIndex', [0]), f('MFLong', 'materialIndex', [-1]), f('MFLong', 'normalIndex', [-1]), f('MFLong', 'textureCoordIndex', [-1])],
  IndexedLineSet: [f('MFLong', 'coordIndex', [0]), f('MFLong', 'materialIndex', [-1]), f('MFLong', 'normalIndex', [-1]), f('MFLong', 'textureCoordIndex', [-1])],
  Info: [f('SFString', 'string', '<Undefined info>')],
  LOD: [f('MFFloat', 'range', []), f('SFVec3f', 'center', [0, 0, 0])],
  Material: [
    f('MFColor', 'ambientColor', [[0.2, 0.2, 0.2]]), f('MFColor', 'diffuseColor', [[0.8, 0.8, 0.8]]),
    f('MFColor', 'specularColor', [[0, 0, 0]]), f('MFColor', 'emissiveColor', [[0, 0, 0]]),
    f('MFFloat', 'shininess', [0.2]), f('MFFloat', 'transparency', [0]),
  ],
  MaterialBinding: [f('SFEnum', 'value', 'OVERALL')],
  MatrixTransform: [f('SFMatrix', 'matrix', [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])],
  Normal: [f('MFVec3f', 'vector', [])],
  NormalBinding: [f('SFEnum', 'value', 'DEFAULT')],
  OrthographicCamera: [f('SFVec3f', 'position', [0, 0, 1]), f('SFRotation', 'orientation', [0, 0, 1, 0]), f('SFFloat', 'focalDistance', 5), f('SFFloat', 'height', 2)],
  PerspectiveCamera: [f('SFVec3f', 'position', [0, 0, 1]), f('SFRotation', 'orientation', [0, 0, 1, 0]), f('SFFloat', 'focalDistance', 5), f('SFFloat', 'heightAngle', 0.785398)],
  PointLight: [f('SFBool', 'on', true), f('SFFloat', 'intensity', 1), f('SFColor', 'color', [1, 1, 1]), f('SFVec3f', 'location', [0, 0, 1])],
  PointSet: [f('SFLong', 'startIndex', 0), f('SFLong', 'numPoints', -1)],
  Rotation: [f('SFRotation', 'rotation', [0, 0, 1, 0])],
  Scale: [f('SFVec3f', 'scaleFactor', [1, 1, 1])],
  Separator: [f('SFEnum', 'renderCulling', 'AUTO')],
  ShapeHints: [f('SFEnum', 'vertexOrdering', 'UNKNOWN_ORDERING'), f('SFEnum', 'shapeType', 'UNKNOWN_SHAPE_TYPE'), f('SFEnum', 'faceType', 'CONVEX'), f('SFFloat', 'creaseAngle', 0.5)],
  Sphere: [f('SFFloat', 'radius', 1)],
  SpotLight: [
    f('SFBool', 'on', true), f('SFFloat', 'intensity', 1), f('SFColor', 'color', [1, 1, 1]),
    f('SFVec3f', 'location', [0, 0, 1]), f('SFVec3f', 'direction', [0, 0, -1]),
    f('SFFloat', 'dropOffRate', 0), f('SFFloat', 'cutOffAngle', 0.785398),
  ],
  Switch: [f('SFLong', 'whichChild', -1)],
  Texture2: [f('SFString', 'filename', ''), f('SFImage', 'image', { w: 0, h: 0, nc: 0, pixels: [] }), f('SFEnum', 'wrapS', 'REPEAT'), f('SFEnum', 'wrapT', 'REPEAT')],
  Texture2Transform: [f('SFVec2f', 'translation', [0, 0]), f('SFFloat', 'rotation', 0), f('SFVec2f', 'scaleFactor', [1, 1]), f('SFVec2f', 'center', [0, 0])],
  TextureCoordinate2: [f('MFVec2f', 'point', [[0, 0]])],
  Transform: [
    f('SFVec3f', 'translation', [0, 0, 0]), f('SFRotation', 'rotation', [0, 0, 1, 0]),
    f('SFVec3f', 'scaleFactor', [1, 1, 1]), f('SFRotation', 'scaleOrientation', [0, 0, 1, 0]),
    f('SFVec3f', 'center', [0, 0, 0]),
  ],
  TransformSeparator: [],
  Translation: [f('SFVec3f', 'translation', [0, 0, 0])],
  WWWAnchor: [f('SFString', 'name', ''), f('SFString', 'description', ''), f('SFEnum', 'map', 'NONE')],
  WWWInline: [f('SFString', 'name', ''), f('SFVec3f', 'bboxSize', [0, 0, 0]), f('SFVec3f', 'bboxCenter', [0, 0, 0])],
};

let cache = null;
export function v1Schemas() {
  if (cache) return cache;
  cache = new Map();
  for (const [k, decls] of Object.entries(V1)) cache.set(k, new Schema(k, decls));
  return cache;
}
export const V1_NODE_NAMES = Object.keys(V1);

// ---------- conversion ----------

function freshState() {
  return {
    matrix: mat4.identity(),
    material: null, // v1 Material node fields
    materialBinding: 'OVERALL',
    normal: null,
    normalBinding: 'DEFAULT',
    coords: [],
    texCoords: null,
    texture: null,
    texTransform: null,
    hints: { vertexOrdering: 'UNKNOWN_ORDERING', shapeType: 'UNKNOWN_SHAPE_TYPE', faceType: 'CONVEX', creaseAngle: 0.5 },
    font: { size: 10, family: 'SERIF', style: ['NONE'] },
  };
}
function copyState(s) {
  return { ...s, matrix: mat4.clone(s.matrix), hints: { ...s.hints }, font: { ...s.font } };
}

function transformMatrix(n) {
  const v = n.f;
  const T = mat4.translation(...v.translation);
  const C = mat4.translation(...v.center);
  const Ci = mat4.translation(-v.center[0], -v.center[1], -v.center[2]);
  const R = mat4.rotation(...v.rotation);
  const SR = mat4.rotation(...v.scaleOrientation);
  const SRi = mat4.rotation(v.scaleOrientation[0], v.scaleOrientation[1], v.scaleOrientation[2], -v.scaleOrientation[3]);
  const S = mat4.scaling(...v.scaleFactor);
  let m = mat4.multiply(T, C);
  m = mat4.multiply(m, R);
  m = mat4.multiply(m, SR);
  m = mat4.multiply(m, S);
  m = mat4.multiply(m, SRi);
  return mat4.multiply(m, Ci);
}

export function convertV1(tree, world, created) {
  const mk = (type, fields = {}) => {
    const n = world.createNode(type);
    Object.assign(n.f, fields);
    created.push(n);
    return n;
  };
  let sawCamera = false;
  const out = [];

  const wrap = (state, node) => mk('MatrixTransform', { matrix: Array.from(state.matrix), children: [node] });

  const appearance = (state, opts = {}) => {
    const m = state.material?.f;
    const pick = (arr, i, d) => (arr && arr.length ? arr[Math.min(i, arr.length - 1)] : d);
    const i = opts.index || 0;
    const mat = mk('Material', {
      diffuseColor: cloneValue(pick(m?.diffuseColor, i, [0.8, 0.8, 0.8])),
      emissiveColor: cloneValue(pick(m?.emissiveColor, i, [0, 0, 0])),
      specularColor: cloneValue(pick(m?.specularColor, i, [0, 0, 0])),
      shininess: pick(m?.shininess, i, 0.2),
      transparency: pick(m?.transparency, i, 0),
      ambientIntensity: (() => {
        const a = pick(m?.ambientColor, i, [0.2, 0.2, 0.2]);
        const d = pick(m?.diffuseColor, i, [0.8, 0.8, 0.8]);
        const dm = Math.max(...d) || 1;
        return Math.min(1, Math.max(...a) / dm);
      })(),
    });
    const app = mk('Appearance', { material: mat });
    if (state.texture) {
      const t = state.texture.f;
      const rs = t.wrapS !== 'CLAMP', rt = t.wrapT !== 'CLAMP';
      if (t.image && t.image.w > 0) app.f.texture = mk('PixelTexture', { image: cloneValue(t.image), repeatS: rs, repeatT: rt });
      else if (t.filename) app.f.texture = mk('ImageTexture', { url: [t.filename], repeatS: rs, repeatT: rt });
    }
    if (state.texTransform) {
      const t = state.texTransform.f;
      app.f.textureTransform = mk('TextureTransform', {
        translation: cloneValue(t.translation), rotation: t.rotation, scale: cloneValue(t.scaleFactor), center: cloneValue(t.center),
      });
    }
    return app;
  };

  const shape = (state, geom, opts) => wrap(state, mk('Shape', { appearance: appearance(state, opts), geometry: geom }));

  // Per-face / per-vertex material bindings become a Color node.
  const colorBinding = (state, geom, n) => {
    const b = state.materialBinding;
    const diff = state.material?.f.diffuseColor;
    if (!diff || diff.length < 2) return;
    if (/PER_(FACE|PART)/.test(b) || /PER_VERTEX/.test(b)) {
      geom.f.color = mk('Color', { color: cloneValue(diff) });
      geom.f.colorPerVertex = /PER_VERTEX/.test(b);
      if (/INDEXED/.test(b) && n.f.materialIndex && n.f.materialIndex[0] !== -1) {
        geom.f.colorIndex = n.f.materialIndex.slice();
      } else if (!/PER_VERTEX/.test(b)) {
        // PER_FACE without index: face i gets color i
        let faces = 0;
        const ci = [];
        for (const k of n.f.coordIndex) if (k < 0) ci.push(faces++);
        if (n.f.coordIndex.length && n.f.coordIndex[n.f.coordIndex.length - 1] >= 0) ci.push(faces);
        geom.f.colorIndex = ci;
      }
    }
  };

  const walk = (node, state, sink) => {
    if (!node || node.unknown) return;
    const v = node.f;
    switch (node.type) {
      case 'Separator': {
        const s = copyState(state);
        for (const c of node.children) walk(c, s, sink);
        break;
      }
      case 'TransformSeparator': {
        const saved = mat4.clone(state.matrix);
        for (const c of node.children) walk(c, state, sink);
        state.matrix = saved;
        break;
      }
      case 'Group':
        for (const c of node.children) walk(c, state, sink);
        break;
      case 'Switch': {
        const w = v.whichChild;
        if (w === -3) for (const c of node.children) walk(c, state, sink);
        else if (w >= 0 && node.children[w]) walk(node.children[w], state, sink);
        break;
      }
      case 'LOD': {
        const levels = node.children.map((c) => {
          const grp = [];
          walk(c, copyState(state), grp);
          return mk('Group', { children: grp });
        });
        const center = mat4.transformPoint(state.matrix, v.center);
        sink.push(mk('LOD', { level: levels, range: v.range.slice(), center }));
        break;
      }
      case 'WWWAnchor': {
        const kids = [];
        const s = copyState(state);
        for (const c of node.children) walk(c, s, kids);
        sink.push(mk('Anchor', { url: v.name ? [v.name] : [], description: v.description, children: kids }));
        break;
      }
      case 'WWWInline':
        if (v.name) sink.push(wrap(state, mk('Inline', { url: [v.name] })));
        break;
      case 'Transform': state.matrix = mat4.multiply(state.matrix, transformMatrix(node)); break;
      case 'Translation': state.matrix = mat4.multiply(state.matrix, mat4.translation(...v.translation)); break;
      case 'Rotation': state.matrix = mat4.multiply(state.matrix, mat4.rotation(...v.rotation)); break;
      case 'Scale': state.matrix = mat4.multiply(state.matrix, mat4.scaling(...v.scaleFactor)); break;
      case 'MatrixTransform': state.matrix = mat4.multiply(state.matrix, new Float32Array(v.matrix)); break;
      case 'Material': state.material = node; break;
      case 'MaterialBinding': state.materialBinding = v.value; break;
      case 'Normal': state.normal = node; break;
      case 'NormalBinding': state.normalBinding = v.value; break;
      case 'Coordinate3': state.coords = v.point; break;
      case 'TextureCoordinate2': state.texCoords = v.point; break;
      case 'Texture2': state.texture = node; break;
      case 'Texture2Transform': state.texTransform = node; break;
      case 'ShapeHints': state.hints = { ...v }; break;
      case 'FontStyle': state.font = { ...v }; break;
      case 'Info': world.info.push(v.string); break;

      case 'Cube':
        sink.push(shape(state, mk('Box', { size: [v.width, v.height, v.depth] })));
        break;
      case 'Sphere':
        sink.push(shape(state, mk('Sphere', { radius: v.radius })));
        break;
      case 'Cone': {
        const all = v.parts.includes('ALL');
        sink.push(shape(state, mk('Cone', {
          bottomRadius: v.bottomRadius, height: v.height,
          side: all || v.parts.includes('SIDES'), bottom: all || v.parts.includes('BOTTOM'),
        })));
        break;
      }
      case 'Cylinder': {
        const all = v.parts.includes('ALL');
        sink.push(shape(state, mk('Cylinder', {
          radius: v.radius, height: v.height,
          side: all || v.parts.includes('SIDES'), top: all || v.parts.includes('TOP'), bottom: all || v.parts.includes('BOTTOM'),
        })));
        break;
      }
      case 'IndexedFaceSet': {
        const h = state.hints;
        const g = mk('IndexedFaceSet', {
          coord: mk('Coordinate', { point: cloneValue(state.coords) }),
          coordIndex: v.coordIndex.slice(),
          // In 1.0, unknown ordering means "draw both sides", which is the safe bet.
          solid: h.shapeType === 'SOLID' && h.vertexOrdering !== 'UNKNOWN_ORDERING',
          ccw: h.vertexOrdering !== 'CLOCKWISE',
          convex: h.faceType === 'CONVEX',
          creaseAngle: h.creaseAngle,
        });
        if (state.normal && state.normalBinding !== 'DEFAULT' && state.normal.f.vector.length) {
          g.f.normal = mk('Normal', { vector: cloneValue(state.normal.f.vector) });
          g.f.normalPerVertex = /VERTEX/.test(state.normalBinding);
          if (/INDEXED/.test(state.normalBinding) && v.normalIndex[0] !== -1) g.f.normalIndex = v.normalIndex.slice();
        }
        if (state.texCoords && v.textureCoordIndex[0] !== -1) {
          g.f.texCoord = mk('TextureCoordinate', { point: cloneValue(state.texCoords) });
          g.f.texCoordIndex = v.textureCoordIndex.slice();
        }
        colorBinding(state, g, node);
        sink.push(shape(state, g));
        break;
      }
      case 'IndexedLineSet': {
        const g = mk('IndexedLineSet', {
          coord: mk('Coordinate', { point: cloneValue(state.coords) }),
          coordIndex: v.coordIndex.slice(),
        });
        colorBinding(state, g, node);
        // lines are unlit in 2.0; carry the diffuse color across as emissive
        const app = appearance(state);
        app.f.material.f.emissiveColor = cloneValue(app.f.material.f.diffuseColor);
        sink.push(wrap(state, mk('Shape', { appearance: app, geometry: g })));
        break;
      }
      case 'PointSet': {
        const start = v.startIndex;
        const end = v.numPoints < 0 ? state.coords.length : start + v.numPoints;
        const g = mk('PointSet', { coord: mk('Coordinate', { point: cloneValue(state.coords.slice(start, end)) }) });
        const app = appearance(state);
        app.f.material.f.emissiveColor = cloneValue(app.f.material.f.diffuseColor);
        sink.push(wrap(state, mk('Shape', { appearance: app, geometry: g })));
        break;
      }
      case 'AsciiText': {
        const fs = state.font;
        const fam = { SERIF: 'SERIF', SANS: 'SANS', TYPEWRITER: 'TYPEWRITER' }[fs.family] || 'SERIF';
        const st = fs.style.includes('BOLD') && fs.style.includes('ITALIC') ? 'BOLDITALIC'
          : fs.style.includes('BOLD') ? 'BOLD' : fs.style.includes('ITALIC') ? 'ITALIC' : 'PLAIN';
        const just = { LEFT: 'BEGIN', CENTER: 'MIDDLE', RIGHT: 'END' }[v.justification] || 'BEGIN';
        const g = mk('Text', {
          string: v.string.slice(),
          fontStyle: mk('FontStyle', { size: fs.size, family: [fam], style: st, justify: [just], spacing: v.spacing }),
        });
        sink.push(shape(state, g));
        break;
      }
      case 'DirectionalLight': {
        // In 1.0 a light shines on everything after it. A 2.0 DirectionalLight
        // only lights its own group, so bake the direction and leave it unwrapped.
        const d = mat4.transformDir(state.matrix, v.direction);
        sink.push(mk('DirectionalLight', { on: v.on, intensity: v.intensity, color: cloneValue(v.color), direction: d }));
        break;
      }
      case 'PointLight':
        sink.push(wrap(state, mk('PointLight', { on: v.on, intensity: v.intensity, color: cloneValue(v.color), location: cloneValue(v.location) })));
        break;
      case 'SpotLight':
        sink.push(wrap(state, mk('SpotLight', {
          on: v.on, intensity: v.intensity, color: cloneValue(v.color), location: cloneValue(v.location),
          direction: cloneValue(v.direction), cutOffAngle: v.cutOffAngle,
          beamWidth: v.dropOffRate > 0 ? v.cutOffAngle * (1 - v.dropOffRate) : v.cutOffAngle,
        })));
        break;
      case 'PerspectiveCamera':
      case 'OrthographicCamera': {
        const vp = mk('Viewpoint', {
          position: cloneValue(v.position), orientation: cloneValue(v.orientation),
          fieldOfView: node.type === 'PerspectiveCamera' ? v.heightAngle : 0.785398,
          description: node.name || (sawCamera ? 'Camera' : 'Entry'),
        });
        if (node.type === 'OrthographicCamera') {
          world.warn('OrthographicCamera shown in perspective. Nobody used it anyway.');
        }
        sawCamera = true;
        sink.push(wrap(state, vp));
        break;
      }
      default:
        world.warn(`VRML 1.0 node ${node.type} is understood but ignored here`);
    }
  };

  const root = freshState();
  for (const n of tree) walk(n, root, out);
  return out;
}
