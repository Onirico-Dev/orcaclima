# OrçaClima — operação comercial isolada

Projeto independente da operação **Capital Autônomo**. Não altera nem depende de outros projetos
do diretório `projetos/`.

## O que é

Ferramenta e material comercial de proposta/orçamento para micro e pequenas empresas de
instalação e manutenção de ar-condicionado. O produto é um arquivo que roda no navegador
(sem servidor, sem login, sem internet) e gera proposta em PDF com a marca da empresa.

## Situação atual (F0 — validação)

- Motor de cálculo: implementado e testado (10 testes automatizados, todos passando).
- Proposta-modelo em PDF: gerada e verificada estruturalmente (1 página, conteúdo dentro da folha).
- Página de oferta: publicada em https://onirico-dev.github.io/orcaclima/ (pré-lançamento).
- Instrumentação de demanda: contadores públicos de visita, download e clique.
- Receita realizada: **R$ 0,00**. Nenhuma venda. Nenhum interessado registrado.
- Veredito da F0: **não validada** — ver `registros/f0-relatorio.md`.
- Evidências brutas: `registros/evidencias-f0.txt`.
- Gasto realizado: **R$ 0,00**.

## Estrutura

```
app/         motor de cálculo + testes (roda no navegador e no Node)
amostra/     proposta-modelo em PDF
docs/        site publicado pelo GitHub Pages (não é pasta de documentação)
financeiro/  registro.csv (fonte única) + painel.html (gerado)
registros/   pesquisa, concorrência, canais, decisões e relatório da F0
scripts/     geração do PDF, verificação, painel e publicação
```

## Comandos

```bash
npm test          # testes do motor
npm run pdf        # regenera o PDF da amostra
npm run verificar  # verifica layout e blocos do PDF
npm run painel     # regenera o painel financeiro
npm run evidencias # coleta provas da F0
npm run publicar -- "mensagem"  # publica no GitHub via API
```

O ambiente bloqueia `git push`; a publicação é feita por `scripts/publicar.sh`, que cria os
blobs, a árvore, o commit e atualiza a referência pela API do GitHub.

## Regras financeiras

1. Nenhum gasto sem justificativa e autorização do operador.
2. Só entra como receita o valor recebido e comprovado.
3. Preço na página é previsão de lançamento, não receita.
