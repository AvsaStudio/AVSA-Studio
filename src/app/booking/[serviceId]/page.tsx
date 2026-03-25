import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/forms/BookingForm";

interface Props {
  params: Promise<{ serviceId: string }>;
}

async function getService(id: string) {
  return prisma.service.findUnique({
    where: { id, isActive: true },
  });
}

async function getAvailableSlots() {
  const slots = await prisma.availabilitySlot.findMany({
    where: {
      isBooked: false,
      date: { gte: new Date() },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
  // Serialize dates to strings for client component
  return slots.map((s) => ({
    id: s.id,
    date: s.date.toISOString(),
    startTime: s.startTime,
    endTime: s.endTime,
  }));
}

export default async function BookingPage({ params }: Props) {
  const { serviceId } = await params;
  const [service, availableSlots] = await Promise.all([
    getService(serviceId),
    getAvailableSlots(),
  ]);

  if (!service) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10 space-y-2">
        <p className="text-xs uppercase tracking-widest text-stone-400">
          Book a Session
        </p>
        <h1 className="text-3xl font-light text-[var(--charcoal)]">
          {service.title}
        </h1>
        <p className="text-stone-500 text-sm leading-relaxed">
          {service.description}
        </p>
      </div>
      <BookingForm service={service} availableSlots={availableSlots} />
    </div>
  );
}
