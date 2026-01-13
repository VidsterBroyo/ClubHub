const express = require('express');
const cors = require('cors');
const fsP = require('fs').promises
// const fetch = require('node-fetch'); // Ensure fetch is imported

require('dotenv').config();

const app = express();
const port = 3001;


// Middleware to parse JSON
app.use(express.json());
app.use(cors());

const { ManagementClient } = require('auth0');

const clientId = process.env.AUTH0_MANAGEMENT_CLIENT_ID;
const clientSecret = process.env.AUTH0_MANAGEMENT_CLIENT_SECRET;
const domain = process.env.REACT_APP_AUTH0_DOMAIN;

let management;


async function getManagementApiToken() {
    const response = await fetch(`https://${domain}/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            audience: `https://${domain}/api/v2/`,
            grant_type: 'client_credentials',
        }),
    });

    const data = await response.json();
    return data.access_token;
}

async function initializeManagementClient() {
    const token = await getManagementApiToken();
    management = new ManagementClient({
        token: token,
        domain: domain,
    });
}

// Initialize ManagementClient when the server starts
initializeManagementClient().catch(err => {
    console.error('Error initializing ManagementClient:', err);
});


// get all clubs
app.get('/get-clubs', async (req, res) => {

    try {
        // get rubric data
        let clubs = JSON.parse(await fsP.readFile('./clubs.json'))

        // send json
        res.setHeader('content-type', 'application/json')
        res.json(clubs)
        res.end()

    } catch (error) {
        console.log(error)
        res.end("get-clubs response error: " + error)
    }
})


// get all teacher requests
app.get('/get-requests', async (req, res) => {

    try {
        // get rubric data
        let requests = JSON.parse(await fsP.readFile('./requests.json'))

        // send json
        res.setHeader('content-type', 'application/json')
        res.json(requests)
        res.end()

    } catch (error) {
        console.log(error)
        res.end("get-requests response error: " + error)
    }
})

app.post('/get-user-type', async (req, res) => {
    console.log('getting user type');
    const { userId } = req.body;

    try {
        // Get the user details
        
        const user = await management.users.get({ id: userId });

        console.log(user.data.user_metadata.type);
        res.status(200).json({ type: user.data.user_metadata.type });
    } catch (error) {
        console.error('Error fetching user metadata:', error);
        res.status(500).json({ message: 'Failed to fetch user metadata' });
    }
});


app.post('/get-points', async (req, res) => {
    console.log('getting user type');
    const { userId } = req.body;

    try {
        // Get the user details
        
        const user = await management.users.get({ id: userId });

        console.log(user.data.user_metadata.points);
        res.status(200).json({ points: user.data.user_metadata.points });
    } catch (error) {
        console.error('Error fetching user points:', error);
        res.status(500).json({ message: 'Failed to fetch user points' });
    }
});



app.post('/get-owned-club', async (req, res) => {
    console.log('getting user type');
    const { userId } = req.body;

    try {
        // Get the user details
        
        const user = await management.users.get({ id: userId });

        console.log(user.data.user_metadata.owned);
        res.status(200).json({ owned: user.data.user_metadata.owned });
    } catch (error) {
        console.error('Error fetching user owned club:', error);
        res.status(500).json({ message: 'Failed to fetch user owned club' });
    }
});


app.post('/newRequest', async (req, res) => {
    try {

        let requests = JSON.parse(await fsP.readFile('./requests.json'))
        requests.requests.push(req.body)
    
        await fsP.writeFile('./requests.json', JSON.stringify(requests))
        console.log(requests)
        res.end("success")
    }
    catch (error) {
        console.error(error)
        res.end("postRubric response error: " + error)
    }
    
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
