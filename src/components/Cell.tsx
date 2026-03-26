import React from 'react';

interface CellProps {
  r: number;
  c: number;
  color: string | null;
  anchorData: { shape: string, values: number[], color: string } | null;
  isLocked: boolean;
  hideTop: boolean;
  hideRight: boolean;
  hideBottom: boolean;
  hideLeft: boolean;
  onEnter: (r: number, c: number) => void;
  onDown: (r: number, c: number) => void;
}

export function Cell({ r, c, color, anchorData, isLocked, hideTop, hideRight, hideBottom, hideLeft, onEnter, onDown }: CellProps) {
  let bg = 'bg-transparent';

  let inner = null;
  if (anchorData) {
    inner = (
      <div 
        className="absolute inset-[15%] sm:inset-[20%] flex flex-col items-center justify-center font-bold z-20 pointer-events-none bg-white border border-gray-200 shadow-sm rounded-full"
        style={{ color: anchorData.color }}
      >
         <span className="text-[12px] sm:text-[14px] leading-none capitalize -mt-0.5 sm:-mt-1">{anchorData.shape === 'plus' ? '+' : anchorData.shape.substring(0, 1)}</span>
         <span className="text-[9px] sm:text-[10px] leading-tight tracking-tighter opacity-90 sm:mt-0.5">{anchorData.values.join('×')}</span>
      </div>
    );
  }

  const shadows = [];
  if (color) {
      if (!hideTop) shadows.push('inset 0 3px 0 0 rgba(0,0,0,0.2)');
      if (!hideRight) shadows.push('inset -3px 0 0 0 rgba(0,0,0,0.2)');
      if (!hideBottom) shadows.push('inset 0 -3px 0 0 rgba(0,0,0,0.2)');
      if (!hideLeft) shadows.push('inset 3px 0 0 0 rgba(0,0,0,0.2)');
  }
  const boxShadow = shadows.join(', ');

  return (
    <div 
      className={`relative w-full aspect-square flex items-center justify-center transition-none cursor-pointer select-none touch-none ${bg} ${isLocked ? 'bg-hatch' : ''}`}
      data-r={r}
      data-c={c}
      style={{ 
        backgroundColor: color ? color : undefined,
        borderRight: !color ? '2px dotted var(--color-linkedin-grid-border)' : undefined,
        borderBottom: !color ? '2px dotted var(--color-linkedin-grid-border)' : undefined,
        borderTopLeftRadius: color && !hideTop && !hideLeft ? '16px' : undefined,
        borderTopRightRadius: color && !hideTop && !hideRight ? '16px' : undefined,
        borderBottomLeftRadius: color && !hideBottom && !hideLeft ? '16px' : undefined,
        borderBottomRightRadius: color && !hideBottom && !hideRight ? '16px' : undefined,
        boxShadow: boxShadow || undefined
      }}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') onEnter(r, c);
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        onDown(r, c);
      }}
    >
      {inner}
      {color && (
        <div className={`absolute inset-0 pointer-events-none flex items-center justify-center ${isLocked ? 'mix-blend-normal' : 'bg-white/20'}`}>
        </div>
      )}
    </div>
  );
}
