import React from 'react';

interface Props extends React.PropsWithChildren {
  isAllowed: boolean | null;
  text: string;
  status: number;
}

export const ProtectedRoute: React.FC<Props> = ({ isAllowed, text, status, children }) => {
  if (!isAllowed) {
    return (
      <span
        className={'text-nowrap text-muted-foreground text-sm fixed top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4'}
      >
        {status} | {text}
      </span>
    );
  }

  return children;
};
