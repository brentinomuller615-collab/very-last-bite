import { redirect } from "next/navigation";
import LandingPage from "./LandingPage";

export default function Home() {
  // ----------------------------------------------------------------------
  // TEMPORARY LAUNCH MODE: Redirect all homepage traffic to /signup
  // ----------------------------------------------------------------------
  // To restore the public landing page after the meeting:
  // 1. Delete or comment out the `redirect` line below.
  // 2. Uncomment the `return <LandingPage />;` line.
  // ----------------------------------------------------------------------

  redirect("/signup");

  // return <LandingPage />;
}
