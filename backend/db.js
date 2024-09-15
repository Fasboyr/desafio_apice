import mysql from "mysql"

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "desafio2024",
    database: "bd_desafio_apice"
})