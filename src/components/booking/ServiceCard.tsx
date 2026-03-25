import Link from "next/link";
import { formatPrice, formatDuration } from "@/lib/utils";
import { Card, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    duration: number;
    price: number;
    depositAmount: number;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      {/* Placeholder image area */}
      <div className="aspect-[4/3] bg-stone-100 rounded-t-2xl" />

      <CardBody className="flex-1 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-medium text-[var(--charcoal)]">
            {service.title}
          </h3>
          <span className="text-lg font-semibold text-stone-800 whitespace-nowrap">
            {formatPrice(service.price)}
          </span>
        </div>
        <p className="text-sm text-stone-500 leading-relaxed line-clamp-3">
          {service.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-stone-400">
          <span>⏱ {formatDuration(service.duration)}</span>
          {service.depositAmount > 0 && (
            <span>
              Deposit: {formatPrice(service.depositAmount)}
            </span>
          )}
        </div>
      </CardBody>

      <CardFooter>
        <Link href={`/booking/${service.id}`} className="w-full">
          <Button className="w-full" variant="primary" size="md">
            Book This Session
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
