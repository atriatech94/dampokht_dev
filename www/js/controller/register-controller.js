angular.module('my-app')
.controller('RegisterController', function($scope,$http,$location) {
    if(localStorage.getItem('user_id')){ $location.path("/home"); } 
         
    $scope.hback=function(){window.history.back()};
    
            $scope.Name = "";
            $scope.email = "";
            $scope.phone = "";
            $scope.password = "";
            $scope.ConfPassword = "";
           
        $scope.submit = function () {
           
             if($scope.Name == '' ||  $scope.email == '' || $scope.phone == '' || $scope.password == ''  || $scope.ConfPassword == ''){
                  ons.notification.alert({
                     title: 'خطا',
                     buttonLabel:"بستن " ,
                     message: 'لطفا تمامی فیلد ها را پر کنید'
                });
                return false;
             }
             
             var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
             if(!re.test($scope.email))
             {
                ons.notification.alert({
                     title: 'خطا',
                     buttonLabel:"بستن " ,
                     message: 'ایمیل وارد شده معتبر نیست !!'
                });
                return false;
             } 
             if(typeof ($scope.phone) != 'number' )
             {
                  ons.notification.alert({
                     title: 'خطا',
                     buttonLabel:"بستن " ,
                     message: 'شماره تلفن وارد شده معتبر نیست !!'
                });
                return false;
             }
             if($scope.phone.toString().length != 10 && $scope.phone.toString().length != 11 )
             {
              
                ons.notification.alert({
                     title: 'خطا',
                     buttonLabel:"بستن " ,
                     message: 'تلفن همراه باید 11 رقم باشد !!'
                });
                return false;
             } 
             if( $scope.password.length < 6)
             { 
                 ons.notification.alert({
                     title: 'خطا',
                     buttonLabel:"بستن " ,
                     message: 'کلمه عبور حداقل باید 6 کاراکتر باشد !!'
                });
                return false;
             } 
             
               if($scope.password != $scope.ConfPassword)
             { 
                 ons.notification.alert({
                     title: 'خطا',
                     buttonLabel:"بستن " ,
                     message: 'کلمه عبور با تکرار آن مطابقت ندارد !!'
                });
                return false;
             } 
           
             document.getElementById('loading').removeAttribute('style');     
             
              $http({
                method: 'POST',
                url: base_url+'register/HamiDaMin23QZYTRRE782',
                data: $.param({name: $scope.Name ,email : $scope.email, phone : Number($scope.phone), password : $scope.password}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                            if(response.data == 0)
                            {
                                   ons.notification.alert({
                                        title: 'خطا',
                                        buttonLabel:"بستن " ,
                                        message: 'ایمیل یا شماره تلفن در سیستم موجود است !!'
                                    });
                                   return false;  
                            }
                            else
                            {
                                $scope.user_info = response.data;
                                localStorage.setItem('user_id',$scope.user_info.customer_id);
                                localStorage.setItem('name',$scope.user_info.name);
                                localStorage.setItem('default_branch',0);
                                localStorage.setItem('email',$scope.user_info.email);
                                localStorage.setItem('phone',$scope.user_info.phone);
                                localStorage.setItem('notification',1);
                                localStorage.setItem('sms',1);
                                localStorage.setItem('home_phone',"");
                                localStorage.setItem('address',JSON.stringify($scope.user_info.address));
                                localStorage.setItem('whishlist',JSON.stringify([]));
                                $location.path("/home");
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
          };//end submit 
           
           
    
});
