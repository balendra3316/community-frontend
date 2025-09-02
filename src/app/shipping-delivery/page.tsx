"use client";
import { useRouter } from 'next/navigation';
import React from 'react';

export default function ShippingDeliveryPage() {
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
            Shipping & Delivery Policy
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last Updated: September 2, 2025
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            Our online workshops are conducted via digital platforms, so no physical shipping is required. However, for any materials or merchandise associated with our workshops (e.g., e-books, dance props, or branded clothing), the following policy applies:
          </p>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">1. Digital Products</h2>
            <p>
              Upon successful registration and payment, participants will receive access to the workshop through a secure link. All digital products (such as e-books or downloadable materials) will be delivered to the email address provided during registration.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">2. Physical Products</h2>
            <p>
              If you order any physical products, they will be shipped to the address you provide during checkout. Please allow 5-7 business days for processing and shipping. Shipping times may vary depending on your location.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">3. Shipping Fees</h2>
            <p>
              Shipping fees for physical products will be calculated based on the delivery address and product weight. Shipping fees are non-refundable.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">5. Tracking Information</h2>
            <p>
              Once your order is shipped, you will receive an email with tracking information. Please allow 24-48 hours for tracking details to update.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">6. Damaged or Missing Items</h2>
            <p>
              If your item arrives damaged or is missing, please contact us at ytsameer@gmail.com within 7 days of receipt. We will arrange a replacement or refund as needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}