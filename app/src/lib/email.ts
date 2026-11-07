import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendChargeReceipt(params: {
  to: string;
  studentName: string;
  amountCents: number;
  policyText: string;
  chargeId: string;
  tutorEmail?: string;
}) {
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set — skipping receipt send", params);
    return;
  }
  try {
    await resend.emails.send({
      from: "LessonLock <receipts@lessonlock.com>",
      to: params.to,
      subject: `LessonLock: kept-fee charge of $${(params.amountCents / 100).toFixed(2)}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="margin:0 0 12px">A kept-fee charge was applied</h2>
          <p>Hi ${params.studentName},</p>
          <p>A charge of <strong>$${(params.amountCents / 100).toFixed(2)}</strong> has been applied to your card on file under your teacher's no-show / late-cancel policy.</p>
          <p style="background:#f4f4f5;padding:12px;border-radius:8px;font-size:13px;color:#52525b">${params.policyText}</p>
          <p>Charge reference: <code>${params.chargeId}</code></p>
          <p>If you believe this is an error, reply to this email and your teacher can issue a 1-click refund.</p>
          <p style="color:#a1a1aa;font-size:12px;margin-top:24px">LessonLock — booking protection for music teachers.</p>
        </div>
      `,
    });
  } catch (e) {
    console.error("[email] failed to send receipt:", e);
  }
}
