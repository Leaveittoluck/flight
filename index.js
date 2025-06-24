

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
    console.log(chosenDestinations);
    if (!Array.isArray(chosenDestinations)) {
      alert('Something went wrong selecting your destination. Please check the holiday type.');
      return;
    }

    const randomDestination = chosenDestinations[Math.floor(Math.random() * chosenDestinations.length)];

    const destinationElement = document.getElementById('destination');