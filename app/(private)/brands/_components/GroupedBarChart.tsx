"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { ECharts, EChartsOption } from "echarts";

export type IChannelMonthData = {
    total: number;
    active: number; // não arquivados
};

export type IGroupedBarChartData = {
    labels: string[];
    channels: {
        name: string;
        data: IChannelMonthData[];
    }[];
};

type Props = {
    data: IGroupedBarChartData;
    title?: string;
};

const COLORS = {
    total: ["#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"],
    active: ["#6ee7b7", "#34d399", "#10b981", "#059669", "#047857", "#065f46"],
};

const CHANNELS = ["Web", "Marketplaces", "Empresas", "Domínios", "Redes Sociais"];

export default function GroupedBarChart({ data, title }: Props) {
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

        // Taxa de ruído por mês (arquivados / total) — linha sobreposta no eixo Y2
        const noiseRate = data.labels.map((_, i) => {
            const totalAll = data.channels.reduce((s, c) => s + (c.data[i]?.total ?? 0), 0);
            const activeAll = data.channels.reduce((s, c) => s + (c.data[i]?.active ?? 0), 0);
            const archived = totalAll - activeAll;
            return totalAll > 0 ? Math.round((archived / totalAll) * 100) : 0;
        });

        // Séries de barras — total e ativo por canal
        const barSeries: echarts.BarSeriesOption[] = data.channels.flatMap((channel, ci) => [
            {
                name: `${channel.name} — Total`,
                type: "bar" as const,
                stack: `total_${ci}`,
                barWidth: 20,
                itemStyle: {
                    color: COLORS.total[ci % COLORS.total.length],
                    borderRadius: [3, 3, 0, 0],
                },
                emphasis: {
                    focus: "series" as const,
                    itemStyle: {
                        shadowBlur: 8,
                        shadowColor: "rgba(59,130,246,0.4)",
                    },
                },
                data: channel.data.map((d) => d.total),
                tooltip: {
                    valueFormatter: (v: unknown) => `${Number(v).toLocaleString("pt-BR")} ocorrências`,
                },
            },
            {
                name: `${channel.name} — Arquivadas`,
                type: "bar" as const,
                stack: `active_${ci}`,
                barMaxWidth: 18,
                itemStyle: {
                    color: COLORS.active[ci % COLORS.active.length],
                    borderRadius: [3, 3, 0, 0],
                },
                emphasis: {
                    focus: "series" as const,
                    itemStyle: {
                        shadowBlur: 8,
                        shadowColor: "rgba(16,185,129,0.4)",
                    },
                },
                data: channel.data.map((d) => d.active),
                tooltip: {
                    valueFormatter: (v: unknown) => `${Number(v).toLocaleString("pt-BR")} ameaças ativas`,
                },
            },
        ]);

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
                    iconStyle: { borderColor: "#3b82f6", color: "#bdd2ed" },
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
                        name: "grafico-performance",
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
                data: [...data.channels.map((c) => `${c.name} — Total`), ...data.channels.map((c) => `${c.name} — Ativos`), "% Ruído (arquivados)"],
            },

            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                    crossStyle: { color: "#94a3b8" },
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
                    const label = list[0]?.axisValueLabel ?? "";
                    const rows = list
                        .map((p: any) => {
                            const isLine = p.seriesType === "line";
                            return `
                            <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin:3px 0">
                                <span style="display:flex;align-items:center;gap:6px">
                                    <span style="display:inline-block;width:8px;height:8px;border-radius:${isLine ? "50%" : "2px"};background:${p.color}"></span>
                                    <span style="color:#94a3b8;font-size:11px">${p.seriesName}</span>
                                </span>
                                <b style="color:#fff">${isLine ? `${p.value}%` : Number(p.value).toLocaleString("pt-BR")}</b>
                            </div>`;
                        })
                        .join("");
                    return `<div style="font-weight:600;margin-bottom:6px;color:#93c5fd">${label}</div>${rows}`;
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
                    name: "% Ruído",
                    min: 0,
                    max: 100,
                    nameTextStyle: { color: "#f97316", fontSize: 11 },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: {
                        color: "#f97316",
                        fontSize: 11,
                        formatter: (v: number) => `${v}%`,
                    },
                    splitLine: { show: false },
                },
            ],

            dataZoom: [
                {
                    type: "inside",
                    start: 0,
                    end: 100,
                    zoomOnMouseWheel: true,
                },
            ],

            series: [
                ...barSeries,
                // Linha de % ruído no eixo Y secundário
                {
                    name: "% Ruído (arquivados)",
                    type: "line",
                    yAxisIndex: 1,
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 6,
                    showSymbol: true,
                    z: 10,
                    lineStyle: {
                        width: 2.5,
                        color: "#f97316",
                        type: "dashed",
                    },
                    itemStyle: { color: "#f97316" },
                    emphasis: {
                        focus: "series" as const,
                        lineStyle: { width: 3.5 },
                    },
                    data: noiseRate,
                    tooltip: {
                        valueFormatter: (v: unknown) => `${Number(v)}% de ruído`,
                    },
                },
            ],
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
