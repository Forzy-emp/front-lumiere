# Cadastro de faturas por usina

O cadastro de faturas fica no formulário de nova usina e nos detalhes de uma usina existente. A rota antiga `/dashboard/usina/:id/fatura/new` redireciona para os detalhes.

## Nova usina

- O botão **+** abre o formulário de conta de energia. As faturas adicionadas ficam em memória até salvar a usina; cancelar ou sair do cadastro descarta esse rascunho.
- É obrigatório adicionar de 1 a 12 faturas, de meses distintos, dentro dos 12 meses anteriores ao mês atual. O mês passado é a primeira opção quando disponível.
- `POST /usina/create` recebe os campos da usina e o campo obrigatório `faturas`, uma lista dos mesmos dados de `POST /faturas`, sem `usinaId`.
- O backend valida as faturas e grava a usina, a associação do usuário autenticado e os itens das faturas por criação aninhada do Prisma. Uma falha nessa operação impede a gravação do conjunto.

## Usina existente

- O histórico usa `GET /faturas`, filtrado pelo `usinaId`, e apresenta competência, vencimento e valor total em ordem decrescente de competência.
- O cadastro usa `POST /faturas` com o identificador da usina aberta. A interface reconsulta as competências antes de salvar.
- A API normaliza a competência para o primeiro dia do mês e consulta o mês inteiro para detectar registros antigos com outros dias. A restrição única já existente protege gravações simultâneas e seu erro é traduzido para uma mensagem de duplicidade.
- O limite dos 12 meses se aplica ao cadastro inicial; o histórico de uma usina existente pode continuar crescendo.
- **Novo Registro de Geração** e o campo de geração anterior continuam independentes da fatura. Energia injetada não é usada como geração da usina.

## Integração e verificação

As alterações do frontend e de `D:\Projects\api-sunset` devem ser usadas juntas. O novo contrato torna `faturas` obrigatório no cadastro de usina. Não há alteração do schema nem migração de banco.

Frontend: `npm test` e `npm run build`.

Backend, na raiz da API: `npm test -- --runInBand --runTestsByPath src/faturas/faturas.service.spec.ts src/usina/usina-cadastro.spec.ts`.

Os testes da API usam mocks do Prisma; não gravam dados nem substituem uma verificação de integração com o banco.
