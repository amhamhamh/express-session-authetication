var express = require('express'); // 이 코드는 router로서 login과 logout을 확인하는 코드임
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js'); 
var authData = {                //해당 인증 데이터가 맞는지 확인을 해야 함. 
  email: 'egoing777@gmail.com',
  password: '111111',
  nickname: 'egoing'
}
router.get('/login', function (request, response) {         // login을 확인하는 과정
  var title = 'WEB - login';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="pwd" placeholder="password"></p>
      <p>
        <input type="submit" value="login">
      </p>
    </form>
  `, '');
  response.send(html);
});
router.post('/login_process', function (request, response) {    // 위의 post 방식으로 가져온 데이터를 확인하여 
  var post = request.body;                                      // 데이터를 변수에 담음        
  var email = post.email;
  var password = post.pwd;
  if(email === authData.email && password === authData.password){
    request.session.is_logined = true;                            //그리고 맞으면 해당 변수로 재정의를 함.  
    request.session.nickname = authData.nickname;                //lib/auth 전송한 다음에 topic.js로 이동          
    response.redirect(`/`);
    request.session.save(function(){      
    });
  } else {
    response.send('Who?');
  }
});
router.get('/logout', function (request, response) {      // logout은 아예 끊어서 session을 버림. 
  request.session.destroy(function(err){
    response.redirect('/');
  });
});