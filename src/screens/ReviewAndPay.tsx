import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, CircleCheck, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { Alert, Button, Card, Input, RadioCard, TextLink } from "../components";
import { chargeCard, expiryValid, formatCardNumber, formatExpiry, luhnValid } from "./payment";

/**
 * Review and pay. Built from Figma frames 3:301 (1280) and 4:684 (390) and their state siblings.
 * See docs/run-plan.md for the state model and the mapping.
 */

type Item = { name: string; priceCents: number };
type Field = "number" | "expiry" | "cvc" | "name";
type Status = "idle" | "submitting" | "declined" | "timeout" | "success";

const ITEMS: Item[] = [{ name: "Linen shirt, M", priceCents: 6800 }, { name: "Wool cap", priceCents: 5000 }];
const SHIPPING_CENTS = 1000;
const PROMO = { code: "SAVE10", cents: 1200 };
const money = (c: number) => `$${(c / 100).toFixed(2)}`;

const MESSAGES = {
  number: "Enter the 16 digits on the front of your card.",
  expiryFormat: "Enter the expiry as MM / YY.",
  expiryExpired: "This card has expired. Use a card with a later date.",
  cvc: "Enter the 3 digits on the back of your card.",
  name: "Enter the name as it is printed on the card.",
  promoInvalid: "That code is not valid. Check the spelling or try another.",
};

export function ReviewAndPay({ cart = ITEMS, onBack }: { cart?: Item[]; onBack?: () => void }) {
  const [method, setMethod] = useState("card");
  const [values, setValues] = useState({ number: "", expiry: "", cvc: "", name: "", promo: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [promoState, setPromoState] = useState<"idle" | "applied" | "invalid">("idle");
  const [status, setStatus] = useState<Status>("idle");
  const [orderId, setOrderId] = useState<string>();
  const refs = { number: useRef<HTMLInputElement>(null), expiry: useRef<HTMLInputElement>(null), cvc: useRef<HTMLInputElement>(null), name: useRef<HTMLInputElement>(null) };

  const subtotal = cart.reduce((s, i) => s + i.priceCents, 0);
  const discount = promoState === "applied" ? PROMO.cents : 0;
  const total = subtotal + SHIPPING_CENTS - discount;
  const busy = status === "submitting";

  const errors: Partial<Record<Field, string>> = {};
  if (!luhnValid(values.number)) errors.number = MESSAGES.number;
  const exp = expiryValid(values.expiry);
  if (exp === "format") errors.expiry = MESSAGES.expiryFormat;
  if (exp === "expired") errors.expiry = MESSAGES.expiryExpired;
  if (!/^\d{3,4}$/.test(values.cvc)) errors.cvc = MESSAGES.cvc;
  if (values.name.trim().length < 2) errors.name = MESSAGES.name;
  const shown = (f: Field) => (touched[f] ? errors[f] : undefined);

  const set = (f: keyof typeof values) => (v: string) => setValues((s) => ({ ...s, [f]: v }));
  // Blur validation waits one beat so a tap on Pay lands before any error text renders (finding F5).
  const blur = (f: Field) => () => { window.setTimeout(() => setTouched((t) => ({ ...t, [f]: true })), 150); };

  const applyPromo = () => setPromoState(values.promo.trim().toUpperCase() === PROMO.code ? "applied" : "invalid");
  const removePromo = () => { setPromoState("idle"); setValues((s) => ({ ...s, promo: "" })); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ number: true, expiry: true, cvc: true, name: true });
    const first = (["number", "expiry", "cvc", "name"] as Field[]).find((f) => errors[f]);
    if (first) { requestAnimationFrame(() => refs[first].current?.focus()); return; }
    setStatus("submitting");
    const r = await chargeCard(values.number, total);
    if (r.result === "ok") { setOrderId(r.orderId); setStatus("success"); }
    else setStatus(r.result);
  };
  const useDifferentCard = () => {
    setValues((s) => ({ ...s, number: "", expiry: "", cvc: "" }));
    setTouched({});
    setStatus("idle");
    requestAnimationFrame(() => refs.number.current?.focus());
  };

  if (cart.length === 0) {
    return (
      <Screen>
        <div className="mx-auto w-full max-w-[480px]">
          <Card title="Your cart is empty">
            <p className="text-body text-text-secondary">Nothing to pay for yet. Add something to your cart and come back here.</p>
            <Button variant="primary" className="w-full lg:w-auto lg:self-start">Browse products</Button>
          </Card>
        </div>
      </Screen>
    );
  }

  if (status === "success") {
    return (
      <Screen>
        <div className="mx-auto w-full max-w-[480px]">
          <Card title="Payment complete">
            <CircleCheck aria-hidden className="size-5 text-state-success-text" strokeWidth={1.5} />
            <p role="status" className="text-body text-text-primary">Order #{orderId}  ·  {money(total)} charged to Visa ····{values.number.slice(-4)}</p>
            <p className="text-body-sm text-text-secondary">A receipt is on its way to you@example.com. You can track the order from your account.</p>
            <Button variant="primary" className="w-full lg:w-auto lg:self-start">View order</Button>
            <Button variant="tertiary" className="self-start">Continue shopping</Button>
          </Card>
        </div>
      </Screen>
    );
  }

  const summary = (
    <Card variant="summary" title="Order summary" total={{ label: "Total", value: money(total) }}>
      {cart.map((i) => <Row key={i.name} l={i.name} r={money(i.priceCents)} />)}
      <Row l="Subtotal" r={money(subtotal)} />
      <Row l="Shipping" r={money(SHIPPING_CENTS)} />
      {discount > 0 && <Row l={`Discount · ${PROMO.code}`} r={`-${money(discount)}`} tone="success" />}
    </Card>
  );

  const payBlock = (
    <div className="flex flex-col gap-3">
      <Button type="submit" form="checkout" variant="primary" size="lg" loading={busy} iconLeft={<Lock strokeWidth={1.5} />} className="w-full">
        {busy ? "Processing payment" : `Pay ${money(total)}`}
      </Button>
      <p className="flex items-center gap-2 text-caption text-text-secondary">
        <ShieldCheck aria-hidden className="size-5 shrink-0 text-icon-muted" strokeWidth={1.5} />
        Encrypted payment. Nothing is charged until you confirm.
      </p>
      <Button variant="tertiary" iconLeft={<ArrowLeft strokeWidth={1.5} />} className="self-start" onClick={onBack} disabled={busy}>
        Back to shipping
      </Button>
    </div>
  );

  return (
    <Screen>
      <header className="flex flex-col gap-2">
        <p className="text-caption text-text-secondary">Step 3 of 3  ·  Shipping saved</p>
        <h1 className="text-h1 text-text-primary">Review and pay</h1>
      </header>

      <div className="lg:hidden">{summary}</div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <form id="checkout" onSubmit={submit} noValidate className="flex flex-col gap-6">
          {(status === "declined" || status === "timeout") && (
            <Alert
              variant="error"
              title={status === "declined" ? "Your card was declined" : "We could not reach the payment provider"}
              body={status === "declined" ? "No charge was made. Try another card or contact your bank." : "Nothing was charged. Check your connection and try again."}
              action={status === "declined" ? { label: "Use a different card", onClick: useDifferentCard } : { label: "Try again", onClick: () => setStatus("idle") }}
            />
          )}

          <Card title="Payment method">
            <fieldset aria-label="Payment method" className="flex flex-col gap-3" disabled={busy}>
              <RadioCard name="method" value="card" title="Card" subtitle="Visa, Mastercard, Amex" icon={<CreditCard strokeWidth={1.5} />} checked={method === "card"} onChange={() => setMethod("card")} />
              <RadioCard name="method" value="apple" title="Apple Pay" subtitle="Pay with Face ID" checked={method === "apple"} onChange={() => setMethod("apple")} />
              <RadioCard name="method" value="paypal" title="PayPal" subtitle="Temporarily unavailable" disabled />
            </fieldset>
          </Card>

          <Card title="Card details">
            <Input ref={refs.number} label="Card number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" value={values.number} onChange={(e) => set("number")(formatCardNumber(e.target.value))} onBlur={blur("number")} helperText="We never store your card number." error={shown("number")} disabled={busy} />
            <div className="grid grid-cols-2 items-start gap-3">
              <Input ref={refs.expiry} label="Expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" value={values.expiry} onChange={(e) => set("expiry")(formatExpiry(e.target.value))} onBlur={blur("expiry")} error={shown("expiry")} disabled={busy} />
              <Input ref={refs.cvc} label="CVC" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} value={values.cvc} onChange={(e) => set("cvc")(e.target.value.replace(/\D/g, ""))} onBlur={blur("cvc")} helperText="3 digits on the back." error={shown("cvc")} disabled={busy} />
            </div>
            <Input ref={refs.name} label="Name on card" autoComplete="cc-name" placeholder="As printed on the card" value={values.name} onChange={(e) => set("name")(e.target.value)} onBlur={blur("name")} error={shown("name")} disabled={busy} />
            <p className="text-body-sm text-text-secondary">
              Billing address is the same as shipping. <TextLink disabled={busy}>Change</TextLink>
            </p>
          </Card>

          <Card title="Promo code">
            {promoState === "applied" ? (
              <Alert variant="success" title="Promo code applied" body={`${PROMO.code} took ${money(PROMO.cents)} off your order.`} action={{ label: "Remove", onClick: removePromo }} />
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <Input label="Code" autoComplete="off" placeholder="Enter a code" value={values.promo} onChange={(e) => { set("promo")(e.target.value); if (promoState === "invalid") setPromoState("idle"); }} error={promoState === "invalid" ? MESSAGES.promoInvalid : undefined} disabled={busy} className="flex-1" />
                <div className="flex flex-col gap-2">
                  <span aria-hidden className="hidden h-5 sm:block" />{/* label height, keeps Apply level with the field */}
                  <Button variant="secondary" onClick={applyPromo} disabled={busy || !values.promo.trim()} className="w-full sm:w-auto">
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <div className="lg:hidden">{payBlock}</div>
        </form>

        <aside className="hidden lg:sticky lg:top-8 lg:flex lg:flex-col lg:gap-4">
          {summary}
          {payBlock}
        </aside>
      </div>
    </Screen>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto flex w-full max-w-[1024px] flex-col gap-8 px-4 py-8 lg:px-8 lg:py-16">{children}</main>;
}

function Row({ l, r, tone }: { l: string; r: string; tone?: "success" }) {
  const c = tone === "success" ? "text-state-success-text" : "text-text-secondary";
  return (
    <div className={`flex justify-between gap-3 text-body-sm ${c}`}>
      <span>{l}</span>
      <span>{r}</span>
    </div>
  );
}
