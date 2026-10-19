FROM node:20 AS build
ARG VITE_BACKEND_URL=https://super-duper-guacamole-wrgwvj9677wp295p-3001.app.github.dev/api/v1
WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN HUSKY=0 npm install --legacy-peer-deps
COPY . .
RUN npm run build
FROM nginx AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /build/dist .