angular.module('my-app')
.directive('owlSlider' , function ($timeout){
    return {
        link: function() {
                $('.owl-carousel_one').owlCarousel({
                    items:1,
                    margin:0,
                    nav:false,
                    rtl:true,
                });
        }/* end */
}})
.service('loadGoogleMapAPI', ['$window', '$q', function ( $window, $q ) {

        var deferred = $q.defer(); 

        // Load Google map API script
        function loadScript() {  
            // Use global document since Angular's $document is weak
            var script = document.createElement('script');
            script.src = '//maps.googleapis.com/maps/api/js?sensor=false&language=fa&callback=initMap&libraries=places,drawing';
            document.body.appendChild(script);
        }

        // Script loaded callback, send resolve
        $window.initMap = function () {
            deferred.resolve();
        }

        loadScript();

        return deferred.promise;
}])
.directive('googleMap',  function( $rootScope, loadGoogleMapAPI , $http , $location ) {  

        return {
            restrict: 'C', // restrict by class name
            scope: {
                mapId: '@id', // map ID
                lat: '@',     // latitude
                long: '@'     // longitude
            },
            link: function( scope, elem, attrs ) {
                 
                
                var flightPath , flightPathh , area_id , center_mp , map , last_points , directionsDisplay;
                var markers = [];
                var other , first_loc = null ;
                var b = 0;
                var counter = 0 ; 
                var geocoder,geocoder2;
                
                var is_click = 1 ; 
                
                
                var _latitude = 29.624698;
                var _longitude = 52.530859;
                var gpss ;
                /*get geo */
                setInterval(function(){ navigator.geolocation.getCurrentPosition(onSuccessw,onErrorw,{timeout:10000}); },500);
                            
                            
                function onSuccessw(){gpss =  1;navigator.geolocation.getCurrentPosition(GetLocation);/*console.log("gps is on");*/}
                function onErrorw(){gpss =  0;/*console.log("gps is off");*/}
                
                var user_pos = new Object();
                
                
               // navigator.geolocation.getCurrentPosition(GetLocation);
                
                function GetLocation(location) 
                {
                    console.log(location.coords.latitude,location.coords.longitude);
                    user_pos.lat = location.coords.latitude;
                    user_pos.lon = location.coords.longitude;
                }
                
                // Check if latitude and longitude are specified
                if ( angular.isDefined(scope.lat) && angular.isDefined(scope.long) ) 
                {

                    // Initialize the map
                    scope.initialize = function() {     
                        geocoder = new google.maps.Geocoder();
                        geocoder2 = new google.maps.Geocoder();
                        
                        var directionsService = new google.maps.DirectionsService();
                        
                        var mapCenter = new google.maps.LatLng(_latitude,_longitude);
                        var mapOptions = {
                            zoom: 13,
                            center: mapCenter,
                            disableDefaultUI: false,
                            //scrollwheel: false,

                        };
                        var mapElement = document.getElementById('submit-map');
                        var map = new google.maps.Map(mapElement, mapOptions);
                        var marker = new google.maps.Marker({
                            position: mapCenter,
                            map: map,
                            icon: 'img/marker.png',
                            labelAnchor: new google.maps.Point(50, 0),
                            draggable: true
                        });
                        
                        flightPathh = null;
                        
                        /*load marker*/
                        $('#submit-map').removeClass('fade-map');
                        
                        /*dragebale marker*/
                        google.maps.event.addListener(marker, "mouseup", function (event) {
                            var latitude = this.position.lat();
                            var longitude = this.position.lng();
                            console.log(latitude);
                            $('#latitude').val( latitude );
                            $('#longitude').val( longitude );
                        });

                            //  Autocomplete
                        var input = document.getElementById('address-map') ;
                        var autocomplete = new google.maps.places.Autocomplete(input);
                        autocomplete.bindTo('bounds', map);
                        /*get suggest place*/
                        google.maps.event.addListener(autocomplete, 'place_changed', function() {

                            var place = autocomplete.getPlace();
                            if (!place.geometry) {
                                return;
                            }
                            if (place.geometry.viewport) {
                                map.fitBounds(place.geometry.viewport);
                            } else {
                                map.setCenter(place.geometry.location);
                                map.setZoom(17);
                            }
                            marker.setPosition(place.geometry.location);
                            marker.setVisible(true);
                            
                            console.log(marker.getPosition());
                            
                            $('#latitude').val( marker.getPosition().lat() );
                            $('#longitude').val( marker.getPosition().lng() );
                            var imap = new google.maps.LatLng(marker.getPosition().lat(),marker.getPosition().lng());
                            marker.setPosition(imap);
                            
                            var address = '';
                            
                            if (place.address_components) {
                                address = [
                                    (place.address_components[0] && place.address_components[0].short_name || ''),
                                    (place.address_components[1] && place.address_components[1].short_name || ''),
                                    (place.address_components[2] && place.address_components[2].short_name || '')
                                    ].join(' ');
                            }
                        });
                        
                        $('.now_me').click(function(){
                            var imap ;
                            
                            if(gpss == 1){
                                
                                imap = new google.maps.LatLng(user_pos.lat,user_pos.lon);
                                geocoder.geocode({'location': imap}, function(results, status) {
                                    if (status === google.maps.GeocoderStatus.OK) {
                                        map.panTo(imap);
                                        marker.setPosition(imap);
                                    }else{
                                        ons.notification.alert({title: "خطا",  buttonLabel:"بستن " ,message: 'لطفا GPS خود را فعال کنید'});
                                    }
                                });
                            }else{
                                ons.notification.alert({title: "خطا",  buttonLabel:"بستن " ,message: 'لطفا GPS خود را فعال کنید'});
                            }
                          
                            
                        });
                       
                        /*========================= new code start ===================================*/
                        var shape_type ;
                        $('.add_branch').on('change',function(){
                            
                            now_branch = $(this).val() ;
                            scope.branch_map = now_branch;
                            console.log( $rootScope.branches );
                            var branch_area = $.grep($rootScope.branches,function(a){
                                return a.id == now_branch;
                            })
                            console.log(branch_area);
                            area = [ { shapes:branch_area[0].area_type , vals:branch_area[0].area } ]
                            console.log(area);
                            map.setZoom(12);
                            var count_mark = 1 ;
                            if(b!=0){map_clear(flightPath);}
                            b++;

                            shape_type = area[0].shapes ;
                            if(area[0].shapes == "polygon")
                            {
                                var data = JSON.parse(area[0].vals);
                                var shapes;
                                for(i=0;i<data.length;i++)
                                {	
                                    var po = new google.maps.LatLng(data[i].A, data[i].F);
                                    if(i==0)
                                        shapes =[po];
                                    else
                                        shapes.push(po);
                                }

                                flightPath = new google.maps.Polygon({
                                    path: shapes,
                                    geodesic: true,
                                    fillColor:'#4BC1D2',
                                    fillOpacity : .09 ,
                                    strokeColor: '#4BC1D2',
                                    strokeOpacity: 1,
                                    strokeWeight: 3 ,
                                });
                                center_mp = shapes[0];  

                            }/*end if polygan*/
                            else if(area[0].shapes == "circle")
                            {

                                var data = JSON.parse(area[0].vals);
                                //console.log(data);

                                flightPath = new  google.maps.Circle({
                                    strokeColor: '#96A831',
                                    strokeOpacity: 1,
                                    strokeWeight: 2,
                                    fillColor: '#96A831',
                                    fillOpacity: 0.15,
                                    center: new google.maps.LatLng( data[0].lat , data[0].lon ),
                                    radius:  data[0].radius ,
                                });
                                /**/
                                // Add the circle for this city to the map.
                                center_mp =  new google.maps.LatLng( data[0].lat , data[0].lon );
                            }
                            else if(area[0].shapes == "rectangle")
                            {

                                var data = JSON.parse(area[0].vals);
                                //console.log(data.ra.A);
                                band_A = new google.maps.LatLng(  data.za.A , data.ra.A);
                                band_B = new google.maps.LatLng(data.za.j  , data.ra.j );

                                var bounds = new google.maps.LatLngBounds(band_B , band_A);

                                //console.log(data);  console.log(band_B);  

                                flightPath = new google.maps.Rectangle({
                                    strokeColor: '#4A93B5',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                    fillColor: '#4A93B5',
                                    fillOpacity: 0.15,
                                    bounds: bounds ,
                                });	

                                center_mp = new google.maps.LatLng( data.za.A + .010 , data.ra.A - .03 );
                            }//rectangle
                            else if(area[0].shapes == "polyline")
                            {

                                var data = JSON.parse(area[0].vals);
                                var shapes;
                                for(i=0;i<data.length;i++)
                                {	
                                    var po = new google.maps.LatLng(data[i].A, data[i].F);
                                    if(i==0)
                                        shapes =[po];
                                    else
                                        shapes.push(po);
                                }

                                flightPath = new google.maps.Polyline({
                                    path: shapes,
                                    geodesic: true,
                                    fillColor:'#4BC1D2',
                                    fillOpacity : .09 ,
                                    strokeColor: '#4BC1D2',
                                    strokeOpacity: 1,
                                    strokeWeight: 3 ,
                                });
                                center_mp = shapes[0];
                            }//end polyline
                            setTimeout(function(){
                                map.setZoom(13);
                                map.setCenter( center_mp ); 
                            },500);

                            flightPath.setMap(map);

                            google.maps.event.addListener(flightPath, 'click', function(event) {
                                if(is_click != 0)
                                addMarker(event.latLng);

                            });
                        });/* end on change   */
                         google.maps.event.addListener(map, 'click', function(event) {
                                if(is_click != 0)
                                addMarker(event.latLng);
                         });
                        
                        function addMarker(location) {
                            var imap = new google.maps.LatLng(user_pos.lat,user_pos.lon);
                            //map.panTo(location);
                            marker.setPosition(location);
                            
                        }/*end addMarker*/

                        /*Sets the map on all markers in the array.*/
                        function setAllMap(map) {
                            for (var i = 0; i < markers.length; i++) {
                              markers[i].setMap(map);
                            }
                        }

                        /* Removes the markers from the map, but keeps them in the array.*/
                        function clearMarkers() {setAllMap(null);}
                        /*Shows any markers currently in the array.*/
                        function showMarkers() { setAllMap(map);}
                        /*Deletes all markers in the array by removing references to them.*/
                        function deleteMarkers() { clearMarkers();markers = []; }
                        function map_clear(vars){ vars.setMap(null);setAllMap(null);}
                        
                        /*========================= new code start ===================================*/
                        $rootScope.submit_map = function(){
                   
                            var user_latlng = new Array();
                            
                           if(flightPath !== undefined && shape_type !== undefined){
                                  
                                console.log(shape_type);
                                if(shape_type == "polyline" || shape_type == "polygon"){
                                    if(google.maps.geometry.poly.containsLocation(marker.getPosition(), flightPath)){
                                        user_latlng = [ { lat : marker.getPosition().lat() , lng : marker.getPosition().lng() } ];
                                     }else{
                                        ons.notification.alert({title: "خطا",  buttonLabel:"بستن " ,message: 'مکان انتخابی شما خارج از محدوده تحت پوشش است'});
                                        return false;
                                    }
                                }
                                else
                                {
                                    if(flightPath.getBounds().contains(marker.getPosition()) ){
                                        user_latlng = [ { lat : marker.getPosition().lat() , lng : marker.getPosition().lng() } ];
                                    }else{
                                        ons.notification.alert({title: "خطا",  buttonLabel:"بستن " ,message: 'مکان انتخابی شما خارج از محدوده تحت پوشش است'});
                                        return false;
                                       
                                    }
                                }// end shape if
                                
                                /*send tu data base*/
                              
                               
                               /*--==========================---*/
                               geocoder2.geocode({ 
                                   latLng: marker.getPosition() ,
                                   language: 'fa',
                               },function(responses, status){
                                   if (status === google.maps.GeocoderStatus.OK)
                                   {
                                       if (responses[0]){
                                           var address = responses[0].formatted_address;
                                           $http({
                                            method: 'POST',
                                            url: base_url+'map_address/HamiDaMin23QZYTRRE782',
                                            data: $.param({ 
                                                user_id : localStorage.getItem('user_id'),
                                                lat : user_latlng[0].lat,
                                                lon : user_latlng[0].lng,
                                                address : address,
                                                branch_id : scope.branch_map
                                         }),
                                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                           }).then(function successCallback(response) {
                                                        document.getElementById('loading').setAttribute('style','display:none;'); 
                                                        if(response.data != 0)
                                                        {
                                                             var addresses = JSON.parse(localStorage.getItem('address'));
                                                             addresses.push({id: JSON.parse(response.data)  , address : address, type : 2 , branch_id : scope.branch_map});
                                                             localStorage.setItem('address',JSON.stringify(addresses));
                                                              ons.notification.alert({
                                                                            title: 'پیام',
                                                                            buttonLabel:"بستن" ,
                                                                            message: 'آدرس با موفقیت ثبت شد'
                                                                        });
                                                            $location.path('/myprofile/address'); 
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
                                            
                                       }else{
                                          ons.notification.alert({
                                                title: 'خطا',
                                                buttonLabel:"بستن " ,
                                                message: 'خطا در برقراری ارتباط'
                                            });
                                        } 
                                   }
                               });   
                               /*--==========================---*/
                               
                              
                                
                                
                            }// if شعبه موجود است 
                            else
                            {
                                ons.notification.alert({
                                    title: 'خطا',
                                    buttonLabel:"بستن " ,
                                    message: 'شعبه را انتخاب کنید'
                                });
                            }// شعبه موجود نیست 
                            
                        }// end submit_map
                        
                    }
                    
                   
                    loadGoogleMapAPI.then(function(){
                        scope.initialize();
                    },function () {
                    });
                }
            }
        };
})
.directive('mapeditDir' , function ($timeout,$http,$rootScope , $location , $routeParams){
    return {
        link: function(scope) {
            document.getElementById('loading').removeAttribute('style');   
            $http({
                method: 'POST',
                url: base_url+'edit_address_info_map/HamiDaMin23QZYTRRE782',
                data: $.param({ address_id :  $routeParams.id }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                document.getElementById('loading').setAttribute('style','display:none;'); 
                if(response.data.done == 1)
                {              
                    scope.branches = response.data.branches;
                    scope.my_address = response.data.customer_address;
                    scope.branch_now = scope.my_address[0].branch_id;
                            

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
            
        }/* end */
}}) 
.directive('googleMapedit',  function( $rootScope, loadGoogleMapAPI , $http , $location , $routeParams ) {  

        return {
            restrict: 'C', // restrict by class name
            scope: {
                mapId: '@id', // map ID
                lat: '@',     // latitude
                long: '@'     // longitude
            },
            link: function( scope, elem, attrs ) {
                
              
               // console.log(scope.$parent.my_address);
                
                
                
                
                
                var flightPath , flightPathh , area_id , center_mp , map , last_points , directionsDisplay;
                var markers = [];
                var other , first_loc = null ;
                var b = 0;
                var counter = 0 ; 
                var geocoder,geocoder2;
                
                var is_click = 1 ; 
                
                
                var _latitude = 29.624698;
                var _longitude = 52.530859;
                var gpss ;
                /*get geo */
                setInterval(function(){ navigator.geolocation.getCurrentPosition(onSuccessw,onErrorw,{timeout:10000}); },500);
                            
                            
                function onSuccessw(){gpss =  1;navigator.geolocation.getCurrentPosition(GetLocation);/*console.log("gps is on");*/}
                function onErrorw(){gpss =  0;/*console.log("gps is off");*/}
                
                var user_pos = new Object();
                
                
               // navigator.geolocation.getCurrentPosition(GetLocation);
                
                function GetLocation(location) 
                {
                    console.log(location.coords.latitude,location.coords.longitude);
                    user_pos.lat = location.coords.latitude;
                    user_pos.lon = location.coords.longitude;
                }
                
                // Check if latitude and longitude are specified
                if ( angular.isDefined(scope.lat) && angular.isDefined(scope.long) ) 
                {
                    
                    
                    
                    
                    var shape_type ;

                    // Initialize the map
                    scope.initialize = function() {     
                        geocoder = new google.maps.Geocoder();
                        geocoder2 = new google.maps.Geocoder();
                        
                        var directionsService = new google.maps.DirectionsService();
                        
                        var mapCenter = new google.maps.LatLng(_latitude,_longitude);
                        var mapOptions = {
                            zoom: 13,
                            center: mapCenter,
                            disableDefaultUI: false,
                            //scrollwheel: false,

                        };
                        var mapElement = document.getElementById('submit-map');
                        var map = new google.maps.Map(mapElement, mapOptions);
                        var marker = new google.maps.Marker({
                            position: mapCenter,
                            map: map,
                            icon: 'img/marker.png',
                            labelAnchor: new google.maps.Point(50, 0),
                            draggable: true
                        });
                        
                        flightPathh = null;
                        
                        /*load marker*/
                        $('#submit-map').removeClass('fade-map');
                        
                        /*dragebale marker*/
                        google.maps.event.addListener(marker, "mouseup", function (event) {
                            var latitude = this.position.lat();
                            var longitude = this.position.lng();
                            console.log(latitude);
                            $('#latitude').val( latitude );
                            $('#longitude').val( longitude );
                        });

                            //  Autocomplete
                        var input = document.getElementById('address-map') ;
                        var autocomplete = new google.maps.places.Autocomplete(input);
                        autocomplete.bindTo('bounds', map);
                        /*get suggest place*/
                        google.maps.event.addListener(autocomplete, 'place_changed', function() {

                            var place = autocomplete.getPlace();
                            if (!place.geometry) {
                                return;
                            }
                            if (place.geometry.viewport) {
                                map.fitBounds(place.geometry.viewport);
                            } else {
                                map.setCenter(place.geometry.location);
                                map.setZoom(17);
                            }
                            marker.setPosition(place.geometry.location);
                            marker.setVisible(true);
                            
                            console.log(marker.getPosition());
                            
                            $('#latitude').val( marker.getPosition().lat() );
                            $('#longitude').val( marker.getPosition().lng() );
                            var imap = new google.maps.LatLng(marker.getPosition().lat(),marker.getPosition().lng());
                            marker.setPosition(imap);
                            
                            var address = '';
                            
                            if (place.address_components) {
                                address = [
                                    (place.address_components[0] && place.address_components[0].short_name || ''),
                                    (place.address_components[1] && place.address_components[1].short_name || ''),
                                    (place.address_components[2] && place.address_components[2].short_name || '')
                                    ].join(' ');
                            }
                        });
                        
                        $('.now_me').click(function(){
                            var imap ;
                            
                            if(gpss == 1){
                                
                                imap = new google.maps.LatLng(user_pos.lat,user_pos.lon);
                                geocoder.geocode({'location': imap}, function(results, status) {
                                    if (status === google.maps.GeocoderStatus.OK) {
                                        map.panTo(imap);
                                        marker.setPosition(imap);
                                    }else{
                                        ons.notification.alert({title: "خطا",  buttonLabel:"بستن " ,message: 'لطفا GPS خود را فعال کنید'});
                                    }
                                });
                            }else{
                                ons.notification.alert({title: "خطا",  buttonLabel:"بستن " ,message: 'لطفا GPS خود را فعال کنید'});
                            }
                          
                            
                        });
                       
                        /*========================= new code start ===================================*/
                        
                        $('.add_branch').on('change',function(event){
                            area_shape($(this).val());
                            
                        });/* end on change   */
                        /*=============================================*/
                        scope.$watch(
                            function(scope) {return scope.$parent.my_address;},
                            function() {
                                if(scope.$parent.my_address !== undefined){
                                    
                                    area_shape(scope.$parent.my_address[0].branch_id);
                                    var imap = new google.maps.LatLng(scope.$parent.my_address[0].lat,scope.$parent.my_address[0].lon);
                                    map.panTo(imap);
                                    marker.setPosition(imap);
                                   
                                }/*if scope.portfolio != 2*/
                            }
                        );
                       /*=============================================*/
                        /*==========================================================================*/
                        function area_shape(event){

                            now_branch = event ;
 
                            scope.branch_map = now_branch;
                            
                            var branch_area = $.grep(scope.$parent.branches,function(a){
                                return a.id == now_branch;
                            })
                            console.log(branch_area);
                            area = [ { shapes:branch_area[0].area_type , vals:branch_area[0].area } ]
                            console.log(area);
                            map.setZoom(12);
                            var count_mark = 1 ;
                            if(b!=0){map_clear(flightPath);}
                            b++;

                            shape_type = area[0].shapes ;
                            if(area[0].shapes == "polygon")
                            {
                                var data = JSON.parse(area[0].vals);
                                var shapes;
                                for(i=0;i<data.length;i++)
                                {	
                                    var po = new google.maps.LatLng(data[i].A, data[i].F);
                                    if(i==0)
                                        shapes =[po];
                                    else
                                        shapes.push(po);
                                }

                                flightPath = new google.maps.Polygon({
                                    path: shapes,
                                    geodesic: true,
                                    fillColor:'#4BC1D2',
                                    fillOpacity : .09 ,
                                    strokeColor: '#4BC1D2',
                                    strokeOpacity: 1,
                                    strokeWeight: 3 ,
                                });
                                center_mp = shapes[0];  

                            }/*end if polygan*/
                            else if(area[0].shapes == "circle")
                            {

                                var data = JSON.parse(area[0].vals);
                                //console.log(data);

                                flightPath = new  google.maps.Circle({
                                    strokeColor: '#96A831',
                                    strokeOpacity: 1,
                                    strokeWeight: 2,
                                    fillColor: '#96A831',
                                    fillOpacity: 0.15,
                                    center: new google.maps.LatLng( data[0].lat , data[0].lon ),
                                    radius:  data[0].radius ,
                                });
                                /**/
                                // Add the circle for this city to the map.
                                center_mp =  new google.maps.LatLng( data[0].lat , data[0].lon );
                            }
                            else if(area[0].shapes == "rectangle")
                            {

                                var data = JSON.parse(area[0].vals);
                                //console.log(data.ra.A);
                                band_A = new google.maps.LatLng(  data.za.A , data.ra.A);
                                band_B = new google.maps.LatLng(data.za.j  , data.ra.j );

                                var bounds = new google.maps.LatLngBounds(band_B , band_A);

                                //console.log(data);  console.log(band_B);  

                                flightPath = new google.maps.Rectangle({
                                    strokeColor: '#4A93B5',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                    fillColor: '#4A93B5',
                                    fillOpacity: 0.15,
                                    bounds: bounds ,
                                });	

                                center_mp = new google.maps.LatLng( data.za.A + .010 , data.ra.A - .03 );
                            }//rectangle
                            else if(area[0].shapes == "polyline")
                            {

                                var data = JSON.parse(area[0].vals);
                                var shapes;
                                for(i=0;i<data.length;i++)
                                {	
                                    var po = new google.maps.LatLng(data[i].A, data[i].F);
                                    if(i==0)
                                        shapes =[po];
                                    else
                                        shapes.push(po);
                                }

                                flightPath = new google.maps.Polyline({
                                    path: shapes,
                                    geodesic: true,
                                    fillColor:'#4BC1D2',
                                    fillOpacity : .09 ,
                                    strokeColor: '#4BC1D2',
                                    strokeOpacity: 1,
                                    strokeWeight: 3 ,
                                });
                                center_mp = shapes[0];
                            }//end polyline
                            setTimeout(function(){
                                map.setZoom(13);
                                map.setCenter( center_mp ); 
                            },500);

                            flightPath.setMap(map);

                            google.maps.event.addListener(flightPath, 'click', function(event) {
                                if(is_click != 0)
                                addMarker(event.latLng);

                            });
                        
                        
                        
                        }
                        /*==========================================================================*/
                         google.maps.event.addListener(map, 'click', function(event) {
                                if(is_click != 0)
                                addMarker(event.latLng);
                         });
                        
                        function addMarker(location) {
                            var imap = new google.maps.LatLng(user_pos.lat,user_pos.lon);
                            //map.panTo(location);
                            marker.setPosition(location);
                            
                        }/*end addMarker*/

                        /*Sets the map on all markers in the array.*/
                        function setAllMap(map) {
                            for (var i = 0; i < markers.length; i++) {
                              markers[i].setMap(map);
                            }
                        }

                        /* Removes the markers from the map, but keeps them in the array.*/
                        function clearMarkers() {setAllMap(null);}
                        /*Shows any markers currently in the array.*/
                        function showMarkers() { setAllMap(map);}
                        /*Deletes all markers in the array by removing references to them.*/
                        function deleteMarkers() { clearMarkers();markers = []; }
                        function map_clear(vars){ vars.setMap(null);setAllMap(null);}
                        
                        /*========================= new code start ===================================*/
                        $rootScope.submit_map = function(){
                   
                            var user_latlng = new Array();
                            
                           if(flightPath !== undefined && shape_type !== undefined){
                                  
                                console.log(shape_type);
                                if(shape_type == "polyline" || shape_type == "polygon"){
                                    if(google.maps.geometry.poly.containsLocation(marker.getPosition(), flightPath)){
                                        user_latlng = [ { lat : marker.getPosition().lat() , lng : marker.getPosition().lng() } ];
                                     }else{
                                        ons.notification.alert({title: "خطا",  buttonLabel:"بستن " ,message: 'مکان انتخابی شما خارج از محدوده تحت پوشش است'});
                                        return false;
                                    }
                                }
                                else
                                {
                                    if(flightPath.getBounds().contains(marker.getPosition()) ){
                                        user_latlng = [ { lat : marker.getPosition().lat() , lng : marker.getPosition().lng() } ];
                                    }else{
                                        ons.notification.alert({title: "خطا",  buttonLabel:"بستن " ,message: 'مکان انتخابی شما خارج از محدوده تحت پوشش است'});
                                        return false;
                                       
                                    }
                                }// end shape if
                                
                                /*send tu data base*/
                              
                               
                               /*--==========================---*/
                               geocoder2.geocode({ 
                                   latLng: marker.getPosition() ,
                                   language: 'fa',
                               },function(responses, status){
                                   if (status === google.maps.GeocoderStatus.OK)
                                   {
                                       if (responses[0]){
                                           var address = responses[0].formatted_address;
                                           $http({
                                            method: 'POST',
                                            url: base_url+'map_address_edit/HamiDaMin23QZYTRRE782',
                                            data: $.param({ 
                                                user_id : localStorage.getItem('user_id'),
                                                lat : user_latlng[0].lat,
                                                lon : user_latlng[0].lng,
                                                address : address,
                                                address_id :  $routeParams.id, 
                                                branch_id : scope.branch_map
                                         }),
                                          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                           }).then(function successCallback(response) {
                                                        document.getElementById('loading').setAttribute('style','display:none;'); 
                                                        if(response.data != 0)
                                                        {
                                                             var addresses = JSON.parse(localStorage.getItem('address'));
                                                             for (var i=0 ; i<addresses.length ; i++){
                                                                
                                                                 if(addresses[i].id == JSON.parse(response.data))
                                                                 {
                                                                    addresses[i] = {id: JSON.parse(response.data) , address : address, type : 2 , branch_id : scope.branch_map}; 
                                                                    break; 
                                                                 }
                                                             }
                                                             localStorage.setItem('address',JSON.stringify(addresses));
                                                              ons.notification.alert({
                                                                            title: 'پیام',
                                                                            buttonLabel:"بستن" ,
                                                                            message: 'آدرس با موفقیت ثبت شد'
                                                                        });
                                                            $location.path('/myprofile/address'); 
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
                                            
                                       }else{
                                          ons.notification.alert({
                                                title: 'خطا',
                                                buttonLabel:"بستن " ,
                                                message: 'خطا در برقراری ارتباط'
                                            });
                                        } 
                                   }
                               });   
                               /*--==========================---*/
                               
                              
                                
                                
                            }// if شعبه موجود است 
                            else
                            {
                                ons.notification.alert({
                                    title: 'خطا',
                                    buttonLabel:"بستن " ,
                                    message: 'شعبه را انتخاب کنید'
                                });
                            }// شعبه موجود نیست 
                            
                        }// end submit_map
                        
                    }
                    
                   
                    loadGoogleMapAPI.then(function(){
                        scope.initialize();
                    },function () {
                    });
                }
            }
        };
})