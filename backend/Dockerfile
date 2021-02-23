FROM node:14-alpine

RUN apk add dumb-init

WORKDIR /workspace

COPY ./package*.json /workspace/
RUN npm install -y --production

WORKDIR /workspace/src
COPY ./src /workspace/src

ENTRYPOINT [ "dumb-init", "--" ]
CMD [ "node", "main.js" ]
