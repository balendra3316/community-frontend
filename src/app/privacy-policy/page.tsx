"use client";
import { useRouter } from 'next/navigation';
import React from 'react';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to previous page
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last Updated: September 2, 2025
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            At Anyone Can Dance, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you participate in our online dance workshops, visit our website, or engage with our services.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">1. Information We Collect</h2>
            <p>
              We collect personal information that you provide when registering for our workshops, including your name, email address, contact number, and payment details. We also collect non-personal information such as your IP address, browser type, and usage data when you visit our website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">2. How We Use Your Information</h2>
            <p>We use your personal information to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Process your registration and payment for the workshops.</li>
              <li>Communicate with you regarding workshop updates, schedules, and promotions.</li>
              <li>Improve our services and enhance your experience.</li>
              <li>Ensure the security and safety of our platform.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">3. Data Protection</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. We do not share or sell your personal information to third parties, except as required by law or for necessary business purposes (such as processing payments).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">4. Cookies</h2>
            <p>
              Our website uses cookies to improve your browsing experience and track usage data. You may disable cookies in your browser settings, but this may affect your ability to use certain features of our site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">5. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these websites.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">6. Changes to This Policy</h2>
            <p>
              We reserve the right to update this Privacy Policy at any time. Any changes will be posted on our website, and your continued use of our services indicates your acceptance of the revised policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">7. Contact Us</h2>
            <p>
              If you have any questions about our Privacy Policy, please contact us at ytsameer@gmail.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}