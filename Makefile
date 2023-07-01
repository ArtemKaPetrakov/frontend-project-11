server:
	npx webpack serve

install:
	npm ci

build:
	NODE_ENV=production npx webpack

develop:
	NODE_ENV=development npx webpack

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

.PHONY: test