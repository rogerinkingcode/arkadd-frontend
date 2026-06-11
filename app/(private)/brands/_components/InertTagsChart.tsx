"use client";
import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { ECharts } from "echarts";

export type IInertTagsChartData = {
    tags: string[];
    values: number[]; // nº de ocorrências em que a tag foi ignorada (nunca acionou nenhuma)
};

type Props = {
    data: IInertTagsChartData;
    title?: string;
};

export default function InertTagsChart({ data, title }: Props) {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const chartInstance = useRef<ECharts | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chart = echarts.init(chartRef.current, undefined, {
            renderer: "canvas",
        });
        chartInstance.current = chart;

        const hasData = data.tags.length > 0;
        const maxVal = data.values.length ? Math.max(...data.values) : 0;

        const option: echarts.EChartsOption = {
            backgroundColor: "transparent",

            title: {
                text: title ?? "Tags Inertes",
                subtext: hasData ? "Tags que não acionaram nenhuma ocorrência (ordenadas pelas mais buscadas em vão)" : "Nenhuma tag inerte neste ativo",
                left: 12,
                top: 10,
                textStyle: { fontSize: 15, fontWeight: "bold", color: "#1e293b" },
                subtextStyle: { fontSize: 11, color: "#94a3b8" },
            },

            toolbox: {
                show: true,
                orient: "horizontal",
                right: 12,
                top: 8,
                itemSize: 18,
                itemGap: 10,
                iconStyle: { borderColor: "#94a3b8", borderWidth: 1.5 },
                emphasis: { iconStyle: { borderColor: "#ef4444", color: "#f7caca" } },
                feature: {
                    dataZoom: { show: true, title: { zoom: "Zoom", back: "Restaurar zoom" }, yAxisIndex: false },
                    restore: { show: true, title: "Restaurar" },
                    saveAsImage: { show: true, title: "Baixar PNG", type: "png", name: "grafico-tags-inertes", backgroundColor: "#ffffff", pixelRatio: 2 },
                },
            },

            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow", shadowStyle: { color: "rgba(239,68,68,0.06)" } },
                backgroundColor: "#0f172a",
                borderColor: "#7f1d1d",
                borderWidth: 1,
                borderRadius: 10,
                padding: [10, 14],
                textStyle: { color: "#f1f5f9", fontSize: 13 },
                formatter: (params: any) => {
                    const p = Array.isArray(params) ? params[0] : params;
                    return `
                        <div style="font-weight:600;margin-bottom:4px;color:#fca5a5">${p.name}</div>
                        <div style="display:flex;align-items:center;gap:8px">
                            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ef4444"></span>
                            <span>Ignorada em <b style="color:#fff">${p.value}</b> ocorrência(s)</span>
                        </div>
                        <div style="color:#64748b;font-size:11px;margin-top:4px">Nunca acionou nenhuma ocorrência</div>
                    `;
                },
            },

            grid: {
                left: "2%",
                right: "6%",
                top: 88,
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

            visualMap: {
                show: false,
                min: 0,
                max: maxVal,
                inRange: {
                    color: ["#fca5a5", "#ef4444", "#b91c1c"],
                },
            },

            series: [
                {
                    name: "Vezes ignorada",
                    type: "bar",
                    data: [...data.values].reverse(),
                    barMaxWidth: 32,
                    barMinHeight: 4,
                    itemStyle: { borderRadius: [0, 6, 6, 0] },
                    label: { show: true, position: "right", color: "#475569", fontSize: 12, fontWeight: "bold", formatter: "{c}" },
                    emphasis: { itemStyle: { shadowBlur: 8, shadowColor: "rgba(239,68,68,0.4)" } },
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
