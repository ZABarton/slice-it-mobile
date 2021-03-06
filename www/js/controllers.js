
angular.module('starter.controllers', [])

.controller('restaurantsCtrl', function($scope, Merchant, Seating) {
  Merchant.query().$promise.then(function(response){
    console.log(response);
    $scope.merchants = response;
  });
    $scope.id = parseInt(window.localStorage['userID'])
    $scope.first_name = window.localStorage['first_name']
    $scope.hello = function(merchant){return merchant.checked_in.includes($scope.id)}
    $scope.selectMerchant = function(merchant) {
      Seating.save({merchant_id: merchant.id, customer_id: window.localStorage['userID']});
      location.reload()
    }
    $scope.doRefresh = function() {
      $scope.merchants = Merchant.query()
      $scope.$broadcast('scroll.refreshComplete')
    }
})

.controller('paidCtrl', function($scope, $stateParams, Transaction) {

    $scope.transaction = Transaction.get($stateParams)
    console.log($scope.transaction)
    $scope.tip = function(amount, total) {return Math.ceil(parseFloat(amount)/(parseFloat(total))*100-100)}
    $scope.textPrice = function(price, amount, total){return ((price/100) * (amount/total))}
    $scope.parseFloat = parseFloat

    $scope.doRefresh = function() {
    $scope.$broadcast('scroll.refreshComplete')
  }
})

.controller('BillCtrl', function($scope, $location, $stateParams, $ionicPopup, Bill, PayUp, AssignItem, $http) {
  $scope.data = {tip: 18}
  if (Object.keys($stateParams).length != 0 && JSON.stringify($stateParams) != JSON.stringify({})) {
   $scope.bill = Bill.get($stateParams);
   console.log($scope.bill)
  }
  $scope.currentUserID = window.localStorage['userID']
  $scope.first_name = window.localStorage['first_name']
  $scope.bills = Bill.query({user_id: window.localStorage['userID']});
  $scope.transactionData = {}
  $scope.payup = function(billID,amount){
    PayUp.update({user_id: window.localStorage['userID'], bill_id: billID, amount: amount,id:1})
    location.reload();
    $scope.assign = function(orderID, transactionID){alert(orderID,transactionID)}
  };
  $scope.deleteTrans = function(billId, transId){
    PayUp.delete({bill_id: billId, id:transId})
    location.reload();
  }
  $scope.doRefresh = function(billId) {
    $scope.bill = Bill.get($stateParams)
    $scope.$broadcast('scroll.refreshComplete')
  }
  $scope.allRefresh = function(){
    $scope.bills = Bill.query({user_id: window.localStorage['userID']});
    $scope.$broadcast('scroll.refreshComplete')
  }
  $scope.chargePopup = function(billID, amount,transactionID) {
     $scope.data.amount=amount

     // An elaborate, custom popup
     var myPopup = $ionicPopup.show({
       template: '<div>{{((data.amount)*(1+data.tip/100))  | currency}} Tip: {{data.tip}}%</div>',
       title: "Confirm Charge",
       scope: $scope,
       buttons: [
         { text: 'Cancel' },
         {
           text: 'Confirm Charge',
           type: 'button-positive',
           onTap: function(e) {
               PayUp.update({user_id: window.localStorage['userID'], bill_id: billID, amount: parseInt((1+$scope.data.tip/100)*amount*100), id:1}).$promise.then(function(){
                  $location.path('app/paid/'+transactionID);
                });
           }
         },
       ]
     });
    };
})

.controller('ListCtrl', function($scope){
  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;
})

// .controller("guestList", function($scope) {
//   if (window.localStorage["guestArray"]) {
//     var guestArray = JSON.parse(window.localStorage["guestArray"]);
//     $scope.guestArray = guestArray;
//     $scope.deleteGuest = function(guest){
//       var filteredArray = guestArray.filter(function (arrGuest) {
//         return arrGuest.username != guest.username
//       });
//       window.localStorage["guestArray"] = JSON.stringify(filteredArray);
//     };
//   }

// })

.controller('settingsCtrl', function($scope, Customer) {
   $scope.data = {id: window.localStorage['userID']}
   $scope.customer = Customer.get({id: window.localStorage['userID']});
   $scope.update_customer = function(){Customer.update($scope.data)}

 })

  // With the new view caching in Ionic, Controllers are only called
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('loginCtrl', function($scope, $stateParams, UserSession, $location, $ionicPopup, $rootScope) {
  $scope.data = {};

  $scope.login = function(){
    var user_session = new UserSession({customer: $scope.data});
    user_session.$save(
      function(data){
        console.log(data);
        window.localStorage['userID'] = data.id;
        window.localStorage['first_name'] = data.first_name;
        window.localStorage['last_name'] = data.last_name;
        // window.localStorage['userName'] = data.username;
        window.localStorage['userEmail'] = data.email;
        $location.path('/app/restaurants');
      },
      function(err){
        var error = err["data"]["error"] || err.data.join('. ')
        var confirmPopup = $ionicPopup.alert({
          title: 'An error occured',
          template: error
        });
      }
    );
  };
})

.controller('newUserCtrl', function($scope, User, $location, $ionicPopup, $http, $ionicLoading) {

  $scope.stripeCallback = function(status, response){
    if (response.error) {
      console.log("I errored");
      // still need bad card error handling
    } else {
      // Create new user resource instance and pass through a post request token and create user details
      console.log(response);

      this.data.stripe_customer_id = {email: this.data.email, token: response.id}

      var new_user = new User({customer: this.data});
      console.log(this.data)
      $ionicLoading.show();
      new_user.$save( function(data){
        console.log(data);
        window.localStorage['userID'] = data.id;
        window.localStorage['first_name'] = data.first_name;
        window.localStorage['last_name'] = data.last_name;
        // window.localStorage['userName'] = data.username;
        window.localStorage['userEmail'] = data.email;
        $ionicLoading.hide();
        $location.path('/app/restaurants');

      },function(err){
        // fix this ***
        console.log("My error is" + err);
        var error = err["data"]["error"] || err.data.join('. ');
        var confirmPopup = $ionicPopup.alert({
        title: 'An error occured',
        template: error
        });
      }
    );
    }
  };
})

.controller('logOutCtrl', function($scope, $location){
  window.localStorage.clear();
  $location.path('/login');
})

.controller('PopupCtrl',function($scope, $ionicPopup, $filter, AddTransaction, PayUp,AssignItem) {

  $scope.showPopup = function(billID) {
    $scope.data = {}

   // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.email">',
      title: "Enter your friend's email",
      cssClass: "popup-vertical-buttons",
      scope: $scope,
      buttons: [
        {
          text: '<b>Add user</b>',
          type: 'button-full button-positive',
          onTap: function(e) {
            AddTransaction.save({email: $scope.data.email,bill_id: billID})
          }
        },
        { text: 'Cancel',
          type: 'button-full' },
        // { text: 'Add Guest',
        //   type: 'button-full button-balanced',
        //   onTap: function(e) {
        //     $scope.guestData = {}
        //     var newGuestPopup = $ionicPopup.show({
        //       template: '<div class="list"><label class="item item-input item-stacked-label"><span class="input-label">Guest Name</span><input type="text" name="username" placeholder="Guest Name" ng-model="guestData.name"></label><label class="item item-input item-stacked-label"><span class="input-label">Email</span><input type="email" name="email" placeholder="guest@example.com" ng-model="guestData.email"></label></div>',
        //       title: "Create a new Guest User?",
        //       scope: $scope,
        //       buttons: [
        //         { text: 'I do not want',
        //           type: 'button-assertive' },
        //         { text: '<b>Create Guest</b>',
        //           type: 'button-positive',
        //           onTap: function(e) {
        //             var newGuest = new Guest($scope.guestData.name, $scope.guestData.email, billID);
        //             newGuest.findPrimaryId();
        //             var holder = []
        //             if (window.localStorage["guestArray"]) {
        //               holder = JSON.parse(window.localStorage["guestArray"]);
        //               holder.push(newGuest);
        //               window.localStorage["guestArray"] = JSON.stringify(holder)
        //             }
        //             else {
        //               holder.push(newGuest);
        //               window.localStorage["guestArray"] = JSON.stringify(holder)
        //             }
        //             location.reload();
        //           }
        //         }
        //       ]
        //     });
        //   }
        // }
      ]
    });
  };

  $scope.transactionsPopup = function(orderID,item_description,transaction_Array) {
   $scope.data2 = {transactions: transaction_Array}

   // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     template: '<ion-radio ng-repeat="transaction in data2.transactions" ng-model="data2.choice" ng-value="transaction[2]">{{transaction[0]}}</ion-radio>',
     title: "Assign "+item_description,
     scope: $scope,
     buttons: [
       { text: 'Cancel' },
       {
         text: '<b>Assign</b>',
         type: 'button-positive',
         onTap: function(e) {
            AssignItem.update({transaction_id: $scope.data2.choice, id: orderID})
            location.reload();
        }
       },
     ]
   });
  };

  $scope.guestPopup = function(price, amount, total) {
    $scope.data = {}
    var myPopup = $ionicPopup.show({
      template: '<label class="item item-input item-stacked-label">Phone Number<span class="input-label"></span><input type="tel" ng-model="data.phone"></label>',
      title: "Text a Payment Reminder to your Friend",
      scope: $scope,
      buttons: [
        { text: 'Never Mind',
          type: 'button-assertive' },
        { text: '<b>Send Text</b>',
          type: 'button-positive',
          onTap: function(e) {
            var phone = $scope.data.phone
            var textAmount = $scope.textPrice(price, amount, total)
            $.ajax({
              method: 'POST',
              url: 'http://slice-it-app.herokuapp.com/notify.json',
              data: {phone: phone, price: textAmount}
            });
          }
        }
      ]
    });
  };

});
