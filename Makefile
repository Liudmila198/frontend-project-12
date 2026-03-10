.PHONY: build start install dev

install:
	npm install
	cd frontend && npm install

build:
	cd frontend && npm run build

start:
	npx start-server -s ./frontend/dist

dev:
	cd frontend && npm run dev

prettier:
	npx prettier --write "src/**/*.{js,jsx}"

lint:
	cd frontend && npx eslint src

lint-fix:
	npx eslint --fix "src/**/*.{js,jsx}"