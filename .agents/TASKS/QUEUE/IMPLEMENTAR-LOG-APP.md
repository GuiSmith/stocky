# Implementar `log_app`

## Objetivo

Implementar uma estrutura de log genérico da aplicação para registrar alterações realizadas nos dados persistidos no banco.

Este log não substitui o `log_api`.

A separação esperada é:

* `log_api`: logs de requisições HTTP.
* `log_app`: logs de alterações de dados da aplicação.

## 1. Criar arquivo de migration

Criar uma nova migration SQL no diretório de migrations do back-end.

A migration deve criar a tabela `log_app`.

Estrutura esperada:

* `id BIGSERIAL PRIMARY KEY`
* `id_usuario INTEGER REFERENCES usuario(id)`
* `data_hora TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP`
* `tabela VARCHAR(100) NOT NULL`
* `id_tabela BIGINT`
* `operacao VARCHAR(10) NOT NULL`
* `antes JSONB`
* `depois JSONB`

A coluna `operacao` deve aceitar somente:

* `INSERT`
* `UPDATE`
* `DELETE`
* `LOGIN`
* `LOGOUT`

Não criar índices nesta migration por enquanto.

Após criar a migration, pode usar `docker exec stocky-dev-back npm run db:sync` se quiser testar, estamos no ambiente dev rsrs

## 2. Configurar DTO e service

Criar DTO para padronizar e validar os dados usados na criação de logs em `log_app`.

O DTO deve ficar em:

`src/dtos/log-app/criar-log.dto.js`

Criar também um service responsável por persistir registros em `log_app`.

O service deve ficar dentro de `src/services`.

A função principal do service deve se chamar:

`criarLog`

A função `criarLog` deve receber dados suficientes para registrar:

* usuário responsável pela alteração, quando existir
* tabela alterada
* id do registro alterado
* operação realizada
* dados anteriores
* dados posteriores

Regras esperadas:

* Em `INSERT`, preencher principalmente `depois`
* Em `UPDATE`, preencher `antes` e `depois`
* Em `DELETE`, preencher principalmente `antes`
* Em `LOGIN`, registrar a tentativa/resultado de autenticação sem duplicar contexto HTTP
* Em `LOGOUT`, registrar a saída do usuário sem duplicar contexto HTTP
* `id_usuario` pode ser `null`
* `antes` pode ser `null`
* `depois` pode ser `null`
* campos sensíveis devem ser removidos de `antes` e `depois` seguindo exatamente a mesma estratégia já usada no `log_api`

O service deve usar o padrão atual de acesso ao banco do projeto.

## 3. Aplicar `criarLog` nos pontos que alteram dados

Procurar no back-end todos os pontos que já fazem alteração de dados no banco.

Considerar como alteração:

* criação de registros
* edição de registros
* exclusão de registros
* login
* logout
* ativação
* inativação
* alteração de senha
* alteração de permissões
* associação ou remoção de vínculos
* qualquer mudança persistida em tabela de negócio

Em cada ponto encontrado, adicionar chamada para `criarLog`.

O log deve ser criado somente após a operação principal ter sido concluída com sucesso.

Quando possível:

* antes de um `UPDATE`, buscar o estado anterior do registro
* depois do `UPDATE`, registrar o estado novo ou os campos alterados
* antes de um `DELETE`, buscar o estado anterior do registro
* após um `INSERT`, registrar o registro criado
* no `LOGIN`, registrar a operação mesmo quando o usuário não for autenticado, usando `id_usuario = null` quando não houver usuário válido
* no `LOGOUT`, registrar a operação para o usuário autenticado quando houver usuário disponível no contexto

Não registrar alterações internas da própria tabela `log_app`.

Evitar duplicar dados que já pertencem ao `log_api`, como:

* IP
* user-agent
* rota
* método HTTP
* status code
* body da requisição
* response body

Esses dados já são responsabilidade do middleware de log de API.

## 4. Atualizar `SOURCE-OF-TRUTH.md`

Editar o arquivo `SOURCE-OF-TRUTH.md` para manter a documentação técnica atualizada.

Adicionar a documentação do `log_app` no local mais adequado.

Provavelmente será necessário incluir mais um item na arquitetura do back-end, dentro da parte de logs, services ou middlewares.

A documentação deve deixar claro:

* o papel da tabela `log_app`
* a diferença entre `log_api` e `log_app`
* onde fica o DTO
* onde fica o service
* que a função principal é `criarLog`
* que o log registra alterações de dados feitas pela aplicação
* que as operações permitidas são `INSERT`, `UPDATE`, `DELETE`, `LOGIN` e `LOGOUT`
* que o log não registra contexto HTTP, pois isso já pertence ao `log_api`

## 5. Realizar testes

Realizar testes para validar a implementação.

Pode usar a skill de testar rota API como apoio, mesmo que o foco aqui não seja exatamente uma rota nova.

Testar pelo menos:

* criação de um registro que gere `INSERT` em `log_app`
* atualização de um registro que gere `UPDATE` em `log_app`, se existir fluxo aplicável
* exclusão ou inativação de um registro que gere `DELETE` ou `UPDATE` em `log_app`, se existir fluxo aplicável
* login válido gerando `LOGIN` em `log_app`
* tentativa de login inválida gerando `LOGIN` em `log_app` com `id_usuario = null`
* logout gerando `LOGOUT` em `log_app`
* operação com usuário autenticado, verificando `id_usuario`
* operação sem usuário autenticado, verificando `id_usuario = null` quando o fluxo permitir, principalmente tentativa de login
* validação da constraint de `operacao`
* confirmação de que `log_api` continua funcionando normalmente
* confirmação de que `/health` continua sem gerar log em `log_api`

Após os testes, registrar no resumo final:

* arquivos criados
* arquivos alterados
* migrations criadas
* pontos do código onde `criarLog` foi aplicado
* testes executados
* resultado dos testes
* qualquer ponto que não pôde ser coberto

## Regra obrigatória de transação

Todas as operações de escrita que gerarem log em `log_app` devem ser executadas dentro de transação.

A alteração principal e o registro em `log_app` devem participar da mesma transação.

Quando uma função de escrita precisar realizar leituras antes de alterar dados, a transação deve começar antes da primeira leitura relevante.

Exemplo de fluxo:

1. abrir transação
2. executar `SELECT X`
3. executar `SELECT Y`
4. executar `INSERT Z`
5. executar `UPDATE A`
6. chamar `criarLog(tx, payload)`
7. finalizar transação

O objetivo é garantir isolamento: o dado lido no começo da função deve ser consistente com o dado alterado e com o log gerado no fim.

A função `criarLog` deve receber como primeiro parâmetro o client/conexão do banco que será utilizado para persistir o log.

Esse parâmetro poderá ser:

- a conexão padrão do Prisma
- o objeto `tx` recebido dentro de `db.$transaction`

Quando a operação principal estiver dentro de uma transação, `criarLog` obrigatoriamente deve receber o mesmo `tx`.

Exemplo conceitual:

`criarLog(tx, payload)`

Não criar o log usando uma conexão global separada quando a operação principal estiver dentro de transação.

Objetivo:

- se a operação principal falhar, o log também deve sofrer rollback
- se o log falhar, a operação principal também deve sofrer rollback
- evitar logs mentirosos
- evitar alterações sem auditoria

## Ajustar services existentes

Verificar os services atuais que realizam escrita no banco e ajustar para usar transações quando necessário.

Toda operação que alterar dados e registrar `log_app` deve ser migrada para o padrão:

1. abrir transação
2. executar as leituras iniciais relevantes dentro da transação
3. buscar estado anterior, quando aplicável
4. executar alteração principal
5. chamar `criarLog` usando o mesmo `tx`
6. finalizar transação

Services que apenas fazem leitura não precisam de transação.
