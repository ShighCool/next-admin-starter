'use client';

import { useEffect } from 'react';

export default function CssLoader() {
  useEffect(() => {
    // 当组件挂载时，说明客户端 JS 已执行，显示 body
    document.body.style.visibility = 'visible';
  }, []);

  return null;
}
