import type { IFormSaveStateMutator } from "../interfaces/form/formSaveState";


export const applyDefaultValueToObjectNumberProperties = (
    obj: any,
    defaultValue: number,
    props: string[]
) => {
    const newObj = { ...obj };

    for (const key of props) {
        if (!newObj[key]) {
            newObj[key] = defaultValue;
        }
    }

    return newObj;
};

export const addOrOverwriteObjectForRouterValues = (
    obj: any,
    newProps: any[],
    routerObj: any
) => {
    if (!newProps || Object.keys(routerObj).length == 0) {
        return obj;
    }

    const newObj = { ...obj };

    for (const key in newProps) {
        newObj[newProps[key].propToModify] =
            routerObj[newProps[key].routeParam];
    }

    return newObj;
};

export function modifyDatasetFromCheckboxSelect(
    checked: boolean,
    currentData: any[],
    newData: any[],
    prop: string,
    searchValue: string
): any[] {
    if (checked) {
        return newData;
    }

    const newObj = { ...currentData };

    let index = -1;

    for (const key in newObj) {
        if (newObj[key][prop] == searchValue) {
            index = parseInt(key);
            break;
        }
    }

    if (index > -1) {
        currentData.splice(index, 1);
        return currentData;
    }

    return newData;
}

export function setProperty<T>(
    obj: T,
    prop: string,
    value: any,
    saveState?: IFormSaveStateMutator
): T {
    let currentObj: any = obj;

    if (!!saveState) {
        saveState.setModified();
    }

    const props = prop.split(".");
    const lastProp = props.pop();

    for (const p of props) {
        if (!currentObj[p]) {
            currentObj[p] = {};
        }

        currentObj = currentObj[p];
    }

    if (lastProp) {
        currentObj[lastProp] = value;
    }

    return obj;
}

export function deleteProperty<T>(
    obj: T,
    prop: string,
    saveState?: IFormSaveStateMutator
): T {
    let currentObj: any = obj;

    if (!!saveState) {
        saveState.setModified();
    }

    const props = prop.split(".");
    const lastProp = props.pop();

    for (const p of props) {
        if (!currentObj[p]) {
            currentObj[p] = {};
        }

        currentObj = currentObj[p];
    }

    if (
        lastProp &&
        currentObj &&
        Object.prototype.hasOwnProperty.call(currentObj, lastProp)
    ) {
        delete currentObj[lastProp];
    }

    return obj;
}

export function getProperty<T>(obj: any, prop: string): T | null {
    // If the property exists at the current level, return it
    if (prop in obj) {
        return obj[prop] as T;
    }

    // Otherwise, recursively search in nested objects or arrays
    for (const key in obj) {
        if (obj[key] !== null && typeof obj[key] === "object") {
            const result = getProperty<T>(obj[key], prop);

            if (result !== null) {
                return result;
            }
        }
    }

    return null;
}

export function setPropertyWithDebounce<T>(
    obj: T,
    prop: any,
    value: any,
    delay: number
) {
    let timeoutId;
    let val: T = obj;

    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
        val = setProperty(obj, prop, value);
    }, delay);

    return val;
}