"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { ECharts } from "echarts";

export type IChannelMonthData = {
    total: number;
    active: number;
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

const TOTAL_COLOR = "#3b82f6";
const ACTIVE_COLOR = "#10b981";

function SingleRadar({ channel }: { channel: { name: string; total: number; active: number; archived: number; noiseRate: number } }) {
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
        const max = Math.max(channel.total, 1);

        chart.setOption({
            tooltip: {
                trigger: "item",
                backgroundColor: "#0f172a",
                borderColor: "#1e3a5f",
                borderWidth: 1,
                borderRadius: 10,
                padding: [10, 14],
                textStyle: { color: "#f1f5f9", fontSize: 12 },
                formatter: (params: any) => {
                    const v = params.value ?? [];
                    return `
                        <div style="font-weight:600;margin-bottom:6px;color:#93c5fd">${channel.name}</div>
                        <div style="display:flex;justify-content:space-between;gap:16px;margin:2px 0">
                            <span style="color:#94a3b8">Total</span>
                            <b style="color:#fff">${channel.total.toLocaleString("pt-BR")}</b>
                        </div>
                        <div style="display:flex;justify-content:space-between;gap:16px;margin:2px 0">
                            <span style="color:#94a3b8">Ativos</span>
                            <b style="color:#10b981">${channel.active.toLocaleString("pt-BR")}</b>
                        </div>
                        <div style="display:flex;justify-content:space-between;gap:16px;margin:2px 0">
                            <span style="color:#94a3b8">Arquivados</span>
                            <b style="color:#f97316">${channel.archived.toLocaleString("pt-BR")}</b>
                        </div>
                        <div style="display:flex;justify-content:space-between;gap:16px;margin:2px 0;border-top:1px solid #1e3a5f;padding-top:4px">
                            <span style="color:#94a3b8">% Ruído</span>
                            <b style="color:#f97316">${channel.noiseRate}%</b>
                        </div>
                    `;
                },
            },
            radar: {
                center: ["50%", "50%"],
                radius: "65%",
                indicator: [
                    { name: "Total", max },
                    { name: "Ativos", max },
                    { name: "Arquivados", max },
                ],
                axisName: {
                    color: "#64748b",
                    fontSize: 11,
                },
                splitLine: {
                    lineStyle: { color: "#e2e8f0" },
                },
                splitArea: {
                    areaStyle: {
                        color: ["rgba(241,245,249,0.4)", "rgba(226,232,240,0.3)"],
                    },
                },
                axisLine: {
                    lineStyle: { color: "#e2e8f0" },
                },
            },
            series: [
                {
                    type: "radar" as const,
                    data: [
                        {
                            value: [channel.total, channel.active, channel.archived],
                            name: channel.name,
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: "rgba(59,130,246,0.4)" },
                                    { offset: 1, color: "rgba(16,185,129,0.2)" },
                                ]),
                            },
                            lineStyle: { color: TOTAL_COLOR, width: 2 },
                            itemStyle: { color: TOTAL_COLOR },
                            symbol: "circle",
                            symbolSize: 5,
                        },
                    ],
                },
            ],
        });

        const ro = new ResizeObserver(() => chart.resize());
        ro.observe(chartRef.current!);

        return () => ro.disconnect();
    }, [channel]);

    useEffect(() => {
        return () => {
            chartInstance.current?.dispose();
            chartInstance.current = null;
        };
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div ref={chartRef} style={{ width: "100%", height: 200 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>{channel.name}</span>
            <div style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: 11, color: TOTAL_COLOR }}>Total: {channel.total.toLocaleString("pt-BR")}</span>
                <span style={{ fontSize: 11, color: ACTIVE_COLOR }}>Ativos: {channel.active.toLocaleString("pt-BR")}</span>
            </div>
            <span style={{ fontSize: 11, color: "#f97316" }}>{channel.noiseRate}% de ruído</span>
        </div>
    );
}

export default function RadarPerformanceChart({ data, title }: Props) {
    const channelTotals = data.channels.map((channel) => {
        const total = channel.data.reduce((s, d) => s + d.total, 0);
        const active = channel.data.reduce((s, d) => s + d.active, 0);
        const archived = total - active;
        const noiseRate = total > 0 ? Math.round((archived / total) * 100) : 0;
        return { name: channel.name, total, active, archived, noiseRate };
    });

    return (
        <div style={{ width: "100%" }}>
            {title && <p style={{ fontSize: 15, fontWeight: "bold", color: "#1e293b", marginBottom: 16, paddingLeft: 4 }}>{title}</p>}
            {/* Legenda manual */}
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: TOTAL_COLOR, display: "inline-block" }} />
                    Total
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: ACTIVE_COLOR, display: "inline-block" }} />
                    Ativos
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f97316", display: "inline-block" }} />
                    Arquivados
                </span>
            </div>
            {/* Grid dos radars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {channelTotals.map((channel) => (
                    <SingleRadar key={channel.name} channel={channel} />
                ))}
            </div>
        </div>
    );
}
