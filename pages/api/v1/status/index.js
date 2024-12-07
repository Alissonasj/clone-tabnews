import database from "infra/database.js";

/*
  Objeto Status Server
  
  updated_at: '',
  dependencies: {
    database: {
      status: '',
      max_connection: '',
      opned_connections: '',
      latency: '',
      version: ''
    },
    webserver: ''
  }
*/

export default async function status(request, response) {
  // const resultDbStatus = await database.query(`SELECT json_build_object(
  //   'version', version(),
  //   'max_connections', current_setting('max_connections')::INTEGER,
  //   'current_connections', (SELECT COUNT(*) FROM pg_stat_activity)
  //   ) AS db_status`);

  const dbVersionResult = await database.query("SHOW server_version;");
  const dbVersionValue = dbVersionResult.rows[0].server_version;

  const dbMaxConnectionResult = await database.query("SHOW max_connections;");
  const dbMaxConnectionValue = dbMaxConnectionResult.rows[0].max_connections;

  const dbCurrentConnectionsResult = await database.query(
    "SELECT count(*)::int FROM pg_stat_activity WHERE datname = 'local_db';",
  );
  const dbCurrentConnectionsValue = dbCurrentConnectionsResult.rows[0].count;
  console.log(dbCurrentConnectionsValue);

  const updatedAt = new Date().toISOString();

  const statusServer = {
    updated_at: updatedAt,
    dependencies: {
      database: {
        status: "",
        max_connections: parseInt(dbMaxConnectionValue),
        opned_connections: dbCurrentConnectionsValue,
        latency: "",
        version: dbVersionValue,
      },
      webserver: "",
    },
  };

  response.status(200).json(statusServer);
}
