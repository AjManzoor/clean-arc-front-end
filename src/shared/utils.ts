export function combineClassNames(parts: (string | null | undefined)[]): string {
    const filteredParts = parts.filter(
        p => p != undefined && p != null && p!.trim().length > 0
    );

    return filteredParts.join(" ");
}

export function combineClassNamesConditional(
    parts: [string, boolean][]
): string {
    const filteredParts = parts.filter(
        p =>
            !!p[1] &&
            p[0] != undefined &&
            p[0] != null &&
            p[0]!.trim().length > 0
    );

    return filteredParts.map(p => p[0]).join(" ");
}