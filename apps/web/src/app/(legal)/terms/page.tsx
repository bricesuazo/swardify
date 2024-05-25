import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-center text-2xl font-bold">Terms and Conditions</h1>

      <div className="space-y-4">
        <p>
          By using the SWARDify mobile application, you agree to the following
          terms and conditions. Your use of the App constitutes acceptance of
          these terms.
        </p>

        <p>
          You must be at least 13 years old to use the App. You are responsible
          for maintaining the confidentiality of your account information and
          for all activities that occur under your account. We reserve the right
          to terminate or suspend your account if you violate these terms.
        </p>

        <p>
          The App is provided "as is," and we make no warranties regarding its
          functionality, accuracy, or reliability. We are not liable for any
          damages arising from your use of the App.
        </p>

        <p>
          You agree not to use the App for any unlawful or prohibited
          activities. We reserve the right to modify or discontinue the App at
          any time without notice.
        </p>

        <p>
          All content provided in the App, including translations and
          definitions, is for informational purposes only.
        </p>

        <p>
          By submitting content to the App, you grant us a non-exclusive,
          royalty-free license to use, reproduce, and distribute your content.
          We reserve the right to remove any content that violates these terms.
        </p>

        <p>
          We may update these terms, and continued use of the App constitutes
          acceptance of the new terms. For any questions, contact us at{" "}
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
