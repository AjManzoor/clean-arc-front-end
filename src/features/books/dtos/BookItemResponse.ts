export type BookItemResponse {
    id: string;           // Guid -> string
    bookName?: string;
    author?: string;
    genreId?: number;
    fiction: boolean;
    userBookId?: number;
    startDate: string;    // DateOnly -> string (ISO date)
    finishDate?: string;
    rating?: number;
}