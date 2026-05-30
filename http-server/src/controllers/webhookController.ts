import { Request, Response } from "express";
import { Webhook } from "svix";
import { User } from "../models/user.js";

export const clerkWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("CLERK_WEBHOOK_SECRET is missing");
    }

    const svixId = req.headers["svix-id"] as string;
    const svixTimestamp = req.headers["svix-timestamp"] as string;
    const svixSignature = req.headers["svix-signature"] as string;

    if (!svixId || !svixTimestamp || !svixSignature) {
      res.status(400).json({
        success: false,
        message: "Missing svix headers",
      });
      return;
    }

    const wh = new Webhook(webhookSecret);

    // Note: If wh.verify fails, ensure your server is using express.json() middleware 
    // or passing the raw body buffer.
    const evt = wh.verify(JSON.stringify(req.body), {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as any;

    const eventType = evt.type;
    const data = evt.data;

    switch (eventType) {
      case "user.created": {
        const email = data.email_addresses?.[0]?.email_address || "";

        // 🔄 FIX: Changed from User.create to findOneAndUpdate with upsert: true
        // This stops old webhook retries from throwing duplicate E11000 email errors.
        await User.findOneAndUpdate(
          { clerkId: data.id }, // Look for this user
          {
            clerkId: data.id,
            email,
            username:
              data.username ||
              `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
              email.split("@")[0],
            profilePicture: data.image_url || "",
            isOnline: false,
            lastSeen: null,
          },
          { upsert: true, new: true } // If not found, create them. If found, update them.
        );

        console.log(`User created/synced: ${data.id}`);
        break;
      }

      case "user.updated": {
        const email = data.email_addresses?.[0]?.email_address || "";

        await User.findOneAndUpdate(
          { clerkId: data.id },
          {
            email,
            username:
              data.username ||
              `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
              email.split("@")[0],
            profilePicture: data.image_url || "",
          },
          { new: true }
        );

        console.log(`User updated: ${data.id}`);
        break;
      }

      case "user.deleted": {
        await User.findOneAndDelete({
          clerkId: data.id,
        });

        console.log(`User deleted: ${data.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    res.status(200).json({
      success: true,
      message: "Webhook processed",
    });
  } catch (error) {
    console.error("Webhook Error:", error);

    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};