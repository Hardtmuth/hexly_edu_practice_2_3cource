DOCKER_DIR = ./backend/docker/

start-db:
	cd "${DOCKER_DIR}" && \
	sudo docker compose up -d

stop-db:
	cd "${DOCKER_DIR}" && \
	sudo docker compose down

remove-db-data:
	cd "${DOCKER_DIR}" && \
	sudo rm -rf data/

start-frontend:
	npx vite

start-backend:
	node backend/server.js

lint:
	npx eslint . --ignore-pattern "backend/docker/data"

lint-fix:
	npx eslint --fix . --ignore-pattern "backend/docker/data"

run-dev: start-db
	nohup $(MAKE) start-backend > ./log/backend.log 2>&1 &
	nohup $(MAKE) start-frontend > ./log/frontend.log 2>&1 &
	@printf "\n"
	@printf "Среда разработки - \033[42m\033[30m готова \033[0m\n"
	@printf "\n"

stop-dev: stop-db
	-pkill -f "node.*node_modules.*vite" 2>/dev/null || true
	-pkill -f "node.*backend/server.js" 2>/dev/null || true
	@printf "\n"
	@printf "Среда разработки - \033[41m\033[30m остановлена \033[0m\n"
	@printf "\n"