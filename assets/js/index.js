$(function () {
  //调用函数获取用户基本信息
  getUserInfo()

  var layer = layui.layer

  $('#btnLogout').on('click', function (e) {
    //提示用户是否退出
    layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, function(index){
      //清空本地存储的token
      localStorage.removeItem('token')
      //跳转到登录页面
      location.href = '/login.html'

      //官方提供组件，关闭confirm提示框
      layer.close(index);
    });
    
  })
})

// 获取用户基本信息
function getUserInfo () {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    //headers 就是请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },

    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败')
      }
      //调用renderAvatar 渲染用户头像
      renderAvatar(res.data)
    }
    
  })
}

//渲染用户头像用户名函数 renderAvatar
function renderAvatar (user) {
  //1.获取用户的名称
  var name = user.nickname || user.username
  //2.设置欢迎的文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  // 3.按需渲染用户图像
  if (user.user_pic !== null) {
    //渲染图片图像
    $('.layui-nav-img').attr('src',user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    //渲染文字图像
    $('.layui-nav-img').hide()
    var first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }

}