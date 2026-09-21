import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const ADMIN_PASSWORD = 'Admin1';
const PASSWORD_SALT_ROUNDS = 10;

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, PASSWORD_SALT_ROUNDS);

  await prisma.user.upsert({
    where: { email: 'admin@wenlock.local' },
    update: {
      name: 'Administrador WenLock',
      registration: '000001',
      passwordHash,
    },
    create: {
      name: 'Administrador WenLock',
      email: 'admin@wenlock.local',
      registration: '000001',
      passwordHash,
    },
  });

  console.info('Seed completed: administrator user is ready.');
}

main()
  .catch((error) => {
    console.error('Unable to seed the database.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
