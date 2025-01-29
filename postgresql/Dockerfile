FROM postgres:17-alpine

WORKDIR /usr/app

ENV POSTGRES_PASSWORD=J1o2s3e4
ENV POSTGRES_USER=postgres
ENV POSTGRES_DB=postgres

COPY ./scripts/migrations.sql /usr/app/.
COPY ./scripts/init-db.sh /usr/app/.

WORKDIR /

RUN chmod +x /usr/app/init-db.sh \
    && su - postgres -c "initdb /var/lib/postgresql/data" \
    && exit \
    && pg_ctl start

EXPOSE 5432

#CMD ["sh", "/usr/app/init-db.sh"] command to run once in the running container
