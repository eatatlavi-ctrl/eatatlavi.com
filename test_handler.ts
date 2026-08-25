import handler from './api/catalog.ts';

async function run() {
  const req = {};
  const res = {
    setHeader: (k,v) => console.log('SetHeader:', k, v),
    status: (code) => {
      console.log('Status:', code);
      return {
        json: (data) => console.log('JSON returned with length:', data.length)
      };
    }
  };
  await handler(req, res);
}
run();
