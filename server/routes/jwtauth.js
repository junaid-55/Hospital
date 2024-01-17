const router = require("express").Router();
const pool = require("../db");
const jwtGenerator = require("../utils/jwtgenerator");
const authorization = require("../middleware/authorization");
const info_validation = require("../middleware/info_validation");

router.post("/register", info_validation, async (req, res) => {
  try {
    const { name,email,password } = req.body;
    const user = await pool.query("SELECT * FROM person where name = ( $1 )", [
      name,
    ]);
    
    if (user.rows.length !== 0) return res.status(401).send(user.rows);

    const newUser = await pool.query(
      "INSERT INTO person (name,email,password) VALUES ($1,$2,$3) RETURNING *",
      [name,email,password]
    );

    const token = jwtGenerator(newUser.rows[0].id);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.post("/login", info_validation, async (req, res) => {
  try {
    const { name,email,password } = req.body;
    const user = await pool.query("SELECT * FROM person where name = ( $1 )", [
      name,
    ]);

    if (user.rows.length === 0) return res.status(401).send(user.rows);

    const token = jwtGenerator(user.rows[0].id);
    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});
router.get("/is-verify", authorization, async (req, res) => {
  try {
    return res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.get("/doctors", async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM person");
    return res.json(user.rows);
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/doctors", async (req, res) => {
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
