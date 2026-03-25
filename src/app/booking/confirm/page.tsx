import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface Props {
  searchParams: Promise<{ bookingId?: string }>;
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const { bookingId } = await searchParams;

  if (!bookingId) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <p className="text-stone-500">No booking found.</p>
        <Link href="/services" className="mt-4 inline-block text-sm underline text-stone-700">
          Browse Services
        </Link>
      </div>
    );
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true },
  });

  if (!booking) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <p className="text-stone-500">Booking not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center space-y-8">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-light text-[var(--charcoal)]">
          Booking Requested!
        </h1>
        <p className="text-stone-500">
          We&apos;ll review your request and confirm within 24 hours.
          Keep an eye on your email.
        </p>
      </div>

      {/* Booking summary */}
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-6 text-left space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-stone-700">Service</span>
          <span className="text-sm text-stone-900">{booking.service.title}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-stone-700">Date</span>
          <span className="text-sm text-stone-900">{formatDate(booking.date)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-stone-700">Time</span>
          <span className="text-sm text-stone-900">
            {booking.startTime} – {booking.endTime}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-stone-700">Total</span>
          <span className="text-sm text-stone-900">
            {formatPrice(booking.service.price)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-stone-700">Status</span>
          <Badge status={booking.status} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center h-12 px-8 bg-[var(--charcoal)] text-white text-sm font-medium rounded-full hover:bg-stone-700 transition-colors"
        >
          View My Bookings
        </Link>
        <Link
          href="/services"
          className="inline-flex items-center justify-center h-12 px-8 border border-stone-200 text-stone-600 text-sm rounded-full hover:bg-stone-50 transition-colors"
        >
          Back to Services
        </Link>
      </div>
    </div>
  );
}
