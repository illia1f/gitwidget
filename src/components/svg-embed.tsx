'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SVGEmbedProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Event) => void;
}

export const SVGEmbed = ({ src, className, style, fallback, onLoad, onError }: SVGEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  // Reset load state inline during render when src changes; the `key` on
  // <object> below recreates the element so the new src bypasses caching.
  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsLoading(true);
    setHasError(false);
  }

  const objectRef = useRef<HTMLObjectElement>(null);
  const callbacksRef = useRef({ onLoad, onError });
  callbacksRef.current = { onLoad, onError };

  // React does not delegate load/error events on <object>, so listen natively.
  useEffect(() => {
    const node = objectRef.current;
    if (!node) return;

    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
      callbacksRef.current.onLoad?.();
    };

    const handleError = (event: Event) => {
      setIsLoading(false);
      setHasError(true);
      callbacksRef.current.onError?.(event);
    };

    node.addEventListener('load', handleLoad);
    node.addEventListener('error', handleError);
    return () => {
      node.removeEventListener('load', handleLoad);
      node.removeEventListener('error', handleError);
    };
  }, [src]);

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className={cn('relative w-full', className)}>
      {isLoading && (
        <div className="bg-muted/50 absolute inset-0 flex items-center justify-center rounded-lg">
          <div className="text-muted-foreground flex items-center space-x-2 text-sm">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Loading SVG...</span>
          </div>
        </div>
      )}
      <object
        key={src}
        ref={objectRef}
        data={src}
        type="image/svg+xml"
        className={cn('bg-background block h-auto w-full', isLoading && 'opacity-0', className)}
        style={style}
      >
        {fallback || (
          <div className="bg-muted flex items-center justify-center rounded-lg p-8">
            <p className="text-muted-foreground text-sm">SVG not supported</p>
          </div>
        )}
      </object>
    </div>
  );
};
