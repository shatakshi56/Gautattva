'use client';

import React, { useState } from 'react';
import { ShieldCheck, Download, ExternalLink, Check, FileText, X } from 'lucide-react';
import knowledgeBase from '@/data/knowledge_base.json';

interface LabReportSectionProps {
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const LabReportSection: React.FC<LabReportSectionProps> = ({
  isOpenModal,
  onCloseModal,
}) => {
  const lab = knowledgeBase.lab_report;
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'macros' | 'purity'>('all');

  const filteredParams = lab.verified_parameters_per_100g.filter((p) => {
    if (selectedCategory === 'macros') {
      return ['Calories (Energy)', 'Total Fat', 'Saturated Fat', 'Monounsaturated Fat (MUFA)', 'Polyunsaturated Fat (PUFA)'].includes(p.parameter);
    }
    if (selectedCategory === 'purity') {
      return ['Total Carbohydrate', 'Total Sugars / Lactose', 'Protein / Casein Solids', 'Sodium', 'Vitamin-A'].includes(p.parameter);
    }
    return true;
  });

  const content = (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-[#1F3A22] text-[#FDFBF7] p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#C9882B] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full">
                Govt. Approved Test House
              </span>
              <span className="text-xs text-stone-300">ISO 9001:2015 • GLP Certified</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
              {lab.laboratory}
            </h3>
            <p className="text-xs text-stone-300">
              {lab.address}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/jagdamba-lab-report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C9882B] hover:bg-[#B37521] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF</span>
            </a>
          </div>
        </div>

        {/* Certificate Reference Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
          <div>
            <span className="block text-stone-400">Report No.</span>
            <span className="font-mono font-bold text-amber-300">{lab.report_number}</span>
          </div>
          <div>
            <span className="block text-stone-400">Sample Name</span>
            <span className="font-semibold">{lab.sample_name}</span>
          </div>
          <div>
            <span className="block text-stone-400">Analysis Completed</span>
            <span className="font-semibold">{lab.report_release_date}</span>
          </div>
          <div>
            <span className="block text-stone-400">Purity Status</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> 100% Passed
            </span>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#1F3A22] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All 15 Parameters
          </button>
          <button
            onClick={() => setSelectedCategory('purity')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              selectedCategory === 'purity'
                ? 'bg-[#1F3A22] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Purity &amp; Zero-Allergen Proof
          </button>
          <button
            onClick={() => setSelectedCategory('macros')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              selectedCategory === 'macros'
                ? 'bg-[#1F3A22] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Lipid &amp; Caloric Profile
          </button>
        </div>

        <span className="text-xs text-stone-500 italic">
          *Tested as per AOAC 22nd Edition &amp; BIS IS Standards
        </span>
      </div>

      {/* Parameters Table */}
      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF6EE] text-[#1F3A22] uppercase tracking-wider font-bold border-b border-stone-200">
            <tr>
              <th className="py-3 px-4">Test Parameter</th>
              <th className="py-3 px-4">Certified Result (Per 100g)</th>
              <th className="py-3 px-4">Standard Method</th>
              <th className="py-3 px-4">Ayurvedic / Health Significance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredParams.map((item, idx) => {
              const isZero = item.result.includes('Not Detected');
              return (
                <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#1C1917]">
                    {item.parameter}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg font-bold font-mono ${
                        isZero
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {item.result}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">
                    {item.method}
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    {item.significance || (isZero ? 'Zero residual solids or sugars' : 'Wholesome lipid nourishment')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Purity Guarantee Footer */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-900">
        <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Official Verification Seal:</p>
          <p className="mt-0.5 text-emerald-800 leading-relaxed">
            Report reviewed by Gajanand Kumawat (Dy. Technical Manager - Food) &amp; authorized by Kuldeep Singh (Technical Manager - Chemical). Sample meets 100% compliance with Food Safety and Standards Authority of India (FSSAI) norms.
          </p>
        </div>
      </div>
    </div>
  );

  // If rendered as a Modal
  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-[#FDFBF7] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border-2 border-[#E7D0A8]">
          <button
            onClick={onCloseModal}
            className="absolute top-6 right-6 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          {content}
        </div>
      </div>
    );
  }

  // If rendered in page
  return (
    <section id="lab-report" className="scroll-mt-24 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C9882B] bg-[#FEF5E7] px-3 py-1 rounded-full border border-[#E7D0A8]">
          Independent NABL Test House
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F3A22] mt-3">
          100% Lab Tested Purity. Certified Zero Casein &amp; Zero Sugars.
        </h2>
        <p className="text-sm text-stone-600 mt-2">
          Every batch of GauTattva Organics undergoes rigorous laboratory testing by Jagdamba Laboratories (OPC) Pvt. Ltd. (Report # JLFD260702144).
        </p>
      </div>

      {content}
    </section>
  );
};
