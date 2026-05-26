// components/charts/VerificationDonutChart.tsx
"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { ECharts } from "echarts";

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

const VERIFIED_COLOR = "#22c55e";
const UNVERIFIED_COLOR = "#ef4444";

function SingleDonut({ channel }: { channel: { name: string; verified: number; unverified: number; total: number; pct: number } }) {
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

        chart.setOption({
            tooltip: {
                trigger: "item",
                backgroundColor: "#0f172a",
                borderColor: "#2e1065",
                borderWidth: 1,
                borderRadius: 10,
                padding: [10, 14],
                textStyle: { color: "#f1f5f9", fontSize: 12 },
                formatter: (params: any) => {
                    const pct = params.percent?.toFixed(1) ?? "0";
                    return `
                        <div style="display:flex;align-items:center;gap:8px;margin:3px 0">
                            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${params.color}"></span>
                            <span style="color:#94a3b8">${params.name}</span>
                            <b style="color:#fff;margin-left:8px">${Number(params.value).toLocaleString("pt-BR")} (${pct}%)</b>
                        </div>
                    `;
                },
            },
            series: [
                {
                    type: "pie",
                    radius: ["50%", "75%"],
                    center: ["50%", "50%"],
                    labelLine: { show: false },
                    label: {
                        show: true,
                        position: "center",
                        formatter: () => `${channel.pct}%`,
                        fontSize: 20,
                        fontWeight: "bold",
                        color: channel.pct >= 50 ? VERIFIED_COLOR : UNVERIFIED_COLOR,
                    },
                    emphasis: {
                        scaleSize: 5,
                        label: { fontSize: 22 },
                    },
                    data: [
                        {
                            value: channel.verified,
                            name: "Verificado",
                            itemStyle: { color: VERIFIED_COLOR },
                        },
                        {
                            value: channel.unverified,
                            name: "Não verificado",
                            itemStyle: { color: UNVERIFIED_COLOR, opacity: 0.8 },
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div ref={chartRef} style={{ width: "100%", height: 180 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>{channel.name}</span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>
                {channel.verified.toLocaleString("pt-BR")} / {channel.total.toLocaleString("pt-BR")}
            </span>
        </div>
    );
}

export default function VerificationDonutChart({ data, title }: Props) {
    const channelTotals = data.channels.map((channel) => {
        const verified = channel.data.reduce((s, d) => s + d.verified, 0);
        const unverified = channel.data.reduce((s, d) => s + d.unverified, 0);
        const total = verified + unverified;
        const pct = total > 0 ? Math.round((verified / total) * 100) : 0;
        return { name: channel.name, verified, unverified, total, pct };
    });

    return (
        <div style={{ width: "100%" }}>
            {title && <p style={{ fontSize: 15, fontWeight: "bold", color: "#1e293b", marginBottom: 16, paddingLeft: 4 }}>{title}</p>}
            {/* Legenda manual */}
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: VERIFIED_COLOR, display: "inline-block" }} />
                    Verificado
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: UNVERIFIED_COLOR, display: "inline-block" }} />
                    Não verificado
                </span>
            </div>
            {/* Grid dos donuts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {channelTotals.map((channel) => (
                    <SingleDonut key={channel.name} channel={channel} />
                ))}
            </div>
        </div>
    );
}
