export class AddProductDto {
	name: string;
	description?: string;
	price: number;
	size?: number; 
	stock?: number;
	categoryName: string;
	type: "DRINK" | "SNACK"
}

export class UpdateProductDto {
	name?: string;
	description?: string;
	price?: number;
	size?: number;
	stock?: number;
	categoryName?: string;
	type?: "DRINK" | "SNACK"
}
