/**
 * カスタムシェーダー集。
 * heroVertex / heroFragment: ヒーロー画像プレーン用（微細な屈折・視差・金の光沢・ヴィネット）
 * mistFragment: 手前に重ねる墨と霧の流体レイヤー
 * fresnelVertex / fresnelFragment: 最終CTAの氷オブジェクト用（フレネル発光）
 */

const noiseGLSL = /* glsl */ `
  // 軽量 value noise + fbm（2オクターブ）
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    v += 0.6 * vnoise(p);
    v += 0.4 * vnoise(p * 2.3);
    return v;
  }
`;

export const heroVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const heroFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform vec2 uMouse;      // -1..1
  uniform float uScroll;    // 0..1
  uniform vec2 uUvScale;    // cover 変換
  uniform vec2 uUvOffset;
  uniform float uReveal;    // 0..1 霧の中から現れる
  varying vec2 vUv;

  ${noiseGLSL}

  void main() {
    // cover fit
    vec2 uv = vUv * uUvScale + uUvOffset;

    // スクロールでゆっくり寄る
    float zoom = 1.0 - uScroll * 0.05 - uReveal * 0.03;
    uv = (uv - 0.5) * zoom + 0.5;

    // マウス視差（奥のレイヤーがわずかに遅れて動く感覚）
    uv += uMouse * vec2(0.006, 0.004);

    // 氷の表面を思わせる微細な屈折
    float n = fbm(uv * 3.0 + uTime * 0.04);
    vec2 refr = (n - 0.5) * 0.008 * vec2(1.0, 0.7);
    // 水面のようなゆらぎの筋
    refr.x += sin((uv.y + n * 0.25) * 28.0 - uTime * 0.25) * 0.0012;
    uv += refr;

    // 端に向かうほど僅かな色収差（レンズ・氷越しの光）
    vec2 fromCenter = vUv - 0.5;
    float edge = dot(fromCenter, fromCenter);
    vec2 ca = fromCenter * edge * 0.012;
    float r = texture2D(uMap, uv + ca).r;
    vec2 gbSample = uv - ca;
    vec4 tex = texture2D(uMap, uv);
    vec3 color = vec3(r, tex.g, texture2D(uMap, gbSample).b);

    // わずかに冷たいカラーグレード（氷の透明感）
    color = mix(color, color * vec3(0.96, 0.985, 1.03), 0.45);

    // マウス位置に追従する金の光
    vec2 mouse01 = uMouse * 0.5 + 0.5;
    float d = distance(vUv, mouse01);
    float glow = smoothstep(0.55, 0.0, d);
    color += vec3(0.78, 0.63, 0.36) * glow * 0.10;

    // 高周波ノイズによる微細な金の煌めき
    float sparkleNoise = vnoise(uv * 220.0 + floor(uTime * 1.5) * 7.0);
    float sparkle = smoothstep(0.985, 1.0, sparkleNoise);
    float pulse = 0.5 + 0.5 * sin(uTime * 2.0 + sparkleNoise * 40.0);
    color += vec3(0.95, 0.82, 0.5) * sparkle * pulse * 0.35;

    // 輪郭の反射光（画像の縁に細く光を走らせる）
    float rim = smoothstep(0.46, 0.5, max(abs(fromCenter.x), abs(fromCenter.y)));
    float rimLight = rim * (0.5 + 0.5 * sin(uTime * 0.6 + fromCenter.x * 6.0));
    color += vec3(0.78, 0.63, 0.36) * rimLight * 0.12;

    // ヴィネット（黒闇に沈む）
    float vig = smoothstep(0.95, 0.3, length(fromCenter) * 1.35);
    color *= mix(0.55, 1.0, vig);

    // 霧の中から現れる（uReveal 0→1）
    float mist = fbm(vUv * 2.5 + uTime * 0.02);
    float revealMask = smoothstep(uReveal * 1.4 - 0.4, uReveal * 1.4, 1.0 - mist * 0.6);
    color = mix(vec3(0.02, 0.02, 0.02), color, clamp(revealMask + uReveal * uReveal, 0.0, 1.0));

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const mistFragment = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  ${noiseGLSL}

  void main() {
    // ゆっくり流れる墨と霧
    float n1 = fbm(vUv * vec2(2.2, 1.4) + vec2(uTime * 0.018, uTime * 0.008));
    float n2 = fbm(vUv * vec2(3.4, 2.2) - vec2(uTime * 0.012, 0.0) + 5.0);
    float mist = n1 * 0.65 + n2 * 0.35;

    // 下端と両端に濃く溜まる
    float edgeBottom = smoothstep(0.55, 0.0, vUv.y);
    float edgeSide = smoothstep(0.35, 0.0, min(vUv.x, 1.0 - vUv.x));
    float density = mist * (edgeBottom * 0.8 + edgeSide * 0.4 + 0.08);

    vec3 ink = vec3(0.015, 0.015, 0.018);
    gl_FragColor = vec4(ink, density * uOpacity);
  }
`;

/* ============================================================
   龍の絵画 3D 化シェーダー
   金の筆致を高さマップとして浮き彫りにし、動的ライティングで
   本物の金箔・金泥のような光沢を与える。
   ============================================================ */

export const dragonVertex = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uRelief;
  varying vec2 vUv;
  varying float vLum;

  float lumOf(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  void main() {
    vUv = uv;
    vec3 tex = texture2D(uMap, uv).rgb;
    float lum = lumOf(tex);
    vLum = lum;

    vec3 pos = position;
    // 筆致の起伏: 金の絵具が盛り上がる浮き彫り
    pos.z += lum * uRelief;
    // 龍の呼吸: 画面全体がゆっくりうねる(明るい部分ほど大きく)
    pos.z += sin(uv.y * 5.2 + uTime * 0.65) * cos(uv.x * 3.8 - uTime * 0.45)
             * 0.04 * (0.25 + lum);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const dragonFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform vec2 uMouse;    // -1..1
  uniform float uReveal;  // 0..1
  uniform vec2 uTexel;    // 1 / テクスチャ解像度
  varying vec2 vUv;
  varying float vLum;

  ${noiseGLSL}

  float lumOf(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  void main() {
    vec2 uv = vUv;
    // 空気の揺らぎ(ごく微細)
    float airy = fbm(uv * 4.0 + uTime * 0.045);
    uv += (airy - 0.5) * 0.0035;

    vec3 col = texture2D(uMap, uv).rgb;
    float lum = lumOf(col);

    // 輝度勾配から法線を近似(筆致の凹凸)
    float lx = lumOf(texture2D(uMap, uv + vec2(uTexel.x * 2.0, 0.0)).rgb)
             - lumOf(texture2D(uMap, uv - vec2(uTexel.x * 2.0, 0.0)).rgb);
    float ly = lumOf(texture2D(uMap, uv + vec2(0.0, uTexel.y * 2.0)).rgb)
             - lumOf(texture2D(uMap, uv - vec2(0.0, uTexel.y * 2.0)).rgb);
    vec3 nrm = normalize(vec3(-lx * 3.2, -ly * 3.2, 1.0));

    // マウスに追従する光源で金泥が照り返す
    vec3 lightDir = normalize(vec3(uMouse.x * 0.85, uMouse.y * 0.85, 1.0));
    float diff = max(dot(nrm, lightDir), 0.0);
    float spec = pow(max(dot(reflect(-lightDir, nrm), vec3(0.0, 0.0, 1.0)), 0.0), 26.0);

    vec3 gold = vec3(1.0, 0.84, 0.5);
    col *= 0.82 + diff * 0.4;
    col += gold * spec * lum * 1.2;

    // 金襴の光が斜めに走り抜ける(周期的なスイープ)
    float sweepPos = fract(uTime * 0.085);
    float band = abs((uv.x * 0.7 + (1.0 - uv.y) * 0.3) - sweepPos * 1.4 + 0.2);
    float sweep = smoothstep(0.10, 0.0, band);
    col += gold * sweep * lum * 0.5;

    // 金粉の煌めき(高周波ノイズ)
    float sp = vnoise(uv * 260.0 + floor(uTime * 1.6) * 11.0);
    float sparkle = smoothstep(0.986, 1.0, sp);
    col += gold * sparkle * lum * (0.5 + 0.5 * sin(uTime * 2.4 + sp * 50.0)) * 0.6;

    // 龍眼の赤い脈動
    float eye1 = smoothstep(0.030, 0.004, distance(vUv, vec2(0.449, 0.764)));
    float eye2 = smoothstep(0.030, 0.004, distance(vUv, vec2(0.539, 0.765)));
    float pulse = 0.55 + 0.45 * sin(uTime * 2.1);
    col += vec3(1.0, 0.08, 0.06) * (eye1 + eye2) * pulse * 0.9;

    // 墨の中から現れる
    float mist = fbm(vUv * 3.0 + uTime * 0.02);
    float reveal = smoothstep(uReveal * 1.35 - 0.4, uReveal * 1.35, 1.0 - mist * 0.55);
    col *= clamp(reveal + uReveal * uReveal, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** 龍の背後で明滅する金のオーラ */
export const auraFragment = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  varying vec2 vUv;

  ${noiseGLSL}

  void main() {
    float d = distance(vUv, vec2(0.5, 0.52));
    float glow = smoothstep(0.55, 0.0, d);
    float wisp = 0.75 + 0.5 * fbm(vUv * 3.0 + vec2(uTime * 0.03, -uTime * 0.02));
    vec3 col = vec3(0.78, 0.62, 0.34) * glow * glow * 0.4 * wisp;
    float breathe = 0.85 + 0.15 * sin(uTime * 0.5);
    gl_FragColor = vec4(col * breathe * uReveal, glow * 0.5 * uReveal);
  }
`;

export const fresnelVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fresnelFragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vView)), 2.5);
    // 氷の青白さ + 縁にかすかな金
    vec3 iceColor = vec3(0.72, 0.85, 0.95);
    vec3 goldColor = vec3(0.78, 0.63, 0.36);
    float goldMix = 0.5 + 0.5 * sin(uTime * 0.4);
    vec3 color = mix(iceColor, goldColor, fresnel * goldMix * 0.5);
    float alpha = fresnel * 0.55 + 0.04;
    gl_FragColor = vec4(color, alpha);
  }
`;

export const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aScale;
  attribute vec3 aRandom;
  varying float vAlpha;
  void main() {
    vec3 pos = position;
    // ゆっくり漂う（各粒子で位相が異なる）
    pos.y += sin(uTime * 0.15 * aRandom.x + aRandom.y * 6.28) * 0.25;
    pos.x += cos(uTime * 0.1 * aRandom.y + aRandom.z * 6.28) * 0.2;
    pos.z += sin(uTime * 0.08 * aRandom.z + aRandom.x * 6.28) * 0.15;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * aScale * (30.0 / -mvPosition.z);
    // 呼吸するような明滅
    vAlpha = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 0.5 * aRandom.x + aRandom.y * 10.0));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const particleFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    // 柔らかい円形の粒子
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(uColor, alpha * vAlpha * uOpacity);
  }
`;
