import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateBookingStatusSchema } from "@/lib/validators";

// GET /api/bookings/:id
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        user: { select: { id: true, name: true, email: true } },
        payment: true,
        invoice: true,
        gallery: true,
      },
    });
    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (error) {
    console.error("[GET /api/bookings/:id]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PATCH /api/bookings/:id/status — admin only
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateBookingStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: result.data.status },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("[PATCH /api/bookings/:id]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
