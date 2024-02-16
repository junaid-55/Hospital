const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");


router.get("", authorization, async (req, res) => {
    try {
      const { "request-type": request_type } = req.headers;
      if (request_type === "all_surgery") {
        const surgery = await pool.query("SELECT name,type,price FROM surgery");
        return res.json(surgery.rows);
      }
  
      return res.status(500).send("My fault");
    } catch (err) {
      console.log(err.message);
    }
  });
  

  module.exports = router;