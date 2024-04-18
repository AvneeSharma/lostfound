

const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017/Backend_Lost&Found';

const connectdb = async () => {
    try {
        // Create a new MongoClient
        const client = new MongoClient(uri);

        // Connect the client to the server
        await client.connect();
        console.log('Connected to MongoDB');

        // Return the connected client
        return client;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Rethrow the error to handle it in the caller
    }
};

module.exports = connectdb;
