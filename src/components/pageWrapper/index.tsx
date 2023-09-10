import { FunctionComponent, ReactNode } from 'react';
import './index.scss';

interface PageWrapperProps {
  right: ReactNode;
  children: ReactNode;
}

const PageWrapper: FunctionComponent<PageWrapperProps> = ({
  children,
  right,
}) => {
  return (
    <>
      <div className="lift-content">{children}</div>
      <div className="right-content">{right}</div>
    </>
  );
};

export default PageWrapper;
