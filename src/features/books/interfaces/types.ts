export type BookItemResponse = {
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

export type AuthorItemResult = {
    id: string;           // Guid -> string
    name : string,
    description : string
}

export type ICreateBookRequest = {
    
}