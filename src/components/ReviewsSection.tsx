'use client';

import React from 'react';
import { Star, ShieldCheck, ThumbsUp } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Dr. Meenakshi Sundaram',
      location: 'Chennai, Tamil Nadu',
      date: '3 days ago',
      rating: 5,
      variant: '1 Litre Jar',
      title: 'Remarkable aroma & absolutely genuine Danedar texture!',
      body: 'As an Ayurvedic practitioner, finding pure bilona ghee made without hybrid milk is rare. The moment I opened the GauTattva jar, the nutty aroma took me back to my village home. Verified their Jagdamba lab report myself — zero sugars and zero casein. Highly recommended.',
      helpful: 48,
    },
    {
      name: 'Rohan Deshmukh',
      location: 'Pune, Maharashtra',
      date: '1 week ago',
      rating: 5,
      variant: '500ml Jar',
      title: 'The WhatsApp Reorder is pure magic!',
      body: 'I bought the 500ml jar last month. Exactly on Day 25, I got a polite WhatsApp message with a 1-tap Razorpay payment link. Literally paid in 5 seconds via UPI without entering any password or login. Received my fresh replenishment 2 days later. Best D2C experience in India!',
      helpful: 62,
    },
    {
      name: 'Sangeeta Agarwal',
      location: 'Jaipur, Rajasthan',
      date: '2 weeks ago',
      rating: 5,
      variant: '2 Litres (Twin Jar)',
      title: 'My kids love it with warm rotis',
      body: 'We ordered the 2L family value pack. The packaging in thick glass with the sacred seal was impeccable. The free brass spoon is heavy and authentic. Even my father with lactose sensitivity digests this effortlessly.',
      helpful: 35,
    },
  ];

  return (
    <section id="reviews" className="py-16 bg-[#FAF6EE] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-1.5 text-amber-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F3A22]">
            Loved by 3,840+ Discerning Families
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Read verified customer experiences from homes across India who switched to GauTattva Vedic Bilona Ghee.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400">{r.date}</span>
                </div>

                <h4 className="font-bold text-sm text-[#1C1917] mb-2">
                  &quot;{r.title}&quot;
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {r.body}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#1F3A22] flex items-center gap-1.5">
                    <span>{r.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-[11px] text-stone-500">{r.location} • {r.variant}</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-stone-400">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{r.helpful}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
