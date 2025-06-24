const express = require('express');
const app = express();
const cors = require('cors');
const redis = require('redis');
const port = 5000;
const redis_port = 6379;
const path = require('path');

const client = redis.createClient( {
    socket: {
        port: redis_port,
        host: 'localhost'
    }
});

client.on('error', err => console.error('Redis error', err));

(async () => {
    await client.connet();
})();

app.use(cors);
app.use(express.static(__dirname));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//Port listener
app.listen(port, () => {
    console.log(`LITL is running at port http://localhost:${port}`);
})