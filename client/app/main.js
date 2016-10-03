'use strict'
// Open socket
const socket = io()
// When it connects - log socket object(has id)
socket.on('connect', () => console.log(`Socket connected: ${socket.id}`))
// When it disconnects
socket.on('disconnect', () => console.log('Socket disconnected'))

angular
  .module('mean101', ['ngRoute'])
  .config($routeProvider =>
  	$routeProvider
  		.when('/', {
  			controller: 'MainCtrl',
  			templateUrl: 'partials/main.html',
			})
			.when('/chat', {
  			controller: 'ChatCtrl',
  			templateUrl: 'partials/chat.html',
			})
	)
  .controller('MainCtrl', function ($scope, $http) {
    $http
    	.get('/api/title')
    	.then(({ data: { title }}) => 
    		$scope.title = title)
  })
  .controller('ChatCtrl', function ($scope, $http) {
    $scope.sendMessage = () => {
      const msg = {
        author: $scope.author,
        content: $scope.content,
      }
      // If connected, emit postMessage, with data
      socket.emit('postMessage', msg)

      // $http
      //   .post('/api/messages', msg)
      //   .then(() => $scope.messages.push(msg))
      //   .catch(console.error)
    }
    // Populating initial messages
    $http
      .get('/api/messages')
      .then(({ data: { messages }}) =>
        $scope.messages = messages
      )

    // receive new messages
    socket.on('newMessage', msg => {
      $scope.messages.push(msg)
      // Triggers digest cycle - module outside of ang.js requires apply()
      $scope.$apply()

    })
  })
