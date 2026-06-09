import {
  createUser,
  deleteUser,
  syncDBUserToClerk,
  updateUser,
} from "@/features/users/action";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    switch (evt.type) {
      case "user.created":
      case "user.updated": {
        const role = evt.data.public_metadata.role || "user";

        if (evt.type === "user.created") {
          const result = await createUser({
            id: evt.data.id,
            clerk_user_id: evt.data.id,
            name: `${evt.data.first_name || ""} ${evt.data.last_name || ""}`.trim(),
            email: evt.data.email_addresses[0]?.email_address || "",
            role,
            image_url: evt.data.image_url || null,
            deleted_at: null,
            created_at: new Date(),
            updated_at: new Date(),
          });

          await syncDBUserToClerk({
            userId: result.data.id,
            role,
            clerkUserId: evt.data.id,
          });
        }

        if (evt.type === "user.updated") {
          const result = await updateUser(evt.data.id, {
            name: `${evt.data.first_name || ""} ${evt.data.last_name || ""}`.trim(),
            email: evt.data.email_addresses[0]?.email_address || "",
            role,
            image_url: evt.data.image_url || null,
            updated_at: new Date(),
          });

          await syncDBUserToClerk({
            userId: result.data.id,
            role,
            clerkUserId: evt.data.id,
          });
        }

        break;
      }
      case "user.deleted":
        await deleteUser(evt.data.id!);
        break;
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
