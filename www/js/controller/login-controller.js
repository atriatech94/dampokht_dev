angular.module('my-app')
.controller('LoginController', function($scope,$location,$http) {
    if(localStorage.getItem('user_id'))
    {
        $location.path("/home");
    }  
    $scope.user = "";
    $scope.password = "";
             
    $scope.go = function ( path ) {$location.path( path )};
    $scope.hback=function(){window.history.back()};
    
    $scope.submit = function () {
        if($scope.user == '' ||  $scope.password == '')
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
                data: $.param({email: $scope.user , phone : Number($scope.user) , password : $scope.password}),
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
                    $scope.user_info = response.data;
                    localStorage.setItem('user_id',$scope.user_info.customer_id);
                    localStorage.setItem('name',$scope.user_info.name);
                    localStorage.setItem('email',$scope.user_info.email);
                    localStorage.setItem('default_branch',$scope.user_info.default_branch);
                    localStorage.setItem('notification',$scope.user_info.notification);
                    localStorage.setItem('sms',$scope.user_info.sms);
                    localStorage.setItem('phone',$scope.user_info.phone);
                    localStorage.setItem('picname',$scope.user_info.picname);
                    localStorage.setItem('home_phone',$scope.user_info.home_phone);
                    localStorage.setItem('address',JSON.stringify($scope.user_info.address));
                    localStorage.setItem('whishlist',JSON.stringify($scope.user_info.whishlist));
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
        }
                
             
    };         
});  