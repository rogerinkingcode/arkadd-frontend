"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { ECharts, EChartsOption } from "echarts";

export type IScoreMonthData = {
    avg: number;
    min: number;
    max: number;
    count: number;
};

export type IScoreChartData = {
    labels: string[];
    data: IScoreMonthData[];
};

type Props = {
    data: IScoreChartData;
    title?: string;
};

export default function ScoreChart({ data, title }: Props) {
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

        // Série invisível do min — base da faixa sombreada
        const minData = data.data.map((d) => d.min);
        // Diferença max-min — empilhada sobre min para formar a faixa
        const bandData = data.data.map((d) => +(d.max - d.min).toFixed(1));
        const avgData = data.data.map((d) => d.avg);
        const countData = data.data.map((d) => d.count);

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
                    restore: { show: true, title: "Restaurar" },
                    saveAsImage: {
                        show: true,
                        title: "Baixar PNG",
                        type: "png",
                        name: "grafico-score-marketplaces",
                        backgroundColor: "#ffffff",
                        pixelRatio: 2,
                    },
                },
            },

            legend: {
                data: ["Score Médio", "Amplitude (min/max)"],
                bottom: 40,
                textStyle: { color: "#475569", fontSize: 12 },
                icon: "roundRect",
                itemWidth: 12,
                itemHeight: 8,
            },

            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                    label: { backgroundColor: "#0f172a" },
                    lineStyle: { color: "#f59e0b", opacity: 0.5 },
                },
                backgroundColor: "#0f172a",
                borderColor: "#78350f",
                borderWidth: 1,
                borderRadius: 10,
                padding: [10, 14],
                textStyle: { color: "#f1f5f9", fontSize: 12 },
                formatter: (params: any) => {
                    const list = Array.isArray(params) ? params : [params];
                    const idx = list[0]?.dataIndex ?? 0;
                    const label = data.labels[idx] ?? "";
                    const d = data.data[idx];
                    if (!d) return "";
                    return `
                        <div style="font-weight:600;margin-bottom:6px;color:#fcd34d">${label}</div>
                        <div style="display:flex;justify-content:space-between;gap:16px;margin:3px 0">
                            <span style="color:#94a3b8">Média</span>
                            <b style="color:#fbbf24">${d.avg}</b>
                        </div>
                        <div style="display:flex;justify-content:space-between;gap:16px;margin:3px 0">
                            <span style="color:#94a3b8">Mínimo</span>
                            <b style="color:#fff">${d.min}</b>
                        </div>
                        <div style="display:flex;justify-content:space-between;gap:16px;margin:3px 0">
                            <span style="color:#94a3b8">Máximo</span>
                            <b style="color:#fff">${d.max}</b>
                        </div>
                        <div style="display:flex;justify-content:space-between;gap:16px;margin:3px 0;border-top:1px solid #1e3a5f;padding-top:4px">
                            <span style="color:#94a3b8">Ocorrências</span>
                            <b style="color:#fff">${d.count}</b>
                        </div>
                    `;
                },
            },

            grid: {
                left: "2%",
                right: "4%",
                top: title ? 100 : 48,
                bottom: 90,
                containLabel: true,
            },

            xAxis: {
                type: "category",
                data: data.labels,
                boundaryGap: false,
                axisLine: { lineStyle: { color: "#e2e8f0" } },
                axisTick: { show: false },
                axisLabel: { color: "#64748b", fontSize: 12 },
            },

            yAxis: {
                type: "value",
                name: "Score",
                min: 0,
                nameTextStyle: { color: "#94a3b8", fontSize: 11 },
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    color: "#94a3b8",
                    fontSize: 11,
                    formatter: (v: number) => String(v),
                },
                splitLine: {
                    lineStyle: { color: "#f1f5f9", type: "dashed" },
                },
            },

            dataZoom: [
                {
                    type: "inside",
                    start: 0,
                    end: 100,
                    zoomOnMouseWheel: true,
                },
                {
                    type: "slider",
                    start: 0,
                    end: 100,
                    height: 20,
                    bottom: 8,
                    borderColor: "#e2e8f0",
                    fillerColor: "rgba(245,158,11,0.1)",
                    handleStyle: { color: "#f59e0b" },
                    moveHandleStyle: { color: "#f59e0b" },
                    textStyle: { color: "#94a3b8" },
                    selectedDataBackground: {
                        lineStyle: { color: "#f59e0b" },
                        areaStyle: { color: "#f59e0b" },
                    },
                },
            ],

            series: [
                // Base invisível do min — ancora a faixa sombreada
                {
                    name: "Min base",
                    type: "line",
                    data: minData,
                    lineStyle: { opacity: 0 },
                    stack: "score-band",
                    symbol: "none",
                    silent: true,
                    legendHoverLink: false,
                    tooltip: { show: false },
                    areaStyle: { color: "transparent" },
                },
                // Faixa sombreada min→max
                {
                    name: "Amplitude (min/max)",
                    type: "line",
                    data: bandData,
                    lineStyle: { opacity: 0 },
                    stack: "score-band",
                    symbol: "none",
                    silent: true,
                },
                // Linha da média
                {
                    name: "Score Médio",
                    type: "line",
                    data: avgData,
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 6,
                    showSymbol: false,
                    z: 10,
                    lineStyle: { width: 2.5, color: "#f59e0b" },
                    itemStyle: { color: "#f59e0b" },
                    emphasis: {
                        focus: "series" as const,
                        lineStyle: { width: 3.5 },
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: "rgba(245,158,11,0.2)" },
                            { offset: 1, color: "rgba(245,158,11,0)" },
                        ]),
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

    return <div ref={chartRef} style={{ width: "100%", height: "min(80vh, 370px)", minHeight: 320 }} />;
}
