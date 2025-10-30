import { clearAll, seedAll } from '@/database/seeds';

const args = process.argv.slice(2);
const [command, target] = args;

async function main() {
  switch (command) {
    case 'seed':
      await seedAll((target as any) || 'all');
      break;
    case 'clear':
      await clearAll((target as any) || 'all');
      break;
    default:
      console.log(`
Usage:
  pnpm tsx src/scripts/seed.ts seed [user|watchlist|all]
  pnpm tsx src/scripts/seed.ts clear [user|watchlist|all]
`);
  }
  process.exit(0);
}

main();
