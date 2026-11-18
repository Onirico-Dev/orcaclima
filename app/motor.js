/*
 * MotorOrcamento — núcleo de cálculo do OrçaClima.
 * Roda no navegador e no Node (mesmo arquivo, sem dependências).
 *
 * Regra central: imposto, taxa de cartão e margem incidem SOBRE O PREÇO,
 * não sobre o custo. Por isso o cálculo usa divisão, e não soma de percentual.
 */
(function (raiz, fabrica) {
  if (typeof module === "object" && module.exports) {
    module.exports = fabrica();
  } else {
    raiz.MotorOrcamento = fabrica();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function numero(valor, padrao) {
    var n = Number(valor);
    if (!isFinite(n) || n < 0) return padrao === undefined ? 0 : padrao;
    return n;
  }

  function arredondar(valor, casas) {
    var f = Math.pow(10, casas === undefined ? 2 : casas);
    return Math.round((valor + Number.EPSILON) * f) / f;
  }

  function somarItens(itens) {
    if (!Array.isArray(itens)) return 0;
    return itens.reduce(function (total, item) {
      return total + numero(item.qtd) * numero(item.custoUnit);
    }, 0);
  }

  /**
   * Calcula um orçamento.
   * @param {object} entrada
   * @param {Array}  entrada.equipamentos  [{descricao, qtd, custoUnit}]
   * @param {Array}  entrada.materiais     [{descricao, qtd, custoUnit}]
   * @param {number} entrada.horasTrabalho
   * @param {number} entrada.valorHora
   * @param {number} entrada.deslocamentoKm
   * @param {number} entrada.custoPorKm
   * @param {number} entrada.rateioFixo    custos fixos rateados por serviço
   * @param {number} entrada.impostoPct    percentual sobre o preço (0-100)
   * @param {number} entrada.taxaCartaoPct percentual sobre o preço (0-100)
   * @param {number} entrada.margemAlvoPct margem desejada sobre o preço (0-99)
   * @param {number} entrada.descontoPct   desconto concedido (0-100)
   * @returns {object} resultado com custos, preços, lucro, margem e alertas
   */
  function calcular(entrada) {
    var e = entrada || {};
    var equipamentos = numero(somarItens(e.equipamentos));
    var materiais = numero(somarItens(e.materiais));
    var maoDeObra = numero(e.horasTrabalho) * numero(e.valorHora);
    var deslocamento = numero(e.deslocamentoKm) * numero(e.custoPorKm);
    var rateio = numero(e.rateioFixo);
    var custoDireto = equipamentos + materiais + maoDeObra + deslocamento + rateio;

    var imposto = numero(e.impostoPct) / 100;
    var taxa = numero(e.taxaCartaoPct) / 100;
    var margem = numero(e.margemAlvoPct) / 100;
    var desconto = numero(e.descontoPct) / 100;

    var divisor = 1 - (imposto + taxa + margem);
    var alertas = [];

    if (divisor <= 0) {
      alertas.push({
        nivel: "critico",
        mensagem:
          "Imposto + taxa + margem somam 100% ou mais. Não existe preço possível: reduza a margem alvo."
      });
      divisor = 0.01;
    }

    var precoCheio = custoDireto / divisor;
    var precoFinal = precoCheio * (1 - desconto);
    var retido = precoFinal * (imposto + taxa);
    var lucro = precoFinal - retido - custoDireto;
    var margemEfetiva = precoFinal > 0 ? (lucro / precoFinal) * 100 : 0;
    var markUp = custoDireto > 0 ? (precoFinal / custoDireto - 1) * 100 : 0;

    if (lucro < 0) {
      alertas.push({
        nivel: "critico",
        mensagem: "Neste preço o serviço dá prejuízo de " + formatarMoeda(-lucro) + "."
      });
    } else if (margemEfetiva < numero(e.margemAlvoPct) * 0.9) {
      alertas.push({
        nivel: "atencao",
        mensagem: "A margem real ficou abaixo da meta por causa do desconto."
      });
    }

    if (desconto > 0 && precoCheio > 0) {
      var perda = precoCheio - precoFinal;
      alertas.push({
        nivel: "info",
        mensagem: "Desconto de " + numero(e.descontoPct) + "% retira " + formatarMoeda(perda) + " do preço."
      });
    }

    if (custoDireto === 0) {
      alertas.push({ nivel: "info", mensagem: "Nenhum custo informado: o orçamento está vazio." });
    }

    return {
      custoEquipamentos: arredondar(equipamentos),
      custoMateriais: arredondar(materiais),
      custoMaoDeObra: arredondar(maoDeObra),
      custoDeslocamento: arredondar(deslocamento),
      custoRateio: arredondar(rateio),
      custoDireto: arredondar(custoDireto),
      precoCheio: arredondar(precoCheio),
      precoFinal: arredondar(precoFinal),
      impostoRetido: arredondar(precoFinal * imposto),
      taxaRetida: arredondar(precoFinal * taxa),
      lucro: arredondar(lucro),
      margemEfetivaPct: arredondar(margemEfetiva, 1),
      markUpPct: arredondar(markUp, 1),
      divisor: arredondar(divisor, 4),
      alertas: alertas
    };
  }

  /** Preço mínimo que apenas cobre custo, imposto e taxa (lucro zero). */
  function precoDeEquilibrio(entrada) {
    var copia = Object.assign({}, entrada, { margemAlvoPct: 0, descontoPct: 0 });
    return calcular(copia).precoFinal;
  }

  function formatarMoeda(valor) {
    return (
      "R$ " +
      Number(valor || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );
  }

  return {
    calcular: calcular,
    precoDeEquilibrio: precoDeEquilibrio,
    formatarMoeda: formatarMoeda,
    somarItens: somarItens
  };
});
