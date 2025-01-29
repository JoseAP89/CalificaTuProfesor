#!/bin/sh
set -e
set -x

psql -U "$POSTGRES_USER" -h "localhost" <<-EOSQL
	CREATE DATABASE teachers;
    \c teachers;
    \i /usr/app/migrations.sql;
    create user joseap;
    alter user joseap with encrypted password 'J1o2s3e4';
    GRANT ALL PRIVILEGES ON DATABASE teachers TO joseap;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO joseap;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO joseap;
EOSQL
