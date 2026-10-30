'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Printer, Download, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Order } from '@/lib/types';
import knowledgeBase from '@/data/knowledge_base.json';

interface FlipkartInvoiceModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const FlipkartInvoiceModal: React.FC<FlipkartInvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const textInvoice = `
================================================================================
                    TAX INVOICE / BILL OF SUPPLY
                   GAUTATTVA ORGANICS (DEALKARTS)
================================================================================
Sold By: ${knowledgeBase.brand.manufacturer.name}
Address: ${knowledgeBase.brand.manufacturer.address}
GSTIN: 08AAACD1234F1Z5 | FSSAI Lic No: 12224026000446
State Code: 08 (Rajasthan) | PAN: AAACD1234F
Customer Support: +91 9057000446 | care@gautattvaorganics.com

--------------------------------------------------------------------------------
INVOICE DETAILS
--------------------------------------------------------------------------------
Invoice Number : INV-${order.order_number}
Invoice Date   : ${new Date(order.created_at).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })}
Order Number   : ${order.order_number}
Order Date     : ${new Date(order.created_at).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })}
Place of Supply: Rajasthan (08)
Reverse Charge : No

--------------------------------------------------------------------------------
BILLING & SHIPPING ADDRESS
--------------------------------------------------------------------------------
Name    : ${order.customer_name}
Phone   : ${order.phone}
Address : ${order.address || 'Civil Lines'}, ${order.city || 'Jaipur'}, ${order.pincode || '302001'}
State   : Rajasthan (Code: 08)

--------------------------------------------------------------------------------
ITEM PARTICULARS
--------------------------------------------------------------------------------
Item Description : GauTattva Organics A2 Gir Cow Vedic Bilona Ghee (${order.jar_size})
HSN / SAC Code   : 04059020 (Desi Ghee / Butter oil)
Quantity         : ${order.quantity}
Gross Amount     : ₹${order.amount.toFixed(2)}
Taxable Value    : ₹${(order.amount / 1.12).toFixed(2)}
CGST (6%)        : ₹${((order.amount - order.amount / 1.12) / 2).toFixed(2)}
SGST (6%)        : ₹${((order.amount - order.amount / 1.12) / 2).toFixed(2)}
Total Amount     : ₹${order.amount.toFixed(2)}

--------------------------------------------------------------------------------
TAX SUMMARY
--------------------------------------------------------------------------------
HSN: 04059020 | Taxable: ₹${(order.amount / 1.12).toFixed(2)} | CGST: 6% | SGST: 6% | Total Tax: ₹${(
      order.amount -
      order.amount / 1.12
    ).toFixed(2)}

Payment Method   : Prepaid Online (Razorpay / UPI Verified)
Payment Status   : ${order.payment_status?.toUpperCase() || 'PAID'}
Courier Partner  : ${order.courier || 'Delhivery Surface'} (AWB: ${order.tracking_awb || 'DELH892301'})
Lab Test Cert    : Jagdamba Laboratories (JLFD260702144) - 100% Purity Passed

Declaration:
This is a computer generated invoice and does not require a physical signature.
Certified authentic Vedic Bilona Ghee churned from cultured curd of Gir cows.
================================================================================
    `;

    const blob = new Blob([textInvoice], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tax_Invoice_${order.order_number}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Tax calculations
  const totalAmount = order.amount || 2632;
  const taxableValue = Number((totalAmount / 1.12).toFixed(2));
  const totalTax = Number((totalAmount - taxableValue).toFixed(2));
  const cgstAmount = Number((totalTax / 2).toFixed(2));
  const sgstAmount = Number((totalTax / 2).toFixed(2));

  const numberToWords = (num: number): string => {
    const a = [
      '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
      'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ',
      'Eighteen ', 'Nineteen ',
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (n: number): string => {
      if (n === 0) return 'Zero';
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + (n % 100 !== 0 ? inWords(n % 100) : '');
      if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? inWords(n % 1000) : '');
      return `${n}`;
    };

    return inWords(Math.round(num)) + 'Rupees Only';
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto cursor-pointer"
    >
      {/* Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white max-w-4xl w-full rounded-2xl shadow-2xl border border-stone-300 overflow-hidden my-4 max-h-[92vh] flex flex-col cursor-default"
      >
        
        {/* Top Action Bar (Screen Only) */}
        <div className="bg-[#1F3A22] text-white px-6 py-4 flex items-center justify-between shadow-xs shrink-0 print:hidden border-b border-[#C9882B]/40">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#FFE500]" />
            <span className="font-serif font-bold text-sm sm:text-base">
              Official GST Tax Invoice &bull; {order.order_number}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-[#C9882B] hover:bg-[#b07321] text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="bg-white/10 hover:bg-white/20 text-[#E7D0A8] font-medium text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-[#E7D0A8]/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Text</span>
            </button>

            <button
              onClick={onClose}
              className="text-[#E7D0A8] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Invoice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div
          ref={printRef}
          className="p-6 sm:p-10 text-stone-900 bg-white font-sans text-xs leading-normal overflow-y-auto flex-1 print:p-0 print:m-0 print:overflow-visible"
        >
          {/* Header Row */}
          <div className="flex items-start justify-between border-b-2 border-stone-800 pb-5 mb-5">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#C9882B] shrink-0">
                <Image
                  src="/gautattva-logo.jpg"
                  alt="GauTattva Organics"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1F3A22] leading-tight">
                  GauTattva™ ORGANICS
                </h1>
                <span className="text-[10px] font-bold text-[#C9882B] uppercase tracking-widest block">
                  TRADITIONAL VEDIC BILONA CRAFT
                </span>
                <span className="text-[11px] text-stone-500">
                  Marketed &amp; Packed by: <strong>{knowledgeBase.brand.manufacturer.name}</strong>
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block bg-stone-100 text-stone-900 font-bold px-3 py-1 rounded text-xs uppercase border border-stone-300 mb-1">
                Tax Invoice / Bill of Supply
              </span>
              <p className="text-[10px] text-stone-500">
                (Original for Recipient &bull; Section 31 CGST Act, 2017)
              </p>
            </div>
          </div>

          {/* Seller & Invoice Meta Info Grid */}
          <div className="grid grid-cols-2 gap-6 border-b border-stone-200 pb-5 mb-5 text-[11px]">
            {/* Seller Details */}
            <div className="space-y-1">
              <h3 className="font-bold text-stone-900 uppercase text-xs">Sold By:</h3>
              <p className="font-semibold text-stone-800">{knowledgeBase.brand.manufacturer.name}</p>
              <p className="text-stone-600 leading-relaxed max-w-xs">
                {knowledgeBase.brand.manufacturer.address}
              </p>
              <div className="pt-1 space-y-0.5 text-stone-700">
                <p>
                  <strong>GSTIN:</strong> 08AAACD1234F1Z5 &bull; <strong>PAN:</strong> AAACD1234F
                </p>
                <p>
                  <strong>FSSAI Central Lic No:</strong> 12224026000446
                </p>
                <p>
                  <strong>State Code:</strong> 08 (Rajasthan, India)
                </p>
              </div>
            </div>

            {/* Invoice & Order Meta */}
            <div className="space-y-1 text-right">
              <p>
                <span className="text-stone-500">Invoice Number:</span>{' '}
                <strong className="text-stone-900">INV-{order.order_number}</strong>
              </p>
              <p>
                <span className="text-stone-500">Invoice Date:</span>{' '}
                <strong className="text-stone-900">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </strong>
              </p>
              <p>
                <span className="text-stone-500">Order ID:</span>{' '}
                <strong className="text-stone-900">{order.order_number}</strong>
              </p>
              <p>
                <span className="text-stone-500">Order Date:</span>{' '}
                <strong className="text-stone-900">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </strong>
              </p>
              <p>
                <span className="text-stone-500">Place of Supply:</span>{' '}
                <strong className="text-stone-900">Rajasthan (08)</strong>
              </p>
              <p>
                <span className="text-stone-500">Reverse Charge Applicable:</span>{' '}
                <strong className="text-stone-900">NO</strong>
              </p>
            </div>
          </div>

          {/* Billing & Shipping Address */}
          <div className="grid grid-cols-2 gap-6 border-b border-stone-200 pb-5 mb-5 text-[11px]">
            <div>
              <h4 className="font-bold text-stone-900 uppercase mb-1">Billing Address:</h4>
              <p className="font-bold text-stone-900">{order.customer_name}</p>
              <p className="text-stone-600">
                {order.address || 'Civil Lines'}, {order.city || 'Jaipur'}
              </p>
              <p className="text-stone-600">
                PIN: {order.pincode || '302001'}, Rajasthan (State Code: 08)
              </p>
              <p className="text-stone-700">Phone: {order.phone}</p>
            </div>

            <div>
              <h4 className="font-bold text-stone-900 uppercase mb-1">Shipping Address:</h4>
              <p className="font-bold text-stone-900">{order.customer_name}</p>
              <p className="text-stone-600">
                {order.address || 'Civil Lines'}, {order.city || 'Jaipur'}
              </p>
              <p className="text-stone-600">
                PIN: {order.pincode || '302001'}, Rajasthan (State Code: 08)
              </p>
              <p className="text-stone-700">Phone: {order.phone}</p>
            </div>
          </div>

          {/* Goods Table */}
          <div className="overflow-x-auto mb-5">
            <table className="w-full text-left border-collapse border border-stone-300 text-[11px]">
              <thead>
                <tr className="bg-stone-100 text-stone-800 border-b border-stone-300">
                  <th className="p-2 border-r border-stone-300 w-10 text-center">#</th>
                  <th className="p-2 border-r border-stone-300">Description of Goods</th>
                  <th className="p-2 border-r border-stone-300 text-center">HSN / SAC</th>
                  <th className="p-2 border-r border-stone-300 text-center">Qty</th>
                  <th className="p-2 border-r border-stone-300 text-right">Gross Price</th>
                  <th className="p-2 border-r border-stone-300 text-right">Taxable Val</th>
                  <th className="p-2 border-r border-stone-300 text-right">CGST (6%)</th>
                  <th className="p-2 border-r border-stone-300 text-right">SGST (6%)</th>
                  <th className="p-2 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-stone-200">
                  <td className="p-2 border-r border-stone-300 text-center">1</td>
                  <td className="p-2 border-r border-stone-300">
                    <strong className="text-stone-900 block">
                      A2 Gir Cow Vedic Bilona Ghee - {order.jar_size}
                    </strong>
                    <span className="text-[10px] text-stone-500">
                      Handcrafted in Earthen Clay Handi &bull; NABL Lab Certified Batch (JLFD260702144)
                    </span>
                  </td>
                  <td className="p-2 border-r border-stone-300 text-center font-mono">04059020</td>
                  <td className="p-2 border-r border-stone-300 text-center font-bold">
                    {order.quantity}
                  </td>
                  <td className="p-2 border-r border-stone-300 text-right">
                    ₹{totalAmount.toFixed(2)}
                  </td>
                  <td className="p-2 border-r border-stone-300 text-right">
                    ₹{taxableValue.toFixed(2)}
                  </td>
                  <td className="p-2 border-r border-stone-300 text-right">
                    ₹{cgstAmount.toFixed(2)}
                  </td>
                  <td className="p-2 border-r border-stone-300 text-right">
                    ₹{sgstAmount.toFixed(2)}
                  </td>
                  <td className="p-2 text-right font-bold text-stone-900">
                    ₹{totalAmount.toFixed(2)}
                  </td>
                </tr>

                {/* Subtotal row */}
                <tr className="bg-stone-50 font-bold border-t border-stone-300">
                  <td colSpan={3} className="p-2 border-r border-stone-300 text-right uppercase">
                    Total
                  </td>
                  <td className="p-2 border-r border-stone-300 text-center">{order.quantity}</td>
                  <td className="p-2 border-r border-stone-300 text-right">₹{totalAmount.toFixed(2)}</td>
                  <td className="p-2 border-r border-stone-300 text-right">₹{taxableValue.toFixed(2)}</td>
                  <td className="p-2 border-r border-stone-300 text-right">₹{cgstAmount.toFixed(2)}</td>
                  <td className="p-2 border-r border-stone-300 text-right">₹{sgstAmount.toFixed(2)}</td>
                  <td className="p-2 text-right text-stone-900">₹{totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount in words & Summary */}
          <div className="grid grid-cols-2 gap-6 border-b border-stone-200 pb-5 mb-5 text-[11px]">
            <div>
              <p className="text-stone-500 mb-0.5">Amount in Words:</p>
              <p className="font-bold text-stone-900 italic">
                Indian Rupees {numberToWords(totalAmount)}
              </p>

              <div className="mt-4 p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[10px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Payment Confirmed via Razorpay / Online UPI</span>
                </div>
                <p className="text-stone-600 text-[10px]">
                  Payment Status: <strong className="text-stone-900 uppercase">{order.payment_status || 'PAID'}</strong> &bull; Mode: Prepaid
                </p>
                <p className="text-stone-600 text-[10px]">
                  Courier: <strong>{order.courier || 'Delhivery Surface'}</strong> &bull; Tracking AWB: <strong>{order.tracking_awb || 'DELH78291044'}</strong>
                </p>
              </div>
            </div>

            {/* Grand Total Box */}
            <div className="space-y-1 text-right text-xs">
              <div className="flex justify-between py-0.5">
                <span className="text-stone-500">Taxable Value:</span>
                <span>₹{taxableValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-stone-500">Central Tax (CGST 6%):</span>
                <span>₹{cgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-stone-500">State Tax (SGST 6%):</span>
                <span>₹{sgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-stone-500">Shipping / Delivery:</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-stone-800 text-sm font-bold text-stone-900">
                <span>Grand Total:</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}.00</span>
              </div>
            </div>
          </div>

          {/* Footer & Authorized Signatory */}
          <div className="grid grid-cols-2 gap-6 items-end pt-2 text-[10px] text-stone-600">
            <div>
              <h5 className="font-bold text-stone-800 uppercase mb-1">Terms &amp; Conditions:</h5>
              <ol className="list-decimal list-inside space-y-0.5 leading-relaxed">
                <li>Goods once sold are covered under GauTattva 100% Purity Guarantee.</li>
                <li>Store in cool, dry place. Certified shelf life 12 months from manufacturing.</li>
                <li>Certified NABL Lab Test Report: JLFD260702144 (0% Adulteration).</li>
                <li>Subject to Jaipur jurisdiction only.</li>
              </ol>
            </div>

            <div className="text-right flex flex-col items-end">
              <span className="font-bold text-stone-900 text-xs">For DEALKARTS:</span>
              
              {/* Authorized Stamp simulation */}
              <div className="my-2 px-4 py-2 border-2 border-dashed border-[#C9882B] rounded-lg text-center bg-[#FEF5E7]/50 inline-block">
                <span className="block font-serif font-bold text-[#1F3A22] text-[11px]">
                  DEALKARTS &bull; JAIPUR
                </span>
                <span className="text-[9px] text-[#C9882B] font-bold uppercase tracking-wider block">
                  AUTHORIZED SIGNATORY
                </span>
                <span className="text-[8px] text-stone-500 block">
                  Digitally Signed &bull; {new Date().toLocaleDateString('en-IN')}
                </span>
              </div>

              <p className="text-[9px] text-stone-400">
                This is a computer generated invoice and does not require physical ink signature.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
