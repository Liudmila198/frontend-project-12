.PHONY: build start install dev

install:
	npm install
	cd frontend && npm install

build:
	cd frontend && npm run build

start:
	npm start

dev:
	cd frontend && npm run dev