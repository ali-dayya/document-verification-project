$python = Get-Command python -ErrorAction SilentlyContinue

if (-not $python) {
    $localPython = "C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
    if (Test-Path $localPython) {
        $python = $localPython
    } else {
        Write-Host "Python was not found. Install Python or add it to PATH."
        exit 1
    }
} else {
    $python = $python.Source
}

& $python manage.py migrate
& $python manage.py runserver 127.0.0.1:8000
