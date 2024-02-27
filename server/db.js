const Pool = require("pg").Pool;


const pool = new Pool({
    user : "postgres",
    password:"8053Meza",
    host : "localhost",
    port : 5432,
    database: "hospitalproject"
})

module.exports = pool