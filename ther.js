window.addEventListener("deviceorientation", handleOrientation, true);
function handleOrientation(event) {
  document.querySelector("pre").innerHTML = JSON.stringify(event.beta);
}