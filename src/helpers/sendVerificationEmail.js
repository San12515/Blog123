import VerificationEmail from "../../emails/VerificationEmail";
import { resend } from "../lib/resend";
import { ApiResponse } from "./ApiResponse";

export async function sendVerificationEmail(username, email, token, purpose = "verify") {
  try {
    const subject =
      purpose === "reset" ? "Reset Your Password" : "Verify Your Account";

    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject,
      react: VerificationEmail({ username, otp: token, purpose }),
    });

    if (error) {
      return new ApiResponse(500, null, "Failed to send email");
    }

    return new ApiResponse(200, data, `${purpose === "reset" ? "Reset" : "Verification"} email sent successfully`);
  } catch (error) {
    console.error("Error:", error);
    return new ApiResponse(500, null, "Unexpected error while sending email");
  }
}
