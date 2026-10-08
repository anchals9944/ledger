/** Mocked payment call. No real provider. Outcome depends on the card number, like a test mode. */
export type PaymentResult = "ok" | "declined" | "timeout";

export const TEST_CARDS = {
  ok: "4242 4242 4242 4242",
  declined: "4000 0000 0000 0002",
  timeout: "4000 0000 0000 0010",
};

export function chargeCard(cardNumber: string, amountCents: number, delayMs = 900): Promise<{ result: PaymentResult; orderId?: string }> {
  const digits = cardNumber.replace(/\s/g, "");
  return new Promise((resolve) => {
    setTimeout(() => {
      if (digits.endsWith("0002")) resolve({ result: "declined" });
      else if (digits.endsWith("0010")) resolve({ result: "timeout" });
      else resolve({ result: "ok", orderId: String(48000 + (amountCents % 1000)) });
    }, delayMs);
  });
}

export const luhnValid = (num: string) => {
  const d = num.replace(/\D/g, "");
  if (d.length !== 16) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  }
  return sum % 10 === 0;
};

export const formatCardNumber = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
export const formatExpiry = (v: string) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d; };

export function expiryValid(v: string, now = new Date()) {
  const d = v.replace(/\D/g, "");
  if (d.length !== 4) return "format" as const;
  const month = Number(d.slice(0, 2)), year = 2000 + Number(d.slice(2));
  if (month < 1 || month > 12) return "format" as const;
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  return endOfMonth < now ? ("expired" as const) : ("ok" as const);
}
