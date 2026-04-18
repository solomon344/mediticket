import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

function formatTime(date: Date): string {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  if (isToday) return `${time}, Today`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + `, ${time}`;
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { organizationId: true },
  });

  if (!user?.organizationId) {
    return NextResponse.json({ error: "No organization" }, { status: 404 });
  }

  const orgId = user.organizationId;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const [
    totalTickets,
    thisMonthCount,
    lastMonthCount,
    thisMonthRevenue,
    lastMonthRevenue,
    pendingCount,
    recentPurchases,
  ] = await Promise.all([
    prisma.ticketPurchase.count({ where: { organizationId: orgId } }),
    prisma.ticketPurchase.count({
      where: { organizationId: orgId, purchasedAt: { gte: startOfMonth } },
    }),
    prisma.ticketPurchase.count({
      where: { organizationId: orgId, purchasedAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
    }),
    prisma.ticketPurchase.aggregate({
      where: { organizationId: orgId, status: "COMPLETED", purchasedAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.ticketPurchase.aggregate({
      where: { organizationId: orgId, status: "COMPLETED", purchasedAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      _sum: { amount: true },
    }),
    prisma.ticketPurchase.count({
      where: { organizationId: orgId, status: "PENDING" },
    }),
    prisma.ticketPurchase.findMany({
      where: { organizationId: orgId },
      orderBy: { purchasedAt: "desc" },
      take: 5,
      include: { ticketType: { select: { name: true } } },
    }),
  ]);

  // Ticket trend (% change vs last month)
  const ticketTrend =
    lastMonthCount === 0
      ? null
      : Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);

  // Revenue goal: 25% above last month (or 50,000 D if no history)
  const lastMonthRev = Number(lastMonthRevenue._sum.amount ?? 0);
  const revenueGoal = lastMonthRev > 0 ? lastMonthRev * 1.25 : 50000;
  const thisMonthRev = Number(thisMonthRevenue._sum.amount ?? 0);
  const revenueGoalPercent = Math.min(Math.round((thisMonthRev / revenueGoal) * 100), 100);

  const activity = recentPurchases.map((p) => ({
    id: p.id,
    name: p.ticketType.name,
    shortId: `#${p.id.slice(-5).toUpperCase()}`,
    initials: getInitials(p.ticketType.name),
    time: formatTime(p.purchasedAt),
    status: p.status,
    amount: `D ${Number(p.amount).toFixed(2)}`,
  }));

  return NextResponse.json({
    totalTickets,
    ticketTrend,
    monthlyRevenue: thisMonthRev,
    revenueGoalPercent,
    activeAdmissions: pendingCount,
    recentActivity: activity,
  });
}
