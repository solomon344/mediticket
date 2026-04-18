import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Prevent duplicate org creation
  const existing = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { organizationId: true },
  });
  if (existing?.organizationId) {
    return NextResponse.json({ error: "Organization already exists" }, { status: 409 });
  }

  const { name, email, phone, address } = await req.json();
  if (!name || !email || !phone) {
    return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 });
  }

  const organization = await prisma.organization.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: (address ?? "Banjul, The Gambia").trim(),
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { organizationId: organization.id },
  });

  return NextResponse.json(organization, { status: 201 });
}
