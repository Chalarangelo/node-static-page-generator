var fs = require('fs-extra');
var path = require('path');
var pageTemplate = require('./page_template');

// All paths are relative to package.json.
var pagesPath = './pages';
var pagesMetaPath = './pages_meta';
var copyFolders = ['./images', './css', './js'];
var outputPath = './build';

// First delete everything in the build directory.
console.log('Cleaning previous build...');
try {
  for (var file of fs.readdirSync(outputPath)){
    fs.removeSync(path.join(outputPath, file));
  }
}
catch (err){
  console.log('Error during cleanup: '+err);
  process.exit(1);
}

// Then read everything in the pages and pages_meta directories.
var pages = {}, pagesMeta = {};

console.log('Loading pages...');
try {
  for(var page of fs.readdirSync(pagesPath)){
    pages[page] = fs.readFileSync(path.join(pagesPath,page),'utf8');
  }
}
catch (err){
  console.log('Error during page loading: '+err);
  process.exit(1);
}

console.log('Loading pages metadata...');
try {
  for(var pageMeta of fs.readdirSync(pagesMetaPath)){
    pagesMeta[pageMeta] = fs.readFileSync(path.join(pagesMetaPath,pageMeta),'utf8');
  }
}
catch (err){
  console.log('Error during metadata loading: '+err);
  process.exit(1);
}

// Generate each page from the data provided, using the template.
console.log('Generating pages...');
try {
  for(var page of Object.entries(pages)) {
    var pageName = page[0].slice(0, page[0].lastIndexOf('.'));
    var metaData = pagesMeta.hasOwnProperty(pageName+'.json')
      ? JSON.parse(pagesMeta[pageName+'.json'])
      : {};
    metaData.title = metaData.title || pageName;
    var pageContent = page[1];
    fs.writeFileSync(
      path.join(outputPath,pageName+'.html'),
      pageTemplate.generatePage(pageContent, metaData));
  }
}
catch (err){
  console.log('Error during page generation: '+err);
  process.exit(1);
}

// Copy folders with assets into build folder.
console.log('Copying folders...');
try {
  for(var copyFolder of copyFolders){
    fs.copySync(copyFolder, path.join(outputPath,copyFolder));
  }
}
catch (err){
  console.log('Error during folder copying: '+err);
  process.exit(1);
}

// Process complete.
console.log('Done!');
