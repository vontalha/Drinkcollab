export class AddDrinkDto {
    name: string;
    description?:string;
    price: number;
    size: number;
    stock?: number;
    category: string
}  

export class UpdateDrinkDto {
    name?: string;
    description?:string;
    price?: number;
    size?: number;
    stock?: number;
    category?: string
}