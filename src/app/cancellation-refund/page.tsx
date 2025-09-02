"use client";
import { useRouter } from 'next/navigation';
import React from 'react';

export default function CancellationRefundPage() {
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
            Cancellation & Refund Policy
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last Updated: September 2, 2025
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            We understand that sometimes plans change. The following policy outlines our cancellation and refund terms:
          </p>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">1. Cancellations by Participants</h2>
            <p>
              If you need to cancel your registration for a workshop, you must notify us at least 48 hours before the workshop start date to be eligible for a full refund. Cancellations made less than 48 hours before the workshop will not be eligible for a refund.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">2. Cancellations by Anyone Can Dance</h2>
            <p>
              In the event that we need to cancel or reschedule a workshop due to unforeseen circumstances, we will offer you the option to attend a rescheduled session or receive a full refund.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">3. No-Shows</h2>
            <p>
              If you do not attend the workshop without prior cancellation, no refund will be issued.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">4. Refund Process</h2>
            <p>
              Refunds will be processed within 7-10 business days after receiving your cancellation request. Refunds will be issued to the original payment method used during registration.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800">5. Non-Refundable Items</h2>
            <p>
              Promotional or discounted workshops are non-refundable unless otherwise stated at the time of purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}