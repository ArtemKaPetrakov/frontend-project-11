server:
	npx webpack serve

install:
	npm ci

production:
	NODE_ENV=production npx webpack

development:
	NODE_ENV=development npx webpack

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

.PHONY: test