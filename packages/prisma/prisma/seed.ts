import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash('ChangeMe!123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@local' },
    update: {},
    create: {
      email: 'admin@local',
      passwordHash,
      role: UserRole.ADMIN,
      enabled: true
    }
  });

  await prisma.setting.upsert({
    where: { key: 'INSTANCE_INITIALIZED' },
    update: { valueJson: { initializedAt: new Date().toISOString() } },
    create: {
      key: 'INSTANCE_INITIALIZED',
      valueJson: { initializedAt: new Date().toISOString() }
    }
  });
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Seed failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
