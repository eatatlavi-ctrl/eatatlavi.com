import React from 'react';
import { X, ExternalLink, Phone, ShoppingBag } from 'lucide-react';

const SQUARE_ONLINE_MENU = 'https://947631192157396575.square.site/shop/menu/5PWVS6EEJ3MUOWSQK2BHBG2H';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout?: () => void;
}

export const DeliveryModal: React.FC<DeliveryModalProps> = ({ isOpen, onClose, onOpenCheckout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#09090B] border border-[#27272A] p-8 sm:p-10 max-w-lg w-full shadow-2xl relative text-left space-y-6">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#A1A1AA] hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MODAL HEADER */}
        <div className="space-y-1">
          <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#A1A1AA]">
            LaVi Restaurant &bull; Staten Island
          </span>
          <h3 className="font-serif text-3xl font-light text-white uppercase tracking-wide">
            How would you like to order?
          </h3>
        </div>

        {/* OPTIONS */}
        <div className="space-y-4 pt-2">

          {/* IN-SITE NATIVE CHECKOUT — PRIMARY */}
          <button
            onClick={() => { onClose(); onOpenCheckout?.(); }}
            className="w-full block border-2 border-white bg-white p-5 hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 group text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-5 h-5 text-black" />
                <span className="font-serif text-lg font-normal uppercase tracking-wide text-black">
                  Order Online — Pay Here
                </span>
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                &rarr; Checkout
              </span>
            </div>
            <div className="mt-3 pt-2 border-t border-black/20">
              <p className="text-[10px] font-mono tracking-wide text-black/70 uppercase">
                Pickup or Delivery &bull; Secure Card Payment &bull; Stay on this site
              </p>
            </div>
          </button>

          {/* EXTERNAL SQUARE STORE OPTION */}
          <a
            href={SQUARE_ONLINE_MENU}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between border border-[#27272A] p-4 hover:border-white transition-all duration-300 group"
          >
            <div>
              <span className="block font-serif text-sm font-light text-white uppercase tracking-wide">
                Order via Square Online Store
              </span>
              <span className="block text-[10px] text-[#A1A1AA] uppercase tracking-wider mt-0.5">
                Opens External Store Catalog
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-[#A1A1AA] group-hover:text-white" />
          </a>

          {/* CALL DIRECT OPTION */}
          <a
            href="tel:3479343040"
            className="block border border-[#27272A] p-5 hover:border-white hover:bg-white hover:text-black transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-white group-hover:text-black" />
                <span className="font-serif text-lg font-normal uppercase tracking-wide">
                  Call Direct: (347) 934-3040
                </span>
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider underline">
                Dial
              </span>
            </div>
            <div className="mt-3 pt-2 border-t border-[#27272A] group-hover:border-black/30">
              <p className="text-[10px] font-mono tracking-wide text-[#A1A1AA] group-hover:text-black/80 uppercase">
                Free Local Delivery over $45 &bull; Call to verify City Employee Discount
              </p>
            </div>
          </a>

          {/* THIRD-PARTY APPS ROW */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href="https://www.ubereats.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border border-[#27272A] p-4 hover:border-white transition-all duration-300 group"
            >
              <div>
                <span className="block font-serif text-sm font-light text-white uppercase tracking-wide">
                  Uber Eats
                </span>
                <span className="block text-[10px] text-[#A1A1AA] uppercase tracking-wider mt-0.5">
                  3rd Party
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-white" />
            </a>
            <a
              href="https://www.doordash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border border-[#27272A] p-4 hover:border-white transition-all duration-300 group"
            >
              <div>
                <span className="block font-serif text-sm font-light text-white uppercase tracking-wide">
                  DoorDash
                </span>
                <span className="block text-[10px] text-[#A1A1AA] uppercase tracking-wider mt-0.5">
                  3rd Party
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-white" />
            </a>
          </div>

        </div>

        {/* FOOTER NOTE */}
        <p className="text-[10px] text-[#A1A1AA] tracking-widest uppercase text-center pt-2">
          500 Henderson Ave, Staten Island, NY 10310
        </p>

      </div>
    </div>
  );
};
