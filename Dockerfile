# Use the latest foundry image
FROM ghcr.io/foundry-rs/foundry:nightly-7398b65e831f2339d1d0a0bb05ade799e4f9d01e as foundry-image

FROM node:16

COPY --from=foundry-image /usr/local/bin/forge /usr/local/bin/forge

RUN mkdir /app
WORKDIR /app

COPY . .

RUN npm install && npm run build

LABEL fly_launch_runtime="nodejs"

ENV NODE_ENV production
ENV PATH /usr/local/node/bin:$PATH

CMD [ "npm", "run", "start" ]