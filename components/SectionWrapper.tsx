import React, { ReactNode } from 'react';

interface Props {
  id: string;
  className?: string;
  children: ReactNode;
}

const SectionWrapper: React.FC<Props> = ({ id, className = "", children }) => {
  return (
    <section id={id} className={`py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full ${className}`}>
      {children}
    </section>
  );
};

export default SectionWrapper;