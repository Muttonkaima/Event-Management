"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, CreditCard, IndianRupee, ReceiptText, User, Banknote, FileWarning, ExternalLink, Package, Tag } from "lucide-react";

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

export default function ReceiptPage() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("paymentDetailsForReceipt");
    if (data) {
      setPaymentData(JSON.parse(data));
    }
  }, []);

  if (!paymentData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <FileWarning className="w-14 h-14 text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">No Receipt Data</h2>
        <p className="text-gray-500">No payment details found for receipt.</p>
      </div>
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
    payerDetails,
    methodDetails,
    productDetails,
    breakdown,
    refund,
    notes
  } = paymentData;

  const statusIcon = status === "Success"
    ? <CheckCircle className="w-5 h-5 text-green-500" />
    : status === "Failed"
    ? <XCircle className="w-5 h-5 text-red-500" />
    : <Clock className="w-5 h-5 text-yellow-500" />;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 my-10 p-6 print:shadow-none print:border-none print:my-0 print:p-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Receipt</h1>
        <button className="text-sm px-4 py-1.5 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 print:hidden" onClick={() => window.print()}>Print</button>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`rounded-full p-2 ${status === "Success" ? "bg-green-100" : status === "Failed" ? "bg-red-100" : "bg-yellow-100"}`}>{statusIcon}</div>
        <div className="text-lg font-semibold text-gray-900">{status}</div>
        <div className="text-xs font-mono text-gray-400 break-all">({transactionId})</div>
      </div>
      <div className="mb-4 text-gray-500 text-sm flex items-center gap-2">
        <Clock className="w-4 h-4" />
        {paymentTime ? new Date(paymentTime).toLocaleString() : "-"}
      </div>
      <div className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
        <IndianRupee className="w-5 h-5 text-green-700" />
        {amount?.toLocaleString()} <span className="text-base font-normal text-gray-500">{currency}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div>
          <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><User className="w-4 h-4 text-blue-600" />Payer</div>
          <div className="text-gray-700 text-sm">{payerDetails.name}</div>
          <div className="text-gray-600 text-sm">{payerDetails.email}</div>
          <div className="text-gray-600 text-sm">{payerDetails.phone}</div>
        </div>
        <div>
          <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Banknote className="w-4 h-4 text-green-600" />Method</div>
          <div className="text-gray-700 text-sm">{paymentMethod} ({paymentProvider})</div>
          {methodDetails.upiId && <div className="text-gray-600 text-sm">UPI: {methodDetails.upiId}</div>}
          {methodDetails.cardLast4 && <div className="text-gray-600 text-sm">Card: **** **** **** {methodDetails.cardLast4}</div>}
          {methodDetails.bankName && <div className="text-gray-600 text-sm">Bank: {methodDetails.bankName}</div>}
        </div>
        <div>
          <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Package className="w-4 h-4 text-purple-600" />Product</div>
          <div className="text-gray-700 text-sm">{productDetails.productName}</div>
          <div className="text-gray-600 text-sm">Category: {productDetails.category}</div>
          <div className="text-gray-600 text-sm">Quantity: {productDetails.quantity}</div>
        </div>
        <div>
          <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><IndianRupee className="w-4 h-4 text-amber-600" />Breakdown</div>
          <div className="text-gray-700 text-sm">Base: ₹{breakdown.baseAmount?.toLocaleString()}</div>
          <div className="text-gray-700 text-sm">Tax: ₹{breakdown.taxAmount?.toLocaleString()}</div>
          <div className="text-gray-700 text-sm">Discount: ₹{breakdown.discount?.toLocaleString()}</div>
          <div className="text-gray-900 font-semibold text-base mt-2">Total Paid: ₹{breakdown.totalPaid?.toLocaleString()}</div>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><XCircle className="w-4 h-4 text-red-400" />Refund</div>
        {refund.isRefunded ? (
          <div className="text-green-700 text-sm">Refunded: ₹{refund.refundAmount} on {refund.refundDate} <span className="ml-2 text-xs text-gray-500">(Refund ID: {refund.refundId})</span></div>
        ) : (
          <div className="text-gray-600 text-sm">No refund has been issued for this transaction.</div>
        )}
      </div>
      <div className="mb-4">
        <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><FileWarning className="w-4 h-4 text-yellow-500" />Notes</div>
        {notes.userNote && <div className="text-gray-700 text-sm mb-1">User: {notes.userNote}</div>}
        {notes.internalNote && <div className="text-xs text-gray-500">Internal: {notes.internalNote}</div>}
      </div>
      <div className="text-center text-xs text-gray-400 mt-8 print:hidden">This is a system-generated receipt for your records.</div>
    </div>
  );
}
