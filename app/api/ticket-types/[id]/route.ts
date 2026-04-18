import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getOrganizationId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { organizationId: true },
  });
  return user?.organizationId ?? null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const organizationId = await getOrganizationId();
  if (!organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { name, description, price } = body;

  if (!name || price === undefined || price === "") {
    return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
  }

  const existing = await prisma.ticketType.findFirst({
    where: { id, organizationId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.ticketType.update({
    where: { id },
    data: {
      name: name.trim(),
      description: description?.trim() ?? null,
      price: parseFloat(price),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const organizationId = await getOrganizationId();
  if (!organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.ticketType.findFirst({
    where: { id, organizationId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.ticketType.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
