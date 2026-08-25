import React, { useState, useEffect } from 'react';
import { X, Check, ShoppingBag } from 'lucide-react';
import type { EditorialMenuItem } from '../types';

interface ItemCustomizeModalProps {
  item: EditorialMenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAdd: (name: string, price: number, optionsSummary: string) => void;
}

const RICE_OPTIONS = [
  'White Rice',
  'Yellow Rice',
  'Rice & Peas',
  'Jollof Rice'
];

const SIDE_OPTIONS = [
  '7-Cheese Mac & Cheese',
  'Candied Yams',
  'Southern Collard Greens',
  'Steamed Island Cabbage',
  'Sweet Fried Plantains',
  'Sweet Butter Corn',
  'Seasoned Green Beans',
  'Creamy Mashed Potatoes',
  'Homestyle Potato Salad',
  'Seasoned French Fries',
  'Honey Butter Corn Bread'
];

const WING_FLAVORS = [
  'Lemon Pepper',
  'Garlic Parmesan',
  'Buffalo',
  'Sweet Chili',
  'Honey Garlic',
  'BuffaQue',
  'BBQ'
];

const EMPANADA_FLAVORS = [
  'Beef',
  'Chicken',
  'Curry Chicken',
  'Jerk Chicken',
  'Apple Cinnamon'
];

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmAdd,
}) => {
  if (!isOpen || !item) return null;

  // Determine item features
  const isEntree = item.category === 'Entrees' || item.name.toLowerCase().includes('oxtail') || item.name.toLowerCase().includes('ribs') || item.name.toLowerCase().includes('chicken');
  const isWing = item.category === 'Wings' || item.name.toLowerCase().includes('wing');
  const isEmpanada = item.category === 'Empanadas & Patties' || item.name.toLowerCase().includes('empanada');

  // Variations (Sizes)
  const hasMultipleSizes = item.options?.includes('Medium') || item.options?.includes('Large');
  
  // State
  const [selectedSize, setSelectedSize] = useState<'Medium' | 'Large'>('Medium');
  const [selectedRice, setSelectedRice] = useState<string>(RICE_OPTIONS[0]);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');

  // Calculate dynamic price based on size
  let basePrice = item.price;
  if (hasMultipleSizes) {
    if (item.name.toLowerCase().includes('oxtail')) {
      basePrice = selectedSize === 'Medium' ? 20.99 : 31.99;
    } else if (item.name.toLowerCase().includes('rib') || item.name.toLowerCase().includes('meatloaf') || item.name.toLowerCase().includes('turkey wing')) {
      basePrice = selectedSize === 'Medium' ? 15.99 : 21.99;
    } else {
      basePrice = selectedSize === 'Medium' ? 8.99 : 13.99;
    }
  }

  // Reset state when modal opens
  useEffect(() => {
    setSelectedSize('Medium');
    setSelectedRice(RICE_OPTIONS[0]);
    setSelectedSides([]);
    setSelectedFlavor(isWing ? WING_FLAVORS[0] : isEmpanada ? EMPANADA_FLAVORS[0] : '');
  }, [item, isWing, isEmpanada]);

  const toggleSide = (sideName: string) => {
    if (selectedSides.includes(sideName)) {
      setSelectedSides(selectedSides.filter((s) => s !== sideName));
    } else {
      if (selectedSize === 'Medium' && selectedSides.length >= 1) {
        setSelectedSides([sideName]); // replaces single side for medium
      } else if (selectedSize === 'Large' && selectedSides.length >= 2) {
        setSelectedSides([selectedSides[1], sideName]); // keeps max 2 for large
      } else {
        setSelectedSides([...selectedSides, sideName]);
      }
    }
  };

  const handleAddToCart = () => {
    const optionParts: string[] = [];

    if (hasMultipleSizes) {
      optionParts.push(`Size: ${selectedSize}`);
    }
    if (isEntree) {
      optionParts.push(`Rice: ${selectedRice}`);
    }
    if (selectedSides.length > 0) {
      optionParts.push(`Sides: ${selectedSides.join(', ')}`);
    }
    if (selectedFlavor) {
      optionParts.push(`Flavor: ${selectedFlavor}`);
    }

    const optionsSummary = optionParts.join(' · ');
    onConfirmAdd(item.name, basePrice, optionsSummary);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-lg bg-[#09090B] border border-[#27272A] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] shrink-0">
          <div>
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-[#D4AF37]">
              Customize Your Dish
            </span>
            <h3 className="font-serif text-xl font-light text-white uppercase tracking-wide">
              {item.name}
            </h3>
          </div>
          <button onClick={onClose} className="text-[#A1A1AA] hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* 1. SIZE SELECTION (IF APPLICABLE) */}
          {hasMultipleSizes && (
            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-[0.25em] uppercase text-[#A1A1AA]">
                1. Select Portion Size *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedSize('Medium')}
                  className={`p-3 border text-left transition-all ${
                    selectedSize === 'Medium'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white'
                      : 'border-[#27272A] text-[#A1A1AA] hover:border-white'
                  }`}
                >
                  <span className="block text-xs font-mono font-bold text-white uppercase">Medium Plate</span>
                  <span className="block text-[11px] text-[#D4AF37] mt-0.5 font-mono">
                    ${item.name.toLowerCase().includes('oxtail') ? '20.99' : '8.99'}
                  </span>
                  <span className="block text-[10px] text-[#A1A1AA] mt-1 font-sans">
                    Includes 1 Meat + Flavored Rice
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSize('Large')}
                  className={`p-3 border text-left transition-all ${
                    selectedSize === 'Large'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white'
                      : 'border-[#27272A] text-[#A1A1AA] hover:border-white'
                  }`}
                >
                  <span className="block text-xs font-mono font-bold text-white uppercase">Large Combo Plate</span>
                  <span className="block text-[11px] text-[#D4AF37] mt-0.5 font-mono">
                    ${item.name.toLowerCase().includes('oxtail') ? '31.99' : '13.99'}
                  </span>
                  <span className="block text-[10px] text-[#A1A1AA] mt-1 font-sans">
                    Includes 1 Meat + Rice + 2 Sides
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* 2. RICE SELECTION (FOR ENTREES) */}
          {isEntree && (
            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-[0.25em] uppercase text-[#A1A1AA]">
                {hasMultipleSizes ? '2.' : '1.'} Select Flavored Rice * (Choose 1)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {RICE_OPTIONS.map((rice) => (
                  <button
                    key={rice}
                    type="button"
                    onClick={() => setSelectedRice(rice)}
                    className={`p-3 text-xs font-mono uppercase tracking-wider text-left border flex items-center justify-between transition-all ${
                      selectedRice === rice
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] font-bold'
                        : 'border-[#27272A] text-[#A1A1AA] hover:border-white hover:text-white'
                    }`}
                  >
                    <span>{rice}</span>
                    {selectedRice === rice && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. SIDES SELECTION (FOR LARGE COMBOS & ENTREE PLATTERS) */}
          {isEntree && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-mono tracking-[0.25em] uppercase text-[#A1A1AA]">
                  {hasMultipleSizes ? '3.' : '2.'} Select Sides {selectedSize === 'Large' ? '(Choose up to 2)' : '(Optional Side Add-on)'}
                </label>
                <span className="text-[10px] font-mono text-[#D4AF37]">
                  {selectedSides.length} / {selectedSize === 'Large' ? '2' : '1'} selected
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SIDE_OPTIONS.map((side) => {
                  const isChecked = selectedSides.includes(side);
                  return (
                    <button
                      key={side}
                      type="button"
                      onClick={() => toggleSide(side)}
                      className={`p-2.5 text-xs font-mono text-left border flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white font-bold'
                          : 'border-[#27272A] text-[#A1A1AA] hover:border-white hover:text-white'
                      }`}
                    >
                      <span className="truncate pr-2">{side}</span>
                      <div className={`w-4 h-4 rounded-sm border shrink-0 flex items-center justify-center ${isChecked ? 'border-[#D4AF37] bg-[#D4AF37] text-black' : 'border-[#3F3F46]'}`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. FLAVOR SELECTION (FOR WINGS & EMPANADAS) */}
          {(isWing || isEmpanada) && (
            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-[0.25em] uppercase text-[#A1A1AA]">
                Select Flavor / Sauce Option *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(isWing ? WING_FLAVORS : EMPANADA_FLAVORS).map((flv) => (
                  <button
                    key={flv}
                    type="button"
                    onClick={() => setSelectedFlavor(flv)}
                    className={`p-3 text-xs font-mono uppercase tracking-wider text-left border flex items-center justify-between transition-all ${
                      selectedFlavor === flv
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] font-bold'
                        : 'border-[#27272A] text-[#A1A1AA] hover:border-white hover:text-white'
                    }`}
                  >
                    <span>{flv}</span>
                    {selectedFlavor === flv && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* FOOTER CONFIRM */}
        <div className="px-6 py-4 border-t border-[#27272A] shrink-0 bg-black flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#A1A1AA] uppercase block">Total Price</span>
            <span className="font-mono text-lg text-[#D4AF37] font-bold">${basePrice.toFixed(2)}</span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#B38F24] hover:brightness-110 text-black font-bold text-xs tracking-[0.2em] uppercase px-6 py-3 shadow-lg flex items-center space-x-2 transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-black" />
            <span>Add to Order · ${basePrice.toFixed(2)}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
