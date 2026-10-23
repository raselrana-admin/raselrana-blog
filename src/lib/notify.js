import { Resend } from "resend";

/**
 * Server only. Emails the owner through Resend (the main site uses the same service).
 * Returns `true` when the email was accepted, `false` when it was not sent: email not
 * configured, or Resend refused it. Never throws, so a notification can never block
 * the change it reports.
 */
export async function notifyOwner({ to, subject, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_EMAIL_FROM;
  const recipient = process.env.NOTIFY_EMAIL_TO || to;
  if (!apiKey || !from || !recipient) return false;

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: recipient,
      subject,
      text,
    });
    if (error) {
      console.error("Notification email was not sent:", error.name);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Notification email was not sent:", error?.name ?? "error");
    return false;
  }
}
