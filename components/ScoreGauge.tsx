"use client";

// ─── ScoreGauge.tsx ───────────────────────────────────────────────────────────
// Gauge semicircular — 3 blocos (azul claro → laranja → vermelho)
// Máximo: 100 | Quanto maior o valor, pior o risco
// Props: value (number 0–100)
// Sem dependências externas além do React
// ─────────────────────────────────────────────────────────────────────────────

interface ScoreGaugeProps {
    value: number; // 0 – 100
}

const MAX = 100;

const BLOCKS = [
    { color: "#38bdf8", label: "Baixo", from: 0, to: 33 },
    { color: "#f97316", label: "Médio", from: 33, to: 66 },
    { color: "#ef4444", label: "Alto", from: 66, to: 100 },
];

// ─── SVG helpers ──────────────────────────────────────────────────────────────
//
// Sistema de ângulos:
//   180° = extremo ESQUERDO  (valor 0 — menor risco)
//     0° = extremo DIREITO   (valor 100 — maior risco)

const CX = 200;
const CY = 260;
const R_OUTER = 175;
const R_INNER = 138;
const GAP = 5;

function degToRad(d: number) {
    return (d * Math.PI) / 180;
}

function polar(angleDeg: number, r: number) {
    const rad = degToRad(angleDeg);
    return { x: CX + r * Math.cos(rad), y: CY - r * Math.sin(rad) };
}

function ringArc(startDeg: number, endDeg: number, ro: number, ri: number): string {
    const sDeg = Math.min(startDeg, endDeg);
    const eDeg = Math.max(startDeg, endDeg);

    const o1 = polar(sDeg, ro);
    const o2 = polar(eDeg, ro);
    const i2 = polar(eDeg, ri);
    const i1 = polar(sDeg, ri);
    const largeArc = eDeg - sDeg > 180 ? 1 : 0;
    const f = (n: number) => n.toFixed(3);
    return [`M ${f(o1.x)} ${f(o1.y)}`, `A ${ro} ${ro} 0 ${largeArc} 0 ${f(o2.x)} ${f(o2.y)}`, `L ${f(i2.x)} ${f(i2.y)}`, `A ${ri} ${ri} 0 ${largeArc} 1 ${f(i1.x)} ${f(i1.y)}`, "Z"].join(" ");
}

// valor 0 → 180°, valor 100 → 0°
function valToAngle(v: number): number {
    return 180 - (Math.min(MAX, Math.max(0, v)) / MAX) * 180;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ScoreGauge({ value }: ScoreGaugeProps) {
    const clamped = Math.min(MAX, Math.max(0, value));
    const pointerAngle = valToAngle(clamped);

    const activeBlock = clamped <= 33 ? BLOCKS[0] : clamped <= 66 ? BLOCKS[1] : BLOCKS[2];

    // CORREÇÃO: Definir os blocos na ordem correta (da esquerda para direita)
    // Bloco Azul: de 180° até 120° (com gap)
    // Bloco Laranja: de 120° até 60°
    // Bloco Vermelho: de 60° até 0°
    const blockDefs = [
        { ...BLOCKS[0], degStart: 180, degEnd: 120, gapStart: 180 - GAP, gapEnd: 120 + GAP },
        { ...BLOCKS[1], degStart: 120, degEnd: 60, gapStart: 120 - GAP, gapEnd: 60 + GAP },
        { ...BLOCKS[2], degStart: 60, degEnd: 0, gapStart: 60 - GAP, gapEnd: 0 + GAP },
    ];

    const rMid = (R_OUTER + R_INNER) / 2;
    const pointer = polar(pointerAngle, rMid);

    return (
        <div
            style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                //background: "#ffffff",
                //borderRadius: 24,
                //padding: "28px 44px 24px",
                //boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07), 0 10px 40px -4px rgba(0,0,0,0.12)",
                fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
                userSelect: "none",
                width: "100%",
            }}
        >
            <svg viewBox="0 0 400 280" width={340} height={238}>
                {/* ── Fundo cinza (todos os blocos com gap) ── */}
                {blockDefs.map((b, i) => (
                    <path key={`bg-${i}`} d={ringArc(b.gapStart, b.gapEnd, R_OUTER, R_INNER)} fill="#e5e7eb" stroke={b.color} strokeWidth={2} strokeOpacity={0.6} />
                ))}

                {/* ── Arcos coloridos (preenchimento até o valor atual) ── */}
                {/* Bloco Azul */}
                {pointerAngle < blockDefs[0].degStart && <path d={ringArc(blockDefs[0].gapStart, Math.max(pointerAngle, blockDefs[0].gapEnd), R_OUTER, R_INNER)} fill={blockDefs[0].color} style={{ filter: `drop-shadow(0 0 6px ${blockDefs[0].color}66)` }} />}

                {/* Bloco Laranja */}
                {pointerAngle < blockDefs[1].degStart && pointerAngle > blockDefs[1].degEnd && <path d={ringArc(blockDefs[1].gapStart, pointerAngle, R_OUTER, R_INNER)} fill={blockDefs[1].color} style={{ filter: `drop-shadow(0 0 6px ${blockDefs[1].color}66)` }} />}
                {pointerAngle <= blockDefs[1].degEnd && <path d={ringArc(blockDefs[1].gapStart, blockDefs[1].gapEnd, R_OUTER, R_INNER)} fill={blockDefs[1].color} style={{ filter: `drop-shadow(0 0 6px ${blockDefs[1].color}66)` }} />}

                {/* Bloco Vermelho */}
                {pointerAngle < blockDefs[2].degStart && pointerAngle > blockDefs[2].degEnd && <path d={ringArc(blockDefs[2].gapStart, pointerAngle, R_OUTER, R_INNER)} fill={blockDefs[2].color} style={{ filter: `drop-shadow(0 0 6px ${blockDefs[2].color}66)` }} />}
                {pointerAngle <= blockDefs[2].degEnd && <path d={ringArc(blockDefs[2].gapStart, blockDefs[2].gapEnd, R_OUTER, R_INNER)} fill={blockDefs[2].color} style={{ filter: `drop-shadow(0 0 6px ${blockDefs[2].color}66)` }} />}

                {/* ── Ponteiro (bolinha) ── */}
                <circle
                    cx={pointer.x}
                    cy={pointer.y}
                    r={11}
                    fill={activeBlock.color}
                    stroke="#ffffff"
                    strokeWidth={3.5}
                    style={{
                        filter: `drop-shadow(0 2px 8px ${activeBlock.color}99)`,
                        transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)",
                    }}
                />

                {/* ── Número central ── */}
                <text x={CX} y={CY - 30} textAnchor="middle" fontSize={76} fontWeight={800} fill="#1e293b" fontFamily="'Segoe UI', system-ui, sans-serif">
                    {clamped}
                </text>

                {/* ── "de 100" ── */}
                <text x={CX} y={CY + 10} textAnchor="middle" fontSize={17} fontWeight={400} fill="#94a3b8" fontFamily="'Segoe UI', system-ui, sans-serif">
                    de {MAX}
                </text>
            </svg>

            {/* ── Badge de nível de risco ── */}
            <div
                style={{
                    marginTop: 8,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    background: activeBlock.color + "18",
                    border: `1.5px solid ${activeBlock.color}55`,
                    borderRadius: 99,
                    padding: "5px 18px",
                    transition: "background 0.5s, border-color 0.5s",
                }}
            >
                <span
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: activeBlock.color,
                        display: "inline-block",
                        boxShadow: `0 0 6px 2px ${activeBlock.color}77`,
                        flexShrink: 0,
                    }}
                />
                <span
                    style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: activeBlock.color,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                    }}
                >
                    Risco {activeBlock.label}
                </span>
            </div>
        </div>
    );
}
