import * as React from "react";

type Stop = { offset: string; color: string; opacity?: number };

type GradientCardProps = {
    /** Único por card para evitar colisiones en <defs id="..."> */
    gradientId: string;

    /** Altura opcional */
    height?: number | string;
    minHeight?: number | string;

    /** Estilo del borde */
    radius?: number;
    strokeWidth?: number;
    stops?: Stop[];

    /** Glow hover (el blur detrás) */
    glow?: boolean;

    /** Clases/estilos para el wrapper y el content */
    className?: string;
    style?: React.CSSProperties;
    contentClassName?: string;
    contentStyle?: React.CSSProperties;

    children: React.ReactNode;
};

const defaultStops: Stop[] = [
    { offset: "0%", color: "#fbbf24", opacity: 1 },
    { offset: "50%", color: "#f97316", opacity: 1 },
    { offset: "100%", color: "#ea580c", opacity: 1 },
];

export function GradientCard({
    gradientId,
    height,
    minHeight,
    radius = 16,
    strokeWidth = 2,
    stops = defaultStops,
    glow = true,
    className = "",
    style,
    contentClassName = "p-5",
    contentStyle,
    children,
}: GradientCardProps) {
    const id = `grad-${gradientId}`; // prefijo para evitar conflictos

    return (
        <div className={`relative group ${className}`}>
            {glow && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-yellow-400 via-orange-500 to-orange-600 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20" />
            )}

            <div
                className="relative h-full"
                style={{
                    height,
                    minHeight,
                    ...style,
                }}
            >
                <svg
                    className="absolute inset-0 w-full h-full"
                    style={{ pointerEvents: "none" }}
                >
                    <defs>
                        <linearGradient
                            id={id}
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            {stops.map((s, i) => (
                                <stop
                                    key={i}
                                    offset={s.offset}
                                    style={{
                                        stopColor: s.color,
                                        stopOpacity: s.opacity ?? 1,
                                    }}
                                />
                            ))}
                        </linearGradient>
                    </defs>

                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        rx={radius}
                        ry={radius}
                        fill="none"
                        stroke={`url(#${id})`}
                        strokeWidth={strokeWidth}
                    />
                </svg>

                <div
                    className={`relative h-full rounded-2xl ${contentClassName}`}
                    style={{ background: "transparent", ...contentStyle }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
