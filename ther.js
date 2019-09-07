import { colortools } from "./colortools.js";
const A_REFERENCE = 440;
function waveToColor(frequency,intensity) {
  let pitch = 49+Math.log(frequency/A_REFERENCE)/Math.log(Math.pow(2,1/12));
  //pitch is given relatively to A440 reference, ie. 49th note on keyboard  
  pitch = [Math.abs(pitch % 12),Math.floor(pitch/12)];
  let out_color = colortools.HSVtoRGB(pitch[0]/12,intensity,pitch[1]/4);
  document.querySelector("body").setAttribute(
    "style","background-color: "+colortools.toCSS(out_color)+";");
  /*Tone -> H
  * Gain -> S
  * Height (% 8a) -> V
  * -----
  * HSV -> RGB
  * P = ln(F/Ref)/ln(2^(1/12))
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
  return A_REFERENCE*Math.exp(0.0243*gamma);
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
wa.audioSourceNode.frequency.setValueAtTime(
  A_REFERENCE, wa.audioCtx.currentTime);
gainNode.gain.setValueAtTime(0.5, wa.audioCtx.currentTime);
wa.audioSourceNode.start();
wa.audioSourceNode.connect(gainNode);
gainNode.connect(wa.audioCtx.destination);
window.addEventListener("deviceorientation", handleOrientation, true);