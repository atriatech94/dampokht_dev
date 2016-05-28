
document.addEventListener("backbutton",amintest, false);


/*======================================*/

/*======================================*/
/*
if (!window.WebSocket && window.MozWebSocket) {
    window.WebSocket = window.MozWebSocket;
    alert('MozWebSocket');
}
else if (!window.WebSocket) {
    alert("WebSocket not supported by this browser");
}
else{
    alert('wtf!? '+window.WebSocket);
}
*/
/**/
/*======================================*/

function amintest(){
   
    var loc =   window.location.hash;
    loc = loc.replace("#/", "");
    
    loc = loc.split('/');
    loc = loc[0] ;
	
	var socket;
    if(!$('body .lpro').hasClass('none'))
    {
        return false;
    }
    if($.fancybox.isOpen)
	{
		$.fancybox.close();
		return false;
	}
    if(loc == "wall" || loc == "select")
    {
         if($('body .alert').hasClass('none'))
         {
             $('body .alert .msg').text("برای خروج از برنامه یک بار دیگر دکمه ی بازگشت را بزنید").parent('.alert').removeClass('none');
             setTimeout(function(){
                 $('body .alert').addClass('none');
             },5000);        
         }
        else{
            $('body .alert').addClass('none');
            navigator.app.exitApp();
        }
              
        return false;
    }
    else if(loc == "forget_pass" || loc == "profile" || loc == "register_one" || loc == "register_two" || loc == "register_three" ||
            loc == "myprofile" || loc == "mycv" ||   loc == "edit_info" || loc == "follower" || loc == "following" ||  loc =="notification" ||
            loc == "search_result" || loc == "mycv"  || loc == "msg_detail" || loc == "setting"  ||  loc =="user_follower" || loc =="user_following"  || loc =="portfolio_detail"  )
    {
         window.history.back() ;
    }
    else if(loc == "msg"){
        return false;
    }
    else if(loc == "login")
    {
         window.location.hash = "#/select";
    }
    else
    {
	    window.location.hash = "#/wall";
    }
    return false;
    
    

}
$(document).ready(function(){
	
	
	// if(localStorage.getItem("user_id") !== null){
	// 	alert(localStorage.getItem("is_user_online"));
	// 	if(!localStorage.getItem("is_user_online")){
	// 		alert('fuck');
	// 		var user_id = localStorage.getItem("user_id");
				
	// 		localStorage.setItem("is_user_online", true);	
	// 		console.log("join " + user_id);
	// 	}
	// }
    height();
    $(window).on("resize",function(){
        height();
    });
    $('body').on("click",function(){
        //if($(".alert").css("display")!= "none"){$(".alert").fadeOut(300)}
    });
    $('.alert').on("click",function(){
        if(!$(this).hasClass("none")){$(this).addClass('none');}
    });
});

function height()
{
    var heigh100 =  $(window).height()+"px";
    $(".height100").css( "height" , heigh100 );
}
function exit()
{
    localStorage.clear();
    quit();
    window.location.hash = "#/select";
}

function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}
function isImage(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'png':
        //etc
        return true;
    }
    return false;
}
function isVideo(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
    case 'm4v':
    case 'avi':
    case 'mpg':
    case 'mp4':
        // etc
        return true;
    }
    return false;
}
function show_anim(){$('body .loader_css').addClass('start_animation');}
function hide_anim(){$('body .loader_css').removeClass('start_animation');}

/*===============================================================*/
$.ajaxSetup({
    timeout: 45000,
});

/*===============================================================*/

function resize_image(url, callback){
    var image = new Image();
    image.onload = function () {
        var canvas = document.createElement('canvas');
		max_size = 400,// TODO : pull max size from a site config
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
                  //  var dems
                    if (canvas.width >  canvas.height){
                        if (canvas.width > max_size){
                            canvas.height *= max_size / canvas.width;
                            canvas.width = max_size;

                        }
                    }else{
                        if (canvas.height > max_size){
                            canvas.width *= max_size / canvas.height;
                            canvas.height = max_size;
                        }
                    }
        canvas.getContext('2d').drawImage(this, 0, 0,canvas.width,canvas.height);
        resizedImage = canvas.toDataURL('image/jpeg');
        // Get raw image data
        canvas.toDataURL('image/jpeg');
        // ... or get as Data URI
        callback(canvas.toDataURL('image/jpeg'));
    };
    image.src = url;
}

function english_only(input){   	
    var spacechar = input.val().substr(input.val().length - 1);
    spacechar = spacechar.charCodeAt();
    if( spacechar >= 1570 && spacechar <= 1712){
        input.val('');
        $('body .alert .msg').text("ورودی اطلاعات برای این فیلد باید انگلیسی باشد .").parent('.alert').removeClass('none');
        return false;
    }
}
var last_h = 0;
var now_h = 1;
$(window).bind( 'hashchange', function(e) {
    last_h = now_h ;
    loc =  window.location.hash;
    loc = loc.replace("#/", "");
    
    loc = loc.split('/');
    now_h = loc[0] ;
    
   // console.log(now_h);
});
function readURL(input) {
    
    if (input.files && input.files[0]) {
        var reader = new FileReader();
                                    
        reader.onload = function (e) {
            return e.target.result;
        }
         
        reader.readAsDataURL(input.files[0]);
        return reader.readAsDataURL;
    }
}
function share_fn(url){
    // window.plugins.socialsharing.share('اشتراک گزاری شده توسط اپلیکیشن کارخونه', null,  base_url+'file/logo_share.png' , url);
    window.plugins.socialsharing.share('کارخونه', null,null, url);                
}
$(function(){
    $('body').on("click",".dl_btn",function(){
        dl_link =  $(this).attr("share_url");
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess, null); 
        downloadFile2(dl_link);
        $('body .alert .msg').text("در حال دانلود فایل ...").parent('.alert').removeClass('none');
        timeout = setTimeout(function(){ $('body .alert').addClass('none');},3000);
        return false;
    });
});
 function downloadFile2(dl_link)
{       
       
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(dl_link);
		var filename = dl_link.substring(dl_link.lastIndexOf('/')+1);
        var filePath = "/mnt/sdcard/Kaarkhooneh/"+filename;
        
        fileTransfer.download(
            uri,
            filePath,
            function(entry) {
               $('body .alert .msg').text("فایل مورد نظر با موفقیت دانلود شد").parent('.alert').removeClass('none');
                
            },
            function(error) {
                $('body .alert .msg').text("خطا در دانلود ..").parent('.alert').removeClass('none');
            },
            true,
            {
            }
        );
}

function onRequestFileSystemSuccess(fileSystem) { 
        var entry=fileSystem.root; 
        entry.getDirectory("Kaarkhooneh", {create: true, exclusive: false}, onGetDirectorySuccess, onGetDirectoryFail); 
} 

function onGetDirectorySuccess(dir) { 
      //alert("Created dir "+dir.name); 
} 

function onGetDirectoryFail(error) { 
    // alert("Error creating directory "+error.code); 
} 
//https://github.com/zho/phonegap-imeiplugin/tree/c506fb6

//window.plugins.imeiplugin.getImei(callback);
var imei = 0 ;

/*====================on foucs=============*/
$('body').on("focus",'input[type="text"],input[type="password"],input[type="email"],textarea',function(){
    samin =$(this) ;
    $(window).resize(function(){
    });
});
/*=================================*/
//var count = document.querySelector(".number .");
//count.onclick=function(){myScript};
/*=================================*/

var Node = Node || {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3
    // etc... if you might need other node types
};
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}