// backend/models/trains.js
const fetch = require('node-fetch')
const EventSource = require('eventsource')

async function fetchTrainPositions(io) {
    const query = `<REQUEST>
    <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
    <QUERY sseurl="true" namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0" limit="1" />
</REQUEST>`

    const trainPositions = {};
    try {
        const response = await fetch(
            "https://api.trafikinfo.trafikverket.se/v2/data.json", {
                method: "POST",
                body: query,
                headers: { "Content-Type": "text/xml" }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json()

        if (!result.RESPONSE || !result.RESPONSE.RESULT || result.RESPONSE.RESULT.length === 0 || !result.RESPONSE.RESULT[0].INFO) {
            throw new Error('API response does not contain expected data structure.');
        }

        const sseurl = result.RESPONSE.RESULT[0].INFO.SSEURL;
        const eventSource = new EventSource(sseurl)

        eventSource.onopen = function() {
            console.log("Connection to server opened.")
        }

        io.on('connection', (socket) => {
            console.log('a user connected')

            eventSource.onmessage = function (e) {
                try {
                    const parsedData = JSON.parse(e.data);

                    if (parsedData && parsedData.RESPONSE && parsedData.RESPONSE.RESULT[0].TrainPosition[0]) {
                        const changedPosition = parsedData.RESPONSE.RESULT[0].TrainPosition[0];

                        const matchCoords = /(\d*\.\d+|\d+),?/g

                        const position = changedPosition.Position.WGS84.match(matchCoords).map((t=>parseFloat(t))).reverse()

                        const trainObject = {
                            trainnumber: changedPosition.Train.AdvertisedTrainNumber,
                            position: position,
                            timestamp: changedPosition.TimeStamp,
                            bearing: changedPosition.Bearing,
                            status: !changedPosition.Deleted,
                            speed: changedPosition.Speed,
                        };

                        if (trainPositions.hasOwnProperty(changedPosition.Train.AdvertisedTrainNumber)) {
                            socket.emit("message", trainObject);
                        }

                        trainPositions[changedPosition.Train.AdvertisedTrainNumber] = trainObject;
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            };
        });

        eventSource.onerror = function(e) {
            console.error("EventSource failed.", e);
        };
    } catch (error) {
        console.error('Failed to fetch train positions:', error);
    }
}

module.exports = fetchTrainPositions;
