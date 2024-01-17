const router = require("express").Router();
const pool = require("../db");

router.get("", async (req, res) => {
    try {
      console.log('request coming');
      const user = await pool.query("SELECT * FROM person");
      return res.json(user.rows);
    } catch (err) {
      console.log(err.message);
    }
  });
  
  router.post("", async (req, res) => {
    try {
      const { 'request-type': type } = req.headers;
      if (type && type === 'search') {
        const {name} = req.body;
        const user = await pool.query("SELECT * FROM person WHERE UPPER(name) LIKE $1 ORDER BY name", [`%${name.toUpperCase()}%`]);
        return res.json(user.rows);
      }
  
      return res.status(500).send('Your fault');
    } catch (err) {
      console.log(err.message);
    }
  });

  module.exports = router;
