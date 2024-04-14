FROM node:18.15 as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
RUN npm install -g @angular/cli
COPY . .
RUN npm run build --prod
FROM nginx:1.25.4-alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
