import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    
    const pw = await bcrypt.hash("ExamplePassword", 10)
    const user = await prisma.user.create({
        data: {
            firstName: "Admin",
            lastName: "User",
            email: "admin@email.com",
            password: pw,
            role: "ADMIN"
        }
    })
    console.log({ user });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });