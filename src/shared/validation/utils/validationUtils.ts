import { IValidationResultWithCategory } from "../Interfaces/IValidation";

export default class ValidationUtils {
    private static normaliseCategory(
        category: string[] | string | null
    ): string[] | null {
        if (category === null) {
            return null;
        }

        return Array.isArray(category) ? category : [category];
    }

    public static filterResultsForCategory(
        results: IValidationResultWithCategory[],
        category: string[] | string | null
    ): IValidationResultWithCategory[] {
        const categoryList = this.normaliseCategory(category);

        return results.filter(
            vr =>
                categoryList === null ||
                categoryList.includes(vr.category!)
        );
    }

    public static countResultsForCategory(
        results: IValidationResultWithCategory[],
        category: string[] | string | null
    ): number {
        const categoryList = this.normaliseCategory(category);

        return results.filter(
            vr =>
                categoryList === null ||
                categoryList.includes(vr.category!)
        ).length;
    }

    public static hasResultsForCategory(
        results: IValidationResultWithCategory[],
        category: string[] | string | null
    ): boolean {
        const categoryList = this.normaliseCategory(category);

        return results.some(
            vr =>
                categoryList === null ||
                categoryList.includes(vr.category!)
        );
    }
}