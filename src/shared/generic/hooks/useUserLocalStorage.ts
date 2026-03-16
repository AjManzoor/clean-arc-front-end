import {
    deleteProperty,
    getProperty,
    setProperty
} from "../../../lib/utils/dataModifiers";
import { LocalUserStorageConstants } from "../constants/localUserStorageConstants";

export const useUserLocalStorage = () => {

    // Initialize localStorage with default value if it doesn't exist
    const initialize = () => {
        try {
            const existing = localStorage.getItem(
                LocalUserStorageConstants.userStorageKey
            );

            if (existing === null) {
                localStorage.setItem(
                    LocalUserStorageConstants.userStorageKey,
                    JSON.stringify(
                        LocalUserStorageConstants.userStorageMasterJson
                    )
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Call initialize when hook is used
    // (ensure master obj placeholder values are set)
    initialize();

    // Get a property from the JSON object in localStorage
    const getItem = <T>(propKey: string): T | null => {
        try {
            const jsonString = localStorage.getItem(
                LocalUserStorageConstants.userStorageKey
            );

            if (!jsonString) {
                return null;
            }

            const obj = JSON.parse(jsonString) as Record<string, unknown>;

            return getProperty(obj, propKey);
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // Set a property in the JSON object in localStorage
    const setItem = <T>(propKey: string, value: T) => {
        try {
            const newObj = setProperty(
                configureStorageObj(),
                propKey,
                value
            );

            localStorage.setItem(
                LocalUserStorageConstants.userStorageKey,
                JSON.stringify(newObj)
            );
        } catch (error) {
            console.error(error);
        }
    };

    // Remove the entire JSON object from localStorage
    const removeAll = () => {
        localStorage.removeItem(LocalUserStorageConstants.userStorageKey);
    };

    // Remove an item from the JSON structure
    const replaceItem = (propKey: string, newValue: any) => {
        const newObj = setProperty(
            configureStorageObj(),
            propKey,
            newValue
        );

        localStorage.setItem(
            LocalUserStorageConstants.userStorageKey,
            JSON.stringify(newObj)
        );
    };

    const removeItem = (propKey: string) => {
        const newObj = deleteProperty(configureStorageObj(), propKey);

        localStorage.setItem(
            LocalUserStorageConstants.userStorageKey,
            JSON.stringify(newObj)
        );
    };

    const configureStorageObj = () => {
        const jsonString = localStorage.getItem(
            LocalUserStorageConstants.userStorageKey
        );

        const currentObj = JSON.parse(jsonString ?? "{}");

        return currentObj;
    };

    return {
        getItem,
        setItem,
        replaceItem,
        removeItem,
        removeAll
    };
};