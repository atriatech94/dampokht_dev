angular.module('my-app')
.controller('IntroController', function() {
    
})
.directive('introDir' , function (){
		return {
			link: function() {
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true
                });
				
            }/* end */
}});
