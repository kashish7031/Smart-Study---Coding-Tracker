export interface Entry {
    _id: string;
    title: string;
    category: string;
    timeSpent: number;
    problemsSolved: number;
    notes?: string;
    date: string | Date;
    createdAt: string | Date;
}
