"use client";
import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { ECharts } from "echarts";

type ChartData = {
    tags: string[];
    values: number[];
};

type Props = {
    data: ChartData;
    title?: string;
};

export default function TagChart({ data, title }: Props) {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const chartInstance = useRef<ECharts | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chart = echarts.init(chartRef.current, undefined, {
            renderer: "canvas",
        });
        chartInstance.current = chart;

        const maxVal = Math.max(...data.values);

        const option: echarts.EChartsOption = {
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
                orient: "horizontal",
                right: 12,
                top: 8,
                itemSize: 18,
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
                        yAxisIndex: false,
                    },
                    magicType: {
                        show: true,
                        title: {
                            line: "Linha",
                            bar: "Barra",
                            stack: "Empilhado",
                        },
                        type: ["line", "bar"],
                    },
                    restore: {
                        show: true,
                        title: "Restaurar",
                    },
                    saveAsImage: {
                        show: true,
                        title: "Baixar PNG",
                        type: "png",
                        name: "grafico-tags",
                        backgroundColor: "#ffffff",
                        pixelRatio: 2,
                    },
                },
            },

            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                    shadowStyle: {
                        color: "rgba(59,130,246,0.06)",
                    },
                },
                backgroundColor: "#0f172a",
                borderColor: "#1e3a5f",
                borderWidth: 1,
                borderRadius: 10,
                padding: [10, 14],
                textStyle: {
                    color: "#f1f5f9",
                    fontSize: 13,
                },
                formatter: (params: any) => {
                    const p = Array.isArray(params) ? params[0] : params;
                    const pct = maxVal > 0 ? ((p.value / maxVal) * 100).toFixed(1) : "0";
                    return `
                        <div style="font-weight:600;margin-bottom:4px;color:#93c5fd">${p.name}</div>
                        <div style="display:flex;align-items:center;gap:8px">
                            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#3b82f6"></span>
                            <span>Menções: <b style="color:#fff">${p.value}</b></span>
                        </div>
                        <div style="color:#64748b;font-size:11px;margin-top:4px">${pct}% do máximo</div>
                    `;
                },
            },

            grid: {
                left: "2%",
                right: "6%",
                top: title ? 100 : 48,
                bottom: "4%",
                containLabel: true,
            },

            xAxis: {
                type: "value",
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    color: "#94a3b8",
                    fontSize: 11,
                    formatter: (v: number) => (Number.isInteger(v) ? String(v) : ""),
                },
                splitLine: {
                    lineStyle: {
                        color: "#f1f5f9",
                        type: "dashed",
                    },
                },
            },

            yAxis: {
                type: "category",
                data: data.tags,
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
                    color: ["#93c5fd", "#3b82f6", "#1d4ed8"],
                },
            },

            series: [
                {
                    name: "Menções",
                    type: "bar",
                    data: data.values,
                    barMaxWidth: 32,
                    barMinHeight: 4,
                    itemStyle: {
                        borderRadius: [0, 6, 6, 0],
                    },
                    label: {
                        show: true,
                        position: "right",
                        color: "#475569",
                        fontSize: 12,
                        fontWeight: "bold",
                        formatter: "{c}",
                    },
                    emphasis: {
                        label: { color: "#1d4ed8" },
                        itemStyle: {
                            shadowBlur: 8,
                            shadowColor: "rgba(59,130,246,0.4)",
                        },
                    },
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
