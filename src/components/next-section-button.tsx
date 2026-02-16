'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NextSectionButtonProps {
  href: string;
  delay?: number; // Delay in milliseconds
  className?: string;
  children?: React.ReactNode;
}

export function NextSectionButton({ href, delay = 10000, className, children }: NextSectionButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "fixed bottom-8 right-8 z-50 transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
    >
      <Link href={href} passHref>
        <Button size="lg" className="shadow-2xl animate-pulse">
          {children || 'Next Section'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
}
