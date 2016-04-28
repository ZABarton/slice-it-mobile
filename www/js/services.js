angular.module('starter.services', [])

.factory('Merchant', function($resource){
  return $resource("http://localhost:3000/merchants/:id.json")
})

.factory('Seating', function($resource){
  return $resource("http://localhost:3000/merchants/:merchant_id/seatings/:id.json", {id: "@id", merchant_id: "@merchant_id"})
})

.factory('Bill', function($resource){
  return $resource("http://localhost:3000/bills/:id.json")
})

.factory('Customer', function($resource){
  return $resource("http://localhost:3000/customers/:id.json",{id: "@id"},{ update: {method: 'PUT'}})
})

.factory('UserSession', function($resource){
  return $resource("http://localhost:3000/customers/sign_in.json");
})

.factory('User', function($resource){
  return $resource("http://localhost:3000/customers.json");
})
.factory('Charge', function($resource){
  return $resource("http://localhost:3000/charges.json");
})

.factory('AddTransaction', function($resource){
  return $resource("http://localhost:3000/bills/:bill_id/transactions",{id: "@id", username: "@username", bill_id: "@bill_id"})
})

.factory('Transaction', function($resource){
  return $resource("http://localhost:3000/bills/:bill_id/transactions/:id.json",{id: "@id", bill_id: 1})
})

.factory('PayUp', function($resource){
  return $resource("http://localhost:3000/bills/:bill_id/transactions/:id",{id: "@id", username: "@username", bill_id: "@bill_id", amount: "@amount"},{ update: {method: 'PUT'}})
})

.factory('AssignItem', function($resource){
  return $resource("http://localhost:3000/orders/:id",{id: "@id", transaction_id: "@transaction_id", user_id: "@user_id"},{ update: {method: 'PUT'}})
})

.service('BlankService', [function(){

}]);
