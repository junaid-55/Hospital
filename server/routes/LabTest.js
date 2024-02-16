const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");


router.get("", authorization, async (req, res) => {
    try {
        console.log("request coming from /tests");
      const { "request-type": request_type } = req.headers;
      if (request_type === "all_test") {
        const tests = await pool.query("SELECT name,type,price FROM test");
        return res.json(tests.rows);
      }
      console.log(tests.rows);
      return res.status(500).send("My fault");
    } catch (err) {
      console.log(err.message);
    }
  });
  

  module.exports = router;