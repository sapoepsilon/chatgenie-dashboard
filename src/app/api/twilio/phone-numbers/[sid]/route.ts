import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.NEXT_PUBLIC_TWILIO_SID;
const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;

export async function PATCH(
  request: Request,
  { params }: { params: { sid: string } }
) {
  try {
    const { friendlyName } = await request.json();
    const client = twilio(accountSid, authToken);

    await client.incomingPhoneNumbers(params.sid).update({
      friendlyName: friendlyName,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating phone number:", error);
    return NextResponse.json(
      { error: "Failed to update phone number" },
      { status: 500 }
    );
  }
}
