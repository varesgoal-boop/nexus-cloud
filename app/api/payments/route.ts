import { NextResponse } from "next/server";

const ADDRESS = "LfXQXcjD5NcpiePvkKhiQ7dVfqExnSEmiu";

type Order = {
  id: string;
  plan: string;
  usd: number;
  amountLtc: number;
  status: "waiting" | "detected" | "paid";
};

const globalForOrders = globalThis as typeof globalThis & {
  nexusPaymentOrders?: Map<string, Order>;
  nexusPaymentSequence?: number;
};

const orders = globalForOrders.nexusPaymentOrders ?? new Map<string, Order>();
globalForOrders.nexusPaymentOrders = orders;

export async function POST(request: Request) {
  const body = await request.json();
  const usd = Number(body.usd);
  const plan = typeof body.plan === "string" ? body.plan : "Nexus Cloud";

  if (!Number.isFinite(usd) || usd <= 0) {
    return NextResponse.json({ error: "Invalid plan amount." }, { status: 400 });
  }

  const priceResponse = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd",
    { cache: "no-store" },
  );

  if (!priceResponse.ok) {
    return NextResponse.json({ error: "Could not retrieve the current LTC rate." }, { status: 502 });
  }

  const priceData = await priceResponse.json();
  const ltcUsd = Number(priceData?.litecoin?.usd);

  if (!Number.isFinite(ltcUsd) || ltcUsd <= 0) {
    return NextResponse.json({ error: "Invalid LTC market rate." }, { status: 502 });
  }

  const sequence = (globalForOrders.nexusPaymentSequence ?? 0) + 1;
  globalForOrders.nexusPaymentSequence = sequence;
  const uniqueSatoshis = sequence % 100000000;
  const amountLtc = Number((usd / ltcUsd + uniqueSatoshis / 100000000).toFixed(8));
  const id = crypto.randomUUID();

  const order: Order = { id, plan, usd, amountLtc, status: "waiting" };
  orders.set(id, order);

  return NextResponse.json({ id, address: ADDRESS, plan, usd, amountLtc });
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  const order = id ? orders.get(id) : undefined;

  if (!order) {
    return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  }

  if (order.status === "paid") {
    return NextResponse.json({ status: "paid" });
  }

  try {
    const addressResponse = await fetch(
      `https://api.blockchair.com/litecoin/dashboards/address/${ADDRESS}?limit=100&transaction_details=true`,
      { cache: "no-store" },
    );

    if (!addressResponse.ok) {
      return NextResponse.json({ status: order.status });
    }

    const addressData = await addressResponse.json();
    const addressInfo = addressData?.data?.[ADDRESS];
    const transactions = addressInfo?.transactions ?? [];

    for (const txHash of transactions) {
      const transactionResponse = await fetch(
        `https://api.blockchair.com/litecoin/dashboards/transaction/${txHash}`,
        { cache: "no-store" },
      );

      if (!transactionResponse.ok) continue;

      const transactionData = await transactionResponse.json();
      const transaction = transactionData?.data?.[txHash];
      const outputs = transaction?.outputs ?? [];
      const paidAmount = outputs
        .filter((output: { recipient?: string }) => output.recipient === ADDRESS)
        .reduce((total: number, output: { value?: number }) => total + (output.value ?? 0), 0) / 100000000;

      if (Math.abs(paidAmount - order.amountLtc) < 0.000000005) {
        const confirmations = Number(transaction?.transaction?.confirmations ?? 0);
        order.status = confirmations >= 1 ? "paid" : "detected";
        break;
      }
    }
  } catch {
    return NextResponse.json({ status: order.status });
  }

  return NextResponse.json({ status: order.status });
}

