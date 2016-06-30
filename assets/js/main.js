/**
 * Created by luism on 30/06/2016.
 */
$(document).ready(function(){
  $('.switchBtn').bootstrapSwitch('state', false);
});

var level = 0;
var sequence = "";
var stateMachine = true;
var hardcoreMode = false;
var readyToReceive = false;
var received = 0;
var time;

// Power Button Toogle
$('.switchBtn').on('switchChange.bootstrapSwitch', function(event, state) {
  stateMachine = !stateMachine;
  $('.counter').toggleClass('off');
  if(!stateMachine)
  {
    level = 0;
    sequence = "";
    hardcoreMode = false;
    $('.level').html( "--" );
  }
});


//Start Button
$( ".startBtn" ).click( function(){start()} );





function start(){
  console.log("something");
  if ( !stateMachine )       // if the machine is OFF
     return;

   level = 0;
   sequence = "";
   //Turn On machine
   newRound();
}

function newRound(){
  if ( level == 4)
    win();
  sequence += (Math.floor(Math.random() * 4) + 1 ).toString();
  level++;
  $('.level').html( twoDigits(level) )
  play();
}

function play(){
  var i = 0;
  //do this every 500ms
  var interval = setInterval(function() {
    blink(sequence[i]);
    i++;
    if (i >= level)
      clearInterval(interval);
  }, 500);
  readyToReceive = true;
}


//User turn
$('.btn').on('click', function(){
  if ( ! readyToReceive || !stateMachine )
    return;

  var n;

  if ( $(this).hasClass('green') )
    n = 1;
  if ( $(this).hasClass('red') )
    n = 2;
  if ( $(this).hasClass('yellow') )
    n = 3;
  if ( $(this).hasClass('blue') )
    n = 4;

  blink(n);

  //user failed -> play again same sequence
  if ( n.toString() !== sequence[received] )
  {
    received = 0;
    readyToReceive = false;
    //strictBt
    //TODO
    play();
  }
  received ++;

  if ( received == level )
  {
      setInterval(function() {
        if (received > level)
          clearInterval(interval);
      }, 1000);

      received = 0;
      readyToReceive = false;
      newRound();

  }
});



function win(){
  level = 0;
  alert("win");
}

function blink(n) {
  var btn = ".btn" + n.toString() ;
  $(btn).addClass('blinking');
  window.setTimeout(function() {
    $(btn).removeClass('blinking');
  }, 500);
}

function twoDigits(n){
    return n > 9 ? "" + n: "0" + n;
}
