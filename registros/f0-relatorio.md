# Relatório F0 — OrçaClima

Data: 18/11/2026 · Responsável: operação autônoma · Capital: R$ 100,00 · Gasto: R$ 0,00

## 1. Veredito

**F0 não validada.** Não há evidência de demanda qualificada: zero visitantes reais, zero
downloads, zero cliques no botão de interesse e zero contatos. O material está publicado e
funcionando; isso prova execução, não prova mercado.

Declaração explícita: **não houve venda, não há receita e não há interessado registrado.**

## 2. Entregáveis e como conferir

| Entregável | Estado | Evidência verificável |
|---|---|---|
| Motor de cálculo (custo, imposto, taxa, margem, desconto) | Funcional | 10/10 testes passando (`node --test app/motor.test.js`) |
| Proposta-modelo em PDF, 1 página, com aviso de documento fictício | Pronta | `amostra/proposta-exemplo.pdf`, md5 `b842f4ba…`, verificação estrutural OK |
| Página de oferta | Publicada | https://onirico-dev.github.io/orcaclima/ — HTTP 200 |
| Amostra baixável sem cadastro | Publicada | `/amostra/proposta-exemplo.pdf` — HTTP 200, idêntico ao local (md5) |
| Indexação em buscadores | Enviada | IndexNow HTTP 202; sitemap e robots publicados |
| Instrumentação de demanda | Ativa | Contadores de visita, download e clique |
| Painel financeiro | Gerado do registro | `financeiro/painel.html` a partir de `financeiro/registro.csv` |
| Registros de pesquisa, concorrência, canais e decisões | Completos | `registros/*.md` |
| Kit completo (contrato, tabela, guia, app final) | **Não construído** | Página declara pré-lançamento |

Evidências brutas coletadas por script: `registros/evidencias-f0.txt`.

## 3. Métricas medidas (leitura de 18/11/2026, 15h42 UTC)

| Indicador | Valor medido | Interpretação |
|---|---|---|
| Visitas ao site (contador) | 3 | todas geradas por mim na verificação; **visitantes reais: 0** |
| Downloads da amostra | 1 | é a própria leitura do contador; **downloads reais: 0** |
| Cliques em "quero receber a oferta" | 1 | idem; **cliques reais: 0** |
| Visualizações do repositório (API GitHub, 14 dias) | 0 | ninguém chegou nem ao código |
| Contatos recebidos | 0 | — |
| Vendas | 0 | — |
| Receita | R$ 0,00 | — |

A leitura do contador incrementa o próprio contador em 1. Por isso valores iguais a 1
significam zero eventos reais.

## 4. Evidência de demanda: o que existe e o que falta

**Existe (indireto):**
- Autocomplete do Google mostra que as pessoas digitam "modelo de orçamento instalação ar
  condicionado", "contrato de manutenção de ar condicionado pdf" e "pmoc modelo pronto".
- Seis sites mantêm páginas dedicadas exatamente a esse termo, e cinco softwares cobram
  assinatura de PMOC. Alguém está gastando dinheiro para atender essa busca.

**Falta (direto):**
- Nenhum comprador viu a oferta. Nenhum sinal de disposição a pagar foi coletado.
- Não há dado de volume de busca, de conversão de concorrente nem de preço praticado
  publicamente.

Conclusão lógica: **existe mercado; não existe, ainda, evidência de que esta oferta vende.**

## 5. Erro de percurso que precisa ser registrado

Ao escolher o nicho, verifiquei a existência de *ferramentas* concorrentes, mas não de *sites de
modelo gratuito*. Quando fui verificar, encontrei seis domínios já ocupando as palavras-chave
centrais. Consequência: a estratégia original de "ferramenta gratuita para atrair busca" perde
força nesse nicho. Isso está documentado em `concorrencia.md` e motivou a mudança de foco de
"modelo grátis" para "entrega pronta com a marca do cliente".

## 6. Avaliação objetiva de viabilidade

| Critério | Nota (1–5) | Base |
|---|---|---|
| Demanda comprovada | 2 | só indireta; concorrentes existem, mas nada indica que eu capturaria parte |
| Concorrência no canal principal (busca) | 1 | seis domínios ocupando os termos, com oferta gratuita |
| Diferenciação possível | 3 | offline, sem conta, pagamento único, personalização — reais, porém não testados |
| Margem | 5 | custo de entrega próximo de zero; sem infraestrutura paga |
| Custo de errar | 5 | R$ 0 gastos; ativo permanece no ar |
| Automação da entrega | 4 | arquivo único; entrega manual hoje |
| Automação da aquisição | 1 | exige canal com titularidade que não possuo |
| Prazo até primeira venda | 1 | indeterminado sem canal |

**Leitura econômica:** o projeto tem custo de manutenção zero e upside desconhecido. O que o
trava não é preço, produto nem técnica — é acesso a comprador.

## 7. Critérios de decisão (definidos antes do próximo ciclo)

1. **Continuar** se, em até 14 dias, houver ao menos **1 interessado qualificado** (pessoa que
   descreve a própria empresa e pergunta preço ou prazo) e **1 download real** da amostra.
2. **Reposicionar preço** se houver 10 interessados qualificados e nenhuma venda: testar R$ 97.
3. **Trocar o pacote de nicho** (mantendo o motor) se, após 14 dias com canal aberto, houver
   menos de 2 interessados qualificados.
4. **Encerrar a operação** se, após 30 dias com canal aberto, a receita realizada for R$ 0,00 e
   não houver interesse demonstrável.

## 8. Impedimentos externos (o que eu não posso fazer)

| Impedimento | Natureza | Efeito |
|---|---|---|
| Criar conta em Google, Instagram, Mercado Livre, Hotmart, GetNinjas | exige identidade do titular | nenhum canal com intenção de compra está ativo |
| Enviar mensagem em nome de alguém | exige identidade e consentimento | abordagem fria está fora de cogitação |
| Receber pagamento | exige chave/conta do titular | sem meio de recebimento configurado |
| Emitir nota fiscal / definir MEI | decisão legal do titular | venda formal ainda não é possível |
| Verificar indexação no Google | exige Search Console | não sei se o Google já indexou a página |

Nenhum desses impedimentos custa dinheiro. Todos custam titularidade.

## 9. Próximas ações

| # | Ação | Dono | Custo | Prazo |
|---|---|---|---|---|
| 1 | Abrir **um** canal com intenção de compra (sugestão: Search Console + um perfil comercial) | titular | R$ 0 | 1 dia |
| 2 | Construir o kit completo (contrato, tabela de preços, guia, app final) | operação | R$ 0 | 2–3 dias |
| 3 | Publicar a oferta no canal aberto e medir 14 dias | operação + titular | R$ 0 | 14 dias |
| 4 | Revisar preço conforme critério 2 | operação | R$ 0 | após 10 interessados |

Enquanto o item 1 não acontece, o item 2 pode avançar sem risco: o ativo continua valendo para
qualquer nicho, porque o motor é genérico.

## 10. Situação do capital

| Item | Valor |
|---|---|
| Capital autorizado | R$ 100,00 |
| Despesas pagas | R$ 0,00 |
| Receita recebida | R$ 0,00 |
| Lucro | R$ 0,00 |
| Saldo disponível | R$ 100,00 |

Nenhuma despesa está prevista ou aprovada. O gasto só se justifica depois de existir interesse
demonstrável — e nenhuma ferramenta usada até aqui é paga.
