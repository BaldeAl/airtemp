// test-mongo.js
const { MongoClient } = require('mongodb');
(async ()=>{
  const client = new MongoClient(process.env.DATABASE_URL);
  try { await client.connect(); console.log('OK'); } catch(e){ console.error(e); } finally{ await client.close(); }
})();
