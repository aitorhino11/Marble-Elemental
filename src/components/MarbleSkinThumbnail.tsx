import React, { useEffect, useRef } from 'react';
import { MarblePower } from '../types/game';
import { drawMarbleSkin } from '../utils/marbleSkinRenderer';

interface MarbleSkinThumbnailProps {
  power: MarblePower;
  size?: number;
  className?: string;
  expression?: 'battle' | 'happy' | 'crying';
}

export const MarbleSkinThumbnail: React.FC<MarbleSkinThumbnailProps> = ({
  power,
  size = 40,
  className = '',
  expression = 'battle'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    // Draw full customized marble skin
    drawMarbleSkin(ctx, {
      x: size / 2,
      y: size / 2,
      radius: size * 0.36,
      color: power.colorHex,
      element: power.element,
      powerId: power.id,
      expression,
      time: 1.0
    });
  }, [power, size, expression]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`shrink-0 select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        filter: `drop-shadow(0 2px 6px ${power.colorHex}66)`
      }}
    />
  );
};
