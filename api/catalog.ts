import * as sq from 'square';

let client: any = null;

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=3600');

  try {
    if (!client) {
      // @ts-ignore
      const ClientConstructor = sq.Client || sq.default?.Client || sq.SquareClient;
      // @ts-ignore
      const Env = sq.SquareEnvironment || sq.default?.SquareEnvironment || sq.Environment;

      if (!ClientConstructor) throw new Error('Square Client constructor not found in square package exports');

      const token = process.env.SQUARE_ACCESS_TOKEN || 'EAAAlwWfgbI1rjM-gIHF3gm0-TOaFCoWxq17RDSZl_ulLRRFecCRAIEjSkz8wjDa';

      client = new ClientConstructor({
        token,
        accessToken: token,
        bearerAuthCredentials: {
          accessToken: token
        },
        environment: Env?.Production || 'Production'
      });
    }

    if (!client) throw new Error('Square Client failed to initialize');
    
    const response = await client.catalog.search({
      objectTypes: ['ITEM', 'CATEGORY'],
      includeDeletedObjects: false,
      includeRelatedObjects: false
    });

    const objects = response.objects || [];
    
    // Map Square Category IDs to their Names
    const categoryMap = new Map();
    objects.forEach((obj: any) => {
      if (obj.type === 'CATEGORY' && obj.categoryData?.name) {
        categoryMap.set(obj.id, obj.categoryData.name);
      }
    });

    const items = objects.filter((obj: any) => obj.type === 'ITEM');

    const formattedMenu = items.map((item: any) => {
      const itemData = item.itemData;
      let minPrice = Infinity;
      let maxPrice = -Infinity;
      
      const variations = itemData?.variations?.map((v: any) => {
        const price = (v.itemVariationData?.priceMoney?.amount || 0) / 100;
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
        return {
          id: v.id,
          name: v.itemVariationData?.name || '',
          price
        };
      }) || [];

      let priceDisplay = '';
      if (minPrice === maxPrice && minPrice !== Infinity) {
        priceDisplay = `$${minPrice.toFixed(2)}`;
      } else if (minPrice !== Infinity && maxPrice !== -Infinity) {
        priceDisplay = `$${minPrice.toFixed(2)}  /  $${maxPrice.toFixed(2)}`;
      } else {
        priceDisplay = 'Price not available';
      }

      const optionsStr = variations.length > 0
        ? `Options: ${variations.map((v: any) => `${v.name} ($${v.price.toFixed(2)})`).join(', ')}`
        : '';

      const categoryName = itemData?.categoryId ? categoryMap.get(itemData.categoryId) || 'Other' : 'Other';

      return {
        id: item.id,
        name: itemData?.name || 'Unknown Item',
        category: categoryName,
        priceDisplay,
        price: minPrice !== Infinity ? minPrice : 0,
        description: itemData?.description || '',
        options: optionsStr,
        variations: variations,
        isPopular: false
      };
    });

    res.status(200).json(formattedMenu);

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ 
      error: 'Failed to fetch catalog',
      details: error?.message || String(error),
      stack: error?.stack || null
    });
  }
}
