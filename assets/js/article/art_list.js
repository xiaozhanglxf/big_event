$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage
  //定义美化事件的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }
  //事件补0函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
  //定义一个查询的参数对象，将来请求数据的时候需要将请求参数对象提交到服务器
  var q = {
    //页码值
    pagenum: 1,
    //每页显示多少条数据
    pagesize: 2,
    //文章分类的 Id
    cate_id: '',
    //文章的状态，可选值有：已发布、草稿
    state: '',
  }
  //获取文章数据函数
  initTable()
  initCate()
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败')
        }
        //使用模板引擎渲染页面的数据
        // console.log(res)
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        //调用渲染分页的方法
        renderPage(res.total)
      },
    })
  }

  //初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败')
        }
        //调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        //让layui重新渲染表单区域的UI结构
        form.render()
      },
    })
  }

  //为筛选表单绑定事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    //获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    //为查询参数对象q对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    //根据最新的筛选条件筛选表格的数据
    initTable()
  })

  //定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox', //指向存放分页的容器
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, //每页显示的条数
      curr: q.pagenum, //起始页,默认被选中的页。

      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      //分页切换时，触发jump回调
      jump: function (obj, first) {
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        //根据最新的q 获取对应的数据列表
        if (!first) {
          initTable()
        }
      },
    })
  }

  //为删除文章按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    //通过删除按钮的个数判断，当前页的剩余数据数量
    var len = $('.btn-delete').length
    //获取到文章的ID
    var id = $(this).attr('data-id')
    layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败')
          }
          layer.msg('删除文章成功')
          //当前页数据删除完之后，判断当前页是否还有剩余的数据，如果没有剩余的数据，让页码值 -1 之后，再重新调用initTable方法
          if (len === 1) {
            //如果len的值等于1 ，说明删除完毕之后，当前页面上就没有任何数据
            //页码值最小值必须是1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        },
      })

      layer.close(index)
    })
  })
})
