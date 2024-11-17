import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.NEXT_PUBLIC_TWILIO_SID;
const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const areaCodeStr = searchParams.get("areaCode");

  if (!areaCodeStr) {
    return NextResponse.json(
      { error: "Area code is required" },
      { status: 400 }
    );
  }

  // Parse area code and ensure it's a valid 3-digit number
  const areaCode = parseInt(areaCodeStr, 10);
  if (isNaN(areaCode) || areaCodeStr.length !== 3) {
    return NextResponse.json({ error: "Invalid area code" }, { status: 400 });
  }

  try {
    const client = twilio(accountSid, authToken);

    // Check if credentials are valid
    if (!accountSid || !authToken) {
      throw new Error("Missing Twilio credentials");
    }

    const availableNumbers = await client
      .availablePhoneNumbers("US")
      .local.list({
        areaCode,
        limit: 20,
      });

    console.log(`Available numbers: ${JSON.stringify(availableNumbers)}`);

    return NextResponse.json(availableNumbers);
  } catch (error) {
    console.error("Error fetching available phone numbers:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch available phone numbers",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const client = twilio(accountSid, authToken);

    const purchasedNumber = await client.incomingPhoneNumbers.create({
      friendlyName: "Purchased Number",
      phoneNumber,
    });

    return NextResponse.json(purchasedNumber);
  } catch (error) {
    console.error("Error purchasing phone number:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to purchase phone number",
      },
      { status: 500 }
    );
  }
}
