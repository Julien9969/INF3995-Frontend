FROM timbru31/node-chrome
WORKDIR /usr/src/app
COPY package.json ./
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max-old-space-size=16384
RUN npm install -g @angular/cli
RUN npm install
