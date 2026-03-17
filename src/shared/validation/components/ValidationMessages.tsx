import { MdErrorOutline } from "react-icons/md";
import styles from "../css/validation.module.css";
import type { IValidationResult } from "../interfaces/IValidation";

interface ValidationMessagesProps {
    results: IValidationResult[];
    maxNumItems?: number | null;
}

const ValidationMessages: React.FC<ValidationMessagesProps> = ({
    results,
    maxNumItems
}) => {
    const limitedResults =
        maxNumItems && maxNumItems > 0
            ? results.slice(0, maxNumItems)
            : results;

    if (limitedResults.length === 0) {
        return null;
    }

    return (
        <ol className={styles.field_validation_results}>
            {limitedResults.map((result: IValidationResult, index: number) => (
                <li key={index} className={styles.field_validation_result}>
                    <MdErrorOutline className={styles.validation_icon} />
                    <span>{result.message}</span>
                </li>
            ))}
        </ol>
    );
};

export default ValidationMessages;