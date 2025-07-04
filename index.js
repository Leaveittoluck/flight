

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

    document.getElementById('holiday-form').addEventListener('submit', async function(e){
    const budget = document.getElementById('budget').value;
    const type = document.getElementById('type').value;
    
      try {
            const response = await fetch('http://localhost:5000/api/destination' , {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              budget: budget,
              type: type
            })
          });

          const data = await response.json();

          if(response.ok) {
            sessionStorage.setItem('selectedDestination', data.destination);
            sessionStorage.setItem('ticketPrice', data.ticket);
            sessionStorage.setItem('dataSource', data.source);
            window.location.href = 'results.html';
          }
          else {
            sessionStorage.setItem('errorMessage', data.error || 'Unknown error occured!');
            window.location.href = 'results.html';
          }
        }
      catch(err) {
        console.error(`Failed to load destination data`, err);
        alert(`Error loading destination data!`);
      }
      
    });

  function toggleInfo() {
    const infoBox = document.getElementById('infoBox');
    infoBox.classList.toggle('visible');
  }