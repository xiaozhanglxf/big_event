$(function () {
  var form = layui.form
  var layer = layui.layer


  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    samePwd: function (value) {
      
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能相同'
        
      }
    },
    rePwd: function (value) {
      if (value !== $('[name=newPwd]').val()) {
        return '两次密码不一致，请重新输入'
      }
    }
  })

//发起Ajax请求
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('重置密码失败')
        }
        layer.msg('重置密码成功')
        //重置表单数据，先把jQuery元素转化成原生js中的DOM元素，在使用原生的reset方法重置表单的数据
        $('.layui-form')[0].reset()
      }
    })
  })

})