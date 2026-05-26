import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface FullscreenPopupProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export default function FullscreenPopup({ open, onClose, children, title }: FullscreenPopupProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Fecha com ESC
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (open) document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onClose]);

    // Trava scroll do body enquanto aberto
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <div
            ref={overlayRef}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "var(--card)", // troque por sua variável de tema se quiser
                transform: open ? "translateY(0)" : "translateY(100%)",
                transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                pointerEvents: open ? "auto" : "none",
            }}
        >
            {/* Barra superior */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 16px",
                    height: 56,
                    borderBottom: "1px solid var(--border)",
                    flexShrink: 0,
                }}
                className="bg-foreground"
            >
                <span style={{ fontWeight: 500, fontSize: 15, color: "var(--background)" }}>{title ?? "Gráfico"}</span>
                <button
                    onClick={onClose}
                    aria-label="Fechar"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: "var(--background)",
                    }}
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Conteúdo centralizado */}
            <div
                style={{
                    overflow: "auto",
                    padding: 15,
                    background: "var(--muted)",
                }}
            >
                <div className="w-[100%]">{children}</div>
            </div>
        </div>
    );
}
