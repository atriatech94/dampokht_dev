angular.module('my-app')
.controller('MenuController', function($scope,$http,$location,$routeParams,$rootScope,$route) {
         $scope.base_img = base_img + 'food-xsmall/' ;
         $scope.branch_id = $routeParams.id;
          $scope.go = function ( path ) {
              $location.path( path );
          };
          
          $scope.refresh = function(){
             $rootScope.root_food = null;
             $route.reload();
         };  
        if(localStorage.getItem('cart')){
             $scope.basket_size = JSON.parse(localStorage.getItem('cart')).length; 
        }
        else
        {
            $scope.basket_size = 0; 
        } 
        
    
        if($rootScope.root_food == null || $rootScope.root_food.foods[0].b_id != $routeParams.id )
         {  
            document.getElementById('loading').removeAttribute('style');       
            $http({ 
                    method: 'POST',
                    url: base_url+'branch_foods/HamiDaMin23QZYTRRE782',
                    data: $.param({ branch_id :  $routeParams.id }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function successCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                if(response.data.done == 1)
                                {
                                    $scope.foods = response.data.foods;
                                    $scope.categories = response.data.category;
                                    $rootScope.root_food = response.data;
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
         }
         else
         {
             $scope.foods = $rootScope.root_food.foods;
             $scope.categories = $rootScope.root_food.category;
         }
         
        var timer;
	    var timeout = 3000;
    
        $scope.add_to_card = function(id,branch_id,picname,price,name,branch_name){
            
            /*==============animation================*/
            var theDiv = document.getElementById("mainList");
			btn = document.createElement("DIV");        // Create a <button> element
			theDiv.appendChild(btn);
			clearTimeout(timer);
			timer = setTimeout(function(){ document.getElementById('mainList').innerHTML=''; } , timeout );
            /*======================================*/
            if(localStorage.getItem('cart'))
            {
                $scope.cart = JSON.parse(localStorage.getItem('cart'));
                $scope.cart_branch = JSON.parse(localStorage.getItem('cart_branch'));
                var find = 0;
                for(var i = 0 ; i <  $scope.cart.length;  i++) {
                    if ( $scope.cart[i].id == id &&  $scope.cart[i].branch_id == branch_id ) {
                           $scope.cart[i].quantity = parseInt( $scope.cart[i].quantity) + 1;
                          find++;
                          localStorage.setItem('cart',JSON.stringify( $scope.cart));
                          break;
                     }
                }
                if(find == 0)
                {
                    $scope.cart.push({id: id , name : name , branch_id : branch_id , price : price , quantity : 1 , picname : picname });
                    localStorage.setItem('cart',JSON.stringify( $scope.cart));
                     $scope.basket_size++;
                     find_branch = 0;
                      for(var i = 0 ; i <  $scope.cart_branch.length;  i++) {
                            if ( $scope.cart_branch[i].branch_id == branch_id ) {
                                 find_branch++;
                                 break;
                        }
                      }
                    if(find_branch == 0)  {
                          $scope.cart_branch.push({ branch_name : branch_name , branch_id : branch_id  });
                         localStorage.setItem('cart_branch',JSON.stringify( $scope.cart_branch));
                    }
                }
            }
            else
            {
                $scope.cart = [{id: id , name : name , branch_id : branch_id , price : price , quantity : 1 , picname : picname }];
                 $scope.basket_size++;
                $scope.cart_branch = [{ branch_name : branch_name , branch_id : branch_id  }];
                localStorage.setItem('cart',JSON.stringify($scope.cart));
                localStorage.setItem('cart_branch',JSON.stringify($scope.cart_branch));
            }
        };
})
.controller('FoodController', function($scope,$http,$location,$routeParams,$filter,$rootScope,$sce) {
       
       $scope.rate = [1,2,3,4,5];
       
        $scope.share = function(id,branch_id){
            
            alert(123);
        };
       
        $scope.order = function(id,branch_id,picname,price,name,branch_name){
                if(localStorage.getItem('cart'))
                {
                    $scope.cart = JSON.parse(localStorage.getItem('cart'));
                    $scope.cart_branch = JSON.parse(localStorage.getItem('cart_branch'));
                    var find = 0;
                    for(var i = 0 ; i < $scope.cart.length;  i++) {
                        if ($scope.cart[i].id == id && $scope.cart[i].branch_id == branch_id ) {
                            $scope.cart[i].quantity = parseInt($scope.cart[i].quantity) + 1;
                            find++;
                            localStorage.setItem('cart',JSON.stringify($scope.cart));
                              ons.notification.alert({
                                            title: 'پیام سیستم',
                                            buttonLabel:"بستن " ,
                                            message: 'به سبد خرید افزوده شد'
                                    });
                            break;
                        }
                    }
                    if(find == 0)
                    {
                        $scope.cart.push({id: id , name : name , branch_id : branch_id , price : price , quantity : 1 , picname : picname });
                        localStorage.setItem('cart',JSON.stringify($scope.cart));
                         ons.notification.alert({
                                            title: 'پیام سیستم',
                                            buttonLabel:"بستن " ,
                                            message: 'به سبد خرید افزوده شد'
                                    });
                        find_branch = 0;
                        for(var i = 0 ; i < $scope.cart_branch.length;  i++) {
                                if ($scope.cart_branch[i].branch_id == branch_id ) {
                                    find_branch++;
                                    break;
                            }
                        }
                        if(find_branch == 0)  {
                            $scope.cart_branch.push({ branch_name : branch_name , branch_id : branch_id  });
                            localStorage.setItem('cart_branch',JSON.stringify($scope.cart_branch));
                        }
                    }
                    
                    
                } 
                else
                {
                    $scope.cart = [{id: id , name : name , branch_id : branch_id , price : price , quantity : 1 , picname : picname }];
                    $scope.cart_branch = [{ branch_name : branch_name , branch_id : branch_id  }];
                    localStorage.setItem('cart',JSON.stringify($scope.cart));
                    localStorage.setItem('cart_branch',JSON.stringify($scope.cart_branch));
                     ons.notification.alert({
                                            title: 'پیام سیستم',
                                            buttonLabel:"بستن " ,
                                            message: 'به سبد خرید افزوده شد'
                                    });
                    
                }
            
       };
       
       /* --------------------- whishlist function ---------------------------- */ 
         if(localStorage.getItem('whishlist')){
             
              $scope.wishlist = JSON.parse(localStorage.getItem('whishlist'));
         }
         else
         {
             $scope.wishlist = [];
         }
         
         if(localStorage.getItem('user_id')){
             
              $rootScope.user_id_wish = 1;
         }
         else
         {
             $rootScope.user_id_wish = 0;
         }
         
         $rootScope.food_wish_id = $routeParams.food_id;
         $rootScope.branch_wish_id = $routeParams.branch_id;
       
         $scope.food_is_whish = $filter('filter')($scope.wishlist,{food_id : $routeParams.food_id , branch_id : $routeParams.branch_id },true);  
         if($scope.food_is_whish.length == 0)
         {
             $rootScope.icon = 0;
         }
         else
         {
             $rootScope.icon = 1;
         }
       
       
         $scope.dialogs = {};
         $scope.show = function(dlg) {
                         if (!$scope.dialogs[dlg]) {
                        ons.createDialog(dlg).then(function(dialog) {
                            $scope.dialogs[dlg] = dialog;
                            dialog.show();
                        });
                        } else {
                          $scope.dialogs[dlg].show();
                        }
                 };
        
        
          $scope.wishlist_add = function () {
             
             if($rootScope.icon == 0)
             {
                 $rootScope.icon = 1;
                 $scope.wishlist.push({food_id : $routeParams.food_id , branch_id : $routeParams.branch_id });
                 localStorage.setItem('whishlist',JSON.stringify($scope.wishlist));
             }
              else
              {
                  $rootScope.icon = 0;
                  var index = -1;
                  for(var i = 0 ; i < $scope.wishlist.length;  i++) {
                        if ($scope.wishlist[i].food_id == $routeParams.food_id && $scope.wishlist[i].branch_id == $routeParams.branch_id ) {
                             index = i;
                             break;
                        }
                    }
                  $scope.wishlist.splice(index,1);
                  localStorage.setItem('whishlist',JSON.stringify($scope.wishlist)); 
              }
                
           
               $http({
                    method: 'POST',
                    url: base_url+'whishlist/HamiDaMin23QZYTRRE782',
                    data: $.param({ user_id :  localStorage.getItem('user_id') , food_id : $routeParams.food_id , status : $rootScope.icon ,  branch_id : $routeParams.branch_id }  ),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });   
              
              
          };
         /* --------------------- whishlist function ---------------------------- */  
          
         $scope.go = function ( path ) { 
              $location.path( path );
          };
          $scope.base_img = base_img + 'food-small/' ;
          $scope.branch_id = $routeParams.branch_id;
          $scope.food_id = $routeParams.food_id;
   
   
   if($rootScope.root_food == null || $rootScope.root_food.foods[0].b_id != $routeParams.branch_id )
         { 
            document.getElementById('loading').removeAttribute('style');  
            $http({
                    method: 'POST',
                    url: base_url+'food_detail/HamiDaMin23QZYTRRE782',
                    data: $.param({ branch_id :  $routeParams.branch_id , food_id : $routeParams.food_id }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function successCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                if(response.data.done == 1)
                                {
                                    $scope.food = response.data.food;
                                    $scope.description = $sce.trustAsHtml($scope.food[0].description);
                                     $scope.realrate = Math.round( Number ($scope.food[0].rate) ); 
                                  
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
         }
         else
         {
             $scope.food = $filter('filter')($rootScope.root_food.foods,{id : $routeParams.food_id },true);
             $scope.description = $sce.trustAsHtml($scope.food[0].description);
             $scope.realrate = Math.round( Number ($scope.food[0].rate) ); 
              
              
         }  
    
})

.controller('GalleryController', function($scope,$http,$location,$routeParams) {
          $scope.go = function ( path ) {
              $location.path( path );
          };
          $scope.base_img = base_img + 'food-small/' ;
          $scope.base_imgx = base_img + 'food-xsmall/' ;
          $scope.branch_id = $routeParams.branch_id;
          $scope.food_id = $routeParams.food_id;
          
            document.getElementById('loading').removeAttribute('style');  
          $http({
                method: 'POST',
                url: base_url+'food_gallery/HamiDaMin23QZYTRRE782',
                data: $.param({ food_id : $routeParams.food_id }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                            if(response.data.done == 1)
                            {
                                 $scope.food = response.data.food;
                                 $scope.food_gallery = response.data.food_gallery;
                                
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
})
.controller('videoController', function($scope,$filter,$rootScope,$http,$routeParams,$sce) {
   
     $scope.base_img = base_img + 'food-video-pic/' ;
    
    if($rootScope.root_food == null || $rootScope.root_food.foods[0].b_id != $routeParams.branch_id )
         { 
            document.getElementById('loading').removeAttribute('style');  
            $http({
                    method: 'POST',
                    url: base_url+'food_detail/HamiDaMin23QZYTRRE782',
                    data: $.param({ branch_id :  $routeParams.branch_id , food_id : $routeParams.food_id }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function successCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                if(response.data.done == 1)
                                {
                                    $scope.food = response.data.food;
                                    $scope.poster =  ($scope.food[0].video).split(".");
                                    $scope.poster =  $scope.poster[0]+".jpg";
                                    $scope.base_vid = base_img + 'food-video/' + $scope.food[0].video ;
                                    $scope.base_vid = $sce.trustAsResourceUrl($scope.base_vid);
                                   
                                    
                                  
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
         }
         else
         {
             $scope.food = $filter('filter')($rootScope.root_food.foods,{id : $routeParams.food_id },true);
             $scope.poster =  ($scope.food[0].video).split(".");
             $scope.poster =  $scope.poster[0]+".jpg";
             $scope.base_vid = base_img + 'food-video/' + $scope.food[0].video ;
             $scope.base_vid = $sce.trustAsResourceUrl($scope.base_vid);
         }  


   
    $scope.goBack = function(){
        window.history.back();
    };
})



.controller('commentController', function($scope,$location,$routeParams,$http,$rootScope) {
    $scope.goBack = function(){
        window.history.back();
    };
    
     $scope.comment = "";
     $scope.rate = 0;
	 $scope.rate_f = function(rate){
		 $scope.rate = rate;
       }
       
      if(localStorage.getItem('user_id')){
          document.getElementById('loading').removeAttribute('style');  
            $http({
                    method: 'POST',
                    url: base_url+'food_comment_rate/HamiDaMin23QZYTRRE782',
                    data: $.param({ branch_id :  $routeParams.branch_id , food_id : $routeParams.food_id , user_id : localStorage.getItem('user_id')  }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function successCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                $scope.rate = Number ( response.data[0].rate ); 
                                console.log(response.data);
                            
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
     $scope.submit = function(){
        if(localStorage.getItem('user_id')){
            if( $scope.comment == "" && $scope.rate == 0 ){
                 ons.notification.alert({
                                            title: 'خطا',
                                            buttonLabel:"بستن " ,
                                            message: 'نظر یا رای خود را اعمال کنید  !!'
                                    });
                                   return false;
            }
            document.getElementById('loading').removeAttribute('style');  
            $http({
                    method: 'POST',
                    url: base_url+'food_comment/HamiDaMin23QZYTRRE782',
                    data: $.param({ branch_id :  $routeParams.branch_id , food_id : $routeParams.food_id , user_id : localStorage.getItem('user_id') , rate :  $scope.rate , comment : $scope.comment }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function successCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                  ons.notification.alert({
                                            title: 'پیام سیستم',
                                            buttonLabel:"بستن " ,
                                            message: 'نظر شما با موفقیت ثبت شد'
                                    });
                                  if($rootScope.root_food != null && $rootScope.root_food !== undefined && response.data != null ){
                                      for( var i=0 ; i<$rootScope.root_food.foods.length ; i++ ){
                                        if( $rootScope.root_food.foods[i].b_id == $routeParams.branch_id && $rootScope.root_food.foods[i].id == $routeParams.food_id ){
                                             $rootScope.root_food.foods[i].rate = Number (response.data[0].r);
                                             break;
                                        }
                                     }
                                  }   
                                  $location.path('/food/'+ $routeParams.food_id  +'/'+ $routeParams.branch_id);
                           
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
        else{
            
            $scope.dialogs = {};
            $scope.show = function(dlg) {
                         if (!$scope.dialogs[dlg]) {
                        ons.createDialog(dlg).then(function(dialog) {
                            $scope.dialogs[dlg] = dialog;
                            dialog.show();
                        });
                        } else {
                          $scope.dialogs[dlg].show();
                        }
                 };
           $scope.show('login.html');  
        }
    };
    
})
.controller('branchController', function($scope,$http,$location) {
   $scope.d_branch = localStorage.getItem('default_branch');
   $scope.goBack = function(){window.history.back();};
   if($scope.d_branch != 0 && localStorage.getItem('default_branch') != null ){
        $location.path('/menu/'+$scope.d_branch); 
   }
    $scope.go = function ( path ) {
              $location.path( path );
          };
   
   
    document.getElementById('loading').removeAttribute('style');     
            $http({
                method: 'GET',
                url: base_url+'branches/HamiDaMin23QZYTRRE782',
             }).then(function successCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                            $scope.branches = response.data;
                            console.log( $scope.branches );
                           
                              
                        }, function errorCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                              ons.notification.alert({
                                title: 'خطا',
                                buttonLabel:"بستن " ,
                                message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                           });
                        
                 });  
  
  $scope.add_branch = function(branch_id){
    
       document.getElementById('loading').removeAttribute('style');  
            $http({
                    method: 'POST',
                    url: base_url+'default_branch/HamiDaMin23QZYTRRE782',
                    data: $.param({ branch_id :  branch_id , user_id : localStorage.getItem('user_id') }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function successCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                $scope.d_branch = branch_id;
                                localStorage.setItem('default_branch',$scope.d_branch);
                           
                           }, function errorCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                  ons.notification.alert({
                                        title: 'خطا',
                                        buttonLabel:"بستن " ,
                                        message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                                });
                                return false;
                    }); 
  };  
  
   $scope.remove_branch = function(branch_id){
    
       document.getElementById('loading').removeAttribute('style');  
            $http({
                    method: 'POST',
                    url: base_url+'default_branch_r/HamiDaMin23QZYTRRE782',
                    data: $.param({ branch_id :  branch_id , user_id : localStorage.getItem('user_id') }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function successCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                $scope.d_branch = 0;
                                localStorage.setItem('default_branch',$scope.d_branch);
                           
                           }, function errorCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                  ons.notification.alert({
                                        title: 'خطا',
                                        buttonLabel:"بستن " ,
                                        message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                                });
                                return false;
                    }); 
  };                
   
})
.controller('branchesController', function($scope,$http,$location) {
   $scope.d_branch = localStorage.getItem('default_branch');
   $scope.go = function ( path ) {
              $location.path( path );
          };
    document.getElementById('loading').removeAttribute('style');     
            $http({
                method: 'GET',
                url: base_url+'branches/HamiDaMin23QZYTRRE782',
             }).then(function successCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                            $scope.branches = response.data;
                            console.log( $scope.branches );
                           
                              
                        }, function errorCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                              ons.notification.alert({
                                title: 'خطا',
                                buttonLabel:"بستن " ,
                                message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                           });
                        
                 });  
  
  $scope.add_branch = function(branch_id){
    
       document.getElementById('loading').removeAttribute('style');  
            $http({
                    method: 'POST',
                    url: base_url+'default_branch/HamiDaMin23QZYTRRE782',
                    data: $.param({ branch_id :  branch_id , user_id : localStorage.getItem('user_id') }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function successCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                $scope.d_branch = branch_id;
                                localStorage.setItem('default_branch',$scope.d_branch);
                           
                           }, function errorCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                  ons.notification.alert({
                                        title: 'خطا',
                                        buttonLabel:"بستن " ,
                                        message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                                });
                                return false;
                    }); 
  };  
  
   $scope.remove_branch = function(branch_id){
    
       document.getElementById('loading').removeAttribute('style');  
            $http({
                    method: 'POST',
                    url: base_url+'default_branch_r/HamiDaMin23QZYTRRE782',
                    data: $.param({ branch_id :  branch_id , user_id : localStorage.getItem('user_id') }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function successCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                $scope.d_branch = 0;
                                localStorage.setItem('default_branch',$scope.d_branch);
                           
                           }, function errorCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                  ons.notification.alert({
                                        title: 'خطا',
                                        buttonLabel:"بستن " ,
                                        message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                                });
                                return false;
                    }); 
  };                
   
})


.controller('commentdetailController', function($scope,$routeParams,$http) {
    $scope.go = function(){
        window.history.back();
    };
     $scope.base_img = base_img + 'profile/' ;
    document.getElementById('loading').removeAttribute('style');  
            $http({
                    method: 'POST',
                    url: base_url+'comments/HamiDaMin23QZYTRRE782',
                    data: $.param({ branch_id :  $routeParams.branch_id , food_id : $routeParams.food_id }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function successCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                $scope.comments = response.data;
                              }, function errorCallback(response) {
                                document.getElementById('loading').setAttribute('style','display:none;'); 
                                ons.notification.alert({
                                    title: 'خطا',
                                    buttonLabel:"بستن " ,
                                    message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                              });
                            return false;
                    }); 
    
    
    
});