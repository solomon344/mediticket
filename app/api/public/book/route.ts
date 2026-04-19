import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export { OPTIONS } from "../cors";

const MODEMPAY_API_URL =
  process.env.MODEMPAY_ENV === "live"
    ? "https://api.modempay.com/v1/payments"
    : "https://sandbox.api.modempay.com/v1/payments";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { buyerName, buyerPhone, buyerEmail, smsPhone, ticketTypeId, paymentMethodId, aiSummary } = body;

  if (!buyerName || !buyerPhone || !smsPhone || !ticketTypeId) {
    return NextResponse.json(
      { error: "Name, phone, SMS number, and ticket type are required" },
      { status: 400 }
    );
  }

  const ticketType = await prisma.ticketType.findUnique({
    where: { id: ticketTypeId },
    include: { organization: { select: { name: true } } },
  });
  if (!ticketType) {
    return NextResponse.json({ error: "Ticket type not found" }, { status: 404 });
  }

  const apiKey = process.env.MODEMPAY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
  }

  // Create pending purchase first to get an ID for Modem Pay metadata
  const purchase = await prisma.ticketPurchase.create({
    data: {
      buyerName,
      buyerPhone,
      whatsappPhone: smsPhone,       // number to receive ticket SMS
      buyerEmail: buyerEmail || null,
      amount: ticketType.price,
      status: "PENDING",
      source: "ONLINE",
      ticketTypeId,
      paymentMethodId: paymentMethodId || null,
      organizationId: ticketType.organizationId,
      aiSummary: aiSummary || null,
      notes: aiSummary ? `AI Pre-Consultation:\n${aiSummary}` : null,
    },
    select: { id: true, amount: true, purchasedAt: true },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const isLiveUrl = appUrl.startsWith("https://");
  const smsFormatted = smsPhone.startsWith("+") ? smsPhone : `+${smsPhone}`;

  // Create Modem Pay payment intent
  let paymentLink: string;
  let intentSecret: string;

  try {
    const modemRes = await fetch(MODEMPAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          amount: Number(ticketType.price),
          currency: "GMD",
          customer_name: buyerName,
          customer_email: buyerEmail || undefined,
          customer_phone: smsFormatted,
          title: ticketType.name,
          description: `${ticketType.name} — ${ticketType.organization.name}`,
          ...(isLiveUrl && {
            return_url: `${appUrl}/book/payment-success`,
            cancel_url: `${appUrl}/book`,
            callback_url: `${appUrl}/api/webhooks/modempay`,
          }),
          metadata: {
            purchase_id: purchase.id,
            organization_id: ticketType.organizationId,
            ticket_type_id: ticketTypeId,
          },
          from_sdk: false,
          skip_url_validation: !isLiveUrl,
        },
      }),
    });

    const modemData = await modemRes.json();

    if (!modemRes.ok || !modemData.status) {
      await prisma.ticketPurchase.update({
        where: { id: purchase.id },
        data: { status: "FAILED" },
      });
      return NextResponse.json(
        { error: modemData.message ?? "Failed to create payment link" },
        { status: 502 }
      );
    }

    paymentLink = modemData.data.payment_link;
    intentSecret = modemData.data.intent_secret;
  } catch {
    await prisma.ticketPurchase.update({
      where: { id: purchase.id },
      data: { status: "FAILED" },
    });
    return NextResponse.json({ error: "Payment gateway unreachable" }, { status: 502 });
  }

  await prisma.ticketPurchase.update({
    where: { id: purchase.id },
    data: { transactionRef: intentSecret },
  });

  return NextResponse.json(
    {
      booking: {
        id: purchase.id,
        amount: Number(purchase.amount),
        status: "PENDING",
        purchasedAt: purchase.purchasedAt,
      },
      paymentLink,
    },
    { status: 201 }
  );
}
