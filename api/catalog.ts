import { SquareClient, SquareEnvironment } from 'square';
import { EDITORIAL_MENU } from '../src/data/menuData';

// We initialize the Square Client with the token securely in the backend
const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN || 'EAAAlwWfgbI1rjM-gIHF3gm0-TOaFCoWxq17RDSZl_ulLRRFecCRAIEjSkz8wjDa',
  environment: SquareEnvironment.Production
});

export default async function handler(req: any, res: any) {
  // Edge caching: Cache for 60 seconds, revalidate in background for up to 1 hour
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=3600');

  try {
    const response = await client.catalogApi.searchCatalogObjects({
      objectTypes: ['ITEM'],
      includeDeletedObjects: false,
      includeRelatedObjects: false
    });

    const items = response.result.objects || [];

    // Parse the Square items and merge with our rich editorial data
    const parsedCatalog = items.map((obj: any) => {
      const itemData = obj.itemData;
      const variations = itemData.variations || [];
      
      const parsedVariations = variations.map((v: any) => ({
        id: v.id,
        name: v.itemVariationData.name,
        price: v.itemVariationData.priceMoney?.amount ? Number(v.itemVariationData.priceMoney.amount) / 100 : 0
      }));

      const name = itemData.name;
      let priceDisplay = '';
      let basePrice = 0;

      if (parsedVariations.length === 1) {
        basePrice = parsedVariations[0].price;
        priceDisplay = `$${basePrice.toFixed(2)}`;
      } else if (parsedVariations.length > 1) {
        const sorted = [...parsedVariations].sort((a, b) => a.price - b.price);
        basePrice = sorted[0].price;
        priceDisplay = `$${sorted[0].price.toFixed(2)}  /  $${sorted[sorted.length - 1].price.toFixed(2)}`;
      }

      // 1. Look for this item in our existing rich menuData
      const existingMatch = EDITORIAL_MENU.find(e => e.name.toLowerCase() === name.toLowerCase());

      // 2. Determine category & description
      let category = 'Uncategorized';
      let description = itemData.description || '';
      let isPopular = false;
      let image = undefined;

      if (existingMatch) {
        category = existingMatch.category;
        description = existingMatch.description || description;
        isPopular = existingMatch.isPopular || false;
        image = existingMatch.image;
      } else {
        // AUTOCATEGORIZATION FOR FUTURE/NEW ITEMS (e.g., the 5 new beverages)
        const nameLower = name.toLowerCase();
        
        if (nameLower.includes('drink') || nameLower.includes('juice') || nameLower.includes('kool aid') || 
            nameLower.includes('lemonade') || nameLower.includes('water') || nameLower.includes('tea') || 
            nameLower.includes('soda') || nameLower.includes('coke') || nameLower.includes('sprite') || 
            nameLower.includes('d-n-g') || nameLower.includes('cola') || nameLower.includes('punch') || 
            nameLower.includes('bottle')) {
          category = 'Beverages';
        } else if (nameLower.includes('cake') || nameLower.includes('pudding') || nameLower.includes('dessert')) {
          category = 'Sweet Treats';
        } else if (nameLower.includes('empanada') || nameLower.includes('patty') || nameLower.includes('patties')) {
          category = 'Empanadas & Patties';
        } else if (nameLower.includes('taco') || nameLower.includes('burrito') || nameLower.includes('wrap')) {
          category = 'Tacos, Burritos & Wraps';
        } else if (nameLower.includes('burger') || nameLower.includes('sandwich') || nameLower.includes('hot dog')) {
          category = 'Burgers & Hot Dogs';
        } else if (nameLower.includes('wings') && !nameLower.includes('turkey')) {
          category = 'Wings';
        } else if (nameLower.includes('pan') || nameLower.includes('tray') || nameLower.includes('catering')) {
          category = 'Catering';
        } else if (nameLower.includes('side') || nameLower.includes('mac') || nameLower.includes('cheese') || 
                   nameLower.includes('rice') || nameLower.includes('cabbage') || nameLower.includes('plantain') || 
                   nameLower.includes('fries') || nameLower.includes('yams') || nameLower.includes('gravy')) {
          category = 'Sides';
        }
      }

      return {
        id: obj.id,
        name: name,
        category,
        priceDisplay,
        price: basePrice,
        description,
        variations: parsedVariations,
        isPopular,
        image
      };
    });

    // Only return items that have a category (filter out weird uncategorized backend items)
    const finalMenu = parsedCatalog.filter((i: any) => i.category !== 'Uncategorized');

    res.status(200).json(finalMenu);

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch catalog' });
  }
}
