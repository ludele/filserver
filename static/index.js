const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const port = 3000;

async function handleFileRequest(request, response) {
   function statusCodeResponse(code, err) {
      response.writeHead(code, { 'Content-Type': 'text/plain' });
      response.write(err);
      response.end();
   }

   let url = request.url;
   let filePath = path.join('static', url);
   console.log(filePath);

   try {
      await fs.access(filePath); // Check if the file exists

      let fileContents = await fs.readFile(filePath);

      let dotIndex = filePath.lastIndexOf('.');
      if (dotIndex === -1) {
         statusCodeResponse(400, '400 Bad Request');
         return;
      }

      let ext = filePath.substring(dotIndex + 1).toLowerCase();
      console.log(ext);

      let contentType;
      switch (ext) {
         case 'html':
            contentType = 'text/html';
            break;
         case 'css':
            contentType = 'text/css';
            break;
         case 'js':
            contentType = 'text/javascript';
            break;
         case 'jpg':
         case 'jpeg':
            contentType = 'image/jpeg';
            break;
         case 'png':
            contentType = 'image/png';
            break;
         case 'svg':
            contentType = 'image/svg+xml'
            break;
         case 'mp4':
            contentType = 'video/mp4'
            break;
         default:
            statusCodeResponse(400, '400 Bad Request');
            return;
      }

      response.writeHead(200, { 'Content-Type': contentType });
      response.write(fileContents);
      response.end();
   } catch (error) {
      if (error.code === 'ENOENT') {
         statusCodeResponse(404, '404 Not Found');
      } else {
         statusCodeResponse(500, '500 Internal Server Error');
      }
   }
}

let app = http.createServer(handleFileRequest);

app.listen(port);
console.log(`Server listening on port ${port}`);