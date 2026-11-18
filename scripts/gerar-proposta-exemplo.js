/*
 * Gera a proposta-modelo em PDF usando o mesmo motor do app.
 * Executar: node scripts/gerar-proposta-exemplo.js
 * Saída: amostra/proposta-exemplo.pdf (uma página A4)
 */
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Motor = require("../app/motor.js");

const AZUL = "#0B3C5D";
const CINZA = "#5A6B75";
const ESCURO = "#1B2A33";
const CLARO = "#EEF3F6";
const LINHA = "#C9D6DE";

const itens = [
  {
    descricao: "Split Hi-Wall Inverter 12.000 BTUs — 220V",
    detalhe: "Equipamento novo, instalação completa até 3 m",
    qtd: 2,
    preco: 2480
  },
  {
    descricao: "Infraestrutura elétrica dedicada",
    detalhe: "Cabo, disjuntor, conduíte e proteção",
    qtd: 2,
    preco: 380
  },
  {
    descricao: "Suporte reforçado para parede",
    detalhe: "Par de mãos-francesas em aço galvanizado",
    qtd: 2,
    preco: 180
  },
  {
    descricao: "Dreno e acabamento",
    detalhe: "Tubulação com caimento e acabamento",
    qtd: 2,
    preco: 120
  }
];

const subtotal = itens.reduce((t, i) => t + i.qtd * i.preco, 0);
const total = subtotal;

const custoInterno = Motor.calcular({
  equipamentos: [{ qtd: 2, custoUnit: 1690 }],
  materiais: [
    { qtd: 2, custoUnit: 210 },
    { qtd: 2, custoUnit: 95 },
    { qtd: 2, custoUnit: 55 }
  ],
  horasTrabalho: 10,
  valorHora: 42,
  deslocamentoKm: 24,
  custoPorKm: 1.8,
  rateioFixo: 60,
  impostoPct: 6,
  taxaCartaoPct: 3,
  margemAlvoPct: 30,
  descontoPct: 0
});

const moeda = (v) =>
  "R$ " + Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const doc = new PDFDocument({ size: "A4", margin: 48, autoFirstPage: true });
const destino = path.join(__dirname, "..", "amostra", "proposta-exemplo.pdf");
fs.mkdirSync(path.dirname(destino), { recursive: true });
const fluxo = fs.createWriteStream(destino);
doc.pipe(fluxo);

const LARGURA = doc.page.width - 96;
let y = 70;

// Faixa de aviso
doc.rect(0, 0, doc.page.width, 30).fill("#B03A2E");
doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(9)
  .text("DOCUMENTO DE EXEMPLO — EMPRESA E CLIENTE FICTÍCIOS. NÃO É UMA PROPOSTA REAL.", 48, 10, {
    width: LARGURA,
    align: "center",
    lineBreak: false
  });

// Cabeçalho
doc.fillColor(AZUL).font("Helvetica-Bold").fontSize(20).text("Clima Frio Instalações", 48, y, { lineBreak: false });
y += 25;
doc.fillColor(CINZA).font("Helvetica").fontSize(8.5)
  .text("Empresa fictícia usada como demonstração  ·  CNPJ 00.000.000/0001-00  ·  (00) 00000-0000  ·  contato@exemplo.com.br", 48, y, { width: LARGURA, lineBreak: false });
y += 22;

doc.fillColor(AZUL).font("Helvetica-Bold").fontSize(11).text("PROPOSTA COMERCIAL", 48, y, { lineBreak: false });
doc.fillColor(CINZA).font("Helvetica").fontSize(8.5)
  .text("Proposta nº 2026-0147  ·  Emissão 18/11/2026  ·  Validade 7 dias", 48, y + 1, { width: LARGURA, align: "right", lineBreak: false });
y += 18;
doc.moveTo(48, y).lineTo(doc.page.width - 48, y).lineWidth(1).strokeColor(LINHA).stroke();
y += 12;

// Dados do cliente
function coluna(rotulo, valor, x, largura) {
  doc.fillColor(CINZA).font("Helvetica").fontSize(7.5).text(rotulo, x, y, { width: largura, lineBreak: false });
  doc.fillColor(ESCURO).font("Helvetica-Bold").fontSize(9.5).text(valor, x, y + 11, { width: largura, lineBreak: false });
}
coluna("CLIENTE", "Condomínio Vista Verde", 48, 190);
coluna("LOCAL", "São Paulo / SP", 250, 150);
coluna("RESPONSÁVEL", "Técnico responsável", 410, 134);
y += 34;

// Escopo
doc.fillColor(AZUL).font("Helvetica-Bold").fontSize(10).text("1. Escopo do serviço", 48, y, { lineBreak: false });
y += 15;
const escopo =
  "Fornecimento e instalação de 2 (dois) aparelhos split, com infraestrutura elétrica dedicada, suporte de fixação, " +
  "dreno e acabamento. Inclui teste de estanqueidade, vácuo, carga de gás e demonstração de uso ao cliente.";
doc.fillColor(ESCURO).font("Helvetica").fontSize(9)
  .text(escopo, 48, y, { width: LARGURA, align: "justify", lineGap: 1.5 });
y += doc.heightOfString(escopo, { width: LARGURA, lineGap: 1.5 }) + 14;

// Tabela
doc.rect(48, y, LARGURA, 20).fill(CLARO);
doc.fillColor(AZUL).font("Helvetica-Bold").fontSize(7.5)
  .text("ITEM", 54, y + 7, { width: 280, lineBreak: false })
  .text("QTD", 360, y + 7, { width: 30, align: "center", lineBreak: false })
  .text("UNITÁRIO", 400, y + 7, { width: 70, align: "right", lineBreak: false })
  .text("TOTAL", 480, y + 7, { width: 60, align: "right", lineBreak: false });
y += 26;

itens.forEach((item) => {
  const alturaDetalhe = doc.font("Helvetica").fontSize(7.5)
    .heightOfString(item.detalhe, { width: 290 });
  doc.fillColor(ESCURO).font("Helvetica-Bold").fontSize(8.5)
    .text(item.descricao, 54, y, { width: 290, lineBreak: false });
  doc.fillColor(CINZA).font("Helvetica").fontSize(7.5)
    .text(item.detalhe, 54, y + 11, { width: 290 });
  doc.fillColor(ESCURO).font("Helvetica").fontSize(8.5)
    .text(String(item.qtd), 360, y, { width: 30, align: "center", lineBreak: false })
    .text(moeda(item.preco), 400, y, { width: 70, align: "right", lineBreak: false })
    .text(moeda(item.qtd * item.preco), 480, y, { width: 60, align: "right", lineBreak: false });
  y += 13 + alturaDetalhe + 8;
});

doc.moveTo(48, y - 2).lineTo(doc.page.width - 48, y - 2).strokeColor(LINHA).stroke();
y += 8;

doc.fillColor(CINZA).font("Helvetica").fontSize(9)
  .text("Subtotal", 360, y, { width: 80, align: "right", lineBreak: false })
  .text("Desconto", 360, y + 14, { width: 80, align: "right", lineBreak: false });
doc.fillColor(ESCURO).font("Helvetica").fontSize(9)
  .text(moeda(subtotal), 460, y, { width: 80, align: "right", lineBreak: false })
  .text(moeda(0), 460, y + 14, { width: 80, align: "right", lineBreak: false });

doc.rect(352, y + 32, 188, 26).fill(AZUL);
doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(9)
  .text("TOTAL", 362, y + 41, { width: 60, align: "right", lineBreak: false });
doc.fontSize(11.5).text(moeda(total), 440, y + 39, { width: 92, align: "right", lineBreak: false });
y += 72;

// Condições
doc.fillColor(AZUL).font("Helvetica-Bold").fontSize(10).text("2. Condições", 48, y, { lineBreak: false });
y += 15;
const condicoes = [
  ["Pagamento", "Pix com 5% de desconto ou cartão em até 3x sem juros"],
  ["Execução", "3 dias úteis após a aprovação"],
  ["Garantia", "90 dias no serviço; equipamento conforme o fabricante"],
  ["Não inclui", "Obra civil, andaimes e reforma do quadro elétrico geral"]
];
condicoes.forEach(([rotulo, texto]) => {
  doc.fillColor(CINZA).font("Helvetica").fontSize(8).text(rotulo, 48, y, { width: 70, lineBreak: false });
  doc.fillColor(ESCURO).font("Helvetica").fontSize(8.5).text(texto, 120, y, { width: LARGURA - 72, lineBreak: false });
  y += 15;
});

// Manutenção
y += 6;
doc.rect(48, y, LARGURA, 52).fill("#F7FAFC").stroke(LINHA);
doc.fillColor(AZUL).font("Helvetica-Bold").fontSize(9).text("3. Manutenção preventiva (opcional)", 58, y + 8, { lineBreak: false });
doc.fillColor(ESCURO).font("Helvetica").fontSize(8)
  .text("Plano trimestral: limpeza de filtros, higienização da evaporadora, medição de carga e relatório técnico. " +
    "R$ 190,00 por equipamento a cada visita, contrato mínimo de 4 visitas.", 58, y + 22, { width: LARGURA - 20, lineGap: 1 });
y += 62;

// Assinaturas
doc.fillColor(ESCURO).font("Helvetica-Bold").fontSize(8.5)
  .text("Aprovação do cliente", 48, y, { width: 200, lineBreak: false })
  .text("Clima Frio Instalações", 330, y, { width: 200, lineBreak: false });
y += 34;
doc.moveTo(48, y).lineTo(250, y).strokeColor("#8FA3AF").stroke();
doc.moveTo(330, y).lineTo(520, y).strokeColor("#8FA3AF").stroke();
doc.fillColor(CINZA).font("Helvetica").fontSize(7)
  .text("Nome, assinatura e data", 48, y + 5, { width: 200, lineBreak: false })
  .text("Responsável técnico", 330, y + 5, { width: 200, lineBreak: false });

// Rodapé
const rodape =
  "Documento de demonstração gerado pelo OrçaClima. Empresa, cliente, CNPJ e valores são fictícios e existem apenas " +
  "para mostrar o formato final da proposta. Não substitui a análise de responsável técnico nem contrato assinado.";
const alturaRodape = doc.font("Helvetica").fontSize(6.5).heightOfString(rodape, { width: LARGURA - 40, align: "center" });
const yRodape = doc.page.height - 34 - alturaRodape;
console.log("y final do conteudo:", y.toFixed(1), "| y do rodape:", yRodape.toFixed(1), "| altura rodape:", alturaRodape.toFixed(1));
doc.fillColor("#8FA3AF").fontSize(6.5)
  .text(rodape, 68, yRodape, { width: LARGURA - 40, align: "center", lineGap: 1, height: alturaRodape + 4 });

doc.end();

fluxo.on("finish", () => {
  console.log("PDF gerado:", destino);
  console.log("Custo interno:", moeda(custoInterno.custoDireto), "| Preço:", moeda(total));
  const lucro = total - custoInterno.impostoRetido - custoInterno.taxaRetida - custoInterno.custoDireto;
  console.log("Lucro no exemplo:", moeda(lucro), "| Margem:", custoInterno.margemEfetivaPct + "%");
});
