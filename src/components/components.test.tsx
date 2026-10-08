import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert, Button, Card, Input, RadioCard } from "./index";

describe("Button", () => {
  it("renders the three variants with token classes only", () => {
    render(<><Button>Pay</Button><Button variant="secondary">Save</Button><Button variant="tertiary">Back</Button></>);
    expect(screen.getByRole("button", { name: "Pay" }).className).toContain("bg-cta-primary-bg");
    expect(screen.getByRole("button", { name: "Save" }).className).toContain("border-cta-secondary-border");
    expect(screen.getByRole("button", { name: "Back" }).className).toContain("text-text-link");
  });
  it("is disabled and busy while loading", () => {
    render(<Button loading>Pay</Button>);
    const b = screen.getByRole("button");
    expect(b).toBeDisabled();
    expect(b).toHaveAttribute("aria-busy", "true");
  });
  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Pay</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });
});

describe("Input", () => {
  it("links label, helper and error to the field for screen readers", () => {
    const { rerender } = render(<Input label="Card number" helperText="We never store your card number." />);
    const field = screen.getByLabelText("Card number");
    expect(field).toHaveAccessibleDescription("We never store your card number.");
    rerender(<Input label="Card number" error="Enter the 16 digits on the front of your card." />);
    expect(screen.getByLabelText("Card number")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter the 16 digits");
  });
});

describe("RadioCard", () => {
  it("is a real radio input with the title as its name", () => {
    render(<RadioCard name="m" value="card" title="Card" subtitle="Visa" checked onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: /Card/ })).toBeChecked();
  });
});

describe("Card and Alert", () => {
  it("summary card shows the total row", () => {
    render(<Card variant="summary" title="Order summary" total={{ label: "Total", value: "$128.00" }} />);
    expect(screen.getByText("$128.00")).toBeInTheDocument();
  });
  it("error alert is announced and says whether a charge was made", () => {
    render(<Alert variant="error" title="Your card was declined" body="No charge was made. Try another card or contact your bank." />);
    expect(screen.getByRole("alert")).toHaveTextContent("No charge was made");
  });
  it("dismiss control has a name", () => {
    render(<Alert variant="info" title="Secure payment" onClose={() => {}} />);
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });
});
