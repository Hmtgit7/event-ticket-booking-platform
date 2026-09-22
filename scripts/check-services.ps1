param(
    [ValidateSet("test", "package")]
    [string]$Goal = "test"
)
$ErrorActionPreference = "Continue"
$services = @("auth-service", "event-service", "booking-service", "payment-service")
foreach ($service in $services) {
    $serviceDir = Join-Path $PSScriptRoot "..\services\$service"
    Write-Host "==> Running Maven $Goal for $service"
    Push-Location $serviceDir
    try {
        if (Test-Path "mvnw.cmd") {
            & .\mvnw.cmd clean $Goal
        }
        else {
            & bash ./mvnw clean $Goal
        }
        if ($LASTEXITCODE -ne 0) { throw "$service Maven $Goal failed with exit code $LASTEXITCODE" }
    }
    finally { Pop-Location }
}

