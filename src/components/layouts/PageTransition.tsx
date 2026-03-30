'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div
      style={{
        opacity: isTransitioning ? 0.5 : 1,
        transform: isTransitioning ? 'translateY(8px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        minHeight: '100vh',
      }}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
