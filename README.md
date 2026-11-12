# web-task-manager

Учебный проект-монорепозиторий
Состоит из фронтенда, бэкенда и БД на Postgre SQL, запускаемых в docker.

Важно: требует .env - файла с секретами, без него работать не будет.

Команда для запуска в контейнере (дефолтная, старая, только для prod - не использовать):
`docker compose up --build`

# Только development-стек
`docker compose --profile dev up --build frontend-dev`

# Только production-стек
`docker compose --profile prod up --build frontend`