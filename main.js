const http = require("http");
const fs = require("fs"); //file system모듈. 파일의 읽기와 쓰기가 포한된, 파일 처리와 관련된 모듈.
const url = require("url");
const { NOTFOUND } = require("dns"); //?
const templateHtml = (title, list, body) => {
  //template를 통째로 함수화. 변수를 지정해준다.
  //저 자리에 들어가는게 body로 취급 될 뿐이다.
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
      ${list}
      ${body}
  </body>
  </html>
  `;
};
const templateList = (files) => {
  let list = "<ul>";
  let i = 0;
  while (i < files.length) {
    list = list + `<li><a href="/?id=${files[i]}">${files[i]}</a></li>`;
    i++;
  }
  list = list + "</ul>";
  return list;
};

const app = http.createServer((request, response) => {
  let _url = request.url;
  let queryData = url.parse(_url, true).query; //url에서 querysting 값을 가져오는 코드이다.
  let pathname = url.parse(_url, true).pathname;
  if (pathname === "/") {
    //만약의 만약....
    if (queryData.id === undefined) {
      //queryData.id가 undefined일 때 : localhost : 3000 일 때, 즉 메인 페이지일때
      fs.readdir("./data", (err, files) => {
        let title = "welcome";
        let description = "Hello, Node.js";
        let list = templateList(files);
        let template = templateHtml(
          title,
          list,
          `<h2>${title}</h2>
        <p>${description}</p>`
        );
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./data", (err, files) => {
        let list = templateList(files);
        fs.readFile(
          //세 번째 인자는 콜백함수이다. readFile이 실행되면 첫 번째 인자인 파일 경로로 가서 해당 파일을 실행하는데, 그 후에
          //실행하는 함수라고 해서 콜백함수이다.(끝나고 전화해~ 같이.)
          `data/${queryData.id}`,
          "utf8",
          function (err, description) {
            //``안의 것은 문자열이다. 표현식을 통해 폴더 내 각 각 해당id의 파일에 접근 가능. 접근하여 description추출
            const title = queryData.id; //querystring은 값이름: 값 의 형태이므로, id만을 꺼내어 변수에 넣는다.
            let template = templateHtml(
              title,
              list,
              `<h2>${title}</h2>
            <p>${description}</p>`
            );
            //readFile(읽을 파일명, utf표기방식,function(err,data))
            //err은 익명함수로, 오류 발생 시 동작. data인자가 읽은 파일 데이터를 담아준다.
            //queryData.id로 데이터 폴더 내 해당 파일을 찾아서, 그 데이터를 description에 담는다

            response.writeHead(200);
            response.end(template);
            //response.writehead는 요청에 응답헤더를 보내는 'http'모듈의 내장 속성.
            //응답헤더작성
            //200 : status code. 3자리 HTTP상태 코드
            //writehead의 숫자 : 웹브라우저가 웹 서버에 접속하면 웹 서버가 응답을 하는데,
            //웹 서버와 웹 브라우저 간에 중요한 정보(정보가 잘 전달 되었는지 등...)를 기계와 기계가 서로 통신하기 위한 약속.
            //200은 파일을 성공적으로 전송했다. <->404(파일을 찾을 수 없을 때)
            //response.end()에 템플릿을 담아서 출력...
            //응답종료메서드. writehead랑 end사이에 res.write()메서드도 있는데, 본문 즉 body 부분 쓰는 메서드.
          }
        );
      });
    }
  } else {
    response.writeHead(404);
    response.end(NOTFOUND);
  }
});
app.listen(3000);
