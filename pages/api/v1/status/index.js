import database from "infra/database.js";

export default async function status(request, response) {
  const resultDbStatus = await database.query(`SELECT json_build_object(
    'version', version(),
    'max_connections', current_setting('max_connections')::INTEGER,
    'current_connections', (SELECT COUNT(*) FROM pg_stat_activity)
    ) AS db_status`);

  const dbStatus = resultDbStatus.rows[0].db_status;

  const updatedAt = new Date().toISOString();

  response.status(200).json({ updated_at: updatedAt, db_status: dbStatus });
}
