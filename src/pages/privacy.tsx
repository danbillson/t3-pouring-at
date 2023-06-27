import { type NextPage } from "next";
import { Layout } from "~/components/ui/layout";

const Privacy: NextPage = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold">Privacy Policy - pouring.at</h1>

      <h2 className="text-xl">Effective Date: 26th June 2023</h2>

      <p>
        At pouring.at, we are committed to protecting your privacy and
        safeguarding your personal information. This Privacy Policy explains how
        we collect, use, store, and protect your personal data when you access
        or use pouring.at, with authentication services provided by clerk.com.
        By using pouring.at, you consent to the practices described in this
        policy.
      </p>

      <h3>1. Information We Collect</h3>

      <p>
        When you access pouring.at with clerk.com authentication, we may collect
        the following types of personal information:
      </p>

      <ul className="flex flex-col gap-4">
        <li>
          Account Information: We collect information that you provide during
          the registration process, such as your name, email address, and other
          necessary details required for authentication.
        </li>
        <li>
          Authentication Data: When you authenticate through clerk.com, we may
          collect information related to the authentication process, including
          unique identifiers, login timestamps, and device information.
        </li>
        <li>
          Usage Information: We may collect data about how you interact with
          pouring.at, including your browsing activities, preferences, and other
          usage patterns. This information helps us improve our services and
          personalize your experience.
        </li>
        <li>
          Cookies and Similar Technologies: We may use cookies, web beacons, and
          similar tracking technologies to collect information about your
          interactions with pouring.at. These technologies help us analyze
          trends, administer the website, track user movements, and gather
          demographic information.
        </li>
      </ul>

      <h3>2. Use of Information</h3>

      <p>
        We use the personal information collected from pouring.at, authenticated
        through clerk.com, for the following purposes:
      </p>

      <ul className="flex flex-col gap-4">
        <li>
          Account Management: We use your information to manage your account,
          authenticate your access, and provide you with the requested services.
        </li>
        <li>
          Personalization: We may personalize your experience on pouring.at by
          using your information to present relevant content, tailor
          recommendations, and improve the overall usability of our platform.
        </li>
        <li>
          Communication: We may use your contact information to communicate with
          you regarding updates, changes to our services, or respond to your
          inquiries.
        </li>
        <li>
          Analytics and Improvement: We analyze user behavior and usage patterns
          to improve our website&apos;s performance, troubleshoot technical
          issues, and enhance our services based on user preferences.
        </li>
        <li>
          Legal Compliance: We may disclose your personal information if
          required by law or in response to valid requests from governmental
          authorities, court orders, or legal processes.
        </li>
      </ul>

      <h3>3. Data Sharing and Disclosure</h3>

      <p>
        We understand the importance of protecting your personal information. We
        do not sell, rent, or disclose your personal data to third parties for
        their marketing purposes without your explicit consent. However, we may
        share your information in the following circumstances:
      </p>

      <ul className="flex flex-col gap-4">
        <li>
          Service Providers: We may engage trusted third-party service providers
          to assist us in delivering and improving our services. These providers
          have access to your personal information solely for the purpose of
          performing their services on our behalf and are contractually
          obligated to maintain its confidentiality.
        </li>
        <li>
          Business Transfers: If pouring.at undergoes a merger, acquisition, or
          sale of all or a portion of its assets, your personal information may
          be transferred as part of the transaction. We will notify you via
          email or prominent notice on our website if such a transfer occurs.
        </li>
        <li>
          Legal Requirements: We may disclose your personal information if
          required to do so by law or in good faith belief that such action is
          necessary to comply with applicable laws, regulations, legal
          processes, or enforceable governmental requests.
        </li>
      </ul>

      <h3>4. Data Security</h3>

      <p>
        We implement appropriate security measures to protect your personal
        information from unauthorized access, alteration, disclosure, or
        destruction. We follow industry-standard practices to ensure the
        security of your data.
      </p>

      <h3>5. Your Rights</h3>

      <p>
        You have certain rights regarding your personal information under the UK
        GDPR. These rights may include the right to access, update, correct, or
        delete your information. If you have any privacy-related concerns or
        wish to exercise your rights, please contact us using the information
        provided below.
      </p>

      <h3>6. Children&apos;s Privacy</h3>

      <p>
        Pouring.at is not intended for use by individuals under the age of 18.
        We do not knowingly collect personal information from children. If we
        become aware that we have inadvertently collected personal data from a
        child, we will take steps to delete it promptly.
      </p>

      <h3>7. Changes to this Privacy Policy</h3>

      <p>
        We reserve the right to update or modify this Privacy Policy at any
        time. Any changes will be effective immediately upon posting the revised
        policy on pouring.at. We encourage you to review this policy
        periodically to stay informed about how we collect, use, and protect
        your personal information.
      </p>

      <h3>8. Contact Us</h3>

      <p>
        If you have any questions, concerns, or requests related to this Privacy
        Policy or the handling of your personal information, please contact us
        at dbillson@outlook.com.
      </p>

      <p>Thank you for trusting pouring.at with your personal information.</p>
    </Layout>
  );
};

export default Privacy;
