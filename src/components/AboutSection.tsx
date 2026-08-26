import React from 'react';
import { Sparkles, Heart, Utensils, Flame, Award } from 'lucide-react';

interface AboutSectionProps {
  onNavigate: (view: "home" | "menu" | "store") => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  return (
    <section id="about" className="py-24 bg-black border-t border-[#27272A] text-white relative overflow-hidden">
      
      {/* BACKGROUND DECORATIVE WATERMARK */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none hidden lg:block">
        <span className="font-serif text-[220px] font-bold text-white tracking-widest leading-none">
          STORY
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 space-y-16">
        
        {/* HEADER TITLE */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 border border-[#27272A] bg-[#09090B]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#A1A1AA] uppercase">
              As Featured in SILive.com & Staten Island Advance
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl font-light tracking-wide uppercase">
            Our Story & Heritage
          </h2>

          <p className="text-xs sm:text-sm font-mono text-[#D4AF37] tracking-widest uppercase max-w-xl mx-auto">
            Where West Brighton Comfort Meets Authentic Island Soul
          </p>
          <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-4" />
        </div>

        {/* 2-COLUMN EDITORIAL CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: EDITORIAL STORY TEXT */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-white leading-snug">
              Sharing Heritage Through Staten Island’s Premier Comfort Food Destination.
            </h3>

            <div className="space-y-4 text-sm text-[#A1A1AA] font-light leading-relaxed">
              <p>
                Located at <strong className="text-white">500 Henderson Ave in West Brighton</strong>, LaVi Restaurant was born from a passion for scratch-made cooking, bold seasonings, and community heritage. Driven by the vision of a Staten Island local raised right here in West Brighton who wanted to share her roots, the space was thoughtfully crafted into a vibrant sanctuary for authentic Caribbean and Southern soul food lovers.
              </p>

              <p>
                Our kitchen blends rich culinary traditions—from 6-hour slow-braised tender oxtail dripping in savory butter-bean gravy to authentic Scotch Bonnet-marinated jerk chicken charred fresh on the grill, crisp golden empanadas, and our legendary baked 7-cheese macaroni.
              </p>

              <p>
                Every dish is prepared daily from scratch using fresh, high-quality ingredients, house-blended seasonings, and timeless family recipes cooked with love. Whether you're stopping by for an all-day breakfast platter, a healthy combo, or takeout for the family, LaVi welcomes you with warmth and unmatched island hospitality.
              </p>
            </div>

            {/* HIGHLIGHTED STATS / BADGES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#27272A]">
              <div className="border border-[#27272A] p-4 bg-[#09090B]">
                <Flame className="w-5 h-5 text-[#D4AF37] mb-2" />
                <h4 className="font-serif text-base text-white uppercase font-normal">6+ Hour Braise</h4>
                <p className="text-[11px] text-[#A1A1AA] mt-0.5">Slow-cooked tender oxtail & meats</p>
              </div>

              <div className="border border-[#27272A] p-4 bg-[#09090B]">
                <Utensils className="w-5 h-5 text-[#D4AF37] mb-2" />
                <h4 className="font-serif text-base text-white uppercase font-normal">7-Cheese Mac</h4>
                <p className="text-[11px] text-[#A1A1AA] mt-0.5">Baked scratch-made signature side</p>
              </div>

              <div className="border border-[#27272A] p-4 bg-[#09090B]">
                <Heart className="w-5 h-5 text-[#D4AF37] mb-2" />
                <h4 className="font-serif text-base text-white uppercase font-normal">Local Pride</h4>
                <p className="text-[11px] text-[#A1A1AA] mt-0.5">Proudly serving Staten Island, NY</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('store')}
                className="bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#B38F24] hover:brightness-110 text-black font-bold text-xs tracking-[0.2em] uppercase px-8 py-4 shadow-xl transition-all"
              >
                Experience LaVi Today &rarr;
              </button>
            </div>

          </div>

          {/* RIGHT: REAL ATTACHED STOREFRONT & DINING ROOM PHOTO GALLERY */}
          <div className="lg:col-span-6 space-y-4">
            <div className="border border-[#D4AF37]/40 bg-[#09090B] p-3 shadow-2xl space-y-3">
              
              {/* PHOTO 1: STOREFRONT EXTERIOR WITH LAVI LOGO WINDOW */}
              <div className="relative overflow-hidden h-72 border border-[#27272A]">
                <img
                  src="/images/storefront_exterior.jpg"
                  alt="LaVi Storefront Exterior 500 Henderson Ave"
                  className="w-full h-full object-cover filter brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-3 left-4 text-left">
                  <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase block">
                    500 Henderson Ave · West Brighton
                  </span>
                  <h4 className="font-serif text-lg text-white font-light">
                    Storefront Exterior & Entrance
                  </h4>
                </div>
              </div>

              {/* PHOTO 2 & 3: INTERIOR MARBLE & DINING ROOM GRID */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative overflow-hidden h-40 border border-[#27272A]">
                  <img
                    src="/images/interior.jpg"
                    alt="LaVi Dining Room Marble Floor"
                    className="w-full h-full object-cover filter brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 text-left">
                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-wider block">
                      Main Dining Area
                    </span>
                  </div>
                </div>

                <div className="relative overflow-hidden h-40 border border-[#27272A]">
                  <img
                    src="/images/dining_view.jpg"
                    alt="LaVi Window Seating Dining"
                    className="w-full h-full object-cover filter brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 text-left">
                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-wider block">
                      Window Seating
                    </span>
                  </div>
                </div>
              </div>

              {/* PRESS CALLOUT BANNER */}
              <div className="p-4 bg-black border border-[#27272A] flex items-center space-x-3 text-left">
                <Award className="w-6 h-6 text-[#D4AF37] shrink-0" />
                <div>
                  <h5 className="text-xs font-mono text-white uppercase font-bold">Staten Island Advance Feature</h5>
                  <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                    "New Staten Island restaurant puts a unique spin on island comfort food."
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
