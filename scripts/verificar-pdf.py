#!/usr/bin/env python3
"""
Verificação estrutural do PDF gerado, sem depender de renderizador externo.
Confere: número de páginas, posição de cada texto (nada fora da folha) e presença dos blocos obrigatórios.
"""
import re
import sys
import zlib

CAMINHO = sys.argv[1] if len(sys.argv) > 1 else "amostra/proposta-exemplo.pdf"
ALTURA_A4 = 841.89
LARGURA_A4 = 595.28

dados = open(CAMINHO, "rb").read()
margem = re.search(rb"/Count (\d+)", dados)
paginas = int(margem.group(1)) if margem else 0

streams = re.findall(rb"stream\r?\n(.*?)endstream", dados, re.S)


def decodificar_hex(hexa: bytes) -> str:
    try:
        return bytes.fromhex(hexa.decode("ascii")).decode("cp1252", "replace")
    except ValueError:
        return ""


def extrair_texto(bloco: bytes) -> str:
    pedacos = []
    for m in re.finditer(rb"<([0-9A-Fa-f\s]+)>|\(((?:[^()\\]|\\.)*)\)", bloco):
        if m.group(1):
            pedacos.append(decodificar_hex(re.sub(rb"\s", b"", m.group(1))))
        else:
            pedacos.append(m.group(2).decode("cp1252", "replace"))
    return "".join(pedacos)


textos = []
posicoes = []
for bruto in streams:
    try:
        conteudo = zlib.decompress(bruto)
    except zlib.error:
        continue
    for m in re.finditer(rb"BT(.*?)ET", conteudo, re.S):
        bloco = m.group(1)
        tm = re.search(rb"1 0 0 1 ([-\d.]+) ([-\d.]+) Tm", bloco)
        if tm:
            x = float(tm.group(1))
            y = ALTURA_A4 - float(tm.group(2))  # sistema de coordenadas invertido
            posicoes.append((x, y))
        trecho = extrair_texto(bloco)
        if trecho.strip():
            textos.append(trecho)

conteudo_total = " ".join(textos)

obrigatorios = [
    "DOCUMENTO DE EXEMPLO",
    "Clima Frio Instala",
    "PROPOSTA COMERCIAL",
    "Escopo do servi",
    "Condi",
    "TOTAL",
    "Manuten",
    "fictícios",
]

problemas = []
if paginas != 1:
    problemas.append(f"esperado 1 página, encontrado {paginas}")
for x, y in posicoes:
    if y < 0 or y > ALTURA_A4:
        problemas.append(f"texto fora da folha em y={y:.1f}")
    if x < 0 or x > LARGURA_A4:
        problemas.append(f"texto fora da folha em x={x:.1f}")
for termo in obrigatorios:
    if termo not in conteudo_total:
        problemas.append(f"bloco ausente: {termo}")

print(f"arquivo: {CAMINHO}")
print(f"páginas: {paginas}")
print(f"blocos de texto: {len(textos)}")
print(f"caracteres extraídos: {len(conteudo_total)}")
print("início:", conteudo_total[:170])
if problemas:
    print("FALHAS:")
    for p in problemas:
        print(" -", p)
    sys.exit(1)
print("OK: layout dentro da folha e blocos obrigatórios presentes")
