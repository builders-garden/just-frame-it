import { fetchUser } from "@/lib/neynar";
import { sendFrameNotification } from "@/lib/notifs";
import { trackEvent } from "@/lib/posthog/server";
import {
  deleteUserNotificationDetails,
  getUserNotificationDetails,
  setUserNotificationDetails,
} from "@/lib/prisma/queries";

import {
  ParseWebhookEvent,
  parseWebhookEvent,
  verifyAppKeyWithNeynar,
} from "@farcaster/frame-node";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const requestJson = await request.json();

  let data;
  try {
    data = await parseWebhookEvent(requestJson, verifyAppKeyWithNeynar);
  } catch (e: unknown) {
    const error = e as ParseWebhookEvent.ErrorType;

    switch (error.name) {
      case "VerifyJsonFarcasterSignature.InvalidDataError":
      case "VerifyJsonFarcasterSignature.InvalidEventDataError":
        // The request data is invalid
        return Response.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      case "VerifyJsonFarcasterSignature.InvalidAppKeyError":
        // The app key is invalid
        return Response.json(
          { success: false, error: error.message },
          { status: 401 }
        );
      case "VerifyJsonFarcasterSignature.VerifyAppKeyError":
        // Internal error verifying the app key (caller may want to try again)
        return Response.json(
          { success: false, error: error.message },
          { status: 500 }
        );
    }
  }

  const fid = data.fid;
  const event = data.event;

  switch (event.event) {
    case "frame_added":
      if (event.notificationDetails) {
        await setUserNotificationDetails(fid, event.notificationDetails!);
        await sendFrameNotification({
          fid,
          title: "Thanks for pre-joining Just Frame It!",
          body: "We'll be in touch soon to let you know when applications open.",
        });
        trackEvent(fid, "frame_added", {
          fid,
        });
      }
      break;
    case "frame_removed":
      await deleteUserNotificationDetails(fid);
      trackEvent(fid, "frame_removed", {
        fid,
      });
      break;
    case "notifications_enabled":
      await setUserNotificationDetails(fid, event.notificationDetails);
      await sendFrameNotification({
        fid,
        title: "Ding ding ding",
        body: "Notifications for Just Frame It are now enabled",
      });
      trackEvent(fid, "notifications_enabled", {
        fid,
      });
      break;
    case "notifications_disabled":
      await deleteUserNotificationDetails(fid);
      trackEvent(fid, "notifications_disabled", {
        fid,
      });
      break;
  }

  return Response.json({ success: true });
}
