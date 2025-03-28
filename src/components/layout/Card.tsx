import { PropsWithChildren } from 'react';

interface Props {
  className?: string;
}

export function Card({ className, children }: PropsWithChildren<Props>) {
  return (
    <div
      className={`max-w-95vw relative overflow-auto rounded-2xl bg-white p-3 xs:p-3 sm:p-5 md:p-4 ${className}`}
    >
      {children}
    </div>
  );
}
