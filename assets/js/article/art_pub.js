$(function () {
  var layer = layui.layer
  var form = layui.form
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  //定义加载文章分类的方法
  initCate()
  // 初始化富文本编辑器
  initEditor()
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败')
        }
        var htmlStr = template('tpl-cate', res)
        // console.log(htmlStr)
        $('[name=cate_id]').html(htmlStr)
        form.render()
      },
    })
  }

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview',
  }
  // 3. 初始化裁剪区域
  $image.cropper(options)

  //选择封面绑定点击事件，选择文件
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })
  //监听coverFile文件选择输入框的change事件
  $('#coverFile').on('change', function (e) {
    var files = e.target.files[0]
    if (files.length == 0) {
      return layer.msg('请选择图片')
    }
    var newImgURL = URL.createObjectURL(files)
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })
  //定义文章的发布状态
  var art_state = '已发布'
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })

  //为表单绑定submit提交事件
  $('#form-pub').on('submit', function (e) {
    //1.阻止表单默认行为
    e.preventDefault()
    //2.基于form 创建一个formData对象
    var fd = new FormData($(this)[0])
    //3.将文章的发布状态，存到fd中
    fd.append('state', art_state)
    //4.将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        //5.将文件对象存到fd中
        fd.append('cover_img', blob)
        //6.发起Ajax请求
        publishArticle(fd)
      })
  })

  //定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败')
        }
        layer.msg('发布文章成功')
        //发布成功之后跳转到文章列表
        location.href = '/article/art_list.html'
      },
    })
  }
})
