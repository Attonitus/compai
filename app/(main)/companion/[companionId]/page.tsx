import prisma from "@/lib/prisma";
import CompanionForm from "./components/CompanionForm";

interface Props {
    params: {
        companionId: string,
    }
}

export default async function CompanionIdPage({params}: Props) {

    const {companionId} = await params;

    const companion = await prisma.companion.findUnique({
        where: {
            id: companionId
        }
    });

    const categories = await prisma.category.findMany();

    return (
        <CompanionForm
            initialData={companion}
            categories={categories}
        />
    )
}
