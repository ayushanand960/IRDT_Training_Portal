const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = path.join(__dirname, "public/images");     // folder with original images
const outputDir = path.join(__dirname, "public/images/thumbs"); // folder for thumbnails

// Create output folder if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Loop through all images in input folder
fs.readdirSync(inputDir).forEach(file => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);

  if (/\.(jpe?g|png)$/i.test(file)) {
    sharp(inputPath)
      .resize({ width: 300 }) // thumbnail width
      .toFile(outputPath)
      .then(() => console.log(`✅ Thumbnail created: ${outputPath}`))
      .catch(err => console.error(`❌ Error processing ${file}:`, err));
  }
});
