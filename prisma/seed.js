const { PrismaClient } =require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const groups = [
        { id: 1, name: "MEDICOS" },
        { id: 2, name: "ENFERMAGEM" },
        { id: 3, name: "ADM" },
        { id: 4, name: "PACIENTE" },
        { id: 5, name: "ROOT" },
    ];

    await prisma.group.createMany({ data: groups, skipDuplicates: true });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
