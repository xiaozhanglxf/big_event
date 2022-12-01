//每次调佣get 或者post 或者Ajax 的时候，会先 调用ajaxPrefilter这个函数
//在这个函数里面，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // console.log(options.url);
  options.url = 'http://www.liulongbin.top:3007' + options.url
})