"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: "postgres",
    host: "localhost",
    database: "db_react",
    password: "postgres",
    port: 5432,
});
pool.connect()
    .then(() => console.log("Conected to PostgreSQL"))
    .catch((err) => console.log("Connection error", err));
//# sourceMappingURL=db.js.map