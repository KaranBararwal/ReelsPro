"use client";

import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
      <p className="mb-4 text-gray-700">
        At <strong>Image Kit ReelsPro</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.
      </p>

      <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Personal information (e.g., name, email) when you register.</li>
        <li>Video content you upload to our platform.</li>
        <li>Usage data such as your interactions with the app.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>To provide and maintain our services.</li>
        <li>To improve user experience and app features.</li>
        <li>To communicate with you regarding updates or issues.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">3. Data Security</h2>
      <p className="mb-4 text-gray-700">
        We use industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
      </p>

      <h2 className="text-2xl font-semibold mb-2">4. Third-Party Services</h2>
      <p className="mb-4 text-gray-700">
        We may use third-party services for analytics and storage, but your data will not be shared without your consent.
      </p>

      <h2 className="text-2xl font-semibold mb-2">5. Changes to This Policy</h2>
      <p className="mb-4 text-gray-700">
        We may update this Privacy Policy from time to time. We encourage you to review this page periodically for any changes.
      </p>

      <h2 className="text-2xl font-semibold mb-2">6. Contact Us</h2>
      <p className="text-gray-700">
        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@reelspro.com" className="text-blue-600 underline">support@reelspro.com</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;