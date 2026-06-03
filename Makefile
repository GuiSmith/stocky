# Desenvolvimento
dev-down:
	docker compose -p stocky-dev -f docker-compose.dev.yml down
dev-up:
	docker compose -p stocky-dev -f docker-compose.dev.yml up -d
dev-migrate:
	docker exec -it stocky-dev-back npm run db:sync
psql:
	docker exec -it stocky-dev-db psql -U stocky -d stocky
# Produção
prod-down:
	docker compose -p stocky -f docker-compose.yml down
prod-up:
	docker compose -p stocky -f docker-compose.yml up -d --build
prod-migrate:
	docker exec -it stocky-back npm run db:sync
