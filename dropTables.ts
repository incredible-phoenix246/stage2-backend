#!/usr/bin/env ts-node

import { sequelize } from "./src/models";

(async () => {
  try {
    await sequelize.getQueryInterface().dropAllTables();
    console.log("All tables dropped successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error dropping tables:", error);
    process.exit(1);
  }
})();

// "drop-tables": "ts-node ./dropTables.ts"
