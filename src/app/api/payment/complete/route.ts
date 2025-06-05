import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resultCode, resultMsg, orderId, amount, signature, timestamp } =
      body;

    // 서명 검증
    const secretKey = process.env.NICEPAY_SECRET_KEY;
    const clientKey = process.env.NICEPAY_CLIENT_KEY;

    const expectedSignature = crypto
      .createHmac("sha256", secretKey!)
      .update(`${timestamp}.${clientKey}.${orderId}.${amount}`)
      .digest("hex");

    if (signature !== expectedSignature) {
      throw new Error("Invalid signature");
    }

    // 결제 성공 처리
    if (resultCode === "0000") {
      // TODO: 결제 성공 처리 (DB 저장 등)
      return NextResponse.json({ success: true });
    } else {
      // TODO: 결제 실패 처리
      return NextResponse.json({ success: false, message: resultMsg });
    }
  } catch (error) {
    console.error("Payment completion error:", error);
    return NextResponse.json(
      { error: "결제 완료 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
