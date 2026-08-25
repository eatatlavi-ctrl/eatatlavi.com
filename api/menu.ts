// @ts-nocheck
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SquareClient, SquareEnvironment } from 'square';

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment:
    process.env.SQUARE_ACCESS_TOKEN?.startsWith('sandbox')
      ? SquareEnvironment.Sandbox
      : SquareEnvironment.Production,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const page = await client.catalog.list({ types: 'ITEM,CATEGORY,ITEM_OPTION' });
    const data = page.data || [];

    const categoriesMap: { [key: string]: string } = {};
    data.filter((o) => o.type === 'CATEGORY').forEach((c) => {
      categoriesMap[c.id] = c.categoryData?.name || 'Uncategorized';
    });

    const items = data.filter((o) => o.type === 'ITEM').map((i) => {
      const isAbsentAtLocation = i.absentAtLocationIds?.includes(process.env.SQUARE_LOCATION_ID || '');
      return {
        id: i.id,
        name: i.itemData?.name,
        category: categoriesMap[i.itemData?.categoryId || ''] || 'Uncategorized',
        isSoldOut: isAbsentAtLocation || false,
        variations: i.itemData?.variations?.map((v) => ({
          id: v.id,
          name: v.itemVariationData?.name,
          price: v.itemVariationData?.priceMoney?.amount
            ? Number(v.itemVariationData.priceMoney.amount) / 100
            : 0,
        })),
      };
    });

    return res.status(200).json({ items });
  } catch (err: any) {
    console.error('Error fetching live Square inventory:', err);
    return res.status(500).json({ error: 'Failed to fetch inventory' });
  }
}
