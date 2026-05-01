import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

export async function main() {
    try {
        console.log("Start seeding");
        await prisma.category.createMany({
            data: [
                { name: "Animation" },
                { name: "Comics" },
                { name: "Games" },
                { name: "Webcomic" },
                { name: "Movies" },
                { name: "Manga" },
                { name: "Books" },
                { name: "Series" },

            ]
        })

        console.log("Complete seeding!!");
    } catch (error) {
        console.error("Error seeding data")
        await prisma.$disconnect();
    }

}

main();