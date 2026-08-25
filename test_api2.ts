import { Client, Environment } from 'square';

const client = new Client({
  accessToken: 'EAAAlwWfgbI1rjM-gIHF3gm0-TOaFCoWxq17RDSZl_ulLRRFecCRAIEjSkz8wjDa',
  environment: Environment.Production
});

async function run() {
  try {
    const response = await client.catalogApi.searchCatalogObjects({
      objectTypes: ['ITEM', 'CATEGORY']
    });
    console.log('Objects:', response.result.objects?.length);
  } catch(e) {
    console.error(e);
  }
}
run();
