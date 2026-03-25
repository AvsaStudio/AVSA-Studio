import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSlotSchema } from "@/lib/validators";

// GET /api/availability?date=YYYY-MM-DD — public
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    const where = {
      isBooked: false,
      date: dateParam
        ? {
            gte: new Date(`${dateParam}T00:00:00`),
            lt: new Date(`${dateParam}T23:59:59`),
          }
        : { gte: new Date() },
    };

    const slots = await prisma.availabilitySlot.findMany({
      where,
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json(slots);
  } catch (error) {
    console.error("[GET /api/availability]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST /api/availability — admin only, create new slots
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = createSlotSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { date, startTime, endTime } = result.data;

    const slot = await prisma.availabilitySlot.create({
      data: {
        date: new Date(date),
        startTime,
        endTime,
      },
    });

    return NextResponse.json(slot, { status: 201 });
  } catch (error) {
    console.error("[POST /api/availability]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
