"use client";
import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { ECharts } from "echarts";

export type ITagPerformanceChartData = {
    tags: string[];
    activated: number[]; // acionamentos totais da tag
    relevant: number[]; // acionamentos em ocorrências relevantes (unarchived + score >= 50)
};

type Props = {
    data: ITagPerformanceChartData;
    title?: string;
};

export default function TagPerformanceChart({ data, title }: Props) {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const chartInstance = useRef<ECharts | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chart = echarts.init(chartRef.current, undefined, {
            renderer: "canvas",
        });
        chartInstance.current = chart;

        const hasData = data.tags.length > 0;

        const option: echarts.EChartsOption = {
            backgroundColor: "transparent",

            title: {
                text: title ?? "Melhores Tags",
                subtext: hasData ? "Total de acionamentos × acionamentos em ocorrências relevantes" : "Sem tags acionadas neste ativo",
                left: 12,
                top: 10,
                textStyle: { fontSize: 15, fontWeight: "bold", color: "#1e293b" },
                subtextStyle: { fontSize: 11, color: "#94a3b8" },
            },

            legend: {
                show: true,
                top: 56,
                left: 12,
                itemWidth: 12,
                itemHeight: 12,
                itemGap: 18,
                textStyle: { color: "#475569", fontSize: 12 },
                data: ["Acionamentos", "Acionou ocorrências relevantes"],
            },

            toolbox: {
                show: true,
                orient: "horizontal",
                right: 12,
                top: 8,
                itemSize: 18,
                itemGap: 10,
                iconStyle: { borderColor: "#94a3b8", borderWidth: 1.5 },
                emphasis: { iconStyle: { borderColor: "#3b82f6", color: "#bdd2ed" } },
                feature: {
                    dataZoom: { show: true, title: { zoom: "Zoom", back: "Restaurar zoom" }, yAxisIndex: false },
                    restore: { show: true, title: "Restaurar" },
                    saveAsImage: { show: true, title: "Baixar PNG", type: "png", name: "grafico-melhores-tags", backgroundColor: "#ffffff", pixelRatio: 2 },
                },
            },

            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow", shadowStyle: { color: "rgba(59,130,246,0.06)" } },
                backgroundColor: "#0f172a",
                borderColor: "#1e3a5f",
                borderWidth: 1,
                borderRadius: 10,
                padding: [10, 14],
                textStyle: { color: "#f1f5f9", fontSize: 13 },
                formatter: (params: any) => {
                    const list = Array.isArray(params) ? params : [params];
                    const name = list[0]?.name ?? "";
                    const total = list.find((p: any) => p.seriesName === "Acionamentos")?.value ?? 0;
                    const relevant = list.find((p: any) => p.seriesName === "Acionou ocorrências relevantes")?.value ?? 0;
                    const pct = total > 0 ? ((relevant / total) * 100).toFixed(0) : "0";
                    return `
                        <div style="font-weight:600;margin-bottom:6px;color:#93c5fd">${name}</div>
                        <div style="display:flex;align-items:center;gap:8px">
                            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#3b82f6"></span>
                            <span>Acionamentos: <b style="color:#fff">${total}</b></span>
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;margin-top:3px">
                            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981"></span>
                            <span>Relevantes: <b style="color:#fff">${relevant}</b></span>
                        </div>
                        <div style="color:#64748b;font-size:11px;margin-top:5px">${pct}% dos acionamentos foram relevantes</div>
                    `;
                },
            },

            grid: {
                left: "2%",
                right: "6%",
                top: 100,
                bottom: "4%",
                containLabel: true,
            },

            xAxis: {
                type: "value",
                minInterval: 1,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    color: "#94a3b8",
                    fontSize: 11,
                    formatter: (v: number) => (Number.isInteger(v) ? String(v) : ""),
                },
                splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
            },

            yAxis: {
                type: "category",
                // ECharts desenha a categoria de baixo para cima; invertendo, a maior fica no topo
                data: [...data.tags].reverse(),
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    color: "#475569",
                    fontSize: 12,
                    fontWeight: "bold",
                    margin: 12,
                    formatter: (val: string) => (val.length > 20 ? val.slice(0, 18) + "…" : val),
                },
            },

            series: [
                {
                    name: "Acionamentos",
                    type: "bar",
                    data: [...data.activated].reverse(),
                    barMaxWidth: 18,
                    barGap: "20%",
                    itemStyle: { color: "#3b82f6", borderRadius: [0, 6, 6, 0] },
                    label: { show: true, position: "right", color: "#475569", fontSize: 11, fontWeight: "bold", formatter: "{c}" },
                    emphasis: { itemStyle: { shadowBlur: 8, shadowColor: "rgba(59,130,246,0.4)" } },
                },
                {
                    name: "Acionou ocorrências relevantes",
                    type: "bar",
                    data: [...data.relevant].reverse(),
                    barMaxWidth: 18,
                    itemStyle: { color: "#10b981", borderRadius: [0, 6, 6, 0] },
                    label: { show: true, position: "right", color: "#047857", fontSize: 11, fontWeight: "bold", formatter: (p: any) => (p.value > 0 ? p.value : "") },
                    emphasis: { itemStyle: { shadowBlur: 8, shadowColor: "rgba(16,185,129,0.4)" } },
                },
            ],
        };

        chart.setOption(option);

        const ro = new ResizeObserver(() => chart.resize());
        ro.observe(chartRef.current!);

        return () => {
            ro.disconnect();
            chart.dispose();
        };
    }, [data, title]);

    return (
        <div
            ref={chartRef}
            style={{
                width: "100%",
                height: "min(80vh, 420px)",
                minHeight: 500,
            }}
        />
    );
}
