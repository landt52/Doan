const { Pool, Client } = require('pg');
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PG_PORT
});

const client = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PG_PORT
});
client.connect();

module.exports = {
  getCityBoundaries: async () => {
    const boundaryQuery = `
        SELECT ST_AsGeoJSON(geom), id, adm1_name
        FROM public."vnProvinces"`;
    const result = await client.query(boundaryQuery);
    return result.rows;
  },

  getDistrictBoundaries: async (name) => {
    const boundaryQuery = `
	    	SELECT ST_AsGeoJSON(geom), id, adm2_name_
        FROM public."vnDistricts"
        WHERE lower(adm1_name_) ilike $1`;
    const result = await client.query(boundaryQuery, [name]);
    return result.rows;
  }
};
