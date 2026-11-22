import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'soft' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-[9px] font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#293d33] focus-visible:outline-offset-2';
  const variants = {
    primary: 'bg-[#293d33] text-white hover:bg-[#365744]',
    soft:    'bg-[#edf3ed] text-[#50725c] hover:bg-[#dbeadb]',
    ghost:   'border border-[#e5eae3] text-[#69766e] bg-white hover:bg-[#f6f8f4]',
    danger:  'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-[11px]',
    md: 'px-[14px] py-[11px] text-[11px]',
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
