angular.module('my-app')
.controller('checkoutController', function($scope,$http,$location,$routeParams,$filter,$rootScope) {
    $scope.go = function(path){
            $location.path(path);
        }
     
        if(localStorage.getItem('cart'))
        {
            $scope.cart = JSON.parse(localStorage.getItem('cart'));
             if($scope.cart.length == 0)
                {
                    $location.path('/buybasket');
                }
                else{
                  
                   $scope.addresses = JSON.parse(localStorage.getItem('address')); 
                   $scope.foods  = $filter('filter')($scope.cart, {branch_id : $routeParams.id} ,true);  
                 }
          document.getElementById('loading').removeAttribute('style');   
          $http({
                method: 'POST',
                url: base_url+'off/HamiDaMin23QZYTRRE782',
                data: $.param({
                   user_id :  localStorage.getItem('user_id')
                   }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                                  document.getElementById('loading').setAttribute('style','display:none;'); 
                                  $scope.profile = response.data.profile;
                                  $scope.change_rate = response.data.off;
                                  $scope.c_off = 0;
                                  $scope.zero = 0;
                                  $scope.p = $scope.profile[0].point;
                                
                         }, function errorCallback(response) {
                              document.getElementById('loading').setAttribute('style','display:none;'); 
                              ons.notification.alert({
                                title: 'خطا',
                                buttonLabel:"بستن " ,
                                message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                           });
                        $location.path('/buybasket');   
                        return false;
                 }); 
                 
            $scope.off = function(point){
             
             if( $scope.c_off == 0){
               
                 var totalPrice = $scope.total + $scope.total * 0.09;
                 var totalOff = parseInt( $scope.change_rate[0].off ) * parseInt(point);
                 var finalPrice = totalPrice - totalOff; 
               if(finalPrice >= 0)
                    {    
                        $scope.c_off = totalOff;
                        $scope.profile[0].point = 0 ;
                    }
                    else
                    {
                        var points = Math.ceil( totalPrice / $scope.change_rate[0].off );
                        var remain_p = point - points;
                        $scope.profile[0].point = remain_p ;
                        $scope.c_off = totalPrice;
                        $scope.zero = 1;
                     }
                }
                else{
                    
                    $scope.c_off = 0;
                    $scope.profile[0].point = $scope.p ; 
                     $scope.zero = 0;
                }   
               
               
              
            };  
            $scope.address_1 = "";
            $scope.description = "";
          
            $scope.submit =  function(payment){
               
               if(  $scope.address_1 == ""){
                     ons.notification.alert({
                                title: 'خطا',
                                buttonLabel:"بستن " ,
                                message: 'لطفا یک آدرس انتخاب کنید !!'
                           });
                         return false;  
               }
               if(payment == 1){
                   
                   ons.notification.alert({
                                title: 'خطا',
                                buttonLabel:"بستن " ,
                                message: 'پرداخت آنلاین به زودی راه اندازی می شود !!'
                           });
               }
               
               if(payment == 3){
                     
                  var total_p = ($scope.total +  $scope.total * 0.09) -  $scope.c_off;
                    if(  $scope.profile[0].credit < total_p  ){
                            ons.notification.alert({
                                        title: 'خطا',
                                        buttonLabel:"بستن " ,
                                        message: 'اعتبار حساب کاربری شما کافی نیست !!'
                                });
                                return false;  
                    }
                    
                    
               }
              
               
                 document.getElementById('loading').removeAttribute('style');   
                     $http({
                        method: 'POST',
                        url: base_url+'submit_order/HamiDaMin23QZYTRRE78256WE',
                        data: $.param({
                            user_id :  localStorage.getItem('user_id'),
                            cart :  JSON.stringify($scope.foods),
                            off :  $scope.c_off,
                            address :   $scope.address_1,
                            payment : payment,
                            description :  $scope.description
                        }),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                                        document.getElementById('loading').setAttribute('style','display:none;'); 
                                        if(response.data.done == 1){
                                             $rootScope.order_result = response.data;
                                              $location.path('/myprofile/order_true');
                                        }
                                        else
                                        {
                                             ons.notification.alert({
                                                    title: 'خطا',
                                                    buttonLabel:"بستن " ,
                                                    message: 'خطا در ثبت سفارش دوباره تلاش کنید !!'
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
           }; 
           
        
            $scope.addr =  function(address){
           
                $scope.address_1 = address;
           };    
            
        }
        else{
             $location.path('/buybasket');
        }
        
  
        
})
.controller('OrdertrueController',function($scope,$location,$rootScope){
    $scope.go = function ( path ) {$location.path( path );};
    $scope.result = $rootScope.order_result;
    console.log( $scope.result );
})
.controller('OrderfalseController',function($scope,$location){
    $scope.go = function ( path ) {$location.path( path );};
});
