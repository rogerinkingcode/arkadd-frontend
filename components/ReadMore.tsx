import { useState } from "react";

interface ReadMoreProps {
    text?: string;
    limit?: number;
}

export default function ReadMore({ text = "", limit = 150 }: ReadMoreProps) {
    const [expanded, setExpanded] = useState(false);

    if (!text) return null;

    const isLong = text.length > limit;
    const displayedText = expanded ? text : text.slice(0, limit);

    return (
        <p className="text-base mt-1">
            {displayedText}
            {!expanded && isLong && "... "}
            {isLong && (
                <button onClick={() => setExpanded(!expanded)} className="text-primary ml-1 underline">
                    {expanded ? "Ler menos" : "Ler mais"}
                </button>
            )}
        </p>
    );
}
