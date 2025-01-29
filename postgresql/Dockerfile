FROM postgres:17-alpine

WORKDIR /usr/app

ENV POSTGRES_PASSWORD=J1o2s3e4
ENV POSTGRES_USER=postgres
ENV POSTGRES_DB=postgres

COPY ./scripts/migrations.sql /usr/app/.
COPY ./scripts/init-db.sh /usr/app/.

WORKDIR /

EXPOSE 5432

#CMD ["sh", "/usr/app/init-db.sh"] command to run once in the running container
