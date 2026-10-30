<#
  comprimir-videos.ps1
  Reduz o tamanho dos videos (.mp4 e .webm) do projeto para rodar melhor no 4G.

  Uso (na raiz do projeto, no terminal do VS Code):
    .\comprimir-videos.ps1
    .\comprimir-videos.ps1 -Pasta .\assets -Altura 480 -Crf 30
    .\comprimir-videos.ps1 -SemAudio        # tira o audio (ideal para videos de fundo/loop)

  Requer ffmpeg instalado:  winget install Gyan.FFmpeg
  Os originais ficam salvos em "originais_backup" (nao some nada).
#>
param(
    [string]$Pasta = ".",
    [int]$Altura = 480,     # altura maxima (480 = bom para celular; 360 = mais leve)
    [int]$Crf = 28,         # qualidade: maior = menor arquivo (24 bom, 28 leve, 32 bem leve)
    [switch]$SemAudio
)

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Host "ffmpeg nao encontrado. Instale com: winget install Gyan.FFmpeg" -ForegroundColor Red
    exit 1
}

$raiz = (Resolve-Path $Pasta).Path
$backup = Join-Path $raiz "originais_backup"
$vf = "scale=-2:'min($Altura,ih)'"

$videos = Get-ChildItem -Path $raiz -Recurse -File -Include *.mp4, *.webm |
    Where-Object { $_.FullName -notlike "*\originais_backup\*" -and $_.FullName -notlike "*\node_modules\*" -and $_.Name -notlike "~tmp_*" }

if (-not $videos) { Write-Host "Nenhum video encontrado em $raiz"; exit 0 }

$totalAntes = 0
$totalDepois = 0

foreach ($v in $videos) {
    $rel = $v.FullName.Substring($raiz.Length).TrimStart('\')
    $tmp = Join-Path $v.DirectoryName ("~tmp_" + $v.Name)
    $antes = $v.Length

    if ($v.Extension -ieq ".webm") {
        $args = @('-y', '-loglevel', 'error', '-i', $v.FullName, '-vf', $vf,
                  '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', ($Crf + 6), '-row-mt', '1')
        if ($SemAudio) { $args += '-an' } else { $args += @('-c:a', 'libopus', '-b:a', '64k') }
    } else {
        $args = @('-y', '-loglevel', 'error', '-i', $v.FullName, '-vf', $vf,
                  '-c:v', 'libx264', '-preset', 'veryfast', '-crf', $Crf,
                  '-pix_fmt', 'yuv420p', '-movflags', '+faststart')
        if ($SemAudio) { $args += '-an' } else { $args += @('-c:a', 'aac', '-b:a', '96k') }
    }
    $args += $tmp

    Write-Host "Comprimindo: $rel" -NoNewline
    & ffmpeg @args

    if ($LASTEXITCODE -ne 0 -or -not (Test-Path $tmp)) {
        Write-Host "  -> erro, mantido original" -ForegroundColor Red
        if (Test-Path $tmp) { Remove-Item $tmp -Force }
        continue
    }

    $depois = (Get-Item $tmp).Length
    if ($depois -lt $antes) {
        $destBackup = Join-Path $backup $rel
        New-Item -ItemType Directory -Force -Path (Split-Path $destBackup) | Out-Null
        Copy-Item $v.FullName $destBackup -Force
        Move-Item $tmp $v.FullName -Force
        $totalAntes += $antes
        $totalDepois += $depois
        Write-Host ("  -> {0:N1} MB para {1:N1} MB" -f ($antes / 1MB), ($depois / 1MB)) -ForegroundColor Green
    } else {
        Remove-Item $tmp -Force
        Write-Host "  -> ja estava otimizado, mantido original" -ForegroundColor Yellow
    }
}

if ($totalAntes -gt 0) {
    Write-Host ("`nTotal: {0:N1} MB para {1:N1} MB (economia de {2:N0}%)" -f ($totalAntes / 1MB), ($totalDepois / 1MB), (100 - ($totalDepois / $totalAntes * 100))) -ForegroundColor Cyan
    Write-Host "Originais guardados em: $backup (coloque no .gitignore se nao quiser subir)"
}
