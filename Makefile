dev-up:
	docker compose -p stocky-dev -f docker-compose.dev.yml up -d
prod-up:
	docker compose -p stocky -f docker-compose.yml up -d --build
