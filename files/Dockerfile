# ---------- Stage 1: сборка ----------
    FROM node:20-alpine AS build
    
    WORKDIR /app
    
    # Сначала зависимости — кэшируются, пока не меняется package.json
    COPY package*.json ./
    RUN npm ci
    
    # Потом код
    COPY . .
    
    # VITE_API_URL задаётся при сборке (build-time переменная)
    ARG VITE_API_URL=/api
    ENV VITE_API_URL=$VITE_API_URL
    
    RUN npm run build
    
    
    # ---------- Stage 2: раздача ----------
    FROM nginx:1.27-alpine
    
    # Своя конфигурация nginx
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Статика из build-стадии
    COPY --from=build /app/dist /usr/share/nginx/html
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]