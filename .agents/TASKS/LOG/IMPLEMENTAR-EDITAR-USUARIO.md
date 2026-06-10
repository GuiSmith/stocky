# Skill — Implementar edição de usuário

## Objetivo

Implementar a funcionalidade de edição de usuário no back-end do Stocky.

A funcionalidade deve permitir atualizar dados de um usuário existente. O `id` do usuário deve ser obrigatório no body da requisição, enquanto os demais campos devem ser opcionais.

Esta implementação deve seguir a arquitetura definida no projeto:

`route -> asyncHandler -> controller -> DTO -> service -> repository/ORM`

Também deve respeitar a separação de responsabilidades:

- DTO valida, filtra, normaliza e padroniza dados.
- Service executa regras de negócio e persistência.
- Utils concentram helpers puros e reutilizáveis.
- `log_app` registra alterações persistidas no banco.

---

## Fonte de verdade

Antes de implementar, leia o arquivo `SOURCE-OF-TRUTH.md` e siga a arquitetura, nomenclaturas, padrões e responsabilidades já definidos nele.

A implementação deve manter o documento atualizado ao final.

---

## Escopo funcional

Deve ser possível editar um usuário existente.

O body da requisição deve receber obrigatoriamente:

- `id`

E pode receber opcionalmente:

- `nome`
- `cpf`
- `email`
- `senha`
- `ativo`

Exemplo conceitual de payload aceito:

- `id`: obrigatório
- `nome`: opcional
- `cpf`: opcional
- `email`: opcional
- `senha`: opcional
- `ativo`: opcional

Não implemente atualização de campos que não estejam nesse escopo.

---

## Rota

Criar ou ajustar a rota de usuários para expor a edição de usuário.

A rota deve ficar no módulo de usuários, seguindo o padrão já existente em:

`back/src/routes/usuarios.routes.js`

A rota pode ser implementada como `PUT` ou `PATCH`, conforme o padrão já adotado no projeto para edição.

Caso ainda não exista padrão, prefira:

`PUT /usuarios`

Motivo: o `id` será recebido no body, conforme definido nesta skill.

A rota deve chamar o controller de usuários através de `asyncHandler`, respeitando o middleware global de erros.

---

## Controller

Criar ou ajustar o controller de usuários em:

`back/src/controllers/usuarios.controller.js`

A função de controller deve:

1. Receber `req.body`.
2. Validar e normalizar os dados usando o DTO de edição de usuário.
3. Chamar o service de usuários responsável pela edição.
4. Retornar JSON com mensagem clara e dados úteis, sem expor senha.
5. Não usar `try/catch`, pois o projeto utiliza middleware global de erros.

Sugestão de nome da função:

`editarUsuario`

---

## DTO

Criar o DTO de edição de usuário em:

`back/src/dtos/usuario/editar-usuario.dto.js`

O DTO deve ser responsável por validar, filtrar, normalizar e padronizar os dados recebidos.

### Regras obrigatórias do DTO

#### `id`

- Campo obrigatório.
- Deve ser um inteiro positivo.
- Caso não seja informado, lançar erro de validação.
- Caso não seja um inteiro positivo, lançar erro de validação.

#### `nome`

- Campo opcional.
- Caso seja informado, deve ser string.
- Deve ser normalizado com `trim`.
- Não deve aceitar string vazia após `trim`.

#### `cpf`

- Campo opcional.
- Caso seja informado, deve ser normalizado removendo tudo que não for número.
- Após normalização, deve conter exatamente 11 dígitos.
- Caso não contenha exatamente 11 dígitos, lançar erro de validação.
- O DTO não deve consultar banco para verificar duplicidade.

#### `email`

- Campo opcional.
- Caso seja informado, deve ser string.
- Deve ser normalizado com `trim`.
- Pode ser normalizado para lowercase, caso esse já seja o padrão do projeto.
- Deve validar se o formato é de e-mail válido.
- Caso seja inválido, lançar erro de validação.
- O DTO não deve consultar banco para verificar duplicidade.

#### `senha`

- Campo opcional.
- Caso seja informada, deve ser string.
- Não deve aceitar string vazia.
- Não deve criptografar senha dentro do DTO.
- A criptografia pertence ao service.

#### `ativo`

- Campo opcional.
- Caso seja informado, deve ser obrigatoriamente booleano.
- Não aceitar string `"true"` ou `"false"` como booleano, a menos que esse padrão já tenha sido explicitamente adotado no projeto.
- Caso não seja booleano, lançar erro de validação.

### Campos indevidos

O DTO deve remover ou ignorar qualquer campo que não esteja no contrato da edição de usuário.

Campos aceitos:

- `id`
- `nome`
- `cpf`
- `email`
- `senha`
- `ativo`

### Payload sem alteração

Caso o body contenha apenas `id` e nenhum campo editável válido, o DTO deve lançar erro de validação informando que ao menos um campo de atualização deve ser enviado.

---

## Helpers e utils

Atualmente existe apenas criação de usuário. É provável que algumas validações e normalizações de `cpf` e `email` estejam dentro do DTO de criação de usuário.

Se a mesma lógica for usada tanto no DTO de criação quanto no DTO de edição, não duplique código.

Crie helpers/utilitários puros em:

`back/src/utils`

Sugestões de arquivos:

- `back/src/utils/cpf.js`
- `back/src/utils/email.js`

Sugestões de responsabilidades:

### `utils/cpf.js`

Concentrar funções puras relacionadas a CPF, por exemplo:

- normalizar CPF removendo tudo que não for número
- verificar se CPF possui exatamente 11 dígitos

Não precisa implementar validação matemática completa de CPF, a menos que isso já exista no projeto ou já seja padrão adotado.

### `utils/email.js`

Concentrar funções puras relacionadas a e-mail, por exemplo:

- normalizar e-mail
- validar formato básico de e-mail

Após criar os helpers, ajustar também o DTO de criação de usuário para usar os mesmos helpers, caso ele tenha lógica duplicada.

---

## Service

Criar ou ajustar o service de usuários em:

`back/src/services/usuarios.service.js`

Sugestão de nome da função:

`editarUsuario`

O service deve assumir que o payload já passou pelo DTO e que os dados estruturais já estão válidos.

### Regras obrigatórias do service

#### Usuário existente

- Buscar o usuário pelo `id`.
- Se não existir, lançar erro apropriado, preferencialmente `NotFoundError`.

#### CPF único

Caso `cpf` tenha sido enviado:

- Verificar se já existe outro usuário com o mesmo CPF.
- A verificação deve ignorar o próprio usuário editado.
- Se o CPF pertencer a outro usuário, lançar erro apropriado, preferencialmente `ConflictError`.

#### E-mail único

Caso `email` tenha sido enviado:

- Verificar se já existe outro usuário com o mesmo e-mail.
- A verificação deve ignorar o próprio usuário editado.
- Se o e-mail pertencer a outro usuário, lançar erro apropriado, preferencialmente `ConflictError`.

#### Senha criptografada

Caso `senha` tenha sido enviada:

- Criptografar a senha antes de atualizar o banco.
- Usar a mesma estratégia, biblioteca, salt e padrão já usados na criação de usuário.
- Não salvar senha em texto puro.

#### Atualização parcial

- Atualizar somente os campos enviados.
- Não sobrescrever campos opcionais com `undefined`, `null` ou valores ausentes.
- O campo `ativo` deve poder ser atualizado para `false`.

Atenção: não usar checagem ingênua baseada em truthy/falsy para montar o payload de atualização, pois isso quebraria o caso `ativo: false`.

---

## Transação e log_app

A edição de usuário altera dados persistidos, então deve registrar `log_app`.

A operação deve ser feita dentro de transação.

Fluxo esperado:

1. Abrir transação.
2. Buscar o usuário atual dentro da transação.
3. Validar existência.
4. Verificar conflito de CPF e e-mail, se necessário.
5. Montar payload de atualização.
6. Atualizar usuário.
7. Registrar `log_app` usando o mesmo objeto de transação.
8. Finalizar transação.

O log deve ser registrado usando:

`criarLog(tx, payload)`

O `log_app` deve registrar:

- `tabela`: `usuario`
- `id_tabela`: id do usuário alterado
- `operacao`: `UPDATE`
- `antes`: estado anterior do usuário
- `depois`: estado atualizado do usuário

Campos sensíveis, como `senha`, não devem aparecer em `antes` nem em `depois`.

Se já existir utilitário de sanitização usado pelo `log_api` ou `log_app`, reutilize-o.

---

## Banco de dados e Prisma

O projeto usa migrations SQL manuais e Prisma ORM.

Não crie migration para esta feature, a menos que o schema atual impossibilite a edição.

A edição deve usar o modelo Prisma existente para a tabela `usuario`.

Após alterações que dependam do Prisma, garantir que o projeto continue compatível com os scripts já previstos:

- `npm run db:sync`
- `npx prisma db pull`
- `npx prisma generate`

Não altere a estratégia de migrations do projeto.

---

## Errors

Use as classes de erro existentes em:

`back/src/errors`

Preferências esperadas:

- Payload inválido: `ValidationError` ou equivalente já usado nos DTOs.
- Usuário não encontrado: `NotFoundError`.
- CPF ou e-mail duplicado: `ConflictError`.

Não retornar erros manualmente no controller se o projeto já centraliza isso no middleware global de erro.

---

## Segurança

A resposta da API nunca deve retornar senha.

A senha também não deve aparecer em:

- response body
- `log_app`
- logs de debug
- objetos `antes` e `depois`

Caso algum retorno atual de usuário exponha senha, ajustar a edição para remover esse campo ao retornar.

---

## Atualização do SOURCE-OF-TRUTH

Ao final da implementação, atualizar o arquivo:

`SOURCE-OF-TRUTH.md`

A documentação deve mencionar que o módulo de usuários possui edição de usuário implementada.

A documentação deve incluir, no mínimo:

- rota usada para edição
- campos aceitos
- campos obrigatórios
- campos opcionais
- validações principais
- regra de unicidade de CPF e e-mail
- regra de criptografia da senha
- registro de `log_app` na operação de edição

Não reescreva o documento inteiro sem necessidade. Faça apenas a atualização incremental relacionada à feature.

---

## Testes e validação manual

Validar pelo menos os seguintes cenários:

1. Editar apenas `nome`.
2. Editar apenas `cpf`.
3. Editar apenas `email`.
4. Editar apenas `ativo` para `false`.
5. Editar `senha` e confirmar que não foi salva em texto puro.
6. Enviar body sem `id` e receber erro de validação.
7. Enviar `id` inválido e receber erro de validação.
8. Enviar CPF com pontuação e confirmar normalização.
9. Enviar CPF com menos ou mais de 11 dígitos e receber erro de validação.
10. Enviar e-mail inválido e receber erro de validação.
11. Enviar `ativo` como string e receber erro de validação.
12. Tentar atualizar CPF para CPF de outro usuário e receber conflito.
13. Tentar atualizar e-mail para e-mail de outro usuário e receber conflito.
14. Tentar editar usuário inexistente e receber erro de não encontrado.
15. Confirmar que a edição gerou registro em `log_app`.
16. Confirmar que `senha` não aparece em `log_app`.

---

## Critérios de aceite

A feature será considerada pronta quando:

- existir rota funcional para edição de usuário
- o controller usar DTO antes do service
- o DTO validar `id` obrigatório como inteiro positivo
- o DTO permitir atualização parcial dos campos opcionais
- o CPF for normalizado e validado com 11 dígitos
- o e-mail for validado como e-mail válido
- o campo `ativo` aceitar booleano real, incluindo `false`
- senha enviada for criptografada antes de persistir
- CPF e e-mail não puderem ser duplicados entre usuários diferentes
- a atualização não expuser senha na resposta
- a operação registrar `log_app` com `antes` e `depois`
- o `log_app` não salvar senha
- helpers compartilhados sejam extraídos para `back/src/utils` quando houver duplicação com o DTO de criação
- o DTO de criação seja ajustado para usar os helpers compartilhados, se aplicável
- o `SOURCE-OF-TRUTH.md` seja atualizado
- a aplicação continue seguindo a arquitetura do projeto

---

## Observações importantes

Não implementar regra de autorização nesta skill, a menos que o projeto já tenha middleware ou padrão consolidado para isso.

Não alterar estrutura de banco sem necessidade.

Não misturar validação estrutural de DTO com regra de negócio de service.

Não duplicar validação de CPF/e-mail em múltiplos DTOs se puder virar helper puro.

Não quebrar a criação de usuário existente ao extrair helpers.
