import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { ProductType } from '@prisma/client';
export const seedData = async () => {
    const hashedPassword = await bcrypt.hash('ExamplePassword', 10);
    const users = [
        {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: hashedPassword,
            role: UserRole.USER,
        },
        {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            password: hashedPassword,
            role: UserRole.USER,
        },
        {
            firstName: 'Alice',
            lastName: 'Smith',
            email: 'alice.smith@example.com',
            password: hashedPassword,
            role: UserRole.USER,
        },
        {
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob.johnson@example.com',
            password: hashedPassword,
            role: UserRole.USER,
        },
        {
            firstName: 'Charlie',
            lastName: 'Brown',
            email: 'charlie.brown@example.com',
            password: hashedPassword,
            role: UserRole.USER,
        },
    ];

    const products = [
        {
            name: 'Product 1',
            description: 'Description for product 1',
            price: 10.0,
            stock: 100,
            type: ProductType.DRINK,
        },
        {
            name: 'Product 2',
            description: 'Description for product 2',
            price: 20.0,
            stock: 200,
            type: ProductType.SNACK,
        },
        {
            name: 'Product 3',
            description: 'Description for product 3',
            price: 30.0,
            stock: 300,
            type: ProductType.DRINK,
        },
        {
            name: 'Product 4',
            description: 'Description for product 4',
            price: 40.0,
            stock: 400,
            type: ProductType.SNACK,
        },
        {
            name: 'Product 5',
            description: 'Description for product 5',
            price: 50.0,
            stock: 500,
            type: ProductType.DRINK,
        },
    ];

    return { users, products };
};
