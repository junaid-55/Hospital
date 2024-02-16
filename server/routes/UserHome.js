const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("", authorization, async (req, res) => {
  try {
    console.log("request coming from /userhome/");
    const {
      headers: { "request-type": type },
    } = req;
    if (type && type === "user_info") {
      const id = req.user;
      const user = await pool.query(
        "SELECT first_name,email FROM patient WHERE patient_id = $1",
        [id]
      );
      return res.json(user.rows[0]);
    } else if (type && type === "all_doctors") {
      const user = await pool.query(
        "SELECT doctor_id, first_name,department_title,experience,schedule,consultation_fee FROM doctor JOIN department USING(department_id)"
      );
      return res.json(user.rows);
    }
  } catch (err) {
    console.log(err.message);
  }
});

router.post("", async (req, res) => {
  try {
    const { "request-type": type, criteria: criteria } = req.headers;
    if (type && type === "search") {
      let user;
      if (criteria === "Name") {
        console.log("here");
        const { name } = req.body;
        user = await pool.query(
          "SELECT doctor_id, first_name,department_title,experience,schedule,consultation_fee FROM doctor JOIN department USING(department_id) WHERE UPPER(first_name) LIKE $1 ",
          [`%${name.toUpperCase()}%`]
        );
      } else {
        const { name } = req.body;
        user = await pool.query(
          "SELECT doctor_id, first_name,department_title,experience,schedule,consultation_fee FROM doctor JOIN department USING(department_id) WHERE UPPER(department_title) LIKE $1 ",
          [`%${name.toUpperCase()}%`]
        );
      }

      return res.json(user.rows);
    }

    return res.status(500).send("Your fault");
  } catch (err) {
    console.log(err.message);
  }
});

// router.post("appointment", authorization, async(req, res) =>{
//   try{
//       const [doctor_id,  ]
//   }catch(err)
//   {
//     console.log(err.message);
//   }
// });

module.exports = router;
