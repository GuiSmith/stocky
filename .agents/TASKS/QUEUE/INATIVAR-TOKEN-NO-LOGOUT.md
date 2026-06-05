# Inativar token no logout

## Objetivo

Ajustar o fluxo de logout para marcar o token como inativo no banco de dados.

Hoje foi observado que o token continua ativo após o logout.

## Regras esperadas

* Ao realizar logout, localizar o token utilizado na autenticação.
* Marcar o token como inativo no banco.
* Manter o padrão atual de services, controllers, DTOs e erros do projeto.
* Atualizar a documentação da API quando houver alteração de comportamento em endpoint.
* Considerar o registro em `log_app` com operação `LOGOUT` quando a tarefa de `log_app` já estiver implementada.

## Testes esperados

* Login cria token ativo.
* Logout marca o token como inativo.
* Token inativo não deve permitir autenticação posterior.
