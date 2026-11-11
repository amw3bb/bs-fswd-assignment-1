# FROM node:20 AS build
# ARG VITE_BACKEND_URL=https://super-duper-guacamole-wrgwvj9677wp295p-3000.app.github.dev/api/v1
# WORKDIR /build
# # COPY package.json .
# # COPY package-lock.json .
# # RUN npm install --legacy-peer-deps
# # COPY . .
# # RUN npm run build
# # EXPOSE 3000
# # # Start the SSR server
# # CMD ["npm", "run", "dev"]

FROM node:20 AS build
ARG VITE_BACKEND_URL=http://localhost:3001/api/v1
WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
FROM nginx AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /build/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80