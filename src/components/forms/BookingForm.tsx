"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createBookingSchema, type CreateBookingInput } from "@/lib/validators";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice, formatDuration } from "@/lib/utils";

interface BookingFormProps {
  service: {
    id: string;
    title: string;
    description: string;
    duration: number;
    price: number;
    depositAmount: number;
  };
  availableSlots: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
  }>;
}

async function createBooking(data: CreateBookingInput) {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? "Failed to create booking");
  }
  return res.json();
}

export function BookingForm({ service, availableSlots }: BookingFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateBookingInput>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      serviceId: service.id,
    },
  });

  const selectedDate = watch("date");

  // Filter slots to just those matching selected date
  const timeSlotsForDate = availableSlots.filter((slot) =>
    slot.date.startsWith(selectedDate ?? "")
  );

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      router.push(`/booking/confirm?bookingId=${data.id}`);
    },
  });

  const onSubmit = (data: CreateBookingInput) => {
    mutate(data);
  };

  // Unique dates from available slots
  const availableDates = [...new Set(
    availableSlots.map((s) => s.date.split("T")[0])
  )].sort();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Service summary */}
      <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 space-y-1">
        <p className="text-xs uppercase tracking-widest text-stone-400">
          Selected Service
        </p>
        <h2 className="text-lg font-medium text-[var(--charcoal)]">
          {service.title}
        </h2>
        <p className="text-sm text-stone-500">
          {formatDuration(service.duration)} &middot; {formatPrice(service.price)}
        </p>
        {service.depositAmount > 0 && (
          <p className="text-xs text-stone-400">
            Deposit to confirm: {formatPrice(service.depositAmount)}
          </p>
        )}
      </div>

      {/* Hidden serviceId */}
      <input type="hidden" {...register("serviceId")} />

      {/* Date picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700">
          Select a Date
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {availableDates.length === 0 ? (
            <p className="text-sm text-stone-400 col-span-full">
              No available dates at the moment.
            </p>
          ) : (
            availableDates.map((date) => (
              <button
                key={date}
                type="button"
                onClick={() => {
                  setValue("date", date);
                  setValue("startTime", "");
                  setValue("endTime", "");
                }}
                className={`rounded-lg border py-2 px-3 text-sm transition-colors ${
                  selectedDate === date
                    ? "bg-[var(--charcoal)] text-white border-[var(--charcoal)]"
                    : "border-stone-200 text-stone-700 hover:bg-stone-50"
                }`}
              >
                {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </button>
            ))
          )}
        </div>
        {errors.date && (
          <p className="text-xs text-red-600">{errors.date.message}</p>
        )}
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700">
            Select a Time
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {timeSlotsForDate.length === 0 ? (
              <p className="text-sm text-stone-400 col-span-full">
                No available times for this date.
              </p>
            ) : (
              timeSlotsForDate.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => {
                    setValue("startTime", slot.startTime);
                    setValue("endTime", slot.endTime);
                  }}
                  className={`rounded-lg border py-2 px-3 text-sm transition-colors ${
                    watch("startTime") === slot.startTime
                      ? "bg-[var(--charcoal)] text-white border-[var(--charcoal)]"
                      : "border-stone-200 text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  {slot.startTime} – {slot.endTime}
                </button>
              ))
            )}
          </div>
          {errors.startTime && (
            <p className="text-xs text-red-600">{errors.startTime.message}</p>
          )}
        </div>
      )}

      {/* Location */}
      <Input
        label="Preferred Location (optional)"
        placeholder="e.g. Central Park, your studio, home address"
        hint="Leave blank if you're flexible — we'll confirm details after booking."
        {...register("location")}
        error={errors.location?.message}
      />

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-stone-700">
          Notes (optional)
        </label>
        <textarea
          rows={3}
          placeholder="Anything we should know? Mood, outfits, special requests…"
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent resize-none"
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-xs text-red-600">{errors.notes.message}</p>
        )}
      </div>

      {/* Error banner */}
      {isError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {(error as Error).message}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        loading={isPending}
        size="lg"
        className="w-full"
      >
        Request Booking
      </Button>
      <p className="text-xs text-stone-400 text-center">
        You won&apos;t be charged yet — payment happens after confirmation.
      </p>
    </form>
  );
}
