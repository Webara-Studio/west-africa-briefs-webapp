import { NextRequest, NextResponse } from "next/server";

const LISTMONK_URL = process.env.LISTMONK_URL;
const LISTMONK_LIST_UUID = process.env.LISTMONK_LIST_UUID;

export async function POST(req: NextRequest) {
  if (!LISTMONK_URL || !LISTMONK_LIST_UUID) {
    return NextResponse.json(
      { error: "Newsletter not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const email = body.email;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const res = await fetch(`${LISTMONK_URL}/subscription/form`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email, l: LISTMONK_LIST_UUID }),
      redirect: "manual",
    });

    if (res.ok || res.status === 302) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Subscription failed" },
      { status: 500 }
    );
  } catch {
    return NextResponse.json(
      { error: "Network error" },
      { status: 502 }
    );
  }
}
