import { Day, PrismaClient, Gender, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ADMIN
  await prisma.user
    .create({
      data: {
        username: "admin",
        secret: "$2a$12$LZMF/rVW0et9PKpMgqn5L.sCCPD.dxhJLcPnHloPajM5IiO8oHsjO",
        isActive: true,
        role: Role.ADMIN,
      },
    })
    .then((data) => {
      prisma.admin.create({
        data: {
          id: data.id,
          username: data.username,
        },
      });
    });
  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
