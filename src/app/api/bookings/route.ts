import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBookingSchema } from "@/lib/validators";

// GET /api/bookings
// Admin: returns all bookings
// Client: returns their own bookings (auth added in Phase 2)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as string | undefined;
    const serviceId = searchParams.get("serviceId") ?? undefined;
    const userId = searchParams.get("userId") ?? undefined;

    const bookings = await prisma.booking.findMany({
      where: {
        ...(status ? { status: status as "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" } : {}),
        ...(serviceId ? { serviceId } : {}),
        ...(userId ? { userId } : {}),
      },
      include: {
        service: { select: { id: true, title: true, price: true } },
        user: { select: { id: true, name: true, email: true } },
        payment: { select: { status: true, paymentType: true, amount: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[GET /api/bookings]", error);
    return NextResponse.json({ message: "Failed to fetch bookings" }, { status: 500 });
  }
}

// POST /api/bookings — create a new booking
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = createBookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { serviceId, date, startTime, endTime, location, notes } = result.data;

    // Check the service exists and is active
    const service = await prisma.service.findUnique({
      where: { id: serviceId, isActive: true },
    });
    if (!service) {
      return NextResponse.json(
        { message: "Service not found or unavailable" },
        { status: 404 }
      );
    }

    // Check for double-booking on same date/time
    const conflict = await prisma.booking.findFirst({
      where: {
        serviceId,
        date: new Date(date),
        startTime,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });
    if (conflict) {
      return NextResponse.json(
        { message: "This time slot is already booked. Please choose another." },
        { status: 409 }
      );
    }

    // Mark availability slot as booked
    await prisma.availabilitySlot.updateMany({
      where: { date: new Date(date), startTime, isBooked: false },
      data: { isBooked: true },
    });

    // TODO: replace hardcoded userId with session user in Phase 2
    // For Phase 1, create a guest or use a placeholder user
    let user = await prisma.user.findFirst({
      where: { email: "guest@avsa.studio" },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Guest",
          email: "guest@avsa.studio",
          role: "CLIENT",
        },
      });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        serviceId,
        date: new Date(date),
        startTime,
        endTime,
        location: location ?? null,
        notes: notes ?? null,
        status: "PENDING",
      },
      include: {
        service: { select: { title: true, price: true } },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("[POST /api/bookings]", error);
    return NextResponse.json({ message: "Failed to create booking" }, { status: 500 });
  }
}
