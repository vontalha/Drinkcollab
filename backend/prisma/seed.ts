import { PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcryptjs';
import { seedData } from './seed-data';

const prisma = new PrismaClient();

async function main() {
    // const pw = await bcrypt.hash('ExamplePassword', 10);
    // const user = await prisma.user.create({
    //     data: {
    //         firstName: 'Admin',
    //         lastName: 'User',
    //         email: 'admin@email.com',
    //         password: pw,
    //         role: 'ADMIN',
    //     },
    // });
    // console.log({ user });
    const { users, products } = await seedData();

    for (const user of users) {
        const createdUser = await prisma.user.create({
            data: user,
        });
        console.log({ createdUser });

        const createdShoppingCart = await prisma.shoppingCart.create({
            data: {
                userId: createdUser.id,
            },
        });
        console.log({ createdShoppingCart });
    }

    for (const product of products) {
        const createdProduct = await prisma.product.create({
            data: product,
        });
        console.log({ createdProduct });
    }
    async function deleteAll() {
        const deletedUsers = await prisma.product.deleteMany();
        console.log(`Deleted ${deletedUsers.count} users`);
        const deletedProducts = await prisma.product.deleteMany();
        console.log(`Deleted ${deletedProducts.count} products`);
    }

    await deleteAll();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
