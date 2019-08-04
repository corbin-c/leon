window.addEventListener("deviceorientation", handleOrientation, true);
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
  document.querySelector("pre").innerHTML =
  JSON.stringify(
    { Intensity:betaToIntensity(event.beta),
      Frequency:Math.round(gammaToFreq(event.gamma))
    });

}