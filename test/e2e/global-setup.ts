import { seedAll } from '@/database/seeds';

export default async function globalSetup() {
  console.log('\n🌱 Running global setup (DB seeding)...');
  await seedAll('all');
  console.log('✅ Seed completed for E2E tests\n');
}
