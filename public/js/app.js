const hackTally = document.querySelector("#hack-tally");
const resetBtn = document.querySelector("#reset-btn");
const recordBtn = document.querySelector("#record-btn");

window.onload = function () {
  // FORK getUserMedia for multiple browser versions, for those that need prefixes
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  if (navigator.getUserMedia) {
    // CREATE the audio context
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const constraints = { video: false, audio: true };

    // CAPTURE the user's microphone to use as 'stream' for AudioContext
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      let flag = false, hacks = 0;

      const hackTrak = function () {
        analyserNode.getByteFrequencyData(dataArray);

        // STYLIZED logger for a 'Hack' worthy frequency :P
        const hackRange = [
          "color: #fff",
          "background-color: green",
          "padding: 2px 4px",
          "border-radius: 2px",
        ].join(";");        

        let total = 0;
        for (let i = 0; i < bufferLength; i++) {
          total += dataArray[i];
        }
        let avg = total / bufferLength;

        if (avg > 65) {
          console.log(`%c${avg}`, hackRange);
          if (flag === false) {
            hacks++;
            hackTally.innerHTML = hacks;
            flag = true;
          }
        } else if (avg < 50) {
          console.log(avg.toString());
          if (flag === true) {
            flag = false;
          }
        }
      };

      const source = audioCtx.createMediaStreamSource(stream);
      // CREATE effect nodes, such as reverb, biquad filter, panner, or compressor

      // BIQUAD FILTER Setup
      // const biquadFilter = audioCtx.createBiquadFilter();
      // biquadFilter.type = "peaking";
      // biquadFilter.frequency.value = 1000;
      // biquadFilter.gain.value = 40;
      // connect the AudioBufferSourceNode to the gainNode

      // (^) Potential to leverage biquadFilter for improved
      // settings/config for user surface specs eg. cement/grass

      //Create analyser node
      const analyserNode = audioCtx.createAnalyser();
      // analyserNode.minDecibels = -90;
      // analyserNode.maxDecibels = -10;
      analyserNode.smoothingTimeConstant = 0.85;
      analyserNode.fftSize = 256;
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // CONNECT the different audio nodes we will use for the app
      // source.connect(biquadFilter);
      source.connect(analyserNode);

      let trak = setInterval(hackTrak, 20);
      // CLEAR 'Hack-Trak' sesh after 10 secs and log num of 'hacks'
      setTimeout(function () {
        clearInterval(trak);
        console.log('hacks :>> ', hacks);
        hackTally.innerHTML = hacks;
      }, 1000 * 10);
    });
  } else {
    console.log("navigator.getUserMedia :>> ", false);
  }
};
