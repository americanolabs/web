import Link from 'next/link';
import { ReactNode } from 'react';

import { GithubIcon } from '@hyperlane-xyz/widgets';
import { BookText } from 'lucide-react';

import { links } from '../../consts/links';

type FooterLink = {
  title: string;
  url: string;
  external: boolean;
  icon?: ReactNode;
};

const footerLinks: FooterLink[] = [
  { title: 'Home', url: "/", external: false },
  { title: 'Generate', url: "/generate", external: false },
  { title: 'Bridge', url: "/bridge", external: false },
  { title: 'Staking', url: "/staking", external: false },
  { title: 'Docs', url: links.docs, external: true, icon: <BookText color="#fff" className='w-5 h-5' /> },
  { title: 'Github', url: links.github, external: true, icon: <GithubIcon color="#fff" className='w-5 h-5' /> },
];

export function Footer() {
  return (
    <footer className="relative text-white">
      <div className="relative bg-gradient-to-b from-transparent to-black/40 px-8 pb-5 pt-2 sm:pt-0">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:gap-10">
          <FooterLogo />
          <FooterNav />
        </div>
      </div>
    </footer>
  );
}

function FooterLogo() {
  return (
    <div className="flex items-center justify-center">
      <div className="ml-2 h-8 sm:h-10 flex flex-wrap gap-2 items-center">
        <p>Built in</p><p className='text-orange-400 font-semibold'>Espresso Network</p>
      </div>
      <div className="ml-6 space-y-1 text-lg font-medium sm:text-xl"></div>
    </div>
  );
}

function FooterNav() {
  return (
    <nav className="text-md font-medium pb-1">
      <ul
        style={{ gridTemplateColumns: 'auto auto auto auto auto auto' }}
        className="grid gap-x-5 gap-y-1.5"
      >
        {footerLinks.map((item) => (
          <li key={item.title}>
            <Link
              className="flex items-center capitalize underline-offset-2 hover:underline"
              target={item.external ? '_blank' : '_self'}
              href={item.url}
            >
              {item?.icon && <div className="mr-1 mt-1 w-4">{item?.icon}</div>}
              {!item?.icon && <div>{item.title}</div>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
