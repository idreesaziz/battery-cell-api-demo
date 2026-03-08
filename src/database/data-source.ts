import { DataSource } from "typeorm";
import { BatteryCell } from "../entities/BatteryCell";
import { env } from "../config/env";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: env.db.synchronize,
  logging: env.db.logging,
  entities: [BatteryCell],
});
