/*
 * Gera o painel financeiro a partir de financeiro/registro.csv.
 * Executar: node scripts/gerar-painel.js
 * Regra: só entra como receita o que tem comprovante e status "recebido".
 */
const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const csv = fs.readFileSync(path.join(raiz, "financeiro", "registro.csv"), "utf8").trim().split("\n");
const cabecalho = csv[0].split(",");
const linhas = csv.slice(1).map((linha) => {
  const campos = linha.split(",");
  const registro = {};
  cabecalho.forEach((chave, i) => { registro[chave.trim()] = (campos[i] || "").trim(); });
  registro.valor = Number(registro.valor);
  return registro;
});

const soma = (filtro) =>
  linhas.filter(filtro).reduce((t, r) => t + (isFinite(r.valor) ? r.valor : 0), 0);

const capital = soma((r) => r.tipo === "capital");
const despesasPagas = soma((r) => r.tipo === "despesa" && r.status === "pago");
const despesasPrevistas = soma((r) => r.tipo === "despesa" && r.status === "aprovado");
const receita = soma((r) => r.tipo === "receita" && r.status === "recebido");
const lucro = receita - despesasPagas;
const saldo = capital - despesasPagas + receita;

const moeda = (v) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const data = new Date().toISOString().slice(0, 10);

const linhasTabela = linhas
  .map(
    (r) =>
      `<tr><td>${r.data}</td><td>${r.tipo}</td><td>${r.descricao}</td><td class="num">${moeda(r.valor)}</td><td>${r.status}</td></tr>`
  )
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Painel financeiro — OrçaClima</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;margin:0;background:#F4F7F9;color:#1B2A33;line-height:1.5}
  .wrap{max-width:760px;margin:0 auto;padding:24px 18px 40px}
  h1{font-size:22px;margin:0 0 4px}
  .sub{color:#5A6B75;font-size:13.5px;margin:0 0 20px}
  .grade{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:22px}
  .bloco{flex:1 1 160px;background:#fff;border:1px solid #D8E2E8;border-radius:10px;padding:14px}
  .bloco .rot{font-size:11px;text-transform:uppercase;letter-spacing:.09em;color:#5A6B75}
  .bloco .val{font-size:21px;font-weight:800;margin-top:4px}
  .ok{color:#1E6F50}.alerta{color:#B03A2E}
  table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #D8E2E8;border-radius:10px;overflow:hidden;font-size:13.5px}
  th,td{padding:9px 10px;border-bottom:1px solid #E6EEF2;text-align:left;vertical-align:top}
  th{background:#EEF3F6;font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:#5A6B75}
  td.num{text-align:right;white-space:nowrap}
  .nota{font-size:12.5px;color:#5A6B75;margin-top:16px}
  .aviso{background:#FFF4E5;border:1px solid #F0D8B8;color:#7A4B12;border-radius:8px;padding:10px 12px;font-size:13px;margin:16px 0}
</style>
</head>
<body>
<div class="wrap">
  <h1>Painel financeiro — OrçaClima</h1>
  <p class="sub">Gerado em ${data} a partir de financeiro/registro.csv. Só entra como receita o valor com status "recebido".</p>

  <div class="grade">
    <div class="bloco"><div class="rot">Capital autorizado</div><div class="val">${moeda(capital)}</div></div>
    <div class="bloco"><div class="rot">Despesas pagas</div><div class="val">${moeda(despesasPagas)}</div></div>
    <div class="bloco"><div class="rot">Receita realizada</div><div class="val ${receita > 0 ? "ok" : ""}">${moeda(receita)}</div></div>
    <div class="bloco"><div class="rot">Lucro líquido</div><div class="val ${lucro > 0 ? "ok" : ""}">${moeda(lucro)}</div></div>
    <div class="bloco"><div class="rot">Saldo disponível</div><div class="val ${saldo > 0 ? "ok" : "alerta"}">${moeda(saldo)}</div></div>
  </div>

  ${despesasPrevistas > 0 ? `<div class="aviso">Despesas aprovadas e ainda não pagas: ${moeda(despesasPrevistas)}.</div>` : ""}
  ${receita === 0 ? `<div class="aviso">Nenhuma venda registrada até agora. Os valores de preço na página são previsão de lançamento, não receita.</div>` : ""}

  <table>
    <thead><tr><th>Data</th><th>Tipo</th><th>Descrição</th><th>Valor</th><th>Status</th></tr></thead>
    <tbody>
${linhasTabela}
    </tbody>
  </table>

  <p class="nota">Despesas com valor zero são ferramentas gratuitas já utilizadas. Elas entram no registro para deixar claro que houve uso, e não gasto.</p>
</div>
</body>
</html>
`;

const destino = path.join(raiz, "financeiro", "painel.html");
fs.writeFileSync(destino, html, "utf8");
console.log("painel gerado:", destino);
console.log(`capital=${moeda(capital)} despesas=${moeda(despesasPagas)} receita=${moeda(receita)} lucro=${moeda(lucro)} saldo=${moeda(saldo)}`);
