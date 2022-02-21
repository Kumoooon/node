var http = require("http");
var fs = require("fs"); //file system모듈. 파일의 읽기와 쓰기가 포한된, 파일 처리와 관련된 모듈.
var url = require("url");

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query; //url에서 querysting 값을 가져오는 코드이다.
  var title = queryData.id; //querystring은 값이름: 값 의 형태이므로, id만을 꺼내어 변수에 넣는다.
  console.log(title);
  if (_url == "/") {
    title = "Welcome"; //아무것도 클릭하지 않은 상태(/)에서 아레 템플릿에 적용
  }
  if (_url == "/favicon.ico") {
    return response.writeHead(404);
  }
  response.writeHead(200);
  fs.readFile(`data/${queryData.id}`, "utf8", function (err, description) {
    //``안의 것은 문자열이다. 표현식을 통해 폴더 내 각 각 해당id의 파일에 접근 가능. 접근하여 description추출
    var template = `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ul>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ul>
        <h2>${title}</h2>
        <p>${description}</p>
      </body>
      </html>
      `;
    response.end(template);
  });
});
app.listen(3000);
