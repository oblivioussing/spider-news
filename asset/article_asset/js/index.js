//类型 100-微享；101-微信；102-搜狐；103-新浪；104-网易；105-凤凰；106-腾讯视频
$(function() {
 var host = 'http://www.51wesharing.com';
 var $body = $('body');
 var $root = $('#root');
 var $loading = $('.advert-loading');
 var $fullScreen = $('.full-screen');
 var $bottomFixed = $('.bottom-fixed');
 var $rootImg = $('.root-bottom>img');
 var mCode = $fullScreen.attr('mCode');
 //发起请求
 request('twxm/sys/gam', function(ret) {
   //默认隐藏页面内容,显示loading
  //  $body.addClass('hidden');
  //  $root.addClass('none');
   if (ret && ret.state == '10') {
    //  var data = ret.data;
    //  $loading.addClass('none');
    //  $fullScreen.css({
    //    'background': 'url(' + host + data.position2 + ')',
    //    'background-size': 'cover',
    //    'background-position': 'center center',
    //    'background-repeat': 'no-repeat'
    //  });
    //  $fullScreen.removeClass('none');
    //  $bottomFixed.attr('src', host + data.position1);
    //  $rootImg.attr('src', host + data.position3);
     //判断是否是视频
     isVideo(data);
   } else {
    //  $fullScreen.remove();
    //  $bottomFixed.remove();
    //  $rootImg.remove();
   }
   //3秒后页面正常显示
  //  delay();
 }, {
   mCode: mCode
 });
 //文章是否包含视频
 function isVideo(data) {
   if (data.type === '106') {
     $('#myVideo').attr('src', data.masterMediaContent);
   }
 }
 //3秒后页面正常显示
 function delay() {
   setTimeout(function() {
     $fullScreen.addClass('none');
     $loading.addClass('none');
     $root.removeClass('none');
     $body.addClass('visible');
     $bottomFixed.removeClass('none');
     //去掉sina新闻底部菜单
     $('.j_cmnt_bottom').remove();
     //给二维码图片添加间距
     var height = $bottomFixed.height();
     $('.root-bottom').css('margin-bottom', height + 10);
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
       callback({
         state: 'error'
       });
     }
   };
   $.ajax(option);
 }
});