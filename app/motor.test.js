/*
 * Testes do motor de orçamento.
 * Executar: node --test app/motor.test.js
 */
const test = require("node:test");
const assert = require("node:assert");
const Motor = require("./motor.js");

const casoBase = {
  equipamentos: [{ descricao: "Split 12.000 BTUs", qtd: 1, custoUnit: 1900 }],
  materiais: [{ descricao: "Kit instalação 3m", qtd: 1, custoUnit: 250 }],
  horasTrabalho: 6,
  valorHora: 45,
  deslocamentoKm: 20,
  custoPorKm: 1.8,
  rateioFixo: 40,
  impostoPct: 6,
  taxaCartaoPct: 3,
  margemAlvoPct: 30,
  descontoPct: 0
};

test("custo direto soma equipamentos, materiais, mão de obra, deslocamento e rateio", () => {
  const r = Motor.calcular(casoBase);
  // 1900 + 250 + 270 + 36 + 40 = 2496
  assert.strictEqual(r.custoDireto, 2496);
  assert.strictEqual(r.custoMaoDeObra, 270);
  assert.strictEqual(r.custoDeslocamento, 36);
});

test("imposto, taxa e margem incidem sobre o preço (divisão, não soma)", () => {
  const r = Motor.calcular({ custoDiretoSimulado: 0, equipamentos: [{ qtd: 1, custoUnit: 1000 }], impostoPct: 6, taxaCartaoPct: 3, margemAlvoPct: 30 });
  // divisor = 1 - 0,39 = 0,61 -> 1639,34
  assert.strictEqual(r.divisor, 0.61);
  assert.strictEqual(r.precoFinal, 1639.34);
  assert.strictEqual(r.margemEfetivaPct, 30);
});

test("margem efetiva bate com a meta quando não há desconto", () => {
  const r = Motor.calcular(casoBase);
  assert.strictEqual(r.margemEfetivaPct, 30);
});

test("lucro é o que sobra depois de imposto, taxa e custo", () => {
  const r = Motor.calcular(casoBase);
  const esperado = r.precoFinal - r.impostoRetido - r.taxaRetida - r.custoDireto;
  assert.ok(Math.abs(r.lucro - esperado) < 0.02, `lucro ${r.lucro} vs ${esperado}`);
});

test("desconto alto gera alerta crítico de prejuízo", () => {
  const r = Motor.calcular(Object.assign({}, casoBase, { descontoPct: 60 }));
  assert.ok(r.lucro < 0);
  assert.ok(r.alertas.some((a) => a.nivel === "critico"));
});

test("divisor inválido não quebra o cálculo e emite alerta", () => {
  const r = Motor.calcular({ equipamentos: [{ qtd: 1, custoUnit: 100 }], impostoPct: 40, taxaCartaoPct: 30, margemAlvoPct: 40 });
  assert.ok(r.alertas.some((a) => a.nivel === "critico"));
  assert.ok(Number.isFinite(r.precoFinal));
});

test("preço de equilíbrio zera o lucro", () => {
  const p = Motor.precoDeEquilibrio(casoBase);
  const r = Motor.calcular(Object.assign({}, casoBase, { margemAlvoPct: 0, descontoPct: 0 }));
  assert.ok(Math.abs(p - r.precoFinal) < 0.01);
  const confere = Motor.calcular({
    equipamentos: [{ qtd: 1, custoUnit: r.custoDireto }],
    impostoPct: 6,
    taxaCartaoPct: 3,
    margemAlvoPct: 0
  });
  assert.ok(Math.abs(confere.lucro) < 0.02, `lucro no equilíbrio: ${confere.lucro}`);
});

test("valores negativos ou lixo não viram custo", () => {
  const r = Motor.calcular({
    equipamentos: [{ qtd: -3, custoUnit: 100 }],
    horasTrabalho: "abc",
    valorHora: 50,
    impostoPct: 0,
    taxaCartaoPct: 0,
    margemAlvoPct: 10
  });
  assert.strictEqual(r.custoDireto, 0);
  assert.strictEqual(r.precoFinal, 0);
});

test("orçamento vazio avisa em vez de inventar número", () => {
  const r = Motor.calcular({});
  assert.strictEqual(r.custoDireto, 0);
  assert.strictEqual(r.precoFinal, 0);
  assert.ok(r.alertas.some((a) => a.mensagem.includes("vazio")));
});

test("markup e margem são grandezas diferentes", () => {
  const r = Motor.calcular({ equipamentos: [{ qtd: 1, custoUnit: 100 }], impostoPct: 0, taxaCartaoPct: 0, margemAlvoPct: 50 });
  // preço 200 sobre custo 100 -> markup 100%, margem 50%
  assert.strictEqual(r.precoFinal, 200);
  assert.strictEqual(r.markUpPct, 100);
  assert.strictEqual(r.margemEfetivaPct, 50);
});
