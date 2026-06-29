import { redirect } from "next/navigation";

/**
 * The old admin route /admin/pending-bakeries has been consolidated
 * into the main admin dashboard at /admin.
 */
export default function PendingBakeriesRedirect() {
  redirect("/admin");
}
