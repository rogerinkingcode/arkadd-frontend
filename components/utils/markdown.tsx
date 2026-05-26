export function handleMarkdown(text: string) {
    const sanitizedText = text.replace(/#/g, "").replace(/\s+-+\s+/g, " ");

    const parts = sanitizedText.split(/\.(\s{2,})/);

    return parts.map((parte, index) => {
        // separador ".  " → quebra de linha
        if (index % 2 === 1) {
            return (
                <span key={`br-${index}`}>
                    .
                    <br />
                </span>
            );
        }

        return <span key={`text-${index}`}>{renderBold(parte)}</span>;
    });
}

function renderBold(text: string) {
    const parts = text.split(/\*\*(.*?)\*\*/g);

    return parts.map((part, index) => (index % 2 === 1 ? <strong key={index}>{part}</strong> : <span key={index}>{part}</span>));
}
