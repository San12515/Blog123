import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from "@react-email/components";

export default function VerificationEmail({ username, otp, purpose }) {
  const isReset = purpose === "reset";

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>{isReset ? "Password Reset" : "Account Verification"}</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>
        {isReset
          ? `Here’s your password reset code: ${otp}`
          : `Here’s your verification code: ${otp}`}
      </Preview>

      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>

        <Row>
          <Text>
            {isReset
              ? "We received a request to reset your password. Please use the code below to continue:"
              : "Thank you for registering. Please use the code below to verify your account:"}
          </Text>
        </Row>

        <Row>
          <Text
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
          >
            {otp}
          </Text>
        </Row>

        <Row>
          <Text>
            {isReset
              ? "If you didn’t request a password reset, you can safely ignore this email."
              : "If you didn’t request an account, you can safely ignore this email."}
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
