import React, { useState } from 'react';
import { EDITORIAL_MENU } from '../data/menuData';
import type { MenuCategory, EditorialMenuItem } from '../types';
import { Plus, Sparkles } from 'lucide-react';

const CATEGORIES: MenuCategory[] = [
  'Entrees',
  'Catering',
  'Wings',
  'Empanadas & Patties',
  'Tacos, Burritos & Wraps',
  'Burgers & Hot Dogs',
  'Breakfast (All Day)',
  'Sides',
  'Sweet Treats',
  'Beverages',
  'Vegan'
];

interface EditorialMenuProps {
  onOpenOrderModal: () => void;
  onInitiateAdd?: (item: EditorialMenuItem) => void;
}

export const EditorialMenu: React.FC<EditorialMenuProps> = ({ onOpenOrderModal, onInitiateAdd }) => {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Entrees');

  // Most ordered / popular items for top showcase
  const popularItems = EDITORIAL_MENU.filter((item) => item.isPopular).slice(0, 6);

  // Group items by category
  const categorizedMenu = CATEGORIES.map((cat) => ({
    category: cat,
    items: EDITORIAL_MENU.filter((item) => item.category === cat)
  })).filter((group) => group.items.length > 0);

  const scrollToCategory = (cat: MenuCategory) => {
    setActiveCategory(cat);
    const elementId = `section-${cat.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
    const el = document.getElementById(elementId);
    if (el) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="menu" className="py-20 bg-[#09090B] border-t border-[#27272A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* HEADER TITLE */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37]">
            Full Online Menu & Food Catalog
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-light tracking-wide uppercase">
            LaVi Restaurant Storefront
          </h2>
          <p className="text-xs text-[#A1A1AA] max-w-lg mx-auto font-light">
            Browse our full kitchen menu below. Click any item to customize size, choose your flavored rice and sides, and place your order.
          </p>
          <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-4" />
        </div>

        {/* MOST ORDERED SHOWCASE */}
        {popularItems.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-serif text-2xl font-light text-white uppercase tracking-wide">
                Most Ordered
              </h3>
              <span className="text-[10px] font-mono text-[#A1A1AA] uppercase tracking-wider">
                · Customer Favorites
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popularItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-black border border-[#27272A] hover:border-[#D4AF37] transition-all p-4 flex justify-between items-start space-x-4 shadow-lg relative overflow-hidden cursor-pointer"
                  onClick={() => onInitiateAdd?.(item)}
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block">
                      {item.category}
                    </span>
                    <h4 className="font-serif text-lg text-white font-medium truncate group-hover:text-[#D4AF37] transition-colors">
                      {item.name}
                    </h4>
                    {item.description && (
                      <p className="text-[11px] text-[#A1A1AA] font-light line-clamp-2 leading-snug">
                        {item.description}
                      </p>
                    )}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">
                        {item.priceDisplay}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 relative">
                    {item.image ? (
                      <div className="w-20 h-20 rounded-md overflow-hidden relative border border-[#27272A]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        {onInitiateAdd && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onInitiateAdd(item); }}
                            className="absolute bottom-1 right-1 bg-white text-black p-1.5 rounded-full shadow-md hover:bg-[#D4AF37] transition-colors"
                            aria-label={`Customize ${item.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      onInitiateAdd && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onInitiateAdd(item); }}
                          className="w-10 h-10 bg-[#18181B] border border-[#27272A] group-hover:border-[#D4AF37] text-white group-hover:bg-[#D4AF37] group-hover:text-black flex items-center justify-center transition-all rounded-full"
                          aria-label={`Customize ${item.name}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAIN DOORDASH LAYOUT: SIDEBAR + CONTINUOUS MENU */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">

          {/* LEFT SIDEBAR CATEGORY NAVIGATION */}
          <aside className="lg:col-span-3 sticky top-24 z-30 bg-black border border-[#27272A] p-4 hidden lg:block shadow-xl">
            <h4 className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#A1A1AA] mb-4 pb-2 border-b border-[#27272A]">
              Full Menu Sections
            </h4>
            <nav className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className={`w-full text-left px-3 py-2 text-xs font-mono tracking-wider uppercase transition-all flex items-center justify-between ${
                    activeCategory === cat
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] opacity-70">
                    ({EDITORIAL_MENU.filter((i) => i.category === cat).length})
                  </span>
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t border-[#27272A]">
              <button
                onClick={onOpenOrderModal}
                className="w-full bg-white text-black font-bold text-[10px] tracking-widest uppercase py-3 hover:bg-[#D4AF37] transition-colors"
              >
                Checkout Options
              </button>
            </div>
          </aside>

          {/* MOBILE STICKY HORIZONTAL BAR */}
          <div className="lg:hidden sticky top-16 z-30 bg-black/95 border-y border-[#27272A] py-3 -mx-4 px-4 overflow-x-auto scrollbar-none flex space-x-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className={`px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider whitespace-nowrap shrink-0 transition-all ${
                  activeCategory === cat
                    ? 'bg-[#D4AF37] text-black font-bold'
                    : 'bg-[#18181B] text-[#A1A1AA] border border-[#27272A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* RIGHT COLUMN: CONTINUOUS SCROLLING MENU SECTIONS */}
          <div className="lg:col-span-9 space-y-16">
            {categorizedMenu.map(({ category, items }) => (
              <div
                key={category}
                id={`section-${category.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                className="space-y-6 scroll-mt-28"
              >
                {/* SECTION HEADER */}
                <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-light text-white uppercase tracking-wide">
                      {category}
                    </h3>
                    {category === 'Entrees' && (
                      <p className="text-[11px] text-[#A1A1AA] font-mono mt-0.5 uppercase tracking-wider">
                        Served with choice of White, Yellow, Rice & Peas, or Jollof Rice
                      </p>
                    )}
                    {category === 'Catering' && (
                      <p className="text-[11px] text-[#D4AF37] font-mono mt-0.5 uppercase tracking-wider">
                        Half Pan & Large Pan Trays for Events & Parties
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* ITEM CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onInitiateAdd?.(item)}
                      className="group bg-black border border-[#27272A] hover:border-[#D4AF37]/70 p-4 flex justify-between items-start space-x-3 transition-all relative cursor-pointer"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="font-serif text-base sm:text-lg text-white font-normal uppercase tracking-wide group-hover:text-[#D4AF37] transition-colors truncate">
                            {item.name}
                          </h4>
                        </div>

                        <span className="font-mono text-xs text-[#D4AF37] font-bold block mt-0.5">
                          {item.priceDisplay}
                        </span>

                        {item.description && (
                          <p className="text-[11px] text-[#A1A1AA] font-light mt-1.5 leading-relaxed line-clamp-3">
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
                          <div className="w-16 h-16 rounded overflow-hidden border border-[#27272A]">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ) : null}

                        {onInitiateAdd && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onInitiateAdd(item); }}
                            className="bg-[#18181B] hover:bg-[#D4AF37] text-[#A1A1AA] hover:text-black border border-[#27272A] hover:border-[#D4AF37] text-[10px] font-mono uppercase font-bold tracking-wider px-3 py-1.5 transition-all flex items-center space-x-1"
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
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
