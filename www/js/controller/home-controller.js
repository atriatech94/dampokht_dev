angular.module('my-app')
.controller('HomeController', function($scope,$location,$rootScope,$routeParams) {

    /*======================AMIN----------------------*/
    ons.createPopover('myPopover.html').then(function (popover) {
        $rootScope.popover = popover;
    });
    
     $scope.show = function(e) {
         $rootScope.popover.show(e);
      };
   
        $scope.prompt = function(material) {
            var mod = material ? 'material' : undefined;
            ons.notification.prompt({
                title:'ارسال به دوستان',
                message: "شماره همراه دوست خود را وارد کنید",
                buttonLabel:"ارسال پیام " ,
                modifier: mod,
              callback: function(age) {
                ons.notification.alert({
                    title:'ارسال موفق',
                    message: 'برای شماره مورد نظر یک پیامک ارسل شد',
                    modifier: mod,
                    buttonLabel:"بستن پنجره" ,
                });
              }
            });
          }
        $scope.go = function(path){
            $location.path(path);
        }
   
})



.controller('CooperationController', function($scope,$http,$sce,$location) {
     $scope.go = function ( path ) {$location.path( path );};
     document.getElementById('loading').removeAttribute('style');     
            $http({
                method: 'GET',
                url: base_url+'cooprate_info/HamiDaMin23QZYTRRE782'
               }).then(function successCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                            $scope.cooprate_info = response.data;
                            $scope.description = $sce.trustAsHtml( $scope.cooprate_info[0].text);
                              
                        }, function errorCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                              ons.notification.alert({
                                title: 'خطا',
                                buttonLabel:"بستن " ,
                                message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                           });
                        
                 });  
    
    
    
      $scope.name = ""; 
      $scope.phone = "";
      $scope.title = "";
      $scope.text = "";
     
       $scope.submit = function () {
           
             if($scope.name == '' || $scope.phone == '' || $scope.title == ''  || $scope.text == ''){
                  ons.notification.alert({
                     title: 'خطا',
                     buttonLabel:"بستن " ,
                     message: 'لطفا تمامی فیلد ها را پر کنید'
                });
                return false;
             }
            document.getElementById('loading').removeAttribute('style');     
             
              $http({
                method: 'POST',
                url: base_url+'cooperate/HamiDaMin23QZYTRRE782',
                data: $.param({name: $scope.name ,phone : $scope.phone, title : $scope.title, text : $scope.text}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                            if(response.data == 1)
                            {
                                     ons.notification.alert({
                                                title: 'پیام',
                                                buttonLabel:"بستن" ,
                                                message: 'درخواست شما با موفقیت ارسال شد'
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
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                              ons.notification.alert({
                                title: 'خطا',
                                buttonLabel:"بستن " ,
                                message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                           });
                        return false;
                 });  
       };//end submit
})

.controller('ContactController', function($scope,$http,$location) {
      $scope.go = function ( path ) {$location.path( path );};
      document.getElementById('loading').removeAttribute('style');     
            $http({
                method: 'GET',
                url: base_url+'contact_info/HamiDaMin23QZYTRRE782'
               }).then(function successCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                            $scope.contact_info = response.data;
                              
                        }, function errorCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                              ons.notification.alert({
                                title: 'خطا',
                                buttonLabel:"بستن " ,
                                message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                           });
                        
                 });  
     
     
     
      $scope.name = "";
      $scope.phone_or_email = "";
      $scope.title = "";
      $scope.phone = "";
      $scope.text = "";
       $scope.submit = function () {
           
             if($scope.name == '' || $scope.phone_or_mail == '' || $scope.title == ''  || $scope.text == ''){
                  ons.notification.alert({
                     title: 'خطا',
                     buttonLabel:"بستن " ,
                     message: 'لطفا تمامی فیلد ها را پر کنید'
                });
                return false;
             }
            var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/; 
            if( !EMAIL_REGEXP.test($scope.phone_or_email ))
            {
                 ons.notification.alert({
                     title: 'خطا',
                     buttonLabel:"بستن " ,
                     message: 'ایمیل وارد شده معتبر نیست'
                });
                return false;
            }
            
            document.getElementById('loading').removeAttribute('style');     
             
              $http({
                method: 'POST',
                url: base_url+'contact/HamiDaMin23QZYTRRE782',
                data: $.param({name: $scope.name , phone : $scope.phone ,phone_or_email : $scope.phone_or_email, title : $scope.title, text : $scope.text}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                            if(response.data == 1)
                            {
                                     ons.notification.alert({
                                                title: 'پیام',
                                                buttonLabel:"بستن" ,
                                                message: 'پیام شما با موفقیت ارسال شد'
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
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                              ons.notification.alert({
                                title: 'خطا',
                                buttonLabel:"بستن " ,
                                message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                           });
                        return false;
                 });  
       };//end submit
})
.controller('faqController', function($scope,$http,$sce,$location) {
    $scope.go = function ( path ) {$location.path( path );};
    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        }else{
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };
    
     document.getElementById('loading').removeAttribute('style');     
            $http({
                method: 'GET',
                url: base_url+'faq/HamiDaMin23QZYTRRE782'
               }).then(function successCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                            $scope.faq = response.data;
                            for(var i=0 ; i < $scope.faq.length ; i++ ){
                                   $scope.faq[i].answer = $sce.trustAsHtml( $scope.faq[i].answer);
                            }
                             
                        }, function errorCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                              ons.notification.alert({
                                title: 'خطا',
                                buttonLabel:"بستن " ,
                                message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                           });
                        
                 });  
    

})



.controller('AboutController', function($scope,$http,$sce,$location) {
     $scope.go = function ( path ) {$location.path( path );};
     document.getElementById('loading').removeAttribute('style');     
            $http({
                method: 'GET',
                url: base_url+'about/HamiDaMin23QZYTRRE782',
             }).then(function successCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                            $scope.about = response.data;
                            $scope.description = $sce.trustAsHtml( $scope.about[0].text);
                            $scope.base_img = base_img + 'about-small/' +  $scope.about[0].picname;
                        
                     }, function errorCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                              ons.notification.alert({
                                title: 'خطا',
                                buttonLabel:"بستن " ,
                                message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                           });
                        
                 });  
})


.controller('lawController', function($scope,$http,$sce,$location) {
      $scope.go = function ( path ) {$location.path( path );};
     document.getElementById('loading').removeAttribute('style');     
            $http({
                method: 'GET',
                url: base_url+'law/HamiDaMin23QZYTRRE782',
             }).then(function successCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                            $scope.laws = response.data;
                            for(var i=0 ; i < $scope.laws.length ; i++ ){
                                   $scope.laws[i].text = $sce.trustAsHtml( $scope.laws[i].text);
                            }
                              
                        }, function errorCallback(response) {
                            document.getElementById('loading').setAttribute('style','display:none;'); 
                              ons.notification.alert({
                                title: 'خطا',
                                buttonLabel:"بستن " ,
                                message: 'خطا در برقراری ارتباط دوباره تلاش کنید !!'
                           });
                        
                 });  
    
});
  
  
