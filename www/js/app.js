// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngResource', 'angularPayments'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  window.Stripe.setPublishableKey('pk_test_rRW8uzM1cWZDV2iYzpftAPEK');
  $httpProvider.defaults.withCredentials = true;
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
  .state('app.restaurants', {
    url: '/restaurants',
    views: {
      'menuContent': {
        templateUrl: 'templates/restaurants.html',
        controller: 'restaurantsCtrl'
      }
    }
  })
    .state('app.Bills', {
    url: '/bills',
    views: {
      'menuContent': {
        templateUrl: 'templates/bills.html',
        controller: 'BillCtrl'
      }
    }
  })
    .state('app.Bill', {
    url: '/bills/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/bill.html',
        controller: 'BillCtrl'
      }
    }
  })
    .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })
    .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })
  .state('register', {
  url: '/register',
  templateUrl: 'templates/register.html',
  controller: 'newUserCtrl'
})
  .state('app.logout', {
  url: '/logout',
  views: {
    'menuContent': {
    controller: 'logOutCtrl'
    }
  }
})
.state('app.paid', {
  url: '/paid/:id',
    views: {
    'menuContent': {
      templateUrl: 'templates/paid.html',
      controller: 'paidCtrl'
    }
  }
})

  ;
  // if none of the above states are matched, use this as the fallback

});
