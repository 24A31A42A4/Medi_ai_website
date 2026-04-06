import React from 'react';
import WhitePageLayout from '../components/WhitePageLayout';

export default function CookiesPage() {
  return (
    <WhitePageLayout title="Cookie Policy" lastUpdated="January 1, 2025">
      <h2>What Are Cookies?</h2>
      <p>Cookies are small text files placed on your device to store data. They are widely used to make websites work more efficiently and provide information to the site owners. They help us understand how you use our site and improve your experience.</p>

      <h2>Cookies We Use</h2>
      <p>We classify the cookies we use into the following categories:</p>
      
      <div className="space-y-6 mt-6 not-prose">
        <div className="w-card">
          <div className="w-card-body p-6">
            <h4 className="text-gray-900 font-bold text-lg mb-2 flex items-center gap-2"> Essential <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-mono border border-gray-200">Cannot be disabled</span></h4>
            <p className="text-sm text-gray-700">These cookies are necessary for the website to function. They are usually set in response to actions made by you, such as logging in, managing your cart, or filling in forms securely. Without these, the core site functions will fail.</p>
          </div>
        </div>

        <div className="w-card">
          <div className="w-card-body p-6">
            <h4 className="text-gray-900 font-bold text-lg mb-2 flex items-center gap-2"> Analytics <span className="text-xs px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full font-mono">Optional</span></h4>
            <p className="text-sm text-gray-700">These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. We track simple page views and session sources to know which pages are popular and how visitors move around the site.</p>
          </div>
        </div>

        <div className="w-card">
          <div className="w-card-body p-6">
            <h4 className="text-gray-900 font-bold text-lg mb-2 flex items-center gap-2"> Preferences <span className="text-xs px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full font-mono">Optional</span></h4>
            <p className="text-sm text-gray-700">These cookies enable the website to provide enhanced functionality and personalization, such as remembering your theme settings (dark/light mode) or localized shipping choices.</p>
          </div>
        </div>
      </div>

      <h2>Third-Party Cookies</h2>
      <p>Some of our services are provided by third parties who may also set cookies on your device:</p>
      <ul>
        <li><strong>Supabase Auth:</strong> Sets secure cookies for persistence across sessions when you log in.</li>
        <li><strong>Razorpay:</strong> Sets temporary session cookies to facilitate secure payment processing and fraud detection during checkout.</li>
      </ul>

      <h2>How to Control Cookies</h2>
      <p>You can control and manage cookies through your browser settings. You can set your browser to refuse cookies, delete them entirely, or alert you when they are being sent. Note that disabling essential or third-party cookies (like Supabase Auth or Razorpay) will break site functionality like logging in or purchasing.</p>

      <h2>Contact</h2>
      <p>If you have questions about our use of cookies, please email us at <a href="mailto:zero.denty.support@gmail.com">zero.denty.support@gmail.com</a>.</p>
    </WhitePageLayout>
  );
}
