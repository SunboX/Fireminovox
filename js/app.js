window.addEventListener('DOMContentLoaded', function() {

    'use strict';

    var start = document.getElementById('start');
    var stop = document.getElementById('stop');

    var audioContext = new(window.AudioContext || window.webkitAudioContext)(); // define audio context
    // Webkit/blink browsers need prefix, Safari won't work without window.

    var oscillator;
    
    // Check whether the DeviceMotionEvent is supported
    if (window.DeviceMotionEvent) {

        // Add a listener for the devicemotion event
        window.ondevicemotion = function (deviceMotionEvent) {

           if(oscillator == null) return;

            // Get acceleration on x, y and z axis
            var x = deviceMotionEvent.accelerationIncludingGravity.x;
            var y = deviceMotionEvent.accelerationIncludingGravity.y;
            var z = deviceMotionEvent.accelerationIncludingGravity.z;

            var value = -(x + y + z) * 10 + 400;
            if(value < 100) value = 100;
            if(value > 1000) value = 1000;
            
            oscillator.frequency.value = value;
        };
    }
    
    start.addEventListener('touchstart', function(){
        oscillator = audioContext.createOscillator();
        oscillator.type = 'triangle';
        oscillator.frequency.value = 100;
        oscillator.connect(audioContext.destination);
        oscillator.start(0);
        start.hidden = true;
        stop.hidden = false;
    }, false);

    stop.addEventListener('touchstart', function(){
        oscillator.stop(0);
        oscillator = null;
        start.hidden = false;
        stop.hidden = true;
    }, false);

});
