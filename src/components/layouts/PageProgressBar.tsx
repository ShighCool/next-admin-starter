'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const PageProgressBar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // 路由变化时显示进度条
    setIsTransitioning(true);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!isTransitioning) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          background:
            'linear-gradient(90deg, var(--theme-primary) 0%, color-mix(in srgb, var(--theme-primary) 60%, transparent) 100%)',
          animation: 'progressSlide 0.3s ease-out forwards',
          width: '100%',
        }}
      >
        <style jsx>{`
          @keyframes progressSlide {
            0% {
              transform: translateX(-100%);
              opacity: 1;
            }
            50% {
              transform: translateX(0%);
              opacity: 1;
            }
            100% {
              transform: translateX(0%);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PageProgressBar;
