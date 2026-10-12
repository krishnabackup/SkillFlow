
export default function PrivacyPolicy() {
  return (
    <main className="privacy-page">
      <article className="privacy-content">
        <h1>Privacy Policy</h1>
        <p>Last updated: October 12, 2026</p>

        <p>
          This policy explains how our application handles
          personal information when users register and receive
          account verification emails.
        </p>

        <h2>1. Information We Process</h2>
        <p>
          We may process email addresses, account registration
          details, verification status, and technical information
          needed to operate and secure the application.
        </p>

        <h2>2. Gmail API Usage</h2>
        <p>
          We use the Google Gmail API to send account verification
          emails. Our application requests permission to send
          email using an authorized Google account.
        </p>
        <p>
          We do not use this permission to read Gmail inboxes
          or retrieve users' email messages.
        </p>

        <h2>3. Google User Data</h2>
        <p>
          OAuth credentials are used to authorize Gmail API
          requests. Access and refresh tokens are handled by
          our backend and must be stored securely.
        </p>
        <p>
          We do not sell Google user data or use it for
          advertising. We use it only for the purposes described
          in this policy and as permitted by applicable law.
        </p>

        <h2>4. Sharing and Service Providers</h2>
        <p>
          Hosting, backend infrastructure, and other service
          providers may process information as needed to operate
          the application. We do not share Google user data for
          unrelated advertising purposes.
        </p>

        <h2>5. Data Security and Retention</h2>
        <p>
          We use reasonable security measures to protect
          information. Information is retained only as long
          as needed for the purposes described here or as
          required by law.
        </p>

        <h2>6. Your Choices and Data Deletion</h2>
        <p>
          You may revoke Google account access through your
          Google Account permissions. To request deletion of
          personal information, contact us using the details
          below. Legal retention requirements may apply.
        </p>

        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this policy when our application or
          data practices change. Updates will appear on this page.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          For privacy questions or data deletion requests,
          email:{" "}
          <a href="mailto:krishnabackup2002@example.com">
            krishnabackup2002@example.com
          </a>
        </p>
      </article>
    </main>
  );
}
