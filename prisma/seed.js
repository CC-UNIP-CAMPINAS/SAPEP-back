const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");
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

    const password = await hash("sapep123", 12);
    await prisma.user.createMany({
        data: { email: "root@sapep.com", groupId: 5, name: "root", id: 0, password },
        skipDuplicates: true,
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
