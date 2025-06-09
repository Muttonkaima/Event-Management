"use client";

import React from "react";
import paymentDataRaw from "@/data/user/payment.json";

// TypeScript interfaces for payment data
interface PayerDetails {
  name: string;
  email: string;
  phone: string;
}
interface MethodDetails {
  upiId?: string | null;
  cardLast4?: string | null;
  bankName?: string | null;
}
interface ProductDetails {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
}
interface Breakdown {
  baseAmount: number;
  taxAmount: number;
  discount: number;
  totalPaid: number;
}
interface Refund {
  isRefunded: boolean;
  refundId?: string | null;
  refundAmount?: number | null;
  refundDate?: string | null;
}
interface Notes {
  internalNote?: string;
  userNote?: string;
}
interface PaymentData {
  transactionId: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  paymentProvider: string;
  paymentTime: string;
  receiptUrl?: string;
  payerDetails: PayerDetails;
  methodDetails: MethodDetails;
  productDetails: ProductDetails;
  breakdown: Breakdown;
  refund: Refund;
  notes: Notes;
}

const paymentData = paymentDataRaw as PaymentData;
import DashboardLayout from "@/components/user/event-dashboard/DashboardLayout";
import { CheckCircle, XCircle, Clock, CreditCard, IndianRupee, ReceiptText, User, Banknote, FileWarning, ExternalLink } from "lucide-react";

export default function PaymentDetailsPage() {
  if (!paymentData || !paymentData.transactionId) {
    return (
      <DashboardLayout title="Payment Details">
        <div className="flex flex-1 items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <FileWarning className="mx-auto w-14 h-14 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">No Payment Found</h2>
            <p className="text-gray-500">You have not completed any payment yet.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const {
    transactionId,
    amount,
    currency,
    status,
    paymentMethod,
    paymentProvider,
    paymentTime,
    receiptUrl,
    payerDetails,
    methodDetails,
    productDetails,
    breakdown,
    refund,
    notes
  } = paymentData;

  const statusIcon = status === "Success"
    ? <CheckCircle className="w-6 h-6 text-green-500 inline-block align-middle mr-1" />
    : status === "Failed"
    ? <XCircle className="w-6 h-6 text-red-500 inline-block align-middle mr-1" />
    : <Clock className="w-6 h-6 text-yellow-500 inline-block align-middle mr-1" />;

  return (
    <DashboardLayout title="Payment Details">
      <section className="w-full max-w-4xl mx-auto px-4 py-8">
        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            {statusIcon}
            <div>
              <div className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {status} <span className="text-base font-normal text-gray-400">({transactionId})</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                <Clock className="w-4 h-4" />
                {paymentTime ? new Date(paymentTime).toLocaleString() : "-"}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 min-w-[180px]">
            <div className="flex items-center gap-2 text-2xl font-bold text-black">
              <IndianRupee className="w-5 h-5 text-green-600" />
              {amount?.toLocaleString()} <span className="text-base font-normal text-gray-500">{currency}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <CreditCard className="w-4 h-4" /> {paymentMethod} <span className="mx-1">|</span> {paymentProvider}
            </div>
            {receiptUrl && (
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition"
              >
                <ReceiptText className="w-4 h-4" /> View Receipt <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payer Details */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1 text-gray-800 font-semibold text-base">
              <User className="w-5 h-5 text-blue-500" /> Payer Details
            </div>
            <div className="text-sm text-gray-600">{payerDetails.name}</div>
            <div className="text-sm text-gray-600">{payerDetails.email}</div>
            <div className="text-sm text-gray-600">{payerDetails.phone}</div>
          </div>

          {/* Method Details */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1 text-gray-800 font-semibold text-base">
              <Banknote className="w-5 h-5 text-green-500" /> Method Details
            </div>
            {paymentMethod === "UPI" && (
              <div className="text-sm text-gray-600">UPI ID: {methodDetails.upiId}</div>
            )}
            {paymentMethod === "Card" && (
              <div className="text-sm text-gray-600">Card: **** **** **** {methodDetails.cardLast4}</div>
            )}
            {methodDetails.bankName && (
              <div className="text-sm text-gray-600">Bank: {methodDetails.bankName}</div>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1 text-gray-800 font-semibold text-base">
              <CreditCard className="w-5 h-5 text-purple-500" /> Product Details
            </div>
            <div className="text-sm text-gray-600">{productDetails.productName}</div>
            <div className="text-sm text-gray-600">Category: {productDetails.category}</div>
            <div className="text-sm text-gray-600">Quantity: {productDetails.quantity}</div>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1 text-gray-800 font-semibold text-base">
              <IndianRupee className="w-5 h-5 text-amber-500" /> Payment Breakdown
            </div>
            <div className="text-sm text-gray-600">Base: ₹{breakdown.baseAmount?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Tax: ₹{breakdown.taxAmount?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Discount: ₹{breakdown.discount?.toLocaleString()}</div>
            <div className="text-sm text-gray-800 font-semibold mt-2">Total Paid: ₹{breakdown.totalPaid?.toLocaleString()}</div>
          </div>

          {/* Refund Info */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-1 text-gray-800 font-semibold text-base">
              <XCircle className="w-5 h-5 text-red-400" /> Refund Status
            </div>
            {refund.isRefunded ? (
              <div className="text-sm text-green-700">
                Refunded: ₹{refund.refundAmount} on {refund.refundDate}
                <span className="ml-2 text-xs text-gray-500">(Refund ID: {refund.refundId})</span>
              </div>
            ) : (
              <div className="text-sm text-gray-600">No refund has been issued for this transaction.</div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-1 text-gray-800 font-semibold text-base">
              <FileWarning className="w-5 h-5 text-yellow-500" /> Notes
            </div>
            {notes.userNote && <div className="text-sm text-gray-600">User: {notes.userNote}</div>}
            {notes.internalNote && <div className="text-xs text-gray-400 mt-1">Internal: {notes.internalNote}</div>}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
