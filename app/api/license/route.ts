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

    // ✅ If env var missing, return error
    if (!productId) {
      return NextResponse.json(
        { ok: false, error: "Missing GUMROAD_PRODUCT_ID on server." },
        { status: 500 }
      );
    }

    const key = (licenseKey || "").trim();
    if (key.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Enter a valid Gumrreturn NextResponse.json(oad license key." },
        { status: 400 }
      );
    }

    // ✅ Verify with Gumroad (do NOT increment uses while testing)
    const body = new URLSearchParams();
body.set("product_id", productId);          // <-- REQUIRED for your product
body.set("license_key", key);
body.set("increment_uses_count", "false");


    const r = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });



    // ✅ If Gumroad rejects, return the real reason (TEMP for debugging)
    if (!data?.success) {
      return NextResponse.json(
        { ok: false, error: "Gumroad rejected the key.", gumroad: data, productIdUsed: productId },
        { status: 401 }
      );
    }

    // ✅ Create session cookie
    const payload = `${productId}:${key}`;
    const token = `${hmac(payload)}.${Date.now()}`;

    const res = NextResponse.json({ ok: true });

    // secure cookies only in production (localhost needs secure=false)
    const isProd =
      process.env.NODE_ENV === "production" ||
      process.env.VERCEL_ENV === "production";

    res.cookies.set("daily_reset_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });

    return res;
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Verification failed.", detail: String(e) },
      { status: 500 }
    );
  }
}
