\echo 'Delete and recreate jobly db?'
\prompt 'Press RETURN to confirm or CONTROL-C to cancel: ' confirm

-- Dropping and recreating the main Jobly database
DROP DATABASE IF EXISTS jobly;
CREATE DATABASE jobly;
\c jobly

\echo 'Setting up Jobly database schema and seeding data...'
\i jobly-schema.sql
\i jobly-seed.sql
\echo 'Main database setup complete.'

\echo 'Delete and recreate jobly_test db?'
\prompt 'Press RETURN to confirm or CONTROL-C to cancel: ' confirm_test

-- Dropping and recreating the Jobly test database
DROP DATABASE IF EXISTS jobly_test;
CREATE DATABASE jobly_test;
\c jobly_test

\echo 'Setting up Jobly test database schema...'
\i jobly-schema.sql
\echo 'Test database setup complete.'

\echo 'Jobly and Jobly_test databases are ready to use!'
