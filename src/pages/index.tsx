import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className="space-y-3 gap-5 pt-4 flex flex-col items-center max-w-[500px]">
      <div className='flex flex-col items-center'>
        <span className='text-white font-bold text-5xl'>originX</span>
        <span className='text-white font-bold text-lg text-center px-3 sm:px-0'>originX is a DeFi platform that automates portfolio management with AI-driven risk profiling, auto-staking, and auto-switching to the highest APY—fully hands-free.</span>
      </div>
      <Link href="/generate">
        <span className="bg-orange-500 text-white px-5 py-3 rounded-md font-semibold">Get Started</span>
      </Link>
    </div>
  );
};

export default Home;
