
import { NextResponse } from "next/server";
import crypto from "crypto";

const VERIFY_URL = "https://api.gumroad.com/v2/licenses/verify";

function hmac(value: string) {
  const secret = process.env.APP_SESSION_SECRET || "";
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { licenseKey } = (await req.json()) as { licenseKey?: string };
    const productId = process.env.GUMROAD_PRODUCT_ID;

    if (!productId) {
      return NextResponse.json(
        { ok: false, error: "Missing GUMROAD_PRODUCT_ID on server." },
        { status: 500 }
      );
    }

    const key = (licenseKey || "").trim();
    if (key.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Enter a valid Gumroad license key." },
        { status: 400 }
      );
    }

    const body = new URLSearchParams();
    body.set("product_id", productId); // required for your product
    body.set("license_key", key);

    // keep false while testing; switch to "true" when you’re done testing
    body.set("increment_uses_count", "false");

    const r = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = await r.json();

    if (!data?.success) {
      return NextResponse.json(
        { ok: false, error: "That license key is not valid." },
        { status: 401 }
      );
    }

    const payload = `${productId}:${key}`;
    const token = `${hmac(payload)}.${Date.now()}`;

    const res = NextResponse.json({ ok: true });

    const isProd =
      process.env.NODE_ENV === "production" ||
      process.env.VERCEL_ENV === "production";

    res.cookies.set("daily_reset_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Verification failed." },
      { status: 500 }
    );
  }
}
