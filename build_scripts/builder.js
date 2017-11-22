var fs = require('fs');

var indexOutputPath = './build/index.html';               // This path is relative to package.json.
module.exports =
fs.writeFile(indexOutputPath,
  `<!doctype html>
  <html>
      <head>

          <title></title>

      </head>
      <body>

          <p>Hello world!</p>

      </body>
  </html>
`,
  function(err) { if(err) return console.log(err);  console.log("Index file generated!"); }
);
