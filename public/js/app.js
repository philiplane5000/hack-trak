(() => {
  // FORK getUserMedia for multiple browser versions, for those that need prefixes
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  const hackTrak = () => {
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
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
      // console.log(`%c${avg}`, hackRange);
      if (flag === false) {
        hacks++;
        hackTally.innerHTML = hacks;
        flag = true;
      }
    } else if (avg < 50) {
      // console.log(avg.toString());
      if (flag === true) {
        flag = false;
      }
    }
  };

  const getStream = async (constraints) => {
    let stream;
    if (navigator.getUserMedia) {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      return stream;
    } else {
      console.log("navigator.getUserMedia :>> ", false);
    }
  };

  const soundGuy = async (audioContext) => {
    // CAPTURE the user's microphone to use as 'stream' for AudioContext
    try {
      let stream = await getStream({ video: false, audio: true });
      console.log('stream :>> ', stream);
      source = audioContext.createMediaStreamSource(stream);
      console.log('source :>> ', source);

      // CREATE analyser node
      analyserNode = audioContext.createAnalyser();
      // analyserNode.minDecibels = -90;
      // analyserNode.maxDecibels = -10;
      analyserNode.smoothingTimeConstant = 0.85;
      analyserNode.fftSize = 256;

      // CONNECT the different audio nodes we will use for the app
      source.connect(analyserNode);
    } catch (err) {
      console.log("err :>> ", err);
    }
  };

  const record = () => {
    recordBtn.classList.add("recording");
    hackTally.innerHTML = 0;
    interval = setInterval(hackTrak, 20);
  };

  const reset = () => {
    clearInterval(interval);
    recordBtn.classList.remove("recording");
    hackTally.innerHTML = "-";
    hacks = 0;
  };

  // HTML Nodes
  const hackTally = document.getElementById("hack-tally");
  const resetBtn = document.getElementById("reset-btn");
  const recordBtn = document.getElementById("record-btn");

  let flag = false,
    hacks = 0,
    interval,
    source,
    analyserNode;

  // CREATE the audio context
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  soundGuy(audioCtx);

  recordBtn.addEventListener("click", record);
  resetBtn.addEventListener("click", reset);
})();
