require("dotenv").config();
import { Sequelize, DataTypes } from "sequelize";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  throw new Error("DATABASE_URL is not defined");
}
const sequelize = new Sequelize("cryptowallet", "", "", {
  dialect: "sqlite",
  storage: DB_URL,
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export { connectDB, sequelize, Sequelize, DataTypes };
