// app/api/twilio/phone-numbers/route.ts
import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.NEXT_PUBLIC_TWILIO_SID;
const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;

export async function GET() {
  try {
    const client = twilio(accountSid, authToken);
    const incomingPhoneNumbers = await client.incomingPhoneNumbers.list();
    console.log(
      `Phone numbers: ${JSON.stringify(
        incomingPhoneNumbers.map((n) => n.capabilities)
      )}`
    );

    // Return the full phone number objects
    return NextResponse.json(incomingPhoneNumbers);
  } catch (error) {
    console.error("Error fetching phone numbers:", error);
    return NextResponse.json(
      { error: "Failed to fetch phone numbers" },
      { status: 500 }
    );
  }
}
// DELETE handler for removing phone numbers
export async function DELETE(
  request: Request,
  { params }: { params: { sid: string } }
) {
  try {
    const client = twilio(accountSid, authToken);
    await client.incomingPhoneNumbers(params.sid).remove();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting phone number:", error);
    return NextResponse.json(
      { error: "Failed to delete phone number" },
      { status: 500 }
    );
  }
}
