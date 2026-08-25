const { SquareClient, SquareEnvironment } = require('square');

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN || 'EAAAlwWfgbI1rjM-gIHF3gm0-TOaFCoWxq17RDSZl_ulLRRFecCRAIEjSkz8wjDa',
  environment: SquareEnvironment.Production
});

async function run() {
  try {
    const response = await client.catalog.search({
      objectTypes: ['ITEM', 'CATEGORY'],
      includeDeletedObjects: false,
      includeRelatedObjects: false
    });
    console.log("Found", response.objects.length, "objects");
  } catch (e) {
    console.error(e);
  }
}
run();
