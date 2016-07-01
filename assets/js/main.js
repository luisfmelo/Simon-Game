/**
 * Created by luism on 30/06/2016.
 */
$(document).ready(function(){
  $('.switchBtn').bootstrapSwitch('state', false);
});

var LEVEL_MAX = 3;
var level = 0;
var sequence = "";
var stateMachine = true;
var hardcoreMode = false;
var readyToReceive = false;
var received = 0;
var ended = false;

// Power Button Toogle
$('.switchBtn').on('switchChange.bootstrapSwitch', function(event, state) {
  stateMachine = !stateMachine;
  $('.counter').toggleClass('off');
  if(!stateMachine)
  {
    level = 0;
    sequence = "";
    readyToReceive = false;
    hardcoreMode = false;
    $('.level').html( "--" );
  }
});


//Start Button
$( ".startBtn" ).click( function(){start()} );


//Strict Mode
$( ".strictBtn" ).click(function() {
  if ( !stateMachine )       // if the machine is OFF
     return;
  hardcoreMode = !hardcoreMode;
  $('.led').toggleClass('led_off');
});




function start(){
  console.log("something");
  if ( !stateMachine )       // if the machine is OFF
     return;

  readyToReceive = false;
   level = 0;
   sequence = "";
   //Turn On machine
   newRound();
}

function newRound(){
  if ( level == LEVEL_MAX)
    win();
  if(ended)
    return;
  sequence += (Math.floor(Math.random() * 4) + 1 ).toString();
  level++;
  $('.level').html( twoDigits(level) );
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
  }, 800);
  readyToReceive = true;
}


//User turn
$('.btn').on('click', function(){
  if ( !readyToReceive || !stateMachine )
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
    $('.level').html( "!!" );
    i = 0;
    var interval = setInterval(function() {
      //strict Mode
      if (hardcoreMode)
        start();
      i++;
      if ( i < 5)
        $('.level').toggleClass('hidden');
      else if (i == 5)
        $('.level').html( twoDigits(level) );
      else if (i == 9)
      {
        clearInterval(interval);
        received = 0;
        readyToReceive = false;
        play();
      }
    }, 250);
  }
  else {
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
  }
});



function win(){
  ended = true;
  $('.level').html( "**" );
  i = 0;
  var interval = setInterval(function() {
    i++;
    if ( i < 9)
      $('.level').toggleClass('hidden');
    else if (i == 9)
    {
      clearInterval(interval);
      received = 0;
      readyToReceive = false;
      ended = false;
      start();
    }
  }, 250);
}

function blink(n) {
  var btn = ".btn" + n.toString() ;
  $(btn).addClass('blinking');
  window.setTimeout(function() {
    $(btn).removeClass('blinking');
  }, 400);
}

function twoDigits(n){
    return n > 9 ? "" + n: "0" + n;
}
