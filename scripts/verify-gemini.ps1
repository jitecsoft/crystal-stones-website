# Verifies the Gemini key and model used by the catalogue assistant ("Fill with AI").
#
#   cd "C:\Users\Sabri.J\crystal-stones-website"
#   powershell -ExecutionPolicy Bypass -File ".\scripts\verify-gemini.ps1"
#
# Reads AI_API_KEY / AI_BASE_URL / AI_MODEL from .env.local when present,
# otherwise asks for the key on screen. The key is never written to disk.

param(
  [string]$Key = "",
  [string]$Model = "",
  [string]$BaseUrl = ""
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root ".env.local"

function Read-DotEnv($path) {
  $values = @{}
  if (-not (Test-Path $path)) { return $values }
  foreach ($line in Get-Content $path) {
    $trimmed = $line.Trim()
    if (-not $trimmed -or $trimmed.StartsWith("#")) { continue }
    $index = $trimmed.IndexOf("=")
    if ($index -lt 1) { continue }
    $name = $trimmed.Substring(0, $index).Trim()
    $value = $trimmed.Substring($index + 1).Trim().Trim('"')
    $values[$name] = $value
  }
  return $values
}

$fileValues = Read-DotEnv $envFile
if (-not $Key) { $Key = $fileValues["AI_API_KEY"] }
if (-not $BaseUrl) { $BaseUrl = $fileValues["AI_BASE_URL"] }
if (-not $Model) { $Model = $fileValues["AI_MODEL"] }
if (-not $BaseUrl) { $BaseUrl = "https://generativelanguage.googleapis.com/v1beta/openai" }
if (-not $Model) { $Model = "gemini-3.6-flash" }

if (-not $Key) {
  Write-Host ""
  Write-Host "No AI_API_KEY found in .env.local." -ForegroundColor Yellow
  $Key = Read-Host "Paste your Gemini key (AIza..., hidden nothing, stays in this session)"
}

Write-Host ""
Write-Host "Base URL : $BaseUrl" -ForegroundColor Cyan
Write-Host "Model    : $Model" -ForegroundColor Cyan
Write-Host ""

$candidates = @($Model) + @("gemini-flash-latest", "gemini-3.7-flash", "gemini-3.8-flash", "gemini-3.5-flash") | Select-Object -Unique

foreach ($candidate in $candidates) {
  $payload = @{
    model = $candidate
    messages = @(@{ role = "user"; content = "Reply with the single word: ready" })
  } | ConvertTo-Json -Depth 5

  try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/chat/completions" -Method POST `
      -Headers @{ Authorization = "Bearer $Key" } -ContentType "application/json" -Body $payload -TimeoutSec 60
    Write-Host "RESULT   : $($response.choices[0].message.content)" -ForegroundColor Green
    Write-Host "MODEL USED: $($response.model)"
    if ($response.usage) { Write-Host "TOKENS   : $($response.usage.total_tokens) total" -ForegroundColor DarkGray }
    Write-Host ""
    Write-Host "The key, model and endpoint are working." -ForegroundColor Green
    Write-Host "Use this as AI_MODEL: $candidate" -ForegroundColor Green
    exit 0
  } catch {
    $status = $null
    $detail = ""
    if ($_.Exception.Response) {
      $status = [int]$_.Exception.Response.StatusCode
      try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $detail = $reader.ReadToEnd()
      } catch { $detail = "" }
    }
    Write-Host "FAILED   : $candidate -> HTTP $status" -ForegroundColor Red
    if ($status -eq 503 -or $status -eq 429) {
      Write-Host "          (busy right now, trying the next model)" -ForegroundColor Yellow
      continue
    }
    if ($detail) { Write-Host $detail -ForegroundColor Red }
    if ($detail -match "no longer available") {
      Write-Host ""
      Write-Host "Google retired that model for new accounts. Use a current one, e.g. gemini-3.8-flash." -ForegroundColor Yellow
    }
    break
  }
}

Write-Host ""
Write-Host "Listing the models this key can use:" -ForegroundColor Yellow
try {
  $models = Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models?key=$Key" -TimeoutSec 45
  $models.models |
    Where-Object { $_.supportedGenerationMethods -contains "generateContent" } |
    Select-Object -ExpandProperty name |
    Sort-Object |
    ForEach-Object { Write-Host "  $_" }
} catch {
  Write-Host "  (could not list models - check the key itself)" -ForegroundColor Red
}
