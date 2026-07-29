/**
 * 金の龍のラインアート（手描きベジェによる一点もの）。
 * 頭部はワンライン・シルエット、身体は蛇行する背骨 + 輪郭線 + 鱗の点描で構成。
 * side="right" では左右反転して使う。
 */
type Props = {
  side: "left" | "right";
};

export default function DragonOrnament({ side }: Props) {
  const gid = `dragon-gold-${side}`;
  return (
    <svg
      viewBox="0 0 220 1000"
      className="h-full w-auto"
      preserveAspectRatio={side === "left" ? "xMinYMid meet" : "xMaxYMid meet"}
      style={side === "right" ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2D58A" />
          <stop offset="0.5" stopColor="#C6A15B" />
          <stop offset="1" stopColor="#8A6D3B" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${gid})`} fill="none" strokeLinecap="round">
        {/* ===== 頭部 ===== */}
        {/* 頭蓋〜額〜眉〜鼻筋〜鼻先の返し〜上唇（ワンライン・シルエット） */}
        <path
          className="dragon-draw"
          d="M 138 100 C 126 90, 112 88, 104 92 C 99 95, 97 98, 92 98 C 82 98, 72 101, 65 106 C 61 109, 60 113, 63 116 C 68 119, 76 120, 83 122"
          strokeWidth="1.4"
          opacity="0.95"
        />
        {/* 牙 */}
        <path className="dragon-draw" d="M 79 121 c 0 4 -1 6 -3 8" strokeWidth="0.75" opacity="0.85" />
        {/* 下唇〜顎〜頬（開いた口） */}
        <path
          className="dragon-draw"
          d="M 74 130 C 80 134, 88 138, 98 140 C 112 143, 124 145, 132 149"
          strokeWidth="1.2"
          opacity="0.9"
        />
        {/* 顎の房 */}
        <path className="dragon-draw" d="M 74 130 c -6 4 -8 10 -4 16" strokeWidth="0.75" opacity="0.65" />
        {/* 目の上のアーク */}
        <path className="dragon-draw" d="M 96 98 c 3 -2 7 -2 10 0" strokeWidth="0.8" opacity="0.85" />
        {/* 耳 */}
        <path className="dragon-draw" d="M 126 98 c 7 -3 13 -2 17 2" strokeWidth="0.8" opacity="0.7" />
        {/* 角（主・枝分かれ） */}
        <path className="dragon-draw" d="M 118 90 C 128 74, 144 62, 164 56" strokeWidth="1.15" opacity="0.9" />
        <path className="dragon-draw" d="M 138 70 C 141 60, 148 50, 158 44" strokeWidth="0.9" opacity="0.75" />
        {/* 角（副） */}
        <path className="dragon-draw" d="M 110 89 C 116 74, 126 62, 138 54" strokeWidth="0.85" opacity="0.65" />
        {/* たてがみ */}
        <path className="dragon-draw" d="M 138 104 C 162 110, 176 126, 180 148" strokeWidth="1" opacity="0.85" />
        <path className="dragon-draw" d="M 140 118 C 166 128, 178 146, 176 172" strokeWidth="0.9" opacity="0.7" />
        <path className="dragon-draw" d="M 138 132 C 160 144, 170 162, 166 186" strokeWidth="0.85" opacity="0.6" />
        <path className="dragon-draw" d="M 134 146 C 152 158, 158 176, 154 196" strokeWidth="0.8" opacity="0.5" />
        {/* 髭（長い流線） */}
        <path
          className="dragon-draw"
          d="M 63 111 C 46 102, 30 104, 21 116 C 15 125, 18 136, 26 140"
          strokeWidth="0.65"
          opacity="0.8"
        />
        <path
          className="dragon-draw"
          d="M 69 124 C 54 128, 45 139, 44 153 C 44 162, 50 169, 58 167"
          strokeWidth="0.6"
          opacity="0.6"
        />

        {/* ===== 身体 ===== */}
        {/* 背骨 */}
        <path
          className="dragon-draw"
          d="M 130 150 C 150 200, 120 250, 84 292 C 48 334, 60 390, 104 420 C 150 452, 158 512, 116 552 C 76 590, 64 646, 100 684 C 138 722, 146 772, 112 812 C 84 844, 88 894, 104 924"
          strokeWidth="1.6"
          opacity="0.95"
        />
        {/* 体の輪郭（平行線） */}
        <path
          className="dragon-draw"
          d="M 143 153 C 163 203, 133 253, 97 295 C 61 337, 73 391, 117 421 C 163 453, 171 513, 129 553 C 89 591, 77 647, 113 685 C 151 723, 159 773, 125 813 C 97 845, 101 895, 116 924"
          strokeWidth="0.85"
          opacity="0.5"
        />
        {/* 鱗（点描・破線のため描画アニメではなくフェードで表示） */}
        <path
          className="dragon-fade"
          d="M 136 151 C 156 201, 126 251, 90 293 C 54 335, 66 390, 110 420 C 156 452, 164 512, 122 552 C 82 590, 70 646, 106 684 C 144 722, 152 772, 118 812 C 90 844, 94 894, 110 924"
          strokeWidth="1.5"
          opacity="0.7"
          strokeDasharray="0.5 7"
        />

        {/* 背びれの房 */}
        <path className="dragon-draw" d="M 52 340 c -8 2 -13 8 -14 15" strokeWidth="0.8" opacity="0.6" />
        <path className="dragon-draw" d="M 60 320 c -9 0 -15 5 -18 11" strokeWidth="0.75" opacity="0.5" />
        <path className="dragon-draw" d="M 166 500 c 8 2 13 8 14 15" strokeWidth="0.8" opacity="0.6" />
        <path className="dragon-draw" d="M 162 480 c 9 0 15 5 18 11" strokeWidth="0.75" opacity="0.5" />
        <path className="dragon-draw" d="M 68 640 c -8 2 -13 8 -14 15" strokeWidth="0.8" opacity="0.55" />

        {/* 前肢と爪 */}
        <path className="dragon-draw" d="M 150 460 C 166 462, 178 472, 182 486" strokeWidth="1" opacity="0.85" />
        <path className="dragon-draw" d="M 182 486 c 8 -2 14 -1 19 3" strokeWidth="0.85" opacity="0.85" />
        <path className="dragon-draw" d="M 182 486 c 9 2 14 6 16 10" strokeWidth="0.85" opacity="0.8" />
        <path className="dragon-draw" d="M 182 486 c 6 4 9 9 10 15" strokeWidth="0.85" opacity="0.75" />

        {/* 雲（渦） */}
        <path
          className="dragon-draw"
          d="M 24 210 c 14 -10 34 -6 34 8 c 0 11 -16 15 -22 6 c -4 -7 4 -13 11 -10"
          strokeWidth="0.75"
          opacity="0.5"
        />
        <path
          className="dragon-draw"
          d="M 196 390 c -14 -10 -34 -6 -34 8 c 0 11 16 15 22 6 c 4 -7 -4 -13 -11 -10"
          strokeWidth="0.75"
          opacity="0.45"
        />
        <path
          className="dragon-draw"
          d="M 26 585 c 14 -10 34 -6 34 8 c 0 11 -16 15 -22 6 c -4 -7 4 -13 11 -10"
          strokeWidth="0.75"
          opacity="0.45"
        />
        <path
          className="dragon-draw"
          d="M 192 745 c -12 -8 -28 -5 -28 6 c 0 9 13 12 18 5 c 3 -6 -3 -11 -9 -8"
          strokeWidth="0.7"
          opacity="0.4"
        />

        {/* 尾の房 */}
        <path className="dragon-draw" d="M 104 924 C 96 946, 108 962, 98 984" strokeWidth="1.1" opacity="0.85" />
        <path className="dragon-draw" d="M 104 924 C 116 944, 104 962, 114 980" strokeWidth="0.85" opacity="0.65" />
        <path className="dragon-draw" d="M 104 924 C 88 940, 92 958, 82 972" strokeWidth="0.8" opacity="0.55" />
      </g>

      {/* 目 */}
      <circle className="dragon-fade" cx="101" cy="103" r="1.9" fill="#F2D58A" opacity="0.95" />
      {/* 金の粒 */}
      <circle className="dragon-fade" cx="150" cy="240" r="1.2" fill="#F2D58A" opacity="0.7" />
      <circle className="dragon-fade" cx="56" cy="430" r="1" fill="#D8B76A" opacity="0.6" />
      <circle className="dragon-fade" cx="176" cy="620" r="1.4" fill="#F2D58A" opacity="0.75" />
      <circle className="dragon-fade" cx="66" cy="770" r="1" fill="#D8B76A" opacity="0.55" />
      <circle className="dragon-fade" cx="128" cy="950" r="1.2" fill="#F2D58A" opacity="0.65" />
    </svg>
  );
}
