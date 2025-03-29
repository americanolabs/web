import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className="space-y-3 gap-5 pt-4 flex flex-col items-center max-w-[500px]">
      <div className='flex flex-col items-center'>
        <span className='text-white font-bold text-5xl'>AmericanoLabs</span>
        <span className='text-white font-bold text-lg text-center px-3 sm:px-0 mt-2'>AmericanoLabs is a DeFi platform that optimizes portfolio management through AI-driven risk profiling and stake-based strategies. Users stake assets according to their risk profile, ensuring optimal returns.</span>
      </div>
      <Link href="/generate">
        <span className="bg-orange-500 text-white px-5 py-3 rounded-md font-semibold">Get Started</span>
      </Link>
    </div>
  );
};

export default Home;
