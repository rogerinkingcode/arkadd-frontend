"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { ECharts, EChartsOption } from "echarts";

export type StackedAreaSeries = {
    name: string;
    data: number[];
};

export type IStackedAreaChartData = {
    labels: string[]; // eixo X — ex: ["Jan", "Fev", "Mar"]
    series: StackedAreaSeries[];
};

type Props = {
    data: IStackedAreaChartData;
    title?: string;
};

const COLORS = [
    "#3b82f6", // blue
    "#10b981", // emerald
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#ef4444", // red
    "#06b6d4", // cyan
];

export default function StackedAreaChart({ data, title }: Props) {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const chartInstance = useRef<ECharts | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        // Garante que só inicializa uma vez
        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current, undefined, {
                renderer: "canvas",
            });
        }

        const chart = chartInstance.current;

        // Calcula totais acumulados por label para a linha de tendência
        const totals = data.labels.map((_, i) => data.series.reduce((sum, s) => sum + (s.data[i] ?? 0), 0));

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
                iconStyle: {
                    borderColor: "#94a3b8",
                    borderWidth: 1.5,
                },
                emphasis: {
                    iconStyle: {
                        borderColor: "#3b82f6",
                        color: "#bdd2ed",
                    },
                },
                feature: {
                    dataZoom: {
                        show: true,
                        title: { zoom: "Zoom", back: "Restaurar zoom" },
                    },
                    magicType: {
                        show: true,
                        title: { line: "Linha", bar: "Barra", stack: "Empilhado" },
                        type: ["line", "bar", "stack"],
                    },
                    restore: {
                        show: true,
                        title: "Restaurar",
                    },
                    saveAsImage: {
                        show: true,
                        title: "Baixar PNG",
                        type: "png",
                        name: "grafico-areas",
                        backgroundColor: "#ffffff",
                        pixelRatio: 2,
                    },
                },
            },

            legend: {
                data: [...data.series.map((s) => s.name), "Total Acumulado"],
                bottom: 0,
                type: "scroll",
                textStyle: { color: "#475569", fontSize: 12 },
                pageTextStyle: { color: "#475569" },
                icon: "roundRect",
                itemWidth: 14,
                itemHeight: 8,
            },

            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                    label: { backgroundColor: "#0f172a" },
                },
                backgroundColor: "#0f172a",
                borderColor: "#1e3a5f",
                borderWidth: 1,
                borderRadius: 10,
                padding: [10, 14],
                textStyle: { color: "#f1f5f9", fontSize: 12 },
                formatter: (params: any) => {
                    const list = Array.isArray(params) ? params : [params];
                    const label = list[0]?.axisValueLabel ?? list[0]?.name ?? "";
                    const rows = list
                        .map(
                            (p: any) => `
                            <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin:3px 0">
                                <span style="display:flex;align-items:center;gap:6px">
                                    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color}"></span>
                                    <span style="color:#94a3b8">${p.seriesName}</span>
                                </span>
                                <b style="color:#fff">${Number(p.value).toLocaleString("pt-BR")}</b>
                            </div>`,
                        )
                        .join("");
                    return `<div style="font-weight:600;margin-bottom:6px;color:#93c5fd">${label}</div>${rows}`;
                },
            },

            grid: {
                left: "2%",
                right: "2%",
                bottom: 60,
                top: title ? 100 : 48,
                containLabel: true,
            },

            xAxis: [
                {
                    type: "category",
                    boundaryGap: false,
                    data: data.labels,
                    axisLine: { lineStyle: { color: "#e2e8f0" } },
                    axisTick: { show: false },
                    axisLabel: { color: "#64748b", fontSize: 12 },
                    splitLine: { show: false },
                },
            ],

            yAxis: [
                {
                    type: "value",
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
            ],

            dataZoom: [
                {
                    type: "inside",
                    start: 0,
                    end: 100,
                    zoomOnMouseWheel: true,
                },
                {
                    type: "slider",
                    show: false, // ativado via toolbox dataZoom
                    start: 0,
                    end: 100,
                    height: 20,
                    bottom: 36,
                    borderColor: "#e2e8f0",
                    fillerColor: "rgba(59,130,246,0.08)",
                    handleStyle: { color: "#3b82f6" },
                    textStyle: { color: "#94a3b8" },
                },
            ],

            series: [
                // Séries de área empilhada
                ...data.series.map((s, i) => ({
                    name: s.name,
                    type: "line" as const,
                    stack: "Total",
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 5,
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.55,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: COLORS[i % COLORS.length] },
                            { offset: 1, color: `${COLORS[i % COLORS.length]}18` },
                        ]),
                    },
                    lineStyle: {
                        width: 2,
                        color: COLORS[i % COLORS.length],
                    },
                    itemStyle: { color: COLORS[i % COLORS.length] },
                    emphasis: {
                        focus: "series" as const,
                        lineStyle: { width: 3 },
                    },
                    data: s.data,
                })),

                // Linha de Tendência — Total Acumulado
                {
                    name: "Total Acumulado",
                    type: "line" as const,
                    data: totals,
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 6,
                    showSymbol: false,
                    stack: undefined, // NÃO empilhada — sobreposta
                    z: 10, // sempre acima das áreas
                    lineStyle: {
                        width: 2.5,
                        color: "#f97316",
                        type: "dashed",
                    },
                    itemStyle: { color: "#f97316" },
                    areaStyle: undefined,
                    label: {
                        show: false,
                    },
                    emphasis: {
                        focus: "series" as const,
                        lineStyle: { width: 3.5 },
                    },
                },
            ],
        };

        chart.setOption(option, { notMerge: true });

        const ro = new ResizeObserver(() => chart.resize());
        ro.observe(chartRef.current!);

        return () => {
            ro.disconnect();
        };
    }, [data, title]);

    // Dispose só no unmount
    useEffect(() => {
        return () => {
            chartInstance.current?.dispose();
            chartInstance.current = null;
        };
    }, []);

    return (
        <div
            ref={chartRef}
            style={{
                width: "100%",
                height: "min(80vh, 370px)",
                minHeight: 320,
            }}
        />
    );
}
