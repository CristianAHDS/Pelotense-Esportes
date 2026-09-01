$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

$tipo = Read-Host "Tipo (feat, fix, refactor, docs, style, test, chore)"
$escopo = Read-Host "Escopo (opcional, ex: tabela, placar, tema)"
$descricao = Read-Host "Descricao curta"

if ([string]::IsNullOrWhiteSpace($tipo)) {
    Write-Host "Erro: tipo e obrigatorio." -ForegroundColor Red
    exit 1
}

if ([string]::IsNullOrWhiteSpace($descricao)) {
    Write-Host "Erro: descricao e obrigatoria." -ForegroundColor Red
    exit 1
}

if ([string]::IsNullOrWhiteSpace($escopo)) {
    $mensagem = "${tipo}: $descricao"
} else {
    $mensagem = "${tipo}($escopo): $descricao"
}

Write-Host ""
Write-Host "Mensagem: $mensagem"
Write-Host ""
Write-Host "Arquivos alterados:"
git status --short
Write-Host ""
$confirm = Read-Host "Stagear tudo, commitar e dar push? (s/N)"

if ($confirm -notmatch '^[sS]$') {
    Write-Host "Cancelado."
    exit 1
}

git add -A
git commit -m $mensagem
git push

Write-Host "Push concluido." -ForegroundColor Green