const Pool = require("pg").Pool;


const pool = new Pool({
    user : "postgres",
    password:"Jjjshmr1.",
    host : "localhost",
    port : 5432,
    database: "hospital"
})

module.exports = pool