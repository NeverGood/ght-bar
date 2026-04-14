export type Item = {
    code_iso: string;
    collection?: null | string;
    countryOrigin: string;
    createdAt: string; //date
    id: number; // ?? string ?
    image: string;
    name: string;
    notes: null | string;
    strength: number;
    type: string; // перевести в типы whiskey rome  итд
    updatedAt: string; //date
    user: string;
};
