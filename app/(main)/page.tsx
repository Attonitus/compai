import prisma from "@/lib/prisma";
import SearchInput from "./components/SearchInput";
import Categories from "./components/Categories";
import Companions from "@/components/general/Companions";

interface Props {
    searchParams: {
        categoryId: string;
        name: string;
    }
}

export default async function MainPage({ searchParams }: Props) {

    const {categoryId, name} = await searchParams;

    const data = await prisma.companion.findMany({
        where: {
            categoryId,
            name: {
                search: name
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            _count: {
                select: {
                    messages: true
                }
            }
        }
    });

    const categories = await prisma.category.findMany();

    return (
        <div className="h-full p-4 space-y-2">
            <SearchInput />
            <Categories data={categories} />
            <Companions data={data} />
        </div>
    )
}
