import { Loader as LucideLoader, type LucideProps } from 'lucide-react';
import React from 'react';

interface Props extends LucideProps {
  fixed?: boolean;
  absolute?: boolean;
}

export const Loader: React.FC<Props> = ({ fixed, absolute, ...iconProps }) => {
  return (
    <div
      className={`${fixed && 'fixed top-1/2 left-1/2 -translate-y-2/4 -translate-x-2/4'} ${absolute && 'absolute top-1/2 left-1/2 -translate-y-2/4 -translate-x-2/4'} `}
    >
      <LucideLoader
        {...iconProps}
        className={`animate-spin duration-1000 size-5 text-muted-foreground ${iconProps.className}`}
      />
    </div>
  );
};
