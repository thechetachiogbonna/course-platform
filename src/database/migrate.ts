import "dotenv/config";
import { Pool } from "pg";
import fs from "fs/promises";
import path from "path";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Add it to .env before running migrations.");
}

const pool = new Pool({
  connectionString: databaseUrl,
});

async function runMigrations() {
  const client = await pool.connect();

  try {
    // Get all migration files
    const migrationsDir = path.join(
      process.cwd(),
      "src",
      "database",
      "migrations"
    );

    const files = await fs.readdir(migrationsDir);

    const migrationFiles = files
      .filter((file) => file.endsWith(".sql"))
      .sort();

    // Get already executed migrations
    const executedResult = await client.query(
      "SELECT name FROM migrations"
    );

    const executed = new Set(
      executedResult.rows.map((row) => row.name)
    );

    // Run pending migrations
    for (const file of migrationFiles) {
      if (executed.has(file)) {
        continue;
      }

      console.log(`Running ${file}`);

      const sql = await fs.readFile(
        path.join(migrationsDir, file),
        "utf8"
      );

      await client.query("BEGIN");

      try {
        await client.query(sql);

        await client.query(
          `
          INSERT INTO migrations(name)
          VALUES($1)
          `,
          [file]
        );

        await client.query("COMMIT");

        console.log(`✓ ${file}`);
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
    }

    console.log("All migrations completed");
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch(console.error);