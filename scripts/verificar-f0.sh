#!/usr/bin/env bash
# Coleta evidências verificáveis da F0 num arquivo com data e hora.
# Uso: bash scripts/verificar-f0.sh
set -uo pipefail

cd "$(dirname "$0")/.."
SAIDA="registros/evidencias-f0.txt"
BASE="https://onirico-dev.github.io/orcaclima"

{
  echo "EVIDENCIAS F0 — OrçaClima"
  echo "coletado em: $(date -u +'%Y-%m-%dT%H:%M:%SZ') (UTC)"
  echo "diretorio: $(pwd)"
  echo
  echo "== ambiente =="
  echo "node: $(node --version)"
  echo "python: $(python3 --version 2>&1)"
  echo
  echo "== testes do motor =="
  node --test app/motor.test.js 2>&1 | grep -E "^ℹ (tests|pass|fail)"
  echo
  echo "== proposta-modelo =="
  echo "arquivo: amostra/proposta-exemplo.pdf"
  echo "md5: $(md5sum amostra/proposta-exemplo.pdf | cut -d' ' -f1)"
  echo "bytes: $(wc -c < amostra/proposta-exemplo.pdf)"
  python3 scripts/verificar-pdf.py 2>&1 | sed 's/^/  /'
  echo
  echo "== paginas publicadas (HTTP) =="
  for caminho in "/" "/amostra/proposta-exemplo.pdf" "/sitemap.xml" "/robots.txt" "/e2b7c6a70679be9c9b4baa52559b88a9.txt"; do
    codigo=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "$BASE$caminho")
    echo "  $caminho -> HTTP $codigo"
  done
  echo
  echo "== integridade do PDF servido =="
  curl -s --max-time 25 "$BASE/amostra/proposta-exemplo.pdf" -o .tmp-publicacao/servido.pdf
  echo "  md5 local:    $(md5sum amostra/proposta-exemplo.pdf | cut -d' ' -f1)"
  echo "  md5 servido:  $(md5sum .tmp-publicacao/servido.pdf | cut -d' ' -f1)"
  echo
  echo "== contadores de demanda (hits.sh) =="
  echo "  atencao: a leitura do contador tambem incrementa 1. O valor exibido ja inclui essa leitura."
  for chave in "" "/amostra" "/pedido"; do
    valor=$(curl -s --max-time 20 "https://hits.sh/onirico-dev.github.io/orcaclima$chave.svg" | grep -o '>[0-9]\+<' | head -1 | tr -d '><')
    echo "  contador${chave:-/visita}: ${valor:-indisponivel}"
  done
  echo
  echo "== trafego do repositorio (API GitHub, janela de 14 dias) =="
  gh api repos/Onirico-Dev/orcaclima/traffic/views --jq '"  visualizacoes: \(.count) | visitantes unicos: \(.uniques)"' 2>/dev/null || echo "  indisponivel"
  echo
  echo "== repositorio =="
  gh api repos/Onirico-Dev/orcaclima --jq '"  visibilidade: " + .visibility + " | pages: " + (.has_pages|tostring)' 2>/dev/null
  echo "  ultimo commit local: $(git log -1 --format='%h %s')"
  echo
  echo "== financeiro =="
  node scripts/gerar-painel.js 2>&1 | sed 's/^/  /'
} | tee "$SAIDA"

echo
echo "evidencias gravadas em $SAIDA"
