param(
  [string]$OutputZip = ""
)

$ErrorActionPreference = "Stop"
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$deliverablesRoot = Join-Path $projectRoot "deliverables"
$packageName = "职前副本AI_V4_Demo"
$stageRoot = Join-Path $deliverablesRoot $packageName
$defaultZip = Join-Path $deliverablesRoot "职前副本AI_V4_Windows_Demo.zip"
if ([string]::IsNullOrWhiteSpace($OutputZip)) {
  $OutputZip = $defaultZip
}

function Assert-PathInsideDeliverables([string]$PathToCheck) {
  $parent = Split-Path -Parent $PathToCheck
  if (-not (Test-Path $parent)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }
  $resolvedParent = (Resolve-Path $parent).Path.TrimEnd('\')
  $resolvedDeliverables = (Resolve-Path $deliverablesRoot).Path.TrimEnd('\')
  if (-not $resolvedParent.StartsWith($resolvedDeliverables, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to modify a path outside deliverables: $PathToCheck"
  }
}

New-Item -ItemType Directory -Path $deliverablesRoot -Force | Out-Null
Assert-PathInsideDeliverables $stageRoot
Assert-PathInsideDeliverables $OutputZip

if (Test-Path $stageRoot) {
  Remove-Item -LiteralPath $stageRoot -Recurse -Force
}
if (Test-Path $OutputZip) {
  Remove-Item -LiteralPath $OutputZip -Force
}

$standalone = Join-Path $projectRoot ".next\standalone"
$static = Join-Path $projectRoot ".next\static"
$public = Join-Path $projectRoot "public"
foreach ($required in @($standalone, $static, $public)) {
  if (-not (Test-Path $required)) {
    throw "Missing build output: $required. Run npm.cmd run build first."
  }
}

$appRoot = Join-Path $stageRoot "app"
$runtimeRoot = Join-Path $stageRoot "runtime"
$toolsRoot = Join-Path $stageRoot "tools"
New-Item -ItemType Directory -Path $appRoot, $runtimeRoot, $toolsRoot -Force | Out-Null

Copy-Item -Path (Join-Path $standalone "*") -Destination $appRoot -Recurse -Force
New-Item -ItemType Directory -Path (Join-Path $appRoot ".next") -Force | Out-Null
Copy-Item -Path $static -Destination (Join-Path $appRoot ".next") -Recurse -Force
Copy-Item -Path $public -Destination $appRoot -Recurse -Force

$nodeVersion = "24.14.0"
$nodeArchive = Join-Path $env:TEMP "node-v$nodeVersion-win-x64.zip"
$nodeExtract = Join-Path $env:TEMP "career-copy-node-$nodeVersion"
$nodeUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-win-x64.zip"
if (-not (Test-Path $nodeArchive)) {
  Write-Host "Downloading official Node.js runtime..."
  Invoke-WebRequest -UseBasicParsing -Uri $nodeUrl -OutFile $nodeArchive
}
if (Test-Path $nodeExtract) {
  Remove-Item -LiteralPath $nodeExtract -Recurse -Force
}
Expand-Archive -LiteralPath $nodeArchive -DestinationPath $nodeExtract -Force
$nodeFolder = Join-Path $nodeExtract "node-v$nodeVersion-win-x64"
Copy-Item -LiteralPath (Join-Path $nodeFolder "node.exe") -Destination (Join-Path $runtimeRoot "node.exe")
Copy-Item -LiteralPath (Join-Path $nodeFolder "LICENSE") -Destination (Join-Path $runtimeRoot "NODE_LICENSE.txt")

$launcher = @'
$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$node = Join-Path $root "runtime\node.exe"
$server = Join-Path $root "app\server.js"
$config = Join-Path $root "config.env"
$pidFile = Join-Path $root ".demo.pid"
$portFile = Join-Path $root ".demo.port"
$stdout = Join-Path $root "demo-server.log"
$stderr = Join-Path $root "demo-server-error.log"

if (-not (Test-Path $node) -or -not (Test-Path $server)) {
  Write-Host "Demo files are incomplete. Please extract the ZIP again." -ForegroundColor Red
  Read-Host "Press Enter to close"
  exit 1
}

if (Test-Path $pidFile) {
  $oldPid = [int](Get-Content $pidFile -ErrorAction SilentlyContinue)
  $oldProcess = Get-Process -Id $oldPid -ErrorAction SilentlyContinue
  if ($oldProcess) {
    $oldPort = Get-Content $portFile -ErrorAction SilentlyContinue
    if ($oldPort) {
      Start-Process "http://localhost:$oldPort/v4"
      Write-Host "The demo is already running at http://localhost:$oldPort/v4" -ForegroundColor Green
      exit 0
    }
  }
  Remove-Item $pidFile, $portFile -Force -ErrorAction SilentlyContinue
}

if (Test-Path $config) {
  foreach ($line in Get-Content $config -Encoding UTF8) {
    $trimmed = $line.Trim()
    if (-not $trimmed -or $trimmed.StartsWith("#") -or -not $trimmed.Contains("=")) { continue }
    $parts = $trimmed.Split("=", 2)
    [Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1], "Process")
  }
}

$port = $null
foreach ($candidate in 3012..3020) {
  $listener = $null
  try {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $candidate)
    $listener.Start()
    $port = $candidate
    break
  } catch {
  } finally {
    if ($listener) { $listener.Stop() }
  }
}
if (-not $port) {
  Write-Host "Ports 3012-3020 are all occupied. Close another local service and retry." -ForegroundColor Red
  Read-Host "Press Enter to close"
  exit 1
}

$env:PORT = "$port"
$env:HOSTNAME = "127.0.0.1"
$env:NODE_ENV = "production"
Remove-Item $stdout, $stderr -Force -ErrorAction SilentlyContinue
$commandLine = "..\runtime\node.exe server.js 1>..\demo-server.log 2>..\demo-server-error.log"
$process = Start-Process -FilePath $env:ComSpec -ArgumentList @("/d", "/c", $commandLine) -WorkingDirectory (Join-Path $root "app") -WindowStyle Hidden -PassThru
Set-Content -LiteralPath $pidFile -Value $process.Id -Encoding ASCII
Set-Content -LiteralPath $portFile -Value $port -Encoding ASCII

$url = "http://localhost:$port/v4"
$ready = $false
for ($attempt = 0; $attempt -lt 50; $attempt++) {
  Start-Sleep -Milliseconds 400
  if ($process.HasExited) { break }
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
      $ready = $true
      break
    }
  } catch {
  }
}

if ($ready) {
  Write-Host ""
  Write-Host "Career Copy AI V4 is running." -ForegroundColor Green
  Write-Host "URL: $url"
  Write-Host "You can close this window. Use Stop Demo.bat when finished."
  Start-Process $url
  Start-Sleep -Seconds 2
  exit 0
}

if (-not $process.HasExited) {
  & taskkill.exe /PID $process.Id /T /F | Out-Null
}
Remove-Item $pidFile, $portFile -Force -ErrorAction SilentlyContinue
Write-Host "The demo failed to start." -ForegroundColor Red
if (Test-Path $stderr) {
  Write-Host ""
  Get-Content $stderr -Tail 20
}
Read-Host "Press Enter to close"
exit 1
'@

$stopper = @'
$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$pidFile = Join-Path $root ".demo.pid"
$portFile = Join-Path $root ".demo.port"

if (-not (Test-Path $pidFile)) {
  Write-Host "The demo is not running."
  Start-Sleep -Seconds 2
  exit 0
}

$demoPid = [int](Get-Content $pidFile)
$process = Get-CimInstance Win32_Process -Filter "ProcessId = $demoPid" -ErrorAction SilentlyContinue
if ($process) {
  $commandLine = [string]$process.CommandLine
  if ($process.Name -ieq "cmd.exe" -and $commandLine.Contains("runtime\node.exe server.js")) {
    & taskkill.exe /PID $demoPid /T /F | Out-Null
    Write-Host "Career Copy AI V4 has stopped." -ForegroundColor Green
  } else {
    Write-Host "PID verification failed. No unrelated process was stopped." -ForegroundColor Yellow
  }
} else {
  Write-Host "The demo process has already stopped."
}
Remove-Item $pidFile, $portFile -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
'@

$configurator = @'
$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$config = Join-Path $root "config.env"

Write-Host "Configure optional AI services" -ForegroundColor Cyan
Write-Host "Leave a key empty to use the built-in fallback."
Write-Host ""

function Read-Secret([string]$Prompt) {
  $secure = Read-Host $Prompt -AsSecureString
  if ($secure.Length -eq 0) { return "" }
  $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try { return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer) }
  finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
}

$aiKey = Read-Secret "DeepSeek API Key"
$tavilyKey = Read-Secret "Tavily API Key"
$lines = @(
  "AI_API_KEY=$aiKey",
  "AI_BASE_URL=https://api.deepseek.com",
  "AI_FAST_MODEL=deepseek-chat",
  "AI_REASONING_MODEL=deepseek-reasoner",
  "TAVILY_API_KEY=$tavilyKey"
)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllLines($config, $lines, $utf8NoBom)
Write-Host ""
Write-Host "Configuration saved locally to config.env." -ForegroundColor Green
Write-Host "Restart the demo for changes to take effect."
Read-Host "Press Enter to close"
'@

$startBat = @'
@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 职前副本 AI V4
echo.
echo 正在启动职前副本 AI V4，请稍候...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\launch.ps1"
if errorlevel 1 pause
'@

$stopBat = @'
@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\stop.ps1"
'@

$configureBat = @'
@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\configure-ai.ps1"
'@

$envExample = @'
# Optional. Leave blank to use the built-in fallback.
AI_API_KEY=
AI_BASE_URL=https://api.deepseek.com
AI_FAST_MODEL=deepseek-chat
AI_REASONING_MODEL=deepseek-reasoner
TAVILY_API_KEY=
'@

$readme = @'
职前副本 AI V4 - Windows 一键 Demo
====================================

一、开始体验
1. 请先完整解压 ZIP 文件，不要直接在压缩包中运行。
2. 双击“启动职前副本AI.bat”。
3. 等待浏览器自动打开。默认地址为 http://localhost:3012/v4。
4. 如果 3012 被占用，程序会自动尝试 3013-3020。
5. 演示结束后双击“停止职前副本AI.bat”。

二、推荐演示路线
职业数字分身 -> 分身试岗 -> 亲自验证 -> 试岗报告
-> 确认校准分身 -> 学习中心

高阶路径：
AI 岗位搜索 -> 选择岗位 -> JD 定制工作台 -> 定制试岗
-> AI 评价与报告 -> 校准分身 -> 成长路线

三、AI 功能
- 默认没有携带任何私人 API Key。
- 未配置 Key 或网络不可用时，系统会自动使用 fallback，完整流程仍可体验。
- 需要真实 AI 时，双击“配置AI密钥.bat”，填写自己的 DeepSeek 和 Tavily Key。
- Key 只保存在当前解压目录的 config.env 中，请勿将填写 Key 后的文件夹再次公开分享。

四、数据说明
- 用户数据、试岗记录和学习进度保存在当前浏览器 localStorage。
- 本 Demo 不使用数据库，不会自动上传简历或附件。
- 任务附件首版仅保存文件名、类型和大小，不解析文件内容。

五、常见问题
1. Windows Defender 提示：
   本包包含官方 Node.js 运行时和本地启动脚本。可选择“更多信息 -> 仍要运行”。
2. 浏览器没有自动打开：
   查看启动窗口显示的 URL，手动复制到浏览器。
3. 启动失败：
   查看 demo-server-error.log，并确认 3012-3020 端口没有全部被占用。
4. 页面还是旧内容：
   在浏览器按 Ctrl+F5 强制刷新。
5. 想清除体验数据：
   打开产品“设置”，选择清除本地 AI 数据，或清除 localhost 的浏览器站点数据。

运行要求：Windows 10/11 x64
产品入口：/v4
'@

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $toolsRoot "launch.ps1"), $launcher, $utf8NoBom)
[System.IO.File]::WriteAllText((Join-Path $toolsRoot "stop.ps1"), $stopper, $utf8NoBom)
[System.IO.File]::WriteAllText((Join-Path $toolsRoot "configure-ai.ps1"), $configurator, $utf8NoBom)
[System.IO.File]::WriteAllText((Join-Path $stageRoot "启动职前副本AI.bat"), $startBat, $utf8NoBom)
[System.IO.File]::WriteAllText((Join-Path $stageRoot "停止职前副本AI.bat"), $stopBat, $utf8NoBom)
[System.IO.File]::WriteAllText((Join-Path $stageRoot "配置AI密钥.bat"), $configureBat, $utf8NoBom)
[System.IO.File]::WriteAllText((Join-Path $stageRoot ".env.example"), $envExample, $utf8NoBom)
[System.IO.File]::WriteAllText((Join-Path $stageRoot "使用说明.txt"), $readme, $utf8NoBom)

Write-Host "Scanning package for private environment files..."
$privateFiles = Get-ChildItem $stageRoot -Recurse -Force -File | Where-Object {
  $_.Name -eq ".env.local" -or $_.Name -eq "config.env" -or $_.Extension -in @(".pem", ".key")
}
if ($privateFiles) {
  throw "Private files were found in the package: $($privateFiles.FullName -join ', ')"
}

Write-Host "Creating ZIP..."
Compress-Archive -Path $stageRoot -DestinationPath $OutputZip -CompressionLevel Optimal

$stageSize = (Get-ChildItem $stageRoot -Recurse -Force -File | Measure-Object Length -Sum).Sum
$zipSize = (Get-Item $OutputZip).Length
Write-Host "Package folder: $stageRoot"
Write-Host "ZIP: $OutputZip"
Write-Host ("Uncompressed: {0:N1} MB" -f ($stageSize / 1MB))
Write-Host ("ZIP size: {0:N1} MB" -f ($zipSize / 1MB))
