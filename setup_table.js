export default async function setup(client) {
  let createProjectsTableQuery = `
    CREATE TABLE IF NOT EXISTS projects(
      id BIGSERIAL PRIMARY KEY NOT NULL ,
      name varchar,
      tagline varchar,
      description varchar,
      last_updated TIMESTAMP NOT NULL DEFAULT current_timestamp,
      image_filename varchar
    );
    `;
  let createEducationAndWorkTableQuery = `
    CREATE TABLE IF NOT EXISTS education(
      id BIGSERIAL PRIMARY KEY NOT NULL ,
      school VARCHAR NOT NULL,
      course VARCHAR NOT NULL,
      start_date DATE,
      end_date DATE
    );
    CREATE TABLE IF NOT EXISTS employment(
      id BIGSERIAL PRIMARY KEY NOT NULL ,
      employer VARCHAR NOT NULL,
      job_title VARCHAR NOT NULL,
      start_date DATE,
      end_date DATE
    );
  `;
  await client.query(createProjectsTableQuery);
  await client.query(createEducationAndWorkTableQuery);
  console.log(`Created tables.`);
  await client.end();
}
