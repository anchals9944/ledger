import { useState } from "react";
import { CreditCard, Lock } from "lucide-react";
import { Alert, Button, Card, Input, RadioCard } from "../components";

/** Component showcase. The checkout screen is added in the generation step; this page verifies the system renders. */
export function Showcase() {
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  return (
    <main className="mx-auto flex max-w-[720px] flex-col gap-8 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-display text-text-primary">Ledger components</h1>
        <p className="text-body text-text-secondary">Rendered from the generated theme. Every color, size and type style below is a token from Figma.</p>
      </header>

      <Card title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" iconLeft={<Lock strokeWidth={1.5} />}>Pay $128.00</Button>
          <Button variant="secondary">Save for later</Button>
          <Button variant="tertiary">Back</Button>
          <Button variant="primary" disabled>Pay $128.00</Button>
          <Button variant="primary" loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }}>
            Pay $128.00
          </Button>
          <Button variant="primary" size="lg">Pay $128.00</Button>
        </div>
      </Card>

      <Card title="Input">
        <Input label="Card number" inputMode="numeric" placeholder="1234 5678 9012 3456" helperText="We never store your card number." />
        <Input label="Card number" defaultValue="4242 4242 4242 4242" error="Enter the 16 digits on the front of your card." />
        <Input label="Card number" placeholder="1234 5678 9012 3456" disabled helperText="We never store your card number." />
      </Card>

      <Card title="Radio card">
        <RadioCard name="method" value="card" title="Card" subtitle="Visa, Mastercard, Amex" icon={<CreditCard strokeWidth={1.5} />} checked={method === "card"} onChange={() => setMethod("card")} />
        <RadioCard name="method" value="apple" title="Apple Pay" subtitle="Pay with Face ID" checked={method === "apple"} onChange={() => setMethod("apple")} />
        <RadioCard name="method" value="paypal" title="PayPal" subtitle="Temporarily unavailable" disabled />
      </Card>

      <Card variant="summary" title="Order summary" total={{ label: "Total", value: "$128.00" }}>
        <div className="flex justify-between text-body-sm text-text-secondary"><span>2 items</span><span>$118.00</span></div>
        <div className="flex justify-between text-body-sm text-text-secondary"><span>Shipping</span><span>$10.00</span></div>
      </Card>

      <div className="flex flex-col gap-3">
        <Alert variant="error" title="Your card was declined" body="No charge was made. Try another card or contact your bank." action={{ label: "Use a different card", onClick: () => {} }} onClose={() => {}} />
        <Alert variant="success" title="Promo code applied" body="SAVE10 took $12.00 off your order." action={{ label: "Undo", onClick: () => {} }} />
        <Alert variant="info" title="Secure payment" body="Your details are encrypted. We never store your card number." />
      </div>
    </main>
  );
}
