import moment from "moment";
import type { ValidatorFunction } from "../interfaces/IValidation";
import dataConstants from "../../generic/constants/dataconstants";

export default class ValidatorFunctions {
    // Constants
    private static readonly REGEX_MATCH_EMAIL = /^\S+@\S+\.\S+$/;
    private static readonly REGEX_MATCH_CONTACT_NUMBER = /^\d+$/;

    // Interface
    public static notEmpty(message: string | null = null): ValidatorFunction {
        return (value: any) => {
            return Promise.resolve({
                isValid: ValidatorFunctions.isValueEmpty(value, true) === false,
                message: message ?? "A value is required"
            });
        };
    }

    public static notEmptyIf(
        runCondition: boolean,
        message: string | null = null
    ): ValidatorFunction {
        return (value: any) => {
            return Promise.resolve({
                isValid:
                    !runCondition ||
                    ValidatorFunctions.isValueEmpty(value, true) === false,
                message: message ?? "A value is required"
            });
        };
    }

    public static notEmptyOrDefaultGuid(
        message: string | null = null
    ): ValidatorFunction {
        return (value: any) => {
            return Promise.resolve({
                isValid:
                    ValidatorFunctions.isValueEmpty(value, true) === false &&
                    value !== dataConstants.defaultGuid,
                message: message ?? "A value is required"
            });
        };
    }

    public static valueEquals(
        valueToMatch: any,
        message: string | null = null
    ): ValidatorFunction {
        return (value: any) => {
            return Promise.resolve({
                isValid: value === valueToMatch,
                message: message ?? "Value must match"
            });
        };
    }

    public static minimumLength(
        minLength: number,
        message: string | null = null
    ): ValidatorFunction {
        return (value: any) => {
            return Promise.resolve({
                isValid:
                    ValidatorFunctions.isValueEmpty(value, false) ||
                    ValidatorFunctions.getValueLength(value) >= minLength,
                message: message ?? `Must contain at least ${minLength} characters`
            });
        };
    }

    public static maximumLength(
        maxLength: number,
        message: string | null = null
    ): ValidatorFunction {
        return (value: any) => {
            return Promise.resolve({
                isValid:
                    ValidatorFunctions.isValueEmpty(value, false) ||
                    ValidatorFunctions.getValueLength(value) <= maxLength,
                message: message ?? `Must not contain more than ${maxLength} characters`
            });
        };
    }

    public static isLessThanOrEqual(
        limit: number,
        message: string | null = null
    ): ValidatorFunction {
        return (value: any) => {
            const numVal = ValidatorFunctions.getNumberValue(value);

            return Promise.resolve({
                isValid:
                    ValidatorFunctions.isValueEmpty(value, false) ||
                    (numVal != null && numVal <= limit),
                message: message ?? `Must be a number less than or equal to ${limit}`
            });
        };
    }

    public static isGreaterThanOrEqual(
        limit: number,
        message: string | null = null
    ): ValidatorFunction {
        return (value: any) => {
            const numVal = ValidatorFunctions.getNumberValue(value);

            return Promise.resolve({
                isValid:
                    ValidatorFunctions.isValueEmpty(value, false) ||
                    (numVal != null && numVal >= limit),
                message:
                    message ?? `Must be a number greater than or equal to ${limit}`
            });
        };
    }

    public static isOfDesiredLength(
        desiredLength: number,
        message: string | null = null
    ): ValidatorFunction {
        return (value: any) => {
            const numVal = ValidatorFunctions.getNumberValue(value);

            return Promise.resolve({
                isValid:
                    ValidatorFunctions.isValueEmpty(value, false) ||
                    (numVal != null && String(numVal).length === desiredLength),
                message: message ?? `Must be a ${desiredLength} digit number`
            });
        };
    }

    public static isGreaterThanOrEqualDesiredLength(
        desiredLength: number,
        message: string | null = null
    ): ValidatorFunction {
        return (value: any) => {
            const numVal = ValidatorFunctions.getNumberValue(value);

            return Promise.resolve({
                isValid:
                    ValidatorFunctions.isValueEmpty(value, false) ||
                    (numVal != null && String(numVal).length >= desiredLength),
                message: message ?? `Must be at minimum a ${desiredLength} digit number`
            });
        };
    }

    public static email(message: string | null = null): ValidatorFunction {
        return (value: any) => {
            return Promise.resolve({
                isValid:
                    ValidatorFunctions.isValueEmpty(value, false) ||
                    ValidatorFunctions.isEmailAddress(value),
                message: message ?? "Must be a valid email address"
            });
        };
    }

    public static mustBeFutureDateTime(
        message: string | null = null
    ): ValidatorFunction {
        return (value: any) => {
            return Promise.resolve({
                isValid:
                    ValidatorFunctions.isValueEmpty(value, false) ||
                    ValidatorFunctions.isFutureDateTime(value, moment()),
                message: message ?? "Must be a valid future date & time"
            });
        };
    }

    public static contactNumber(
        message: string | null = null
    ): ValidatorFunction {
        return (value: any) => {
            return Promise.resolve({
                isValid:
                    ValidatorFunctions.isValueEmpty(value, false) ||
                    ValidatorFunctions.isContactNumber(value),
                message: message ?? "Must be a valid contact number"
            });
        };
    }

    public static isValueValidDropDown(
        dropdownValue: string,
        dropdownValues: string[],
        message: string | null = null
    ): ValidatorFunction {
        return (_value: any) => {
            return Promise.resolve({
                isValid: dropdownValues.includes(dropdownValue),
                message: message ?? "Selected value is not in the list of options"
            });
        };
    }

    // Internals
    private static isNotSet(value: any): boolean {
        return value === undefined || value === null;
    }

    public static isValueEmpty(value: any, checkArrays: boolean): boolean {
        if (ValidatorFunctions.isNotSet(value)) {
            return true;
        }

        if (typeof value === "string" && value.trim().length === 0) {
            return true;
        }

        if (checkArrays === true && Array.isArray(value) && value.length === 0) {
            return true;
        }

        return false;
    }

    private static getValueLength(value: any): number {
        if (typeof value === "string") {
            return value.length;
        }

        if (Array.isArray(value)) {
            return value.length;
        }

        return value?.length ?? 0;
    }

    private static getNumberValue(value: any): number | null {
        if (!value) {
            return null;
        }

        const numValue = +value;

        if (isNaN(numValue)) {
            return null;
        }

        return numValue;
    }

    private static isEmailAddress(value: any): boolean {
        if (typeof value !== "string") {
            return false;
        }

        return ValidatorFunctions.REGEX_MATCH_EMAIL.test(value);
    }

    private static isFutureDateTime(
        value: any,
        relativeTo: moment.Moment
    ): boolean {
        const mdValue = moment(value);

        if (mdValue.isValid() === false) {
            return false;
        }

        return mdValue.diff(relativeTo, "minute") > 0;
    }

    private static isContactNumber(value: any): boolean {
        if (typeof value !== "string") {
            return false;
        }

        return ValidatorFunctions.REGEX_MATCH_CONTACT_NUMBER.test(value);
    }
}