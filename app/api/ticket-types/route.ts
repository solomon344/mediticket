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

export async function GET() {
  const organizationId = await getOrganizationId();
  if (!organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ticketTypes = await prisma.ticketType.findMany({
    where: { organizationId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(ticketTypes);
}

export async function POST(req: NextRequest) {
  const organizationId = await getOrganizationId();
  if (!organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, price } = body;

  if (!name || price === undefined || price === "") {
    return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
  }

  const ticketType = await prisma.ticketType.create({
    data: {
      name: name.trim(),
      description: description?.trim() ?? null,
      price: parseFloat(price),
      organizationId,
    },
  });

  return NextResponse.json(ticketType, { status: 201 });
}
