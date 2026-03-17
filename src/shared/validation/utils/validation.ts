export function stringEmpty(input: string): boolean {
    if (!input) {
        return true;
    }

    return input.trim() === "";
}

export function inputEmpty(input: any): boolean {
    return input == null || input === "";
}

export function inputEmptyOrDefaultGuid(input: any): boolean {
    return (
        input == null ||
        input === "" ||
        input === "00000000-0000-0000-0000-000000000000"
    );
}

export function collectionEmpty(obj: any): boolean {
    if (!obj) {
        return true;
    }

    return obj.length === 0;
}

export function radioButtonSelected(input: any): boolean {
    return input == null;
}