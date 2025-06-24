document.addEventListener('DOMContentLoaded', function () {
  const destination = sessionStorage.getItem('selectedDestination');

  if (destination) {
    // Change this selector to target the right <p>
    const destinationEl = document.querySelector('.destination p');
    if (destinationEl) {
      destinationEl.textContent = `${destination}`;
    } else {
      console.warn("Destination element not found.");
    }
  } else {
    console.warn("No destination found in sessionStorage.");
  }
});