import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-stone-200 bg-white shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: CardProps) {
  return (
    <div className={cn("px-6 pt-6 pb-4 border-b border-stone-100", className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: CardProps) {
  return (
    <div className={cn("px-6 py-5", className)}>{children}</div>
  );
}

export function CardFooter({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "px-6 py-4 border-t border-stone-100 bg-stone-50 rounded-b-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}
