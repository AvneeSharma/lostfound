
const express=require('express');
const app = express();
const router=require('router'); 
const connectdb=require('./utils/app');
const cors = require('cors');
const bodyParser = require('body-parser');

const multer = require('multer');
const path = require('path');

app.use(cors());
// Middleware
app.use(bodyParser.json());

app.use(express.json());

const PORT = 3000;

//API FOR SIGN UP
app.post('/api/signup', async (req,res)=>{

    try {
       // const { userDetails } = req.body;
       const userDetails = req.body;

      userDetails.email;
      userDetails.password 

   console.log(userDetails);
        if (userDetails.email && userDetails.password && userDetails.name && userDetails.contact) {

            // Assuming connectdb returns a MongoDB client
            const client = await connectdb();
            const db = client.db('project'); // Specify your database name
            const usersCollection = db.collection('LostFound'); // Specify your collection name


            await usersCollection.insertOne(userDetails);
            

            //res.status(201).send('User registered successfully');
            res.status(201).json({ message: 'User registered successfully' });

            console.log('User registered successfully');
        } else {
            res.status(400).json({ error: 'Missing required fields' });
        }
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Error adding user' });
    }
});

connectdb()
    .then((client) => {
        app.listen(PORT, () => {
            const db = client.db('project'); // Specify your database name
            const usersCollection = db.collection('LostFound'); // Specify your collection name
            //console.log(Server is running on port ${PORT});
            console.log(usersCollection);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1); // Exit the process with an error code
    });

   
//API FOR LOST PAGE
app.post('/api/lostpage', async (req, res) => {
    try {
        // Destructure the fields directly from req.body
        const { name_of_item_lost, select_place, description,  place, show_contact  } = req.body;
        
       
        // Check if all required fields are present
        if (name_of_item_lost && select_place && description ) {
            // Assuming connectdb returns a MongoDB client
            const client = await connectdb();
            const db = client.db('project'); // Specify your database name
            const usersCollection = db.collection('LostPageForm'); // Specify your collection name

            

            // Create an object with the required fields
            const lostDetails = {
                name_of_item_lost: name_of_item_lost,
                select_place: select_place,
                description: description,
                place: place,
                show_contact: show_contact
               
            };
            const lostDetails2= {
                name_of_item_lost: name_of_item_lost,
                select_place: select_place,
                description: description,
                show_contact: show_contact
               
            };

           // console.log(lostDetails);
            if(place=='undefined'){
                await usersCollection.insertOne(lostDetails2);
            }else{
            // Insert the details into the database
           await usersCollection.insertOne(lostDetails);

        }

            // Respond with success message
            res.status(201).json({ message: 'Lost data input successfully!' });
            console.log('Lost data input successfully!');
        } else {
            // If any required field is missing, respond with an error
            res.status(400).json({ error: 'Missing required fields' });
        }
    } catch (error) {
        // If an error occurs, respond with a server error
        console.error('Error Lost data input failed.', error);
        res.status(500).json({ error: 'Error Lost data input failed. ' });
    }
});


app.post('/api/signin', async (req, res) => {
    try {
        const { email, password} = req.body;
        console.log(email);
        console.log(password);

        if (email && password) {
            // Assuming connectdb returns a MongoDB client
            const client = await connectdb();
            const db = client.db('project'); // Specify your database name
            const usersCollection = db.collection('LostFound'); // Specify your collection name

            // Query the database to find a user with the provided email and password
            const user = await usersCollection.findOne({ email, password });

            if (user) {
                // If a user with matching credentials is found, respond with success
                res.status(200).json({ message: 'User signed in successfully' });
                console.log('User signed in successfully');
            } else {
                // If no user is found or the password doesn't match, respond with an error
                console.error('Invalid email or password');
                res.status(401).json({ error: 'Invalid email or password' });
            }
        } else {
            // If email or password is missing, respond with a bad request error
            res.status(400).json({ error: 'Missing required fields' });
        }
    } catch (error) {
        // If an error occurs during the process, respond with a server error
        console.error('Error signing in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET API endpoint
app.get('/api/lost-items-card', async (req, res) => {
    try {
        // Assuming connectdb returns a MongoDB client
        const client = await connectdb();
        const db = client.db('project'); // Specify your database name
        const usersCollection = db.collection('LostPageForm'); // Specify your collection name

        // Retrieve items from MongoDB
       // const lostItems = await LostFound.find({}, 'name_of_item_lost select_place description contact place');
 // Query MongoDB for lost items
 const lostItems = await  usersCollection.find({}, { projection: { _id: 0 } }).toArray();


        // Send response to client
        res.json(lostItems);
    } catch (error) {
        // Handle error
        res.status(500).json({ message: error.message });

    }
});

app.get('/api/lost-items-card-signup', async (req, res) => {
    try {
        // Assuming connectdb returns a MongoDB client
        const client = await connectdb();
        const db = client.db('project'); // Specify your database name
        const usersCollection = db.collection('LostFound'); // Specify your collection name
        // Retrieve items from MongoDB
       // const lostItems = await LostFound.find({}, 'name_of_item_lost select_place description contact place');
 // Query MongoDB for lost items
 const lostItems = await  usersCollection.find({}, { projection: { _id: 0 } }).toArray();

        // Send response to client
        res.json(lostItems);
    } catch (error) {
        // Handle error
        res.status(500).json({ message: error.message });
    }
});


