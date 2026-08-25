import { SquareClient, SquareEnvironment } from 'square';

const client = new SquareClient({
  token: 'EAAAlwWfgbI1rjM-gIHF3gm0-TOaFCoWxq17RDSZl_ulLRRFecCRAIEjSkz8wjDa',
  environment: SquareEnvironment.Production
});

async function run() {
  try {
    const response = await client.catalogApi.searchCatalogObjects({
      objectTypes: ['ITEM', 'CATEGORY'],
      includeDeletedObjects: false,
      includeRelatedObjects: false
    });
    console.log('Objects:', response.result.objects?.length);
  } catch(e) {
    console.error(e);
  }
}
run();
