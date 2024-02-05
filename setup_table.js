export default async function setup(client) {
  let createTableQuery = `
    CREATE TABLE IF NOT EXISTS projects(
      id BIGSERIAL PRIMARY KEY NOT NULL ,
      name varchar,
      tagline varchar,
      description varchar,
      last_updated TIMESTAMP NOT NULL DEFAULT current_timestamp,
      image_filename varchar
    );
  `;
  const res = await client.query(createTableQuery);
  console.log(`Created table.`);
  await client.end();
}
