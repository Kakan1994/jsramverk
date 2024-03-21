// backend/models/tickets.js
const database = require('../database');

const collectionName = 'tickets';

const tickets = {
    // eslint-disable-next-line
    getTickets: async (req, res, next) => {
        try {
            const db = await database.openDb(collectionName);
            const allTickets = await db.collection.find({}).toArray();

            await db.client.close();

            return res.json({
                data: allTickets
            });
        } catch (error) {
            next(error);
        }
    },

    // eslint-disable-next-line
    createTicket: async (req, res, next) => {
        try {
            const db = await database.openDb(collectionName);

            const result = await db.collection.insertOne({
                code: req.body.code,
                trainNumber: req.body.trainNumber,
                trainDate: req.body.trainDate
            });

            await db.client.close();

            return res.json({
                data: {
                    _id: result.insertedId,
                    code: req.body.code,
                    trainNumber: req.body.trainNumber,
                    trainDate: req.body.trainDate
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = tickets;
