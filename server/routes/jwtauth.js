const router = require("express").Router();
const pool = require("../db");
const jwtGenerator = require("../utils/jwtgenerator");
const authorization = require("../middleware/authorization");
const info_validation = require("../middleware/info_validation");

router.post("/register", info_validation, async (req, res) => {
  try {
    console.log("request coming from auth/register");
    const { name, email, password, user_type } = req.body;
    console.log(user_type, name, email);
    let exist_user;
    let user;
    if (user_type === "doctor") {
      exist_user = await pool.query(
        "SELECT * FROM doctor WHERE name = $1 AND gmail = $2",
        [name, email]
      );
      if (exist_user.rows.length === 0) {
        user = await pool.query(
          "INSERT INTO doctor (name,gmail,password) VALUES ($1,$2,$3) RETURNING *",
          [name, email, password]
        );
      } else return res.status(401);
    } else if (user_type === "patient") {
      exist_user = await pool.query(
        "SELECT * FROM person WHERE name = $1 AND gmail = $2",
        [name, email]
      );
      console.log("details");
      console.log(exist_user.rows);
      if (exist_user.rows.length === 0) {
        user = await pool.query(
          "INSERT INTO person (name,gmail,password) VALUES ($1,$2,$3) RETURNING *",
          [name, email, password]
        );
      } else return res.status(401);
    }

    if (user.rows.length === 0) return res.status(401).send(user.rows);
    const token = jwtGenerator(user.rows[0].person_id);
    return res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.post("/login", info_validation, async (req, res) => {
  try {
    console.log("request coming from auth/login");
    const { name, email, password, user_type } = req.body;
    let user;
    if (user_type === "Doctor") {
      user = await pool.query("SELECT * FROM doctor where name = ( $1 )", [
        name,
      ]);
    } else if (user_type === "Patient") {
      user = await pool.query("SELECT * FROM person where name = ( $1 )", [
        name,
      ]);

      if (user.rows.length === 0) return res.status(401).send(user.rows);
      const token = jwtGenerator(user.rows[0].person_id);
      return res.status(200).json({ token });
    }
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
    const user = await pool.query(
      "SELECT name,department_title,experience,schedule,consultation_fee FROM doctor JOIN department USING(department_id)"
    );
    console.log(user.rows[0]);
    return res.json(user.rows);
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/doctors", async (req, res) => {
  try {
    const { "request-type": type } = req.headers;
    if (type && type === "search") {
      const { name } = req.body;
      const user = await pool.query(
        "SELECT * FROM person WHERE UPPER(name) LIKE $1 ORDER BY name",
        [`%${name.toUpperCase()}%`]
      );
      return res.json(user.rows);
    }

    return res.status(500).send("Your fault");
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
