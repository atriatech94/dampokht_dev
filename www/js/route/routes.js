angular.module('my-app')
    .config(function($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'page/intro/index.html',
            controller: 'IntroController',
        })
        .when('/intro', {
            templateUrl: 'page/intro/index.html',
            controller: 'IntroController',
        })
        .when('/home', {
            templateUrl: 'page/home/home.html',
            controller: 'HomeController',
        })
        .when('/buybasket', {
            templateUrl: 'page/home/buybasket.html',
            controller: 'HomeController',
		})
        .when('/more', {
            templateUrl: 'page/home/more.html',
            controller: 'HomeController',
		})
        .when('/favourite', {
            templateUrl: 'page/home/favourite.html',
            controller: 'HomeController',
		})
        .when('/food_list', {
            templateUrl: 'page/food_list/index.html',
            controller: 'FoodlistController',
		})
       
        .when('/login', {
            templateUrl: 'page/login/index.html',
            controller: 'LoginController',
		})
        .when('/register', {
            templateUrl: 'page/register/index.html',
            controller: 'RegisterController',
		})
        .when('/video/:food_id/:branch_id', {
            templateUrl: 'page/menu/video.html',
            controller: 'videoController',
		})
        .when('/comment/:food_id/:branch_id', {
            templateUrl: 'page/menu/comment.html',
            controller: 'commentController',
		})
        .when('/comment_detail/:food_id/:branch_id', {
            templateUrl: 'page/menu/comment_detail.html',
            controller: 'commentdetailController',
		})
        .when('/menu/:id', {
            templateUrl: 'page/menu/index.html',
            controller: 'MenuController',
		})
        .when('/food/:food_id/:branch_id', {
            templateUrl: 'page/menu/food.html',
            controller: 'FoodController',
		})
        .when('/pictures/:food_id/:branch_id', {
            templateUrl: 'page/menu/gallery.html',
            controller: 'GalleryController',
		})
        .when('/myprofile/', {
            templateUrl: 'page/myprofile/index.html',
            controller: 'MyprofileController',
		})
        .when('/myprofile/setting', {
            templateUrl: 'page/myprofile/setting.html',
            controller: 'SettingController',
		})
        .when('/myprofile/change_pass', {
            templateUrl: 'page/myprofile/change_pass.html',
            controller: 'ChangepassController',
		})
        .when('/myprofile/change_info', {
            templateUrl: 'page/myprofile/change_info.html',
            controller: 'ChangeinfoController',
		})
        .when('/myprofile/address', {
            templateUrl: 'page/myprofile/address.html',
            controller: 'AddressController',
		})
        .when('/myprofile/new_address', {
            templateUrl: 'page/myprofile/new_address.html',
            controller: 'NewaddressController',
		})
        .when('/myprofile/charje', {
            templateUrl: 'page/myprofile/charje.html',
            controller: 'charjeController',
		})
        .when('/cooperation/', {
            templateUrl: 'page/other/cooperation.html',
            controller: 'CooperationController',
		})
        .when('/about/', {
            templateUrl: 'page/other/about.html',
            controller: 'AboutController',
		})
        .when('/contact/', {
            templateUrl: 'page/other/contact.html',
            controller: 'ContactController',
		})
        .when('/faq/', {
            templateUrl: 'page/other/faq.html',
            controller: 'faqController',
		})
        .when('/law/', {
            templateUrl: 'page/other/law.html',
            controller: 'lawController',
		})
       .when('/edit_address/:id/:type', {
            templateUrl: 'page/myprofile/edit_address.html',
            controller: 'EditAddressController',
		})
         .when('/edit_address_map/:id/:type', {
            templateUrl: 'page/myprofile/edit_address_map.html'
           
		})
        .when('/checkout/:id', {
            templateUrl: 'page/checkout/index.html',
            controller: 'checkoutController',
		})
		.when('/myprofile/order_list', {
            templateUrl: 'page/myprofile/order_list.html',
            controller: 'OrderlistController',
		})
        .when('/myprofile/order_detail/:id', {
            templateUrl: 'page/myprofile/order_detail.html',
            controller: 'OrderdetailController',
		})
        .when('/myprofile/order_true', {
            templateUrl: 'page/myprofile/order_true.html',
            controller: 'OrdertrueController',
		})
        .when('/myprofile/order_false', {
            templateUrl: 'page/myprofile/order_false.html',
            controller: 'OrderfalseController',
		})
		.when('/branch/', {
            templateUrl: 'page/menu/branch.html',
            controller: 'branchController',
		})
        .when('/branches/', {
            templateUrl: 'page/menu/branches.html',
            controller: 'branchesController',
		})
        .when('/test/', {
            templateUrl: 'page/test/index.html',
            controller: 'testController',
		})
        .when('/myprofile/support', {
            templateUrl: 'page/myprofile/support.html',
            controller: 'supportController',
		})
        .when('/myprofile/support_detail/:id', {
            templateUrl: 'page/myprofile/support_detail.html',
            controller: 'supportdetailController',
		}) 
        .when('/myprofile/support_new', {
            templateUrl: 'page/myprofile/support_new.html',
            controller: 'supportnewController',
		})
        
});
