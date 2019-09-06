function waveToColor(frequency,intensity) {
  /*Tone -> H
  * Gain -> S
  * Height (% 8a) -> V
  * -----
  * HSV -> RGB
  */
}
function WebAudio() {
  this.type = "osc";
  this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  this.stream = {};
  this.audioSourceNode = {};
  this.analyserNode = {};
}
function gammaToFreq(gamma) {
  return 440*Math.exp(0.0243*gamma);
}
function betaToIntensity(beta) {
  beta = (0.0052*beta + 0.5);
  beta = (beta < 0.1) ? 0.1:beta;
  beta = (beta > 0.95) ? 0.95:beta;
  return beta;
}
function handleOrientation(event) {
  let f = gammaToFreq(event.gamma);
  let i = betaToIntensity(event.beta);
  wa.audioSourceNode.frequency.setValueAtTime(f, wa.audioCtx.currentTime);
  gainNode.gain.setValueAtTime(i, wa.audioCtx.currentTime);
  waveToColor(f,i);
}
let wa = new WebAudio();
let gainNode = wa.audioCtx.createGain();
wa.audioSourceNode = wa.audioCtx.createOscillator();
wa.audioSourceNode.type = "sine";
wa.audioSourceNode.frequency.setValueAtTime(440, wa.audioCtx.currentTime);
gainNode.gain.setValueAtTime(0.5, wa.audioCtx.currentTime);
wa.audioSourceNode.start();
wa.audioSourceNode.connect(gainNode);
gainNode.connect(wa.audioCtx.destination);
window.addEventListener("deviceorientation", handleOrientation, true);