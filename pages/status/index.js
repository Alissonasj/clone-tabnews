import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const data = await response.json();

  return data;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status Page</h1>
      <StatusServer />
    </>
  );
}

function StatusServer() {
  const { isLoading, data: status } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  const updatedAtText = new Date(status?.updated_at).toLocaleString("pt-BR");
  let statusServer = (
    <ul>
      <li>Carregando...</li>
    </ul>
  );

  if (!isLoading) {
    statusServer = (
      <ul>
        <li>Updated At: {updatedAtText}</li>
        <li>
          Max Connections: {status?.dependencies.database.max_connections}
        </li>
        <li>
          Opended Connections:
          {status?.dependencies.database.opened_connections}
        </li>
        <li>Database Version: {status?.dependencies.database.version}</li>
      </ul>
    );
  }

  return <>{statusServer}</>;
}
