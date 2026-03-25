import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServiceSchema } from "@/lib/validators";

// GET /api/services — public, returns all active services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("[GET /api/services]", error);
    return NextResponse.json(
      { message: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST /api/services — admin only (auth guard will be added in Phase 2)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = createServiceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: result.data,
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("[POST /api/services]", error);
    return NextResponse.json(
      { message: "Failed to create service" },
      { status: 500 }
    );
  }
}
