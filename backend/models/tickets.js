// backend/models/tickets.js
const database = require('../database.js');

const tickets = {
    getTickets: async function getTickets(req, res){
        const { collection, client } = await database.openDb('tickets');

        try {
            const allTickets = await collection.find({}).toArray();

            res.json({
                data: allTickets
            });
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
            res.status(500).send(error);
        } finally {
            await client.close();
        }
    },

    createTicket: async function createTicket(req, res){
        const { collection, client } = await database.openDb('tickets');

        try {
            const result = await collection.insertOne({
                code: req.body.code,
                trainNumber: req.body.trainNumber,
                trainDate: req.body.trainDate
            });

            res.json({
                data: {
                    id: result.insertedId,
                    code: req.body.code,
                    trainNumber: req.body.trainNumber,
                    trainDate: req.body.trainDate
                }
            });
        } catch (error) {
            console.error('Failed to create ticket:', error);
            res.status(500).send(error);
        } finally {
            await client.close();
        }
    }
};

module.exports = tickets;
