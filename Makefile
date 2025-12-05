.PHONY: build start install dev stop clean

PORT ?= 5001

install:
	cd frontend && npm install

build:
	cd frontend && npm run build

stop:
	@echo "Stopping server on port $(PORT)..."
	@-sudo kill -9 $(sudo lsof -t -i:$(PORT)) 2>/dev/null || true
	@sleep 2

clean: stop
	@echo "Cleaning up..."

start: stop
	@echo "Starting server on port $(PORT)..."
	npx start-server -s ./frontend/dist -p $(PORT)

# Альтернативный запуск на случайном порту
start-random:
	@RANDOM_PORT=$$(shuf -i 3000-9000 -n 1); \
	echo "Starting server on random port: $$RANDOM_PORT"; \
	npx start-server -s ./frontend/dist -p $$RANDOM_PORT

# Запуск на другом порте (например 5002)
start-5002:
	PORT=5002 make start

dev:
	cd frontend && npm run dev

test:
	@echo "Testing connection on port $(PORT)..."
	@curl -s http://localhost:$(PORT)/api/v1/channels | head -c 200 || echo "Server not running"
	@echo ""
	