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

return NextResponse.json({ ok: false, debug: { productIdUsed: productId } }, { status: 200 });

    const key = (licenseKey || "").trim();
    if (key.length < 10) {
      return NextResponse.json({ ok: false, error: "Enter a valid Gumroad license key." }, { status: 400 });
    }

    // Verify with Gumroad
    const body = new URLSearchParams();
    body.set("product_id", productId);
    body.set("license_key", key);
    body.set("increment_uses_count", "true");

    const r = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    const data = await r.json();

    if (!data?.success) {
      return NextResponse.json({ ok: false, error: "That license key is not valid." }, { status: 401 });
    }

    // Create a signed session cookie (httpOnly)
    const payload = `${productId}:${key}`;
    const token = `${hmac(payload)}.${Date.now()}`;

    const res = NextResponse.json({ ok: true });
    res.cookies.set("daily_reset_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Verification failed." }, { status: 500 });
  }
}
