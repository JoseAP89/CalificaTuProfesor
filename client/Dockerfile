FROM node:20-alpine

WORKDIR /usr/src/app/client

COPY . .

RUN npm install -g @angular/cli && \
    npm install

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]