const http = require('http');
const app = require('./app');
const { fetchTrainPositions } = require('./models/trains');

const httpServer = http.createServer(app);

// eslint-disable-next-line
const io = require('socket.io')(httpServer, {
    cors: {
        origin: ['http://localhost:3000', 'http://www.student.bth.se/~kalo22/train-controller/'],
        methods: ['GET', 'POST']
    }
});

const port = process.env.PORT || 1337;

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

fetchTrainPositions(io);
