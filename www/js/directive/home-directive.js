angular.module('my-app')
.directive('homeDir' , function ($http,$timeout,$rootScope,$location){
    return {
        link: function(scope) {
          
           if(localStorage.getItem('cart')){
             scope.basket_size = JSON.parse(localStorage.getItem('cart')).length; 
          }
          else{
             scope.basket_size = 0; 
          } 
          
          
          
          scope.base_img = base_img + 'food-xsmall/' ;
            scope.go = function ( path ) {
                $location.path( path );
            };
          
         if(localStorage.getItem('user_id')){
             scope.login = true;
         } 
         else{
              scope.login = false;
         }
          
         if($rootScope.specials_root == null)
         {
             $http({
                method: 'GET',
                url: base_url+'home_info/HamiDaMin23QZYTRRE782',
            }).then(function successCallback(response) {
                         
                            if(response.data.done == 1)
                            {
                                $rootScope.specials_root = response.data.specials;
                                scope.specials = response.data.specials;
                                console.log(scope.specials);
                               $timeout(function(){
                                    $('.owl-carousel_two').owlCarousel({
                                    items:2,
                                    margin:5,
                                    autoHeight:true,
                                    nav:false,
                                    dots:false,
                                    rtl:true,
                                });
                                  
                                   
                               }); 
                              
                            }
                            else
                            {
                                 ons.notification.alert({
                                        title: 'خطا',
                                        buttonLabel:"بستن " ,
                                        message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                                });
                                
                            }
                           
                        }, function errorCallback(response) {
                             ons.notification.alert({
                                title: 'خطا',
                                buttonLabel:"بستن " ,
                                message: 'لطفا اینترنت خود را چک کنید !!'
                           });
                        return false;
                 }); 
         } 
         else
         {
              scope.specials =  $rootScope.specials_root;
               $timeout(function(){
                    $('.owl-carousel_two').owlCarousel({
                    items:2,
                    margin:5,
                    autoHeight:true,
                    nav:false,
                    dots:false,
                    rtl:true,
                });
              }); 
         }
        
        }
}})


 
.directive('buybasketDir' , function ($filter,$rootScope,$location){
    return {
        link: function(scope) {
          
            scope.base_img = base_img + 'food-xsmall/' ;
            if(localStorage.getItem('cart'))
            {
                scope.cart = JSON.parse(localStorage.getItem('cart'));
                scope.basket_size =  scope.cart.length; 
                scope.cart_branch = JSON.parse(localStorage.getItem('cart_branch'));
               
                if(scope.cart.length == 0)
                {
                    scope.empty = true;
                }
                else{
                    
                   for(var i=0 ; i<scope.cart_branch.length ; i++){
                         scope.cart_branch[i].total = 0; 
                         for ( var j=0 ; j< scope.cart.length ; j++ ){
                             if(scope.cart[j].branch_id == scope.cart_branch[i].branch_id ){
                                 scope.cart_branch[i].total = scope.cart_branch[i].total + ( parseInt(scope.cart[j].price) * parseInt(scope.cart[j].quantity) ); 
                             }
                           }   
                        }
                 }
                   
            }
            else
            {
                scope.empty = true;
                scope.basket_size = 0; 
            }
          
         scope.minesFood = function(id,branch_id){
           
              for(var i = 0 ; i < scope.cart.length;  i++) {
                    if (scope.cart[i].id == id && scope.cart[i].branch_id == branch_id ) {
                          scope.cart[i].quantity = parseInt(scope.cart[i].quantity) - 1;
                           for(var j=0 ; j<scope.cart_branch.length ; j++){
                               if( scope.cart_branch[j].branch_id == branch_id )
                                {
                                    scope.cart_branch[j].total =  scope.cart_branch[j].total -  parseInt(scope.cart[i].price);
                                    break;
                                }
                               
                           }
                          if(scope.cart[i].quantity == 0){
                              scope.cart.splice(i,1);
                              scope.basket_size--;
                               var find = 0;
                               for(var i = 0 ; i < scope.cart.length;  i++) {
                                  if(scope.cart[i].branch_id == branch_id)
                                  {
                                      find ++;
                                      break;
                                  }
                                   
                               } 
                               if(find == 0)
                               {
                                     for(var i = 0 ; i < scope.cart_branch.length;  i++) {
                                         
                                         if(scope.cart_branch[i].branch_id == branch_id )
                                         {
                                             scope.cart_branch.splice(i,1);
                                             localStorage.setItem('cart_branch',JSON.stringify(scope.cart_branch));
                                             break;
                                         }
                                     }
                               }
                          }
                          if(scope.cart.length == 0)
                            {
                                scope.empty = true;
                            } 
                          localStorage.setItem('cart',JSON.stringify(scope.cart));
                          break;
                     }
                }
          };
          
          scope.plusFood = function(id,branch_id){   
              
                for(var i = 0 ; i < scope.cart.length;  i++) {
                    if (scope.cart[i].id == id && scope.cart[i].branch_id == branch_id ) {
                          scope.cart[i].quantity = parseInt(scope.cart[i].quantity) + 1;
                          localStorage.setItem('cart',JSON.stringify(scope.cart));
                          for(var j=0 ; j<scope.cart_branch.length ; j++){
                               if( scope.cart_branch[j].branch_id == branch_id )
                                {
                                    scope.cart_branch[j].total =  scope.cart_branch[j].total +  parseInt(scope.cart[i].price);
                                    break;
                                }
                               
                           }
                          break;
                     }
                }
                
              };
          
          scope.remove_food = function(id,branch_id){
             
              for(var i = 0 ; i < scope.cart.length;  i++) {
                    if (scope.cart[i].id == id && scope.cart[i].branch_id == branch_id ) {
                          for(var j=0 ; j<scope.cart_branch.length ; j++){
                            if( scope.cart_branch[j].branch_id == branch_id )
                                {
                                    scope.cart_branch[j].total =  scope.cart_branch[j].total -  (parseInt(scope.cart[i].price) * parseInt(scope.cart[i].quantity) ) ;
                                    break;
                                }
                               
                           }
                          scope.cart.splice(i,1);
                          scope.basket_size--;
                           var find = 0;
                               for(var i = 0 ; i < scope.cart.length;  i++) {
                                  if(scope.cart[i].branch_id == branch_id)
                                  {
                                      find ++;
                                      break;
                                  }
                                   
                               } 
                               if(find == 0)
                               {
                                     for(var i = 0 ; i < scope.cart_branch.length;  i++) {
                                         
                                         if(scope.cart_branch[i].branch_id == branch_id )
                                         {
                                             scope.cart_branch.splice(i,1);
                                             localStorage.setItem('cart_branch',JSON.stringify(scope.cart_branch));
                                             break;
                                         }
                                     }
                               }
                           if(scope.cart.length == 0)
                            {
                                scope.empty = true;
                            }     
                          localStorage.setItem('cart',JSON.stringify(scope.cart));
                          break;
                     }
                }
          };
            
            if(localStorage.getItem('user_id')){
                 $rootScope.user_id_wish = 1;
            } 
            else{
                 $rootScope.user_id_wish = 0;
            }
            scope.dialogs = {};
            scope.show = function(dlg) {
                         if (!scope.dialogs[dlg]) {
                        ons.createDialog(dlg).then(function(dialog) {
                            scope.dialogs[dlg] = dialog;
                            dialog.show();
                        });
                        } else {
                           scope.dialogs[dlg].show();
                        }
                 };
            
            
        }
}})


.directive('favouriteDir' , function ($http,$location){
    return {
        link: function(scope) {
            
         if(localStorage.getItem('cart')){
             scope.basket_size = JSON.parse(localStorage.getItem('cart')).length; 
          }
          else{
             scope.basket_size = 0; 
          }  
            
              scope.base_img = base_img + 'food-xsmall/' ;
              document.getElementById('loading').removeAttribute('style');     
          scope.dialogs = {};

      
             scope.show1 = function(dlg) {
                if (!scope.dialogs[dlg]) {
                ons.createDialog(dlg).then(function(dialog) {
                    scope.dialogs[dlg] = dialog;
                    dialog.show();
                });
                } else {
                  scope.dialogs[dlg].show();
                }
            };
       
             
          
         if(localStorage.getItem('user_id') == null)
         {
            document.getElementById('loading').style.display = 'none';  
            scope.show1('navigator.html');
             scope.branches = [];
             
         } 
         else
         {
              $http({
                    method: 'POST',
                    url: base_url+'get_whishlist/HamiDaMin23QZYTRRE782',
                    data: $.param({ user_id : localStorage.getItem('user_id') }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function successCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                if(response.data.done == 1)
                                {
                                    scope.wishes = response.data.wish;
                                    scope.branches = response.data.branch;
                                  
                                    scope.whishlist = [];
                                    for(var i = 0 ; i < scope.wishes.length;  i++) {
                                       scope.whishlist[i] = {food_id : scope.wishes[i].id , branch_id : scope.wishes[i].branch_id };
                                    }
                                   localStorage.setItem('whishlist',JSON.stringify(scope.whishlist));
                                 }
                                else
                                {
                                    ons.notification.alert({
                                            title: 'خطا',
                                            buttonLabel:"بستن " ,
                                            message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                                    });
                                    
                                }
                            
                            }, function errorCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                ons.notification.alert({
                                    title: 'خطا',
                                    buttonLabel:"بستن " ,
                                    message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                            });
                            return false;
                    }); 
             var timer;
             var timeout = 3000;
         scope.add_to_card = function(id,branch_id,picname,price,name,branch_name){
             /*==============animation================*/
            var theDiv = document.getElementById("mainList");
			btn = document.createElement("DIV");        // Create a <button> element
			theDiv.appendChild(btn);
			clearTimeout(timer);
			timer = setTimeout(function(){ document.getElementById('mainList').innerHTML=''; } , timeout );
            /*======================================*/
             
            if(localStorage.getItem('cart'))
            {
                scope.cart = JSON.parse(localStorage.getItem('cart'));
                scope.cart_branch = JSON.parse(localStorage.getItem('cart_branch'));
                var find = 0;
                for(var i = 0 ; i < scope.cart.length;  i++) {
                    if (scope.cart[i].id == id && scope.cart[i].branch_id == branch_id ) {
                          scope.cart[i].quantity = parseInt(scope.cart[i].quantity) + 1;
                          find++;
                          localStorage.setItem('cart',JSON.stringify(scope.cart));
                          break;
                     }
                }
                if(find == 0)
                {
                    scope.cart.push({id: id , name : name , branch_id : branch_id , price : price , quantity : 1 , picname : picname });
                     scope.basket_size++;
                    localStorage.setItem('cart',JSON.stringify(scope.cart));
                      find_branch = 0;
                      for(var i = 0 ; i < scope.cart_branch.length;  i++) {
                            if (scope.cart_branch[i].branch_id == branch_id ) {
                                 find_branch++;
                                 break;
                        }
                      }
                    if(find_branch == 0)  {
                         scope.cart_branch.push({ branch_name : branch_name , branch_id : branch_id  });
                         localStorage.setItem('cart_branch',JSON.stringify(scope.cart_branch));
                    }
                }
                
                 
            }
            else
            {
                scope.cart = [{id: id , name : name , branch_id : branch_id , price : price , quantity : 1 , picname : picname }];
                scope.basket_size++;
                scope.cart_branch = [{ branch_name : branch_name , branch_id : branch_id  }];
                localStorage.setItem('cart',JSON.stringify(scope.cart));
                localStorage.setItem('cart_branch',JSON.stringify(scope.cart_branch));
                
            }
            
            
        };
           
          scope.remove = function(food_id,branch_id){
              
               ons.notification.confirm({
                    title : "پیام",
                    message: 'از لیست علاقه مندی ها حذف شود ؟',
                    buttonLabels : ['خیر','بلی'],
                        callback: function(idx) {
                            switch (idx) {
                                case 0:
                                       
                                    break;
                                case 1:
                                   scope.do_remove(food_id,branch_id);
                                   break;
                        }
                    }
           });
             
        }; 
        
        
                scope.do_remove =  function(food_id,branch_id)
                {
                    var index = -1;
                            for(var i = 0 ; i < scope.wishes.length;  i++) {
                                    if (scope.wishes[i].id == food_id && scope.wishes[i].branch_id == branch_id ) {
                                        index = i;
                                        break;
                                    }
                                }
                        scope.wishes.splice(index,1);
                        scope.whishlist.splice(index,1);
                        localStorage.setItem('whishlist',JSON.stringify(scope.whishlist));
                        if(scope.whishlist.length == 0){
                            scope.branches = [];
                        }
                        
                        $http({
                            method: 'POST',
                            url: base_url+'whishlist/HamiDaMin23QZYTRRE782',
                            data: $.param({ user_id :  localStorage.getItem('user_id') , food_id : food_id , status : 0 ,  branch_id : branch_id }  ),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        });  
                };          
                      
         }
           
        }
        
}})
.directive('quickLogindir' , function ($location){
    return {
        link: function(scope) {
          scope.login = function(){
          naviDialog.hide();    
          $location.path('/login');
        };
        
         scope.register = function(){
          naviDialog.hide();    
          $location.path('/register');
         
        };
            
        }
}})


.directive('popOver' , function ($location,$rootScope){
    return {
        link: function(scope) {
          if(localStorage.getItem('user_id'))
            {
                scope.login = 1;
                scope.name = localStorage.getItem('name');
            } 
            else
            {
                scope.login = 0;
            }
            
             scope.go = function ( path ) {
               $rootScope.popover.hide(); 
               $location.path( path );
          };
        } 
}})

.directive('moreDir' , function ($location){
    return {
        link: function(scope) {
             if(localStorage.getItem('cart')){
             scope.basket_size = JSON.parse(localStorage.getItem('cart')).length; 
             }
             else{
                    scope.basket_size = 0; 
                } 
            
             if(localStorage.getItem('user_id')){
                 scope.login = true; 
             }
             else{
                    scope.login = false; 
               } 
         
          scope.exit = function(){
             localStorage.clear();
             $location.path("/home");
        };
                    
        }
        
       
}})


.directive('quickLogin' , function ($location,$http,$rootScope,$filter){
    return {
        link: function(scope) {
           scope.username = '';
           scope.password = '';
           
             scope.submit = function () {
              if(scope.username == '' ||  scope.password == '')
              {
                   ons.notification.alert({
                     title: 'خطا',
                     buttonLabel:"بستن " ,
                     message: 'نام کاربری و رمز عبور را وارد کنید !!'
                });
                  
              }
              else
              {
                   
                    document.getElementById('loading').removeAttribute('style');     
                    $http({
                        method: 'POST',
                        url: base_url+'login/HDaMin2dsaZ3QZYTRRE782',
                        data: $.param({email: scope.username , phone : Number(scope.username) , password : scope.password}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                                    document.getElementById('loading').setAttribute('style','display:none;'); 
                                    if(response.data == 0)
                                    {
                                        ons.notification.alert({
                                                title: 'خطا',
                                                buttonLabel:"بستن" ,
                                                message: 'نام کاربری یا رمز عبور اشتباه است !!'
                                            });
                                        return false;  
                                    }
                                    else
                                    {
                                        scope.user_info = response.data;
                                        dialog.hide();
                                        localStorage.setItem('user_id',scope.user_info.customer_id);
                                        localStorage.setItem('name',scope.user_info.name);
                                        localStorage.setItem('email',scope.user_info.email);
                                        localStorage.setItem('phone',scope.user_info.phone);
                                        localStorage.setItem('picname',scope.user_info.picname);
                                        localStorage.setItem('home_phone',scope.user_info.home_phone);
                                        localStorage.setItem('notification',scope.user_info.notification);
                                        localStorage.setItem('sms',scope.user_info.sms);
                                        localStorage.setItem('default_branch',scope.user_info.default_branch);
                                        localStorage.setItem('address',JSON.stringify(scope.user_info.address));
                                        localStorage.setItem('whishlist',JSON.stringify(scope.user_info.whishlist));
                                        $rootScope.user_id_wish = 1;
                                        scope.food_is_whish = $filter('filter')(scope.user_info.whishlist,{food_id : $rootScope.food_wish_id , branch_id : $rootScope.branch_wish_id },true); 
                                         if(scope.food_is_whish.length == 0)
                                        {
                                            $rootScope.icon = 0;
                                        }
                                        else
                                        {
                                            $rootScope.icon = 1;
                                        }
                                       
                                     }
                                
                                }, function errorCallback(response) {
                                    document.getElementById('loading').setAttribute('style','display:none;'); 
                                    ons.notification.alert({
                                        title: 'خطا',
                                        buttonLabel:"بستن " ,
                                        message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                                });
                                return false;
                        });   
              }
                
             
          };
           
           scope.go = function ( path ){
                dialog.hide();
                $location.path( path ); 
               
           }
           
        }
}})

.directive('lightgallery', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
        if (scope.$last) { 
            $('#lightgallery').lightGallery({
                thumbnail:true,
                animateThumb: false,
                showThumbByDefault: false
        });
        }
         
    }
  };
})
.directive('dirTabbar', function($location) {
  return {
    link: function(scope) {
    
        
        switch($location.path()) {
            case '/home':
                scope.activemenu = 'home';
                break;
            case '/favourite':
               scope.activemenu = 'favourite';
                break;
            case '/buybasket':
               scope.activemenu = 'buybasket';
                break;
            case '/more':
                scope.activemenu = 'more';
                break;
            
        }
        
      scope.tabbar_go = function(path){
            $location.path(path);
            return false;
        };
       
        
    }
    ,templateUrl : 'page/home/tabbar.html'
  };
})
