import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServiceSchema } from "@/lib/validators";

// GET /api/services/:id
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error) {
    console.error("[GET /api/services/:id]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT /api/services/:id — admin only
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = createServiceSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const service = await prisma.service.update({
      where: { id },
      data: result.data,
    });
    return NextResponse.json(service);
  } catch (error) {
    console.error("[PUT /api/services/:id]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE /api/services/:id — admin only (soft delete)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.service.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json({ message: "Service deactivated" });
  } catch (error) {
    console.error("[DELETE /api/services/:id]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
