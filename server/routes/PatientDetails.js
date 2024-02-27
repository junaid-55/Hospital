const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/bed_selection/bed_type", authorization, async (req, res) => {
  try {
    console.log("request coming from /bed_selection/bed_type");
    const bed_type = await pool.query("SELECT bed_type type FROM bed_type");
    console.log(bed_type.rows);
    return res.json(bed_type.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;