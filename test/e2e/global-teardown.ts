import { clearAll } from '@/database/seeds';

export default async function globalTeardown() {
  console.log('\n🧹 Running global teardown (clearing test data)...');
  await clearAll('all');
  console.log('✅ Cleanup completed\n');
}
