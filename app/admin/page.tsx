import { redirect } from "next/navigation";
import { requireMediaMember } from "@/lib/media/auth";
import { canReviewMedia } from "@/lib/media/domain";

export const dynamic = "force-dynamic";

/** /admin is the admin entry point. Team members with review rights land
 *  straight on the new-product form; read-only viewers go to the library. */
export default async function AdminIndexPage() {
  const { role } = await requireMediaMember();
  redirect(canReviewMedia(role) ? "/admin/products/new" : "/admin/library");
}
