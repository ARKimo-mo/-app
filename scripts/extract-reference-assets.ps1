Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$source = Join-Path $root "references\original"
$output = Join-Path $root "references\generated-assets"
New-Item -ItemType Directory -Path $output -Force | Out-Null

$crops = @(
  @{ Source = "01-dashboard.png"; Name = "avatar-student-tablet.png"; X = 790; Y = 70; W = 330; H = 290 },
  @{ Source = "01-dashboard.png"; Name = "avatar-student-profile.png"; X = 31; Y = 786; W = 54; H = 54 },
  @{ Source = "10-interview.png"; Name = "avatar-interviewer-suit.png"; X = 830; Y = 74; W = 270; H = 200 },
  @{ Source = "05-mission.png"; Name = "assistant-robot.png"; X = 288; Y = 285; W = 74; H = 82 },
  @{ Source = "04-skill-growth.png"; Name = "ability-core-hex.png"; X = 445; Y = 476; W = 180; H = 174 },
  @{ Source = "06-review.png"; Name = "grade-s-medal.png"; X = 1138; Y = 147; W = 125; H = 125 },

  @{ Source = "03-recommend.png"; Name = "job-product-manager.png"; X = 264; Y = 350; W = 276; H = 112 },
  @{ Source = "03-recommend.png"; Name = "job-frontend-engineer.png"; X = 557; Y = 350; W = 276; H = 112 },
  @{ Source = "03-recommend.png"; Name = "job-data-analyst.png"; X = 850; Y = 350; W = 276; H = 112 },
  @{ Source = "03-recommend.png"; Name = "job-content-operations.png"; X = 264; Y = 689; W = 276; H = 112 },
  @{ Source = "03-recommend.png"; Name = "job-ui-designer.png"; X = 557; Y = 689; W = 276; H = 112 },
  @{ Source = "03-recommend.png"; Name = "job-market-specialist.png"; X = 850; Y = 689; W = 276; H = 112 },

  @{ Source = "07-portfolio.png"; Name = "portfolio-campus-market.png"; X = 270; Y = 270; W = 148; H = 110 },
  @{ Source = "07-portfolio.png"; Name = "portfolio-ecommerce-analysis.png"; X = 735; Y = 270; W = 148; H = 110 },
  @{ Source = "07-portfolio.png"; Name = "portfolio-feature-launch.png"; X = 270; Y = 480; W = 148; H = 110 },
  @{ Source = "07-portfolio.png"; Name = "portfolio-brand-strategy.png"; X = 735; Y = 480; W = 148; H = 110 },
  @{ Source = "07-portfolio.png"; Name = "portfolio-learning-competitor.png"; X = 270; Y = 682; W = 148; H = 110 },
  @{ Source = "07-portfolio.png"; Name = "portfolio-retention-analysis.png"; X = 735; Y = 682; W = 148; H = 110 },
  @{ Source = "07-portfolio.png"; Name = "portfolio-community-review.png"; X = 270; Y = 884; W = 148; H = 110 },
  @{ Source = "07-portfolio.png"; Name = "portfolio-integrated-marketing.png"; X = 735; Y = 884; W = 148; H = 110 }
)

foreach ($crop in $crops) {
  $sourcePath = Join-Path $source $crop.Source
  $destinationPath = Join-Path $output $crop.Name
  $image = [System.Drawing.Image]::FromFile($sourcePath)
  try {
    $rectangle = New-Object System.Drawing.Rectangle($crop.X, $crop.Y, $crop.W, $crop.H)
    $bitmap = New-Object System.Drawing.Bitmap($crop.W, $crop.H)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.DrawImage($image, (New-Object System.Drawing.Rectangle(0, 0, $crop.W, $crop.H)), $rectangle, [System.Drawing.GraphicsUnit]::Pixel)
      } finally {
        $graphics.Dispose()
      }
      $bitmap.Save($destinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
      $bitmap.Dispose()
    }
  } finally {
    $image.Dispose()
  }
}

Get-ChildItem -LiteralPath $output -File | Select-Object Name, Length
