document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('holiday-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const people = document.getElementById('people').value.trim();
    const budget = document.getElementById('budget').value.trim();
    const nights = document.getElementById('nights').value;
    const season = document.getElementById('season').value;
    const type = document.getElementById('type').value;
    const email = document.getElementById('email').value.trim();

    if (!people || !budget || !nights || !season || !type || !email) {
      alert('Please fill in all the fields including your email!');
      return;
    }

    const destinations = {
      'Adventure & Nature': ['Mallorca', 'Tenerife', 'Faro', 'Lanzarote', 'Dalaman', 'Antalya', 'Madeira (Funchal)', 'Rhodes', 'Menorca',
      'Kos', 'Kefalonia', 'Heraklion', 'Kerry County', 'Almeria', 'Catania', 'Thira (Santorini)', 'Aarhus',
      'Chania', 'Bergen', 'Ponta Delgada (Azores)', 'Pula', 'Zadar', 'Poprad', 'Innsbruck', 'Reykjavik', 'Salzburg',
      'Ouarzazate', 'Essaouira', 'Trapani', 'Kalamata', 'Kayseri', 'Biarritz', 'Zakynthos', 'Preveza', 'Sardinia' , 'Olbia', 'Alghero', 'Cagliari'],


      'Relax & Recharge': ['Mallorca', 'Alicante', 'Malaga', 'Tenerife', 'Ibiza', 'Lanzarote', 'Antalya', 'Faro', 'Malta', 'Menorca',
      'Nice', 'Paphos', 'Kos', 'Lourdes', 'Larnaca', 'Almeria', 'Santander', 'Catania', 'Thira', 'Chania',
      'Olbia', 'Zadar', 'Tangier', 'Skiathos', 'Zakynthos', 'Preveza', 'Split', 'Sharm el Sheikh',
      'Agadir', 'Essaouira', 'Funchal', 'Bodrum', 'Pula', 'Rimini', 'Trapani', 'Reggio Calabria',
      'Palermo', 'Calabria (Lamezia-Terme)', 'Sardinia', 'Madeira'],

      'City & Culture': ['Dublin', 'Istanbul', 'Edinburgh', 'Belfast', 'Rome', 'Barcelona', 'Budapest', 'Milan', 'Bucharest', 'Lisbon',
      'Copenhagen', 'Pisa', 'Berlin', 'Eindhoven', 'Cork', 'Madrid', 'Porto', 'Vienna', 'Tirana', 'Cologne', 'Venice',
      'Prague', 'Krakow', 'Sofia', 'Malta', 'Marrakesh', 'Marseille', 'Girona', 'Wroclaw', 'Hamburg', 'Naples', 'Riga',
      'Amsterdam', 'Turin', 'Bremen', 'Oslo', 'Toulouse', 'Zagreb', 'Athens', 'Dubrovnik', 'Luxembourg', 'Santiago De Compostela',
      'Chisinau', 'Nice', 'Sevilla', 'Verona', 'Florence', 'Helsinki', 'Bratislava', 'Reykjavik', 'Vilnius', 'Brno',
      'Rotterdam', 'Rabat', 'Cluj-Napoca', 'Salzburg', 'Tallinn', 'Zaragoza', 'Geneva', 'Sarajevo', 'Plovdiv',
      'Split', 'Fes', 'Zurich', 'Munich', 'Amman', 'Rimini', 'Florence', 'Casablanca'],

    };

    const chosenDestinations = destinations[type];

    if (!Array.isArray(chosenDestinations)) {
      alert('Something went wrong selecting your destination. Please check the holiday type.');
      return;
    }

    const randomDestination = chosenDestinations[Math.floor(Math.random() * chosenDestinations.length)];

    const formData = {
      user_email: email,
      people,
      budget,
      nights,
      season,
      type,
      destination: randomDestination,
    };

    sendFormEmail(formData)
      .then((response) => {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('result-box');
        resultDiv.innerHTML = `       
          <p>📧 We've sent the details over to our team</p>
        `;
        document.querySelector('.main-content').appendChild(resultDiv);
      })
      .catch((error) => {
        console.error('EmailJS error:', error.text, error);
        alert('Oops! Something went wrong sending your email. Please try again.');
      });
  });

  window.toggleInfo = () => {
  const icon = document.querySelector('.info-icon');
  const box = document.getElementById('infoBox');
  icon.classList.toggle('active');
  box.style.display = box.style.display === 'block' ? 'none' : 'block';
};
});

function sendFormEmail(formData) {
  return emailjs
    .send('service_1sjgyhs', 'template_qsp2r9s', {
      people: formData.people,
      budget: formData.budget,
      nights: formData.nights,
      season: formData.season,
      type: formData.type,
      email: formData.user_email,
      destination: formData.destination,
    })
    .then((response) => {
      console.log('Email sent successfully:', response.status, response.text);
      return response;
    })
    .catch((error) => {
      console.error('Failed to send email:', error.text, error);
      throw error;
    });
}

const nights = document.getElementById('nights').value.trim();
const season = document.getElementById('season').value.trim();
const type = document.getElementById('type').value.trim();