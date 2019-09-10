const database = require('../database');

exports.getCitiesName = async (req, res) => {
  const results = await database.getAllCitiesName();
  if (results.length === 0) {
    res.status(404).json('NOT FOUND');
  }
  const cities = results.map(row => {
    let city = { name: row.adm1_name, id: row.id, lat: row.lat, lng: row.lng };
    return city;
  });
  res.status(200).send({ status: 'success', cities });
};
