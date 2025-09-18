import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

// A resilient wrapper around Recharts ResponsiveContainer that delays rendering
// until the parent container has a non-zero width and height. This prevents
// blank charts caused by initial 0x0 measurements on mobile webviews.
//
// Usage: <SafeResponsiveContainer height={280}><LineChart ... /></SafeResponsiveContainer>
// - width defaults to 100% (string) like ResponsiveContainer
// - height can be number or string; number recommended for reliability
// - fallback renders a minimal skeleton while waiting for dimensions
const SafeResponsiveContainer = ({ width = '100%', height = 300, minHeight = 120, className = '', children, fallback = null }) => {
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  // Ensure we run before paint for first layout if possible
  const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsoLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const read = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.floor(rect.width);
      // Height from style or rect; prefer explicit height if provided
      const computed = window.getComputedStyle(el);
      const parsedStyleH = parseFloat(computed.height);
      const h = !Number.isNaN(parsedStyleH) && parsedStyleH > 0 ? parsedStyleH : Math.floor(rect.height);
      setDimensions({ w, h });
      setReady(w > 0 && h > 0);
    };

    read();

    // Observe size changes including first paint
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        read();
      });
      ro.observe(el);
    }

    // Fallback timers for environments where initial measurement is 0
    const t1 = setTimeout(read, 50);
    const t2 = setTimeout(read, 150);
    const t3 = setTimeout(read, 300);

    // On page visibility change (e.g., mobile PWA wakes), re-measure
    const onVisibility = () => setTimeout(read, 50);
    document.addEventListener('visibilitychange', onVisibility);

    // On orientation change, re-measure
    window.addEventListener('orientationchange', onVisibility);

    return () => {
      if (ro) ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('orientationchange', onVisibility);
    };
  }, []);

  // Inline style ensures a height is reserved to avoid collapsing
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    minHeight
  };

  return (
    <div ref={containerRef} className={className} style={style}>
      {ready ? children : (fallback ?? <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Loading chart…</div>)}
    </div>
  );
};

export default SafeResponsiveContainer;


