$(function() {
  var host = 'http://www.51wesharing.com/';
  var $body = $('body');
  var $root = $('#root');
  var $loading = $('.advert-loading');
  var $fullScreen = $('.full-screen');
  var $bottomFixed = $('.bottom-fixed');
  //发起请求
  request('twxm/sys/gam', function(ret) {
    //默认隐藏页面内容,显示loading
    $body.addClass('hidden');
    $root.addClass('none');
    if (ret && ret.state === 10) {
      var data = ret.data;
      $loading.addClass('none');
      $fullScreen.attr('src', data.position2);
      $fullScreen.removeClass('none');
      $bottomFixed.attr('src',ata.position3);
      $('.root-bottom>img').attr('src',ata.position1);
    }
    //3秒后页面正常显示
    delay();
  }, { mCode: 'f8cc5e9d58cf22040158dd343ddc000b' });
  //3秒后页面正常显示
  function delay() {
    setTimeout(function() {
      $fullScreen.addClass('none');
      $loading.addClass('none');
      $root.removeClass('none');
      $body.addClass('visible');
      $bottomFixed.removeClass('none');
    }, 3000);
  }
  //请求
  function request(path, callback, data, sync) {
    var url = host + path;
    var option = {
      type: 'post',
      url: url,
      data: data,
      async: sync === false ? false : true,
      dataType: 'json',
      timeout: 10000,
      success: function(ret) {
        ret && callback(ret);
      },
      error: function(ret) {
        console.log(ret);
        callback({ state: 'error' });
      }
    };
    $.ajax(option);
  }
});