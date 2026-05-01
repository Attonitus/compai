interface Props {
    text: string;
}

export default function FormattedMessage({ text }: Props) {
    // Divide el texto en partes: acciones (*...*) y diálogo normal
    const parts = text.split(/(\*[^*]+\*)/g);

    return (
        <div className="space-y-2">
            {parts.map((part, index) => {
                if (part.startsWith("*") && part.endsWith("*")) {

                    // Es una acción — quita los asteriscos y estiliza
                    const action = part.slice(1, -1);
                    return (
                        <p key={index} className="text-sm italic text-muted-foreground before:content-['·_'] after:content-['_·']">
                            {action}
                        </p>
                    );
                }

                // Es diálogo normal — divide por puntos para saltos de línea
                const sentences = part
                    .split(/(?<=[.!?])\s+/)
                    .filter(s => s.trim().length > 0);

                return (
                    <div key={index} className="space-y-1">
                        {sentences.map((sentence, i) => (
                            <p key={i} className="text-sm leading-relaxed">
                                {sentence}
                            </p>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}