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
            Welcome to Anyone Can Dance! By accessing or participating in our online dance workshops, you agree to the following Terms & Conditions:
          </p>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">1. Registration and Payments</h2>
            <p>
              By registering for our workshops, you agree to provide accurate and complete information. All payments for workshops must be made in advance through our secure payment gateways. Failure to complete payment will result in cancellation of your registration.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">2. Workshop Participation</h2>
            <p>
              Our workshops are designed for participants of all skill levels. However, we are not responsible for any injuries or health issues that may arise during the workshops. Please consult a doctor if you have any medical conditions before participating.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">3. Intellectual Property</h2>
            <p>
              All content provided in the workshops, including choreography, videos, and materials, is the intellectual property of Anyone Can Dance. You may not reproduce, distribute, or use any content without our express permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">4. Code of Conduct</h2>
            <p>
              Participants are expected to behave respectfully toward instructors and other participants. Harassment, inappropriate behavior, or misuse of our platform will not be tolerated, and we reserve the right to remove any participant who violates these terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">5. Modifications</h2>
            <p>
              We reserve the right to modify or cancel workshops due to unforeseen circumstances, such as instructor availability or technical issues. In such cases, participants will be notified and compensated in accordance with our Refund Policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">6. Liability</h2>
            <p>
              Anyone Can Dance is not liable for any direct or indirect damages resulting from the use of our services or your participation in the workshops. You agree to participate at your own risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}