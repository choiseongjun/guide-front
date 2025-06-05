import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      amount,
      orderId,
      orderName,
      customerName,
      customerEmail,
      customerTel,
    } = body;

    // 나이스페이먼츠 API 키
    const clientKey = process.env.NICEPAY_CLIENT_KEY;
    const secretKey = process.env.NICEPAY_SECRET_KEY;

    // 타임스탬프 생성
    const timestamp = Math.floor(Date.now() / 1000);

    // 서명 생성
    const signature = crypto
      .createHmac("sha256", secretKey!)
      .update(`${timestamp}.${clientKey}.${orderId}.${amount}`)
      .digest("hex");

    return NextResponse.json({
      clientKey,
      signature,
      timestamp,
    });
  } catch (error) {
    console.error("Payment preparation error:", error);
    return NextResponse.json(
      { error: "결제 준비 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
