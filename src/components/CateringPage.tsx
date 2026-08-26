import React from 'react';
import { Loader2, Plus } from 'lucide-react';
import type { EditorialMenuItem } from '../types';

interface CateringPageProps {
  items: EditorialMenuItem[];
  isLoading: boolean;
  onInitiateAdd?: (item: EditorialMenuItem) => void;
}

export const CateringPage: React.FC<CateringPageProps> = ({ items, isLoading, onInitiateAdd }) => {
  const cateringItems = items.filter((item) => item.category === 'Catering');

  return (
    <section id="catering" className="py-24 bg-[#09090B] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-10">
        
        {/* HEADER TITLE */}
        <div className="text-center space-y-3 mb-16">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37]">
            Events & Parties
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-light tracking-wide uppercase">
            Catering
          </h2>
          <p className="text-xs text-[#A1A1AA] max-w-lg mx-auto font-light">
            Half Pan & Large Pan Trays. Perfect for your next gathering. Click any item to customize and add to your order.
          </p>
          <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-6" />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
            <p className="text-xs font-mono tracking-widest text-[#A1A1AA] uppercase">Loading Catering Menu...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-white uppercase tracking-wide">
                All Catering Trays
              </h3>
              <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
                {cateringItems.length} {cateringItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* ITEM CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cateringItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onInitiateAdd?.(item)}
                  className="group bg-black border border-[#27272A] hover:border-[#D4AF37]/70 p-4 flex justify-between items-start space-x-3 transition-all relative cursor-pointer shadow-lg"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="font-serif text-base sm:text-lg text-white font-normal uppercase tracking-wide group-hover:text-[#D4AF37] transition-colors truncate">
                      {item.name}
                    </h4>

                    <span className="font-mono text-xs text-[#D4AF37] font-bold block mt-1">
                      {item.priceDisplay}
                    </span>

                    {item.description && (
                      <p className="text-[11px] text-[#A1A1AA] font-light mt-2 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    )}

                    {item.options && (
                      <p className="text-[10px] text-[#A1A1AA]/70 font-mono mt-2 uppercase tracking-wide truncate">
                        {item.options}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex flex-col items-end justify-between h-full space-y-3">
                    {item.image ? (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden border border-[#27272A]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : null}

                    {onInitiateAdd && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onInitiateAdd(item); }}
                        className="bg-[#18181B] hover:bg-[#D4AF37] text-[#A1A1AA] hover:text-black border border-[#27272A] hover:border-[#D4AF37] text-[10px] font-mono uppercase font-bold tracking-wider px-3 py-1.5 transition-all flex items-center space-x-1 mt-auto"
                        aria-label={`Customize ${item.name}`}
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
