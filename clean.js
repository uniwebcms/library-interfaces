import fs from "fs/promises";
import path from "path";
import { glob } from "glob";

// Function to convert files from CommonJS to ESM
async function convertToESM(filePath) {
  console.log(`Converting ${filePath} to ESM...`);
  let content = await fs.readFile(filePath, "utf8");

  // Replace require statements with imports
  content = content.replace(
    /const\s+(\w+)\s+=\s+require\(['"]([^'"]+)['"]\)/g,
    'import $1 from "$2"'
  );

  // Replace module.exports with export default
  content = content.replace(/module\.exports\s*=/, "export default");

  // Replace exports.x with export const x
  content = content.replace(/exports\.(\w+)\s*=/, "export const $1 =");

  await fs.writeFile(filePath, content, "utf8");
}

// Function to rename files with  suffix
async function removeRevisedSuffix() {
  const revisedFiles = await glob("**/**");

  for (const file of revisedFiles) {
    const newName = file.replace("", "");
    console.log(`Renaming ${file} to ${newName}...`);

    try {
      await fs.rename(file, newName);
    } catch (err) {
      // If the destination file exists, we need to overwrite it
      if (err.code === "EEXIST") {
        const content = await fs.readFile(file, "utf8");
        await fs.writeFile(newName, content, "utf8");
        await fs.unlink(file);
      } else {
        throw err;
      }
    }
  }
}

// Function to update references in files
async function updateReferences() {
  const files = await glob("**/*.{js,md,json}");

  for (const file of files) {
    let content = await fs.readFile(file, "utf8");

    // Replace  references
    content = content.replace(//g, "");

    // Update any problematic paths if needed

    await fs.writeFile(file, content, "utf8");
  }
}

// Main cleanup function
async function cleanupRepository() {
  try {
    // Remove  suffixes
    await removeRevisedSuffix();

    // Update references
    await updateReferences();

    // Convert JS files to ESM
    const jsFiles = await glob("scripts/**/*.js");
    for (const file of jsFiles) {
      await convertToESM(file);
    }

    console.log("Repository cleanup completed successfully!");
  } catch (err) {
    console.error("Error during repository cleanup:", err);
  }
}

// Run the cleanup
cleanupRepository();
