"use client";
import { useRouter } from 'next/navigation';
import React from 'react';

export default function TermsConditionsPage() {
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
            Terms & Conditions
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last Updated: September 2, 2025
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            Welcome to our Tech Community Hub! By accessing or participating in our platform, courses, and community features, you agree to the following Terms & Conditions:
          </p>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">1. Registration and Payments</h2>
            <p>
              By registering for our courses and community, you agree to provide accurate and complete information. All payments for premium courses and subscriptions must be made in advance through our secure payment gateways. Failure to complete payment will result in cancellation of your registration or access to premium features.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">2. Course and Community Participation</h2>
            <p>
              Our courses and community are designed for developers of all skill levels. We are not responsible for any technical issues, data loss, or other damages that may occur while using our platform. You participate in courses and community activities at your own risk. Ensure you have backed up any important work before engaging with our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">3. Intellectual Property</h2>
            <p>
              All content provided on our platform, including course materials, videos, code examples, and tutorials, is the intellectual property of our platform or respective content creators. You may not reproduce, distribute, or use any content without express permission. Any code or projects you create while participating in courses remain your intellectual property.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">4. Code of Conduct</h2>
            <p>
              Community members are expected to behave respectfully toward instructors, mentors, and fellow developers. Harassment, inappropriate behavior, spam, or misuse of our platform will not be tolerated. We reserve the right to suspend or remove any user who violates these terms. Respectful collaboration and constructive feedback are encouraged.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">5. Modifications</h2>
            <p>
              We reserve the right to modify, update, or cancel courses and community features due to unforeseen circumstances, technical maintenance, or content updates. Users will be notified of significant changes. If a paid course is cancelled, refunds will be provided in accordance with our Refund Policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">6. Liability</h2>
            <p>
              Our platform is not liable for any direct or indirect damages resulting from the use of our services, courses, or community features. This includes but is not limited to technical issues, data loss, or any damages from code you write or deploy. You use our platform at your own risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}