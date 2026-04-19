"use client";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Received!</h1>
        <p className="text-gray-600 mb-6">
          Your payment is being confirmed. Your ticket ID will be sent to you via SMS shortly.
        </p>

        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 mb-6">
          Please show your ticket ID at the clinic reception when you arrive.
        </div>

        <a
          href="/book"
          className="block w-full bg-[#1a9ea8] text-white text-center py-3 rounded-xl font-medium hover:bg-[#158a93] transition-colors"
        >
          Book Another Ticket
        </a>
      </div>
    </div>
  );
}
