$(function () {
  var layer = layui.layer
  var form = layui.form
  iniArtCateList()
  //获取文章分类列表
  function iniArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类列表失败！')
        }
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      },
    })
  }
  // 添加类别按钮绑定弹出框事件
  var indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html(),
    })
  })

  // 通过代理的形式，为 form-add 表单绑定 submit 事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！')
        }
        initArtCateList()
        layer.msg('新增分类成功！')
        // 根据索引，关闭对应的弹出层
        layer.close(indexAdd)
      },
    })
  })

  //通过代理，为btn-edit按钮绑定事件
  var indexEdit = null
  $('body').on('click', '.btn-edit', function () {
    //弹出修改文章分类层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html(),
    })

    var id = $(this).attr('data-id')
    // console.log(id)
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // console.log(res)
        form.val('form-edit', res.data)
      },
    })

    $('body').on('submit', '#form-edit', function (e) {
      e.preventDefault()
      $.ajax({
        method: 'POST',
        url: '/my/article/updatecate',
        data: $(this).serialize(),
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('修改文章分类失败')
          }

          layer.msg('修改文章分类成功')
          layer.close(indexEdit)
          iniArtCateList()
        },
      })
    })
  })

  //通过代理，为btn-delete按钮绑定事件
  $('body').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id')
    //提示用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除失败')
          }
          layer.close(index)
          layer.msg('删除成功')
          initArtCateList()
        },
      })
    })
  })
})
