start-frontend:
	npx vite

lint:
	npx eslint . --ignore-pattern "backend/docker/data"

lint-fix:
	npx eslint --fix . --ignore-pattern "backend/docker/data"