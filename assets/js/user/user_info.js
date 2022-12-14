$(function () {
  var form = layui.form
  var layer = layui.layer

  form.verify({
    nickname: function () {
      if (value.length > 6) {
        return '昵称长度必须在1~6个字符之间！'
      }
    }
  })

  initUserInfo ()

  //初始化用户信息函数
  function initUserInfo () {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！')
        }
        // console.log(res);
        //调用 form.val() 方法，快速填充表单信息
        form.val('formUserInfo',res.data)
      }
     })
  }
  //重置表单的数据
  $('#btnReset').on('click', function (e) {
    e.preventDefault()
    initUserInfo ()
  })

  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    //发起Ajax请求，修改用户信息
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('修改用户信息失败！')
        }
        layer.msg('修改用户信息成功！')
        //调用index.html页面的方法重新渲染用户的头像和用户的信息
        window.parent.getUserInfo ()
      }
    })
  })
})




