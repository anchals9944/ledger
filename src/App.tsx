import { ReviewAndPay } from "./screens/ReviewAndPay";
import { Showcase } from "./screens/Showcase";

/** Two routes, no router: /checkout is the screen under test, / is the component showcase. */
export default function App() {
  const url = new URL(window.location.href);
  if (url.pathname.startsWith("/checkout")) {
    return <ReviewAndPay cart={url.searchParams.get("cart") === "empty" ? [] : undefined} onBack={() => history.back()} />;
  }
  return <Showcase />;
}
