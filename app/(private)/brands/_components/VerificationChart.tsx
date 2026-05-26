"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { ECharts, EChartsOption } from "echarts";

export type IVerificationMonthData = {
    total: number;
    verified: number;
    unverified: number;
};

export type IVerificationChartData = {
    labels: string[];
    channels: {
        name: string;
        data: IVerificationMonthData[];
    }[];
};

type Props = {
    data: IVerificationChartData;
    title?: string;
};

const VERIFIED_COLORS = ["#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534"];
const UNVERIFIED_COLORS = ["#f87171", "#ef4444", "#dc2626", "#b91c1c", "#991b1b"];

export default function VerificationChart({ data, title }: Props) {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const chartInstance = useRef<ECharts | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current, undefined, {
                renderer: "canvas",
            });
        }

        const chart = chartInstance.current;

        const globalCoverage = data.labels.map((_, i) => {
            const totalAll = data.channels.reduce((s, c) => s + (c.data[i]?.total ?? 0), 0);
            const verifiedAll = data.channels.reduce((s, c) => s + (c.data[i]?.verified ?? 0), 0);
            return totalAll > 0 ? Math.round((verifiedAll / totalAll) * 100) : 0;
        });

        const series: echarts.SeriesOption[] = [
            ...data.channels.map((channel, ci) => ({
                name: `${channel.name} — Verificado`,
                type: "bar" as const,
                stack: channel.name,
                // Distribuição uniforme — largura fixa igual para todas as séries
                barWidth: 21,
                itemStyle: {
                    color: VERIFIED_COLORS[ci % VERIFIED_COLORS.length],
                    borderRadius: [0, 0, 0, 0],
                },
                emphasis: { focus: "series" as const },
                label: {
                    show: true,
                    position: "inside" as const,
                    fontSize: 8,
                    color: "#fff",
                    formatter: (p: any) => {
                        const total = channel.data[p.dataIndex]?.total ?? 0;
                        if (total === 0) return "";
                        const pct = Math.round((p.value / total) * 100);
                        return pct > 8 ? `${pct}%` : "";
                    },
                },
                data: channel.data.map((d) => d.verified),
                tooltip: {
                    valueFormatter: (v: unknown) => `${Number(v).toLocaleString("pt-BR")} verificados`,
                },
            })),

            ...data.channels.map((channel, ci) => ({
                name: `${channel.name} — Não verificado`,
                type: "bar" as const,
                stack: channel.name,
                // Mesma largura fixa para parear corretamente com o verified
                barWidth: 21,
                itemStyle: {
                    color: UNVERIFIED_COLORS[ci % UNVERIFIED_COLORS.length],
                    opacity: 0.75,
                    borderRadius: [3, 3, 0, 0],
                },
                emphasis: { focus: "series" as const },
                label: {
                    show: true,
                    position: "inside" as const,
                    fontSize: 8,
                    color: "#fff",
                    formatter: (p: any) => {
                        const total = channel.data[p.dataIndex]?.total ?? 0;
                        if (total === 0) return "";
                        const pct = Math.round((p.value / total) * 100);
                        return pct > 8 ? `${pct}%` : "";
                    },
                },
                data: channel.data.map((d) => d.unverified),
                tooltip: {
                    valueFormatter: (v: unknown) => `${Number(v).toLocaleString("pt-BR")} não verificados`,
                },
            })),
        ];

        const option: EChartsOption = {
            backgroundColor: "transparent",

            title: title
                ? {
                      text: title,
                      left: 12,
                      top: 10,
                      textStyle: { fontSize: 15, fontWeight: "bold", color: "#1e293b" },
                  }
                : undefined,

            toolbox: {
                show: true,
                right: 16,
                top: 8,
                itemSize: 17,
                itemGap: 10,
                iconStyle: { borderColor: "#94a3b8", borderWidth: 1.5 },
                emphasis: {
                    iconStyle: { borderColor: "#a78bfa", color: "#bdd2ed" },
                },
                feature: {
                    dataZoom: {
                        show: true,
                        title: { zoom: "Zoom", back: "Restaurar zoom" },
                        yAxisIndex: false,
                    },
                    magicType: {
                        show: true,
                        title: { line: "Linha", bar: "Barra", stack: "Empilhado" },
                        type: ["line", "bar", "stack"],
                    },
                    restore: { show: true, title: "Restaurar" },
                    saveAsImage: {
                        show: true,
                        title: "Baixar PNG",
                        type: "png",
                        name: "grafico-verificacao",
                        backgroundColor: "#ffffff",
                        pixelRatio: 2,
                    },
                },
            },

            legend: {
                type: "scroll",
                bottom: 0,
                textStyle: { color: "#475569", fontSize: 11 },
                pageTextStyle: { color: "#475569" },
                icon: "roundRect",
                itemWidth: 12,
                itemHeight: 8,
            },

            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                    label: { backgroundColor: "#0f172a" },
                },
                backgroundColor: "#0f172a",
                borderColor: "#2e1065",
                borderWidth: 1,
                borderRadius: 10,
                padding: [10, 14],
                textStyle: { color: "#f1f5f9", fontSize: 12 },
                // Tooltip reformulado — verified e unverified na mesma linha por canal
                formatter: (params: any) => {
                    const list = Array.isArray(params) ? params : [params];
                    const label = list[0]?.axisValueLabel ?? "";

                    // Agrupa por canal — junta verified e unverified lado a lado
                    const grouped: Record<string, { verified?: any; unverified?: any }> = {};
                    for (const p of list) {
                        const isVerified = p.seriesName?.includes("— Verificado");
                        const isUnverified = p.seriesName?.includes("— Não verificado");
                        if (!isVerified && !isUnverified) continue;
                        const canal = p.seriesName.replace(" — Verificado", "").replace(" — Não verificado", "");
                        if (!grouped[canal]) grouped[canal] = {};
                        if (isVerified) grouped[canal].verified = p;
                        if (isUnverified) grouped[canal].unverified = p;
                    }

                    const rows = Object.entries(grouped)
                        .map(([canal, { verified, unverified }]) => {
                            const vVal = verified ? Number(verified.value).toLocaleString("pt-BR") : "—";
                            const uVal = unverified ? Number(unverified.value).toLocaleString("pt-BR") : "—";
                            const vColor = verified?.color ?? VERIFIED_COLORS[0];
                            const uColor = unverified?.color ?? UNVERIFIED_COLORS[0];
                            return `
                            <div style="margin:4px 0">
                                <div style="color:#94a3b8;font-size:10px;margin-bottom:2px">${canal}</div>
                                <div style="display:flex;align-items:center;gap:12px">
                                    <span style="display:flex;align-items:center;gap:4px">
                                        <span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${vColor}"></span>
                                        <span style="color:#f1f5f9;font-size:11px">✓: <b>${vVal}</b></span>
                                    </span>
                                    <span style="display:flex;align-items:center;gap:4px">
                                        <span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${uColor}"></span>
                                        <span style="color:#f1f5f9;font-size:11px">✗: <b>${uVal}</b></span>
                                    </span>
                                </div>
                            </div>`;
                        })
                        .join("");

                    return `<div style="font-weight:600;margin-bottom:6px;color:#c4b5fd">${label}</div>${rows}`;
                },
            },

            grid: {
                left: "2%",
                right: "4%",
                top: title ? 100 : 48,
                bottom: 72,
                containLabel: true,
            },

            xAxis: [
                {
                    type: "category",
                    data: data.labels,
                    axisPointer: { type: "shadow" },
                    axisLine: { lineStyle: { color: "#e2e8f0" } },
                    axisTick: { show: false },
                    axisLabel: { color: "#64748b", fontSize: 12 },
                    // Gap uniforme entre grupos de barras
                    boundaryGap: true,
                },
            ],

            yAxis: [
                {
                    type: "value",
                    name: "Ocorrências",
                    nameTextStyle: { color: "#94a3b8", fontSize: 11 },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: {
                        color: "#94a3b8",
                        fontSize: 11,
                        formatter: (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)),
                    },
                    splitLine: {
                        lineStyle: { color: "#f1f5f9", type: "dashed" },
                    },
                },
                {
                    type: "value",
                    name: "% Cobertura",
                    min: 0,
                    max: 100,
                    nameTextStyle: { color: "#a78bfa", fontSize: 11 },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: {
                        color: "#a78bfa",
                        fontSize: 11,
                        formatter: (v: number) => `${v}%`,
                    },
                    splitLine: { show: false },
                },
            ],

            // Espaçamento uniforme entre grupos e entre barras do mesmo grupo
            barCategoryGap: "30%",
            barGap: "5%",

            dataZoom: [
                {
                    type: "inside",
                    start: 0,
                    end: 100,
                    zoomOnMouseWheel: true,
                },
            ],

            series,
        };

        chart.setOption(option, { notMerge: true });

        const ro = new ResizeObserver(() => chart.resize());
        ro.observe(chartRef.current!);

        return () => ro.disconnect();
    }, [data, title]);

    useEffect(() => {
        return () => {
            chartInstance.current?.dispose();
            chartInstance.current = null;
        };
    }, []);

    return <div ref={chartRef} style={{ width: "100%", height: "min(80vh, 500px)", minHeight: 600 }} />;
}
