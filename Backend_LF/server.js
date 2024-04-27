
const express=require('express');
const app = express();
const router=require('router'); 
const connectdb=require('./utils/app');
const cors = require('cors');
const bodyParser = require('body-parser');

const path = require('path');
const session = require('express-session');
const multer = require('multer');



app.use(cors());
// Middleware
app.use(bodyParser.json({ limit: '10mb' }));

app.use(express.json());

const PORT = 3000;

// Add session middleware to your Express app
app.use(session({
    secret: 'your_secret_key_here', // Secret used to sign the session ID cookie
    resave: false,
    saveUninitialized: true
  }));

  // Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the directory where uploaded files should be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
    }
});

const upload = multer({ storage: storage });

const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'founditems/'); // Specify the directory where uploaded files should be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
    }
});

const Upload = multer({ storage: Storage });



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

             // Check if the user already exists based on email or contact
             const existingUser = await usersCollection.findOne({
                $or: [
                    { email: userDetails.email },
                    { contact: userDetails.contact },
                    { name: userDetails.name}
                ]
            });
            if (existingUser) {
                // User already exists
                
                return res.status(400).json({ exists: true, field: Object.keys(existingUser)[0] });
            }else {

            await usersCollection.insertOne(userDetails);
            
            res.status(201).json({ message: 'User registered successfully' });

            console.log('User registered successfully');
            }
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
            console.log(usersCollection);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1); // Exit the process with an error code
    });

  
  //API FOR LOST PAGE
app.post('/api/lostpage', upload.single('image'),async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // Destructure the fields directly from req.body
       // const { name_of_item_lost, select_place, description,  place, show_contact  } = req.body;
       const { name_of_item_lost, select_place, description,  place, contact  } = req.body;

       const imagePath = req.file.path; // Get the path of the uploaded image
       
      
        
       
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
                //show_contact: show_contact
                contact:contact,
                image: imagePath // Store the image path in the database
               
            };
            const lostDetails2= {
                name_of_item_lost: name_of_item_lost,
                select_place: select_place,
                description: description,
               // show_contact: show_contact
                contact:contact,
                image: imagePath // Store the image path in the database
               
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


                // If a user with matching credentials is found, create a session for the user
                req.session.user = user; // Store user information in the session
  
                 // Check if session is created
                 if (req.session.user) {
                    console.log('Session created successfully');
                    // Log the contact number of the user
        console.log('User Contact:', user.contact);
                    
                } else {
                    console.log('Session creation failed');
                }

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
        // Log the error message along with additional context
        console.error('Error processing request:', error);
        console.error('Request Body:', req.body);
        console.error('Request File:', req.file);

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

        
 // Query MongoDB for lost items
 //const lostItems = await  usersCollection.find({}, { projection: { _id: 0 } }).toArray();
 const lostItems = await  usersCollection.find({}, { projection: { _id: 0 } }).toArray();
 
    
    res.json(lostItems);
   
    } catch (error) {
        // Handle error
        res.status(500).json({ message: error.message });

    }
});

 //API FOR FOUND PAGE
 app.post('/api/foundpage', Upload.single('image'),async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // Destructure the fields directly from req.body
       // const { name_of_item_lost, select_place, description,  place, show_contact  } = req.body;
       const { name_of_item_found, select_place, description,  place, contact  } = req.body;

       const imagePath = req.file.path; // Get the path of the uploaded image
       
      
        console.log(req.body)
       
        // Check if all required fields are present
        if (name_of_item_found && select_place && description ) {
            // Assuming connectdb returns a MongoDB client
            const client = await connectdb();
            const db = client.db('project'); // Specify your database name
            const usersCollection = db.collection('FoundPageForm'); // Specify your collection name

            

            // Create an object with the required fields
            const foundDetails = {
                name_of_item_found: name_of_item_found,
                select_place: select_place,
                description: description,
                place: place,
                //show_contact: show_contact
                contact:contact,
                image: imagePath // Store the image path in the database
               
            };
            const foundDetails2= {
                name_of_item_found: name_of_item_found,
                select_place: select_place,
                description: description,
               // show_contact: show_contact
                contact:contact,
                image: imagePath // Store the image path in the database
               
            };

           // console.log(lostDetails);
            if(place=='undefined'){
                await usersCollection.insertOne(foundDetails2);
            }else{
            // Insert the details into the database
           await usersCollection.insertOne(foundDetails);

        }

            // Respond with success message
            res.status(201).json({ message: 'Found data input successfully!' });
            console.log('Found data input successfully!');
        } else {
            // If any required field is missing, respond with an error
            res.status(400).json({ error: 'Missing required fields' });
        
            
        }
        
    } catch (error) {
        // If an error occurs, respond with a server error
        console.error('Error Found data input failed.', error);
        res.status(500).json({ error: 'Error Found data input failed. ' });
    }
});

// GET API endpoint
app.get('/api/found-items-card', async (req, res) => {
    try {
        // Assuming connectdb returns a MongoDB client
        const client = await connectdb();
        const db = client.db('project'); // Specify your database name
        const usersCollection = db.collection('FoundPageForm'); // Specify your collection name

        
 // Query MongoDB for lost items
 const foundItems = await  usersCollection.find({}, { projection: { _id: 0 } }).toArray();
  
    res.json(foundItems);
   
    } catch (error) {
        // Handle error
        res.status(500).json({ message: error.message });

    }
});


//API FOR CONTACT US
app.post('/api/contact', async (req,res)=>{

    try {
       // const { userDetails } = req.body;
       const userDetails = req.body;
    

   console.log(userDetails);
   
        if (userDetails.name && userDetails.email && userDetails.subject && userDetails.message) {

            // Assuming connectdb returns a MongoDB client
            const client = await connectdb();
            const db = client.db('project'); // Specify your database name
            const usersCollection = db.collection('Contact'); // Specify your collection name

            
                
                await usersCollection.insertOne(userDetails);
                res.status(201).json({ message: 'User contacted successfully' });

                console.log('User contacted successfully');
            
        } else {
            res.status(400).json({ error: 'Missing required fields' });
        }
    } catch (error) {
        console.error('Error contacting:', error);
        res.status(500).json({ error: 'Error contacting' });
    }
});



