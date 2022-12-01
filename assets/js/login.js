$(function(){
  //点击去注册账号
  $('#link_reg').on('click',function(){
    $('.login-box').hide()
    $('.reg-box').show()
  })
  //点击去登录账号
  $('#link_login').on('click',function(){
    $('.reg-box').hide()
    $('.login-box').show()
  })

  //从layui中获取form对象
  var form = layui.form
  var layer = layui.layer
  //定义表单校验规则
  form.verify({
    'pwd':[/^[\S]{6,12}$/
    ,'密码必须6到12位，且不能出现空格'],
    //校验两次密码是否一致的规则
    repwd:function(value){
      //通过形参拿到的是确认密码框的内容
      //还需要拿到密码框的内容
      //然后进行判断
      //如果失败，则return一个提示消息
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value){
        return('两次密码不一致，请重新输入')
      }
    }
  })

  //监听注册表单的提交事件
  $('#form_reg').on('submit',function(e) {
    //组织默认的提交行为
    e.preventDefault()
    //发起Ajax的post请求
    let data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val()
  
    }
    $.post('/api/reguser',data,function(res) {
      if (res.status !== 0){
        return layer.msg(res.message);
      }
      layer.msg('注册成功')
      $('#link_login').click()
      $('#form_login [name=username]').val(data.username)
      $('#form_login [name=password]').val(data.password)
      
    })
  })
  //监听登录表单的提交事件
  $('#form_login').submit(function (e) {
    e.preventDefault()
    
    //发起ajax的post登录请求
    $.ajax({
      url: '/api/login',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败')
        }
        layer.msg('登录成功')
        // 将登录成功得到的token字符串保存到localStorage中
        localStorage.setItem('token',res.token)
        location.href = '/index.html'
      }
    })
  })
})