"use client";

import { useEffect, useRef } from "react";

/**
 * Lado da célula da simulação, em pixels de CSS.
 *
 * A grade é grossa de propósito: a onda é um campo suave, e o navegador interpola ao esticar o
 * canvas para o tamanho real. Resolução alta aqui só gastaria CPU sem mudar o que se vê.
 */
const CELL = 5;

/** Energia que sobra a cada passo. Abaixo disso a onda morre rápido demais; acima, ela ecoa. */
const DAMPING = 0.945;

/** Altura depositada onde o cursor toca. */
const IMPACT = 150;

/** Abaixo desta energia total a superfície é dada como parada e o laço dorme. */
const REST_ENERGY = 0.4;

/** Ganho do brilho: converte a inclinação da onda em opacidade. */
const SHADE_GAIN = 4.5;

/**
 * Superfície de água que reage ao cursor — o ponteiro é o dedo passando na água.
 *
 * É a simulação clássica de campo de altura em dois buffers: cada célula é a média dos quatro
 * vizinhos no passo anterior menos o próprio valor atual, tudo multiplicado pelo amortecimento.
 * Disso saem ondas que se propagam, refletem nas bordas e se somam — o que um monte de círculos
 * em CSS não faz, porque ali cada onda ignora as outras.
 *
 * O canvas pinta só luz e sombra em cima do que estiver embaixo (`rgba` branco/preto conforme a
 * inclinação da onda). Assim ele não precisa saber nada sobre o tema: quem dá a cor é o CSS do
 * painel, e a água funciona igual no claro e no escuro.
 */
export default function WaterSurface({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        // Quem pediu menos movimento não recebe uma tela inteira de ondulação.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const ctx = canvas.getContext("2d", { alpha: true });

        if (!ctx) return;

        let cols = 0;
        let rows = 0;
        let previous = new Float32Array(0);
        let current = new Float32Array(0);
        let image: ImageData | null = null;
        let rect = canvas.getBoundingClientRect();

        let frame = 0;
        let running = false;
        // Último ponto tocado, para ligar os pontos quando o cursor anda rápido
        let lastX = -1;
        let lastY = -1;

        function resize() {
            const canvasEl = canvasRef.current;

            if (!canvasEl) return;

            rect = canvasEl.getBoundingClientRect();

            cols = Math.max(8, Math.floor(rect.width / CELL));
            rows = Math.max(8, Math.floor(rect.height / CELL));

            canvasEl.width = cols;
            canvasEl.height = rows;

            previous = new Float32Array(cols * rows);
            current = new Float32Array(cols * rows);
            image = ctx!.createImageData(cols, rows);

            lastX = -1;
            lastY = -1;
        }

        /** Deposita energia numa vizinhança 3x3 — um único ponto nasceria com cara de pixel. */
        function disturb(gx: number, gy: number) {
            if (gx < 2 || gy < 2 || gx > cols - 3 || gy > rows - 3) return;

            for (let y = gy - 1; y <= gy + 1; y++) {
                for (let x = gx - 1; x <= gx + 1; x++) {
                    const center = x === gx && y === gy;
                    previous[y * cols + x] -= center ? IMPACT : IMPACT * 0.45;
                }
            }
        }

        /** Rastro contínuo entre a posição anterior e a atual: é isso que dá a sensação de dedo
         *  arrastando, em vez de gotas caindo em pontos soltos. */
        function drag(gx: number, gy: number) {
            if (lastX < 0) {
                disturb(gx, gy);
            } else {
                const steps = Math.max(1, Math.round(Math.hypot(gx - lastX, gy - lastY)));

                for (let step = 1; step <= steps; step++) {
                    disturb(Math.round(lastX + ((gx - lastX) * step) / steps), Math.round(lastY + ((gy - lastY) * step) / steps));
                }
            }

            lastX = gx;
            lastY = gy;
        }

        function step() {
            for (let y = 1; y < rows - 1; y++) {
                const row = y * cols;

                for (let x = 1; x < cols - 1; x++) {
                    const i = row + x;
                    current[i] = ((previous[i - 1] + previous[i + 1] + previous[i - cols] + previous[i + cols]) / 2 - current[i]) * DAMPING;
                }
            }

            const swap = previous;
            previous = current;
            current = swap;
        }

        /** Pinta a inclinação da onda como luz (crista) e sombra (vale), e devolve a energia
         *  total — é ela que decide se vale a pena continuar animando. */
        function render(): number {
            if (!image) return 0;

            const data = image.data;
            let energy = 0;

            for (let y = 1; y < rows - 1; y++) {
                const row = y * cols;

                for (let x = 1; x < cols - 1; x++) {
                    const i = row + x;
                    const height = previous[i];

                    energy += height < 0 ? -height : height;

                    // Luz vinda do canto superior esquerdo, como numa superfície real
                    const slope = previous[i - 1] - previous[i + 1] + previous[i - cols] - previous[i + cols];
                    const shade = slope * SHADE_GAIN;
                    // Teto abaixo de 255: o brilho fica sempre translúcido, senão o ponto sob o
                    // cursor viraria um borrão branco sólido em vez de luz na superfície.
                    const alpha = Math.min(190, Math.abs(shade));
                    const p = i * 4;

                    // Crista reflete a luz, vale escurece
                    const tone = shade > 0 ? 255 : 0;
                    data[p] = tone;
                    data[p + 1] = tone;
                    data[p + 2] = tone;
                    data[p + 3] = alpha;
                }
            }

            ctx!.putImageData(image, 0, 0);

            return energy;
        }

        function loop() {
            step();

            const energy = render();

            // Água parada não precisa de quadro novo: o laço dorme até o cursor voltar a mexer.
            if (energy < REST_ENERGY) {
                running = false;
                return;
            }

            frame = requestAnimationFrame(loop);
        }

        function wake() {
            if (running) return;

            running = true;
            frame = requestAnimationFrame(loop);
        }

        function handlePointerMove(event: PointerEvent) {
            const gx = Math.floor((event.clientX - rect.left) / CELL);
            const gy = Math.floor((event.clientY - rect.top) / CELL);

            if (gx < 0 || gy < 0 || gx >= cols || gy >= rows) {
                lastX = -1;
                lastY = -1;
                return;
            }

            drag(gx, gy);
            wake();
        }

        function handlePointerLeave() {
            lastX = -1;
            lastY = -1;
        }

        function handleResize() {
            resize();
        }

        /** O retângulo é lido uma vez e guardado — medir a cada movimento do ponteiro forçaria
         *  o navegador a recalcular layout 60 vezes por segundo. Só rolagem e resize o invalidam. */
        function handleScroll() {
            const canvasEl = canvasRef.current;

            if (canvasEl) rect = canvasEl.getBoundingClientRect();
        }

        resize();

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerleave", handlePointerLeave);
        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerleave", handlePointerLeave);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
