const express = require('express');
const app = express();
const cors = require('cors');
const redis = require('redis');
const port = 5000;
const redis_port = 6379;
const path = require('path');

const fs = require('fs');

const client = redis.createClient( {
    socket: {
        port: redis_port,
        host: 'localhost'
    }
});

client.on('error', err => console.error('Redis error', err));

(async () => {
    await client.connect();
})();


app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/destination', async (req,res) => {
    const {budget, type} = req.body;

    const cacheKey = `${type}:${budget}`;

    try {
        const cachedData = await client.get(cacheKey);

        if(cachedData) {
            return res.json({source: 'cache', ...JSON.parse(cachedData)});
        }

        const data = JSON.parse(fs.readFileSync('allFlights.json', 'utf-8'));
        const destinations = data[type];

        if(!Array.isArray(destinations) || destinations.length === 0) {
            return res.status(404).json({error: 'No destinations found for this type'});
        }

        const filtered = destinations.filter(d => d.ticket <= parseInt(budget));

        if(filtered.length === 0) {
            return res.status(404).json({error: 'No destinations found within your budget'});
        }

        const randomDestination = filtered[Math.floor(Math.random() * destinations.length)];
        const responseData = {
            destination: randomDestination.name,
            ticket: randomDestination.ticket
        }

        await client.set(cacheKey, JSON.stringify(responseData), {EX: 3600});
        return res.json({source: 'json', ...responseData});

    }
    catch(error) {
        console.error('API error:', error);
        return res.status(500).json('Internal server error');
    }
});

//Port listener
app.listen(port, () => {
    console.log(`LITL is running at port http://localhost:${port}`);
})