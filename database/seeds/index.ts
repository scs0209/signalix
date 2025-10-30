import { clearWatchlistSeedData, seedWatchlistData } from './watchlist.seed';

type SeedTarget = 'all' | 'watchlist';

export async function seedAll(target: SeedTarget = 'all') {
  console.log('🌱 Starting seed process...\n');

  try {
    switch (target) {
      case 'watchlist':
        await seedWatchlistData();
        break;
      case 'all':
      default:
        await seedWatchlistData();
        break;
    }

    console.log('\n✅ Seeding complete!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

export async function clearAll(target: SeedTarget = 'all') {
  console.log('🧹 Clearing test data...\n');

  try {
    switch (target) {
      case 'watchlist':
        await clearWatchlistSeedData();
        break;
      case 'all':
      default:
        await clearWatchlistSeedData();
        break;
    }

    console.log('\n✅ Clear complete!');
  } catch (err) {
    console.error('❌ Clear failed:', err);
    process.exit(1);
  }
}
