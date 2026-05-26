"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:scale-[1.02] transition-all duration-300",
                destructive: "bg-gradient-to-r from-destructive to-destructive/80 text-white hover:from-destructive/90 hover:to-destructive/70 hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] hover:scale-[1.02] transition-all duration-300 dark:from-destructive/80 dark:to-destructive/60",
                outline: "border bg-gradient-to-r from-background to-background/95 hover:from-accent hover:to-accent/80 hover:text-accent-foreground hover:shadow-[0_0_20px_rgba(0,0,0,0.25)] hover:scale-[1.02] transition-all duration-300 dark:bg-input/30 dark:border-input",
                secondary: "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground hover:from-secondary/90 hover:to-secondary/70 hover:shadow-[0_0_25px_rgba(107,114,128,0.5)] hover:scale-[1.02] transition-all duration-300",
                ghost: "hover:bg-gradient-to-r hover:from-accent hover:to-accent/80 hover:text-accent-foreground hover:shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:scale-[1.02] transition-all duration-300 dark:hover:from-accent/50 dark:hover:to-accent/30",
                link: "text-primary underline-offset-4 hover:underline hover:shadow-none hover:scale-100",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
                "icon-sm": "size-8",
                "icon-lg": "size-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

const pulseAnimation = `
@keyframes pulse-glow {
    0%   { transform: scale(1);    box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
    25%  { transform: scale(1.02); }
    50%  { transform: scale(1);    box-shadow: 0 0 20px 5px rgba(59,130,246,0.6); }
    75%  { transform: scale(1.01); }
    100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(59,130,246,0); }
}
.btn-pulse { animation: pulse-glow 0.5s ease-out; }
`;

if (typeof document !== "undefined") {
    const styleId = "button-pulse-animation";
    if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = pulseAnimation;
        document.head.appendChild(style);
    }
}

function Button({
    className,
    variant,
    size,
    asChild = false,
    onClick,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : "button";
    const ref = React.useRef<HTMLButtonElement>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const el = ref.current;
        if (el) {
            // Manipula a classe diretamente no DOM — sem state, sem mismatch de hidratação
            el.classList.remove("btn-pulse");
            // Força reflow para reiniciar a animação caso clique rápido
            void el.offsetWidth;
            el.classList.add("btn-pulse");
            const timer = setTimeout(() => el.classList.remove("btn-pulse"), 500);
            // Limpa o timer se o componente desmontar antes
            el.addEventListener(
                "animationend",
                () => {
                    clearTimeout(timer);
                    el.classList.remove("btn-pulse");
                },
                { once: true },
            );
        }
        onClick?.(e);
    };

    return <Comp ref={ref as React.Ref<HTMLButtonElement>} data-slot="button" className={cn(buttonVariants({ variant, size, className }))} onClick={handleClick} {...props} />;
}

export { Button, buttonVariants };
