window.addEventListener('DOMContentLoaded', () => {
  const destination = sessionStorage.getItem('selectedDestination');
  const ticket = sessionStorage.getItem('ticketPrice');
  const dataSource = sessionStorage.getItem('dataSource');
  const errorMessage = sessionStorage.getItem('errorMessage');

  const container = document.querySelector('.destination');

  if(errorMessage){
    let countdown = 5;
    let currentCount = countdown;
    
    container.innerHTML = `<h2>${errorMessage}</h2>
    <div class="countdown-circle">
      <svg>
          <circle r="40" cx="50" cy="50"></circle>
          <circle id="progress" r="40" cx="50" cy="50"></circle>
      </svg>

      <div class="countdown-number" id="countdown-number">${countdown}</div>
    </div>
    <p>Returning to the form shortly...</p>`;

    const countdownNumber = document.getElementById('countdown-number');
    const progressCircle = document.getElementById('progress');
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = `0`;

    const interval = setInterval(() => {
    currentCount--;
    countdownNumber.textContent = currentCount;

    const offset = ((countdown - currentCount) / countdown) * circumference;
    progressCircle.style.strokeDashoffset = `${offset}`;

    if (currentCount <= 0) {
        clearInterval(interval);
        sessionStorage.removeItem('errorMessage');
        window.location.href = 'index.html';
      }
    }, 1000);
  }
  else {
    document.querySelector('.destination').innerHTML = `
    <p>${destination}</p>
    `;

    document.querySelector('.flights').innerHTML = `
      <h2>Ticket price: £${ticket}</h2>
      <h3 style="color: ${dataSource === 'cache' ? 'green' : 'blue'}">
        Loaded from: <strong>${dataSource.toUpperCase()} (Data is now cached for later use across the server)</strong>
      </h3>
    `;
  }

  
});