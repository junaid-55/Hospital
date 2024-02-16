const router = require("express").Router();
const pool = require("../db");
const jwtGenerator = require("../utils/jwtgenerator");
const authorization = require("../middleware/authorization");
const info_validation = require("../middleware/info_validation");

router.post("/register", info_validation, async (req, res) => {
  try {
    console.log("request coming from auth/register");
    const { firstName,lastName, email, password,contact, user_type } = req.body;
    console.log(user_type, firstName, email);
    let exist_user;
    let user;
    if (user_type === "doctor") {
      // exist_user = await pool.query(
      //   "SELECT * FROM doctor WHERE name = $1 AND emailmail = $2",
      //   [firstName, email]
      // );
      // if (exist_user.rows.length === 0) {
      //   user = await pool.query(
      //     "INSERT INTO doctor (name,gmail,password) VALUES ($1,$2,$3) RETURNING *",
      //     [name, email, password]
      //   );
      // } else return res.status(401);
    } else if (user_type === "patient") {
      exist_user = await pool.query(
        "SELECT * FROM patient WHERE email = $1",
        [email]
      );
      console.log("details");
      console.log(exist_user.rows);
      if (exist_user.rows.length === 0) {
        user = await pool.query(
          "INSERT INTO patient (first_name,last_name,email,contact_no,password) VALUES ($1,$2,$3,$4,$5) RETURNING *",
          [firstName,lastName, email,contact, password]
        );
      } else return res.status(401);
    }

    if (user.rows.length === 0) return res.status(401).send(user.rows);
    const token = jwtGenerator(user.rows[0].patient_id);
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.post("/login", info_validation, async (req, res) => {
  try {
    console.log("request coming from auth/login");
    const { firstName, email, password, user_type } = req.body;
    let user;
    if (user_type === "Doctor") {
      user = await pool.query("SELECT * FROM doctor where first_name = ( $1 )", [
        firstName,
      ]);
    } else if (user_type === "Patient") {
      user = await pool.query("SELECT * FROM patient where email = ( $1 )", [
        email,
      ]);

      if (user.rows.length === 0) return res.status(401).send(user.rows);
      const token = jwtGenerator(user.rows[0].patient_id);
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
      "SELECT first_name,department_title,experience,schedule,consultation_fee FROM doctor JOIN department USING(department_id)"
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
        "SELECT * FROM patient WHERE UPPER(first_name) LIKE $1 ORDER BY first_name",
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
