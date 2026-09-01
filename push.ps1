$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

# ─────────────────────────────── Config ───────────────────────────────

$iconesEscopo = @{
    "sistema"   = "🛡️"
    "ui"        = "🖥️"
    "ux"        = "🧭"
    "dados"     = "🗄️"
    "sync"      = "🔄"
    "placar"    = "⚽"
    "geral"     = "✨"
}

$tipos  = @("feat", "fix", "refactor", "docs", "style", "test", "chore")
$escopos = @("sistema", "ui", "ux", "dados", "sync", "placar", "geral")

$ci    = "Cyan"
$cn    = "Green"
$cr    = "Red"
$cy    = "Yellow"
$cgray = "Gray"

# ─────────────────────────────── Helpers ───────────────────────────────

function Sep() { Write-Host ("  " + ("─" * 52)) -ForegroundColor $cgray }

function Titulo($t) { Write-Host ""; Write-Host ("  ◆ " + $t) -ForegroundColor $ci }

function Info($m) { Write-Host ("  " + $m) -ForegroundColor White }

function Ok($m) { Write-Host ("  ✓ " + $m) -ForegroundColor $cn }

function Wrn($m) { Write-Host ("  ! " + $m) -ForegroundColor $cy }

function Err($m) { Write-Host ""; Write-Host ("  ✗ " + $m) -ForegroundColor $cr; exit 1 }

function Elegir($prompt) { Read-Host $prompt }

function Int($s) {
    if ($s -match '^\d+$') { return [int]$s }
    return $null
}

function RamoActual() {
    try {
        $r = (git rev-parse --abbrev-ref HEAD 2>&1)
        if ($r -and $r.Trim() -ne "HEAD") { return $r.Trim() }
    } catch {}
    return "detached"
}

function Limpiar() {
    Clear-Host
    Write-Host ("  " + ("─" * 52)) -ForegroundColor $ci
    Write-Host ("  PELOTENSE-ESPORTES · GIT PUSH   Rama: $rama") -ForegroundColor $ci
    Write-Host ("  " + ("─" * 52)) -ForegroundColor $ci
    Write-Host ""
}

$rama = RamoActual

# ─────────────────────────────── Tipo ───────────────────────────────

Limpiar
Titulo "Tipo de commit"
for ($i = 0; $i -lt $tipos.Count; $i++) {
    Write-Host ("     {0}. {1}" -f ($i + 1), $tipos[$i]) -ForegroundColor White
}
$seleccion = Elegir "     Tipo [1-7]: "
$idx = Int $seleccion
if ($idx -eq $null -or $idx -lt 1 -or $idx -gt $tipos.Count) { Err "Tipo invalido." }
$tipo = $tipos[$idx - 1]
Ok "Tipo → $tipo"

# ─────────────────────────────── Escopo ───────────────────────────────

Limpiar
Titulo "Escopo"
Write-Host "     0. (sin escopo)" -ForegroundColor $cgray
for ($i = 0; $i -lt $escopos.Count; $i++) {
    Write-Host ("     {0}. {1}   {2}" -f ($i + 1), $iconesEscopo[$escopos[$i]], $escopos[$i]) -ForegroundColor White
}
$seleccionScopo = Elegir "     Escopo [0-$($escopos.Count)], o escribe uno propio: "

$escopo = $null
$icone = $null
$n = Int $seleccionScopo
if ($n -ne $null) {
    if ($n -eq 0) {
        $escopo = ""
    } elseif ($n -ge 1 -and $n -le $escopos.Count) {
        $escopo = $escopos[$n - 1]
        $icone = $iconesEscopo[$escopo]
    } else {
        Err "Escopo invalido."
    }
} else {
    $escopo = $seleccionScopo.Trim()
    if (-not [string]::IsNullOrWhiteSpace($escopo)) {
        $icone = $iconesEscopo[$escopo.ToLower()]
    }
}

if ([string]::IsNullOrWhiteSpace($escopo)) {
    Ok "Escopo → ninguno"
} else {
    $etiquetaIcono = if ($icone) { "$icone  $escopo" } else { $escopo }
    Ok "Escopo → $etiquetaIcono"
}

# ─────────────────────────────── Descripcion ───────────────────────────────

Limpiar
Titulo "Descripcion"
$descripcion = Elegir "     Descripcion corta: "
if ([string]::IsNullOrWhiteSpace($descripcion)) { Err "La descripcion es obligatoria." }
Ok "Descripcion introducida."

# ─────────────────────────────── Mensaje ───────────────────────────────

$prefixo = if ($icone) { "$icone " } else { "" }
$mensaje = if ([string]::IsNullOrWhiteSpace($escopo)) {
    "${tipo}: $descripcion"
} else {
    "${prefixo}${tipo}($escopo): $descripcion"
}

# ─────────────────────────────── Resumen ───────────────────────────────

Titulo "Resumen"
Info "  Tipo:      $tipo"
Write-Host ("  Escopo:    " + ($escopo -or "-")) -ForegroundColor $cgray
Info "  Mensaje:   $mensaje"
Info "  Rama:      $rama"

$estado = (git status --short 2>&1 | Out-String).Trim()
Write-Host ""
Info "Archivos modificados:"
if ([string]::IsNullOrWhiteSpace($estado)) {
    Wrn "No hay cambios pendientes (repositorio limpio)."
} else {
    Write-Host ("  " + $estado) -ForegroundColor $cgray
}
Write-Host ""
Sep

# ─────────────────────────────── Confirmacion ───────────────────────────────

Limpiar
Titulo "Confirmacion"
Info "  Mensaje:   $mensaje"
Info "  Rama:      $rama"
Write-Host ""
Info "Archivos modificados:"
if ([string]::IsNullOrWhiteSpace($estado)) {
    Wrn "No hay cambios pendientes (repositorio limpio)."
} else {
    Write-Host ("  " + $estado) -ForegroundColor $cgray
}
Write-Host ""
Sep
$confirm = Elegir "  ⚡ ¿Confirmar add, commit y push? (s/N) "
if ($confirm -notmatch '^[sS]$') {
    Write-Host ""
    Wrn "Operacion cancelada."
    exit 1
}

# ─────────────────────────────── Ejecucion ───────────────────────────────

Titulo "Ejecutando"
git add -A
if ($LASTEXITCODE -ne 0) { Err "Fallo en 'git add'." }
Ok "Cambios stageados."

git commit -m $mensaje
if ($LASTEXITCODE -ne 0) { Err "Fallo en 'git commit'." }
Ok "Commit creado: $mensaje"

git push
if ($LASTEXITCODE -ne 0) { Err "Fallo en 'git push'." }
Ok "Push completado."

Write-Host ""
Write-Host ("  ★ Commit enviado a la rama " + $rama) -ForegroundColor $cn
Sep
Write-Host ""