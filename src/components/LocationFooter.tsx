import React from 'react';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';

export const LocationFooter: React.FC = () => {
  return (
    <footer id="location" className="bg-black border-t border-[#27272A] text-white pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#27272A]">
          
          {/* BRAND COLUMN WITH LOGOLAVI.png */}
          <div className="md:col-span-5 text-left space-y-6">
            <img
              src="/images/LOGOLAVI.png"
              alt="LaVi Restaurant Logo"
              className="h-12 w-auto object-contain"
            />
            <p className="text-xs text-[#A1A1AA] font-light leading-relaxed max-w-sm">
              High-Fashion Editorial Digital Menu & Showcase. Premier Soul Food & Caribbean Destination in Staten Island, NY.
            </p>
            <div className="pt-2 text-xs font-mono tracking-widest text-[#A1A1AA] uppercase">
              EATATLAVI.COM
            </div>
          </div>

          {/* LOCATION & PHONE */}
          <div className="md:col-span-4 text-left space-y-4">
            <h4 className="text-xs font-semibold tracking-[0.25em] text-[#A1A1AA] uppercase">
              Location & Contact
            </h4>
            <div className="space-y-3 text-xs text-white">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>
                  500 Henderson Ave<br />
                  Staten Island, NY 10310
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <a href="tel:3479343040" className="hover:underline font-mono">
                  (347) 934-3040
                </a>
              </div>

              <a
                href="https://maps.google.com/?q=500+Henderson+Ave,+Staten+Island,+NY+10310"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-[11px] font-mono tracking-wider text-[#A1A1AA] hover:text-white uppercase pt-2"
              >
                <span>View Google Maps Location</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* HOURS */}
          <div className="md:col-span-3 text-left space-y-4">
            <h4 className="text-xs font-semibold tracking-[0.25em] text-[#A1A1AA] uppercase">
              Hours of Operation
            </h4>
            <div className="space-y-2 text-xs text-[#A1A1AA] font-mono">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-white shrink-0" />
                <span>Daily Kitchen Hours</span>
              </div>
              <p className="text-white pt-1">
                Monday – Saturday: 11AM – 10PM<br />
                Sunday: 12PM – 9PM
              </p>
            </div>
          </div>

        </div>

        {/* MAP EMBED FRAME */}
        <div className="py-12 border-b border-[#27272A]">
          <div className="h-64 border border-[#27272A] bg-[#09090B] overflow-hidden relative">
            <iframe
              title="LaVi Restaurant Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3027.671373971206!2d-74.1169!3d40.6358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24e0f7e4f9b2d%3A0x7d6f5c5d0a0a0a0a!2s500%20Henderson%20Ave%2C%20Staten%20Island%2C%20NY%2010310!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(100%) invert(100%) contrast(1.2)' }}
              allowFullScreen={false}
              loading="lazy"
            />
          </div>
        </div>

        {/* MINIMAL COPYRIGHT */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono tracking-widest text-[#A1A1AA] uppercase gap-4">
          <p>© 2026 LaVi Restaurant (eatatlavi.com). All rights reserved.</p>
          <p>Editorial Minimalist Digital Menu</p>
        </div>

      </div>
    </footer>
  );
};
