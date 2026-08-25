import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { EditorialMenuItem } from '../types';

interface ItemCustomizeModalProps {
  item: EditorialMenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAdd: (name: string, price: number, optionsSummary: string) => void;
}

export interface RiceOption {
  id: string;
  name: string;
  price: number;
  isSoldOut?: boolean;
}

const RICE_OPTIONS: RiceOption[] = [
  { id: 'rice-peas', name: 'Rice & Peas', price: 0 },
  { id: 'yellow-rice', name: 'Yellow Rice', price: 0, isSoldOut: true }, // Sold out example matching screenshot
  { id: 'white-rice', name: 'White Rice', price: 0 },
  { id: 'rice-beans', name: 'Rice & Beans', price: 0 },
  { id: 'no-rice', name: 'No Rice', price: 0 },
  { id: 'soul-bowl', name: 'Soul Bowl', price: 7.99 },
  { id: 'make-salad', name: 'Make It A Salad', price: 8.99 },
  { id: 'rasta-pasta', name: 'Rasta Pasta', price: 9.99 },
];

const EXTRA_SIDES = [
  { id: 'side-mac', name: 'Mac & Cheese', price: 4.99 },
  { id: 'side-yams', name: 'Yams', price: 4.99 },
  { id: 'side-collard', name: 'Collard Greens', price: 4.99 },
  { id: 'side-pudding', name: 'Banana Pudding', price: 4.99 },
  { id: 'side-cabbage', name: 'Cabbage', price: 4.99 },
  { id: 'side-cornbread', name: 'Honey Butter Corn Bread', price: 4.99 },
];

const RECOMMENDED_UPSELLS = [
  { id: 'up-curry-emp', name: 'Curry Chicken Empanada', price: 2.49 },
  { id: 'up-jerk-emp', name: 'Jerk Chicken Empanada', price: 2.49 },
  { id: 'up-apple-emp', name: 'Apple Pie Empanada', price: 2.49 },
  { id: 'up-can-drink', name: 'Can Drink', price: 1.49 },
  { id: 'up-kool-aid', name: 'Kool Aid', price: 2.49 },
  { id: 'up-lemonade', name: 'Fresh Squeezed Lemonade Large', price: 7.99 },
];

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmAdd,
}) => {
  if (!isOpen || !item) return null;

  const isEntree = item.category === 'Entrees';
  const variations = item.variations && item.variations.length > 1 ? item.variations : [];
  const hasMultipleSizes = variations.length > 0;

  // State
  const [selectedVariation, setSelectedVariation] = useState<string>('');
  const [selectedRice, setSelectedRice] = useState<string>('Rice & Peas');
  const [extraSides, setExtraSides] = useState<{ [key: string]: number }>({});
  const [upsells, setUpsells] = useState<{ [key: string]: number }>({});
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  useEffect(() => {
    setSelectedVariation(item.variations && item.variations.length > 1 ? item.variations[0].name : '');
    // Default to first available (non-soldout) rice option
    const firstAvailable = RICE_OPTIONS.find(r => !r.isSoldOut)?.name || 'Rice & Peas';
    setSelectedRice(firstAvailable);
    setExtraSides({});
    setUpsells({});
    setSpecialInstructions('');
  }, [item]);

  // Price calculations
  let basePrice = item.price;
  if (hasMultipleSizes) {
    const selectedVarObj = variations.find((v) => v.name === selectedVariation);
    basePrice = selectedVarObj ? selectedVarObj.price : item.price;
  }

  const selectedRiceObj = RICE_OPTIONS.find((r) => r.name === selectedRice);
  const ricePrice = selectedRiceObj?.price || 0;

  const extraSidesTotal = Object.entries(extraSides).reduce((sum, [id, qty]) => {
    const side = EXTRA_SIDES.find((s) => s.id === id);
    return sum + (side?.price || 0) * qty;
  }, 0);

  const upsellsTotal = Object.entries(upsells).reduce((sum, [id, qty]) => {
    const up = RECOMMENDED_UPSELLS.find((u) => u.id === id);
    return sum + (up?.price || 0) * qty;
  }, 0);

  const totalPrice = basePrice + ricePrice + extraSidesTotal + upsellsTotal;

  // Validation
  const isVariationSelected = !hasMultipleSizes || !!selectedVariation;
  const isRiceSelected = !isEntree || !!selectedRice;
  const isFormValid = isVariationSelected && isRiceSelected;

  const requiredCountNeeded = (hasMultipleSizes && !selectedVariation ? 1 : 0) + (isEntree && !selectedRice ? 1 : 0);

  const toggleQty = (setMap: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>, id: string, delta: number) => {
    setMap((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleAddToCart = () => {
    if (!isFormValid) return;

    const parts: string[] = [];
    if (hasMultipleSizes) parts.push(`Size: ${selectedVariation}`);
    if (isEntree) parts.push(`Rice: ${selectedRice}`);

    const sidesList = Object.entries(extraSides).map(([id, qty]) => {
      const s = EXTRA_SIDES.find((x) => x.id === id);
      return `${s?.name} x${qty}`;
    });
    if (sidesList.length > 0) parts.push(`Sides: ${sidesList.join(', ')}`);

    const upsellsList = Object.entries(upsells).map(([id, qty]) => {
      const u = RECOMMENDED_UPSELLS.find((x) => x.id === id);
      return `${u?.name} x${qty}`;
    });
    if (upsellsList.length > 0) parts.push(`Addons: ${upsellsList.join(', ')}`);

    if (specialInstructions.trim()) parts.push(`Note: "${specialInstructions.trim()}"`);

    onConfirmAdd(item.name, totalPrice, parts.join(' · '));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-lg bg-white text-black sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">

        {/* TOP HERO IMAGE OR CLOSE BUTTON */}
        <div className="relative">
          {item.image ? (
            <div className="h-48 w-full overflow-hidden relative bg-gray-100">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <button
                onClick={onClose}
                className="absolute top-3 left-3 bg-white/90 hover:bg-white text-black p-2 rounded-full shadow-md transition-all"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">

          {/* ITEM TITLE & DESCRIPTION */}
          {item.image && (
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900">{item.name}</h3>
              {item.description && (
                <p className="text-xs text-gray-600 font-normal mt-1 leading-relaxed">{item.description}</p>
              )}
            </div>
          )}

          {/* 1. VARIATION (REQUIRED · SELECT 1) */}
          {hasMultipleSizes && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-gray-900">Variation</h4>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Required · Select 1
                </span>
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-2">
                {variations.map((v) => {
                  const isSelected = selectedVariation === v.name;
                  return (
                    <label
                      key={v.name}
                      onClick={() => setSelectedVariation(v.name)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected ? 'border-red-600 bg-red-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-red-600 bg-red-600' : 'border-gray-300'}`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs font-semibold text-gray-900">{v.name}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-700">${v.price.toFixed(2)}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. RICE / BASE (MATCHING EXACT SCREENSHOT DROPDOWN / LIST FORMAT) */}
          {isEntree && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-gray-900">Rice Options</h4>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Required · Select 1
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">Live Inventory Synced</span>
              </div>

              {/* RICE DROPDOWN / RADIO SELECTOR */}
              <div className="space-y-1.5 border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                {RICE_OPTIONS.map((rice) => {
                  const isSelected = selectedRice === rice.name;
                  const isSoldOut = rice.isSoldOut;

                  return (
                    <button
                      key={rice.id}
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => !isSoldOut && setSelectedRice(rice.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                        isSoldOut
                          ? 'opacity-40 bg-gray-100 cursor-not-allowed text-gray-400 line-through'
                          : isSelected
                          ? 'bg-white border border-red-600 text-gray-900 shadow-sm font-semibold'
                          : 'hover:bg-white text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-red-600 bg-red-600' : 'border-gray-300'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className={`text-xs ${isSoldOut ? 'text-gray-400 font-normal' : 'font-medium'}`}>
                          {rice.name}
                        </span>
                        {isSoldOut && (
                          <span className="text-[10px] font-mono text-gray-500 font-bold bg-gray-200 px-1.5 py-0.5 rounded">
                            (Sold out)
                          </span>
                        )}
                      </div>

                      {rice.price > 0 ? (
                        <span className={`text-xs font-mono font-bold ${isSoldOut ? 'text-gray-400' : 'text-gray-700'}`}>
                          (+ ${rice.price.toFixed(2)})
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. ADD EXTRA SIDES */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div>
              <h4 className="text-sm font-bold text-gray-900">Add Extra Sides</h4>
              <span className="text-[11px] text-gray-500 font-normal">Optional · Select up to 5</span>
            </div>

            <div className="space-y-2">
              {EXTRA_SIDES.map((side) => {
                const qty = extraSides[side.id] || 0;
                return (
                  <div key={side.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200">
                    <div>
                      <span className="text-xs font-semibold text-gray-900 block">{side.name}</span>
                      <span className="text-xs font-bold text-gray-500">+${side.price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {qty > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => toggleQty(setExtraSides, side.id, -1)}
                            className="w-7 h-7 rounded-full border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-gray-900 w-4 text-center">{qty}</span>
                          <button
                            type="button"
                            onClick={() => toggleQty(setExtraSides, side.id, 1)}
                            className="w-7 h-7 rounded-full border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleQty(setExtraSides, side.id, 1)}
                          className="w-7 h-7 rounded-full border border-gray-300 text-gray-700 flex items-center justify-center hover:border-black hover:text-black"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. RECOMMENDED UPSELLS */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div>
              <h4 className="text-sm font-bold text-gray-900">Recommended Add-ons & Drinks</h4>
              <span className="text-[11px] text-gray-500 font-normal">Optional</span>
            </div>

            <div className="space-y-2">
              {RECOMMENDED_UPSELLS.map((up) => {
                const qty = upsells[up.id] || 0;
                return (
                  <div key={up.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200">
                    <div>
                      <span className="text-xs font-semibold text-gray-900 block">{up.name}</span>
                      <span className="text-xs font-bold text-gray-500">+${up.price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {qty > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => toggleQty(setUpsells, up.id, -1)}
                            className="w-7 h-7 rounded-full border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-gray-900 w-4 text-center">{qty}</span>
                          <button
                            type="button"
                            onClick={() => toggleQty(setUpsells, up.id, 1)}
                            className="w-7 h-7 rounded-full border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleQty(setUpsells, up.id, 1)}
                          className="w-7 h-7 rounded-full border border-gray-300 text-gray-700 flex items-center justify-center hover:border-black hover:text-black"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. SPECIAL INSTRUCTIONS (SENT TO SQUARE POS KITCHEN TICKET) */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-900">Special Instructions</h4>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra oxtail gravy, gravy on rice, no cutlery needed"
              className="w-full border border-gray-300 rounded-xl p-3 text-xs outline-none focus:border-red-600 font-sans transition-colors placeholder:text-gray-400"
            />
            <p className="text-[10px] text-gray-400">Special instructions are sent directly to the Square kitchen POS ticket.</p>
          </div>

        </div>

        {/* STICKY RED DOORDASH STYLE BOTTOM CTA BUTTON */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isFormValid}
            className="w-full bg-[#E51800] hover:bg-[#CC1400] text-white font-extrabold text-sm py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isFormValid ? (
              <span>Add to Order · ${totalPrice.toFixed(2)}</span>
            ) : (
              <span>Make {requiredCountNeeded} required {requiredCountNeeded === 1 ? 'selection' : 'selections'}</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
