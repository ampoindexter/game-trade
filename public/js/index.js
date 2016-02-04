'use strict'; 

$(document).ready(init); 

function init() {
  $('.showGame').click(showGame);
  $('#offerTrade').click(offerTrade);
  $('#makeTrade').click(makeTrade);
  $('#accept').click(acceptTrade);
  $('#decline').click(declineTrade);
  $('#toggle').click(toggle);
}

function showGame(){
  console.log('this data is: ', $(this).data().gameid.replace(/\"/g,""));
  location.href = '/games/showpage/' + $(this).data().gameid.replace(/\"/g,"") + '/' + $(this).data().userid.replace(/\"/g,"");  
}

function offerTrade(){
  console.log("This data", $(this).data());
  console.log('this data is: ', $(this).data().gameid.replace(/\"/g,""));
  var desiredgame = '/'+ $(this).data().gameid.replace(/\"/g,"");
  var owner = '/'+ $(this).data().ownerid.replace(/\"/g,"");

  location.href = '/games/offerTrade' + desiredgame + owner
}

function makeTrade(){
  console.log("THIS DATA:", $(this).data());
  var owner = '/' + $(this).data().owner.replace(/\"/g,"");
  var desiredgame = '/' + $(this).data().desiredgame.replace(/\"/g,"");
  var user = '/' + $(this).data().userid.replace(/\"/g,"");
  var game = '/' + $(this).data().gameid.replace(/\"/g,"");
  var api = '/trades' + owner + desiredgame + user + game; 
  $.post(api)
  .success(function() {
    swal('Trade initiated. Waiting for response.')
    location.href = '/trades';
  })
  .fail(function(err) {
    swal('Error.  Check console.');
    console.log('err:', err);
  });
}

function acceptTrade(){
  var tradeId = '/' + $(this).data().trade.replace(/\"/g,""); 
  
  $.ajax({
    url: '/trades' + tradeId, 
    method: "PUT"
  })
  .success(function(data) {
    swal('Success! Trade accepted!')
    location.replace('/trades/mine');
  })
  .fail(function(err) {
    console.error("Error:", err);
  });
}

function declineTrade(){
  var tradeId = '/' + $(this).data().trade.replace(/\"/g,""); 
  
  $.ajax({
    url: '/trades/decline' + tradeId, 
    method: "PUT"
  })
  .success(function(data) {
    swal('Trade declined')
    location.replace('/trades/mine');
  })
  .fail(function(err) {
    swal('Error. Check console.')
    console.error("Error:", err);
  });
}


function toggle(){
  var gameid = '/' + $(this).data().gameid.replace(/\"/g,""); 
  
  $.ajax({
    url: '/games/toggle' + gameid, 
    method: "PUT"
  })
  .success(function(data) {
    location.replace('/games/mine');
  })
  .fail(function(err) {
    console.error("Error:", err);
  });
}