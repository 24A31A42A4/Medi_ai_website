import React from 'react';
import WhitePageLayout from '../components/WhitePageLayout';

export default function PrivacyPage() {
  return (
    <WhitePageLayout title="Privacy Policy" lastUpdated="January 1, 2025">
      <p>ZERO Technologies ("we", "our", or "us") respects your privacy. This Privacy Policy outlines how we collect, use, and share your information when you visit zeroteam.in (the "Site") or use our DENTY products and applications.</p>

      <h2>Information We Collect</h2>
      <ul>
        <li><strong>Account Data:</strong> Name, email address, password (encrypted).</li>
        <li><strong>Shipping Data:</strong> Delivery address, phone number.</li>
        <li><strong>Payment Information:</strong> Processed directly by Razorpay (we do not store full card info).</li>
        <li><strong>Device & App Data:</strong> Brushing habits, duration, frequency (only if you opt-in to AI coaching).</li>
        <li><strong>Usage Data:</strong> IP address, browser type, pages visited.</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>We use your information sparingly, primarily for:</p>
      <ul>
        <li>Order fulfillment and delivery.</li>
        <li>Personalizing your DENTY AI app experience (Buddy, Luna, Batman interactions).</li>
        <li>Communicating order updates or warranty information.</li>
        <li>Improving our website and products via analytics.</li>
      </ul>

      <h2>Data Sharing</h2>
      <p>We do <strong>not</strong> sell your personal data. We only share it with trusted third parties strictly necessary for our business:</p>
      <ul>
        <li><strong>DTDC Express:</strong> For shipping and delivery.</li>
        <li><strong>Razorpay:</strong> For secure payment processing.</li>
        <li><strong>AWS / Supabase:</strong> For secure database hosting.</li>
      </ul>

      <h2>Data Security</h2>
      <p>We implement robust security measures including HTTPS, end-to-end encryption for passwords, and secure cloud infrastructure hosted by Supabase. However, no internet transmission is 100% secure.</p>

      <h2>Your Rights</h2>
      <p>You have the right to access, correct, or delete your personal information. If you wish to delete your account and all associated data, simply email us at <a href="mailto:zero.denty.support@gmail.com">zero.denty.support@gmail.com</a> with the subject "Data Deletion Request".</p>

      <h2>Children's Privacy</h2>
      <p>Our products and services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13.</p>

      <h2>Contact Us</h2>
      <p>If you have questions about this policy, contact us at <a href="mailto:zero.denty.support@gmail.com">zero.denty.support@gmail.com</a>.</p>
    </WhitePageLayout>
  );
}
