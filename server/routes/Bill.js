const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await pool.query(
      `SELECT type, doctor.consultation_fee fee
       FROM appointment
       JOIN doctor ON appointment.doctor_id = doctor.doctor_id
       WHERE appointment_id = $1`,
      [id]
    );
    console.log(bill.rows);
    return res.json(bill.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
