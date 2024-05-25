import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-center text-2xl font-bold">Privacy Policy</h1>

      <div className="space-y-4">
        <p>
          This Privacy Policy outlines how SWARDify collects, uses, and protects
          your information when you use our mobile application. By using the
          App, you agree to this policy.
        </p>

        <p>
          We collect personal information such as your email address, and
          password when you create an account. Additionally, we gather usage
          data, including information about your interactions with the App. We
          also collect information from messages you send us.
        </p>

        <p>
          Your information is used to provide and maintain the App, improve it
          based on usage data, communicate updates and promotional materials,
          and ensure security. We share your information with service providers
          who perform tasks on our behalf, comply with legal requirements, and
          in the event of a business transfer, such as a merger or sale.
        </p>

        <p>
          We take reasonable measures to protect your information. Your data is
          retained as long as necessary to provide our services and for legal
          purposes.
        </p>

        <p>
          You have the right to request access to your personal information,
          correction of inaccurate information, deletion of your personal
          information, and under certain conditions, limited processing,
          objection to processing, or data transfer.
        </p>

        <p>
          The App is not intended for children under 13, and we do not knowingly
          collect data from them.
        </p>
        <p>
          We may update this policy and will notify you of changes by posting
          the new policy on this page. For any questions, contact us at{" "}
          <Link
            href="mailto:swardify@gmail.com"
            className="text-primary underline"
          >
            swardify@gmail.com
          </Link>
        </p>
      </div>
    </div>
  );
}
