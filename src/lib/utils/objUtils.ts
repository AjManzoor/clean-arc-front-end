export const isDomEventOrNode = (value: any): boolean => {
    // React synthetic events and DOM events
    if (value instanceof Event) return true;
    if (value && value.nativeEvent instanceof Event) return true;

    // DOM nodes (like HTMLButtonElement)
    if (value instanceof Node) return true;

    return false;
};

export const isJsonSerializable = (value: any): boolean => {
    try {
        JSON.stringify(value);
        return true;
    } catch {
        return false;
    }
};