import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-[13px] border border-[#e5eae3] bg-white ${onClick ? 'cursor-pointer hover:border-[#c8d4c5] transition-colors' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[13px] border border-[#e5eae3] bg-white ${className}`}>
      {children}
    </div>
  );
}
