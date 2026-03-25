import { prisma } from "@/lib/prisma";
import { ServiceCard } from "@/components/booking/ServiceCard";

export const revalidate = 60; // ISR — revalidate every 60s

async function getServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="max-w-xl mb-12 space-y-4">
        <p className="text-xs uppercase tracking-widest text-stone-400">
          What We Offer
        </p>
        <h1 className="text-4xl font-light text-[var(--charcoal)] leading-tight">
          Photography Services
        </h1>
        <p className="text-stone-500 leading-relaxed">
          Choose the session type that feels right for you. Each service
          includes a pre-session consultation and a curated gallery delivery.
        </p>
      </div>

      {/* Services grid */}
      {services.length === 0 ? (
        <div className="text-center py-24 text-stone-400">
          <p className="text-lg">No services available right now.</p>
          <p className="text-sm mt-2">Check back soon.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
