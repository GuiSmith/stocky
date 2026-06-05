# Desenvolvimento
dev-down:
	cd infra && docker compose -p stocky-dev -f docker-compose.dev.yml down
dev-up:
	cd infra && docker compose -p stocky-dev -f docker-compose.dev.yml up -d
dev-migrate:
	cd infra && docker exec -it stocky-dev-back npm run db:sync
dev-psql:
	docker exec -it stocky-dev-db psql -U stocky -d stocky
# Produção
prod-down:
	cd infra && docker compose -p stocky -f docker-compose.yml down
prod-up:
	cd infra && docker compose -p stocky -f docker-compose.yml up -d --build
prod-migrate:
	cd infra && docker exec -it stocky-back npm run db:sync
prod-psql:
	docker exec -it stocky-back psql -U stocky -d stocky