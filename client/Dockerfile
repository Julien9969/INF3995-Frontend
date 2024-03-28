FROM  --platform=linux/amd64 node:18.15-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install -g @angular/cli
RUN npm install
RUN npm i @rollup/rollup-linux-x64-gnu
# COPY . .
# EXPOSE 4200

