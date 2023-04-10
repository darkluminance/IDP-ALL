const express = require('express'); //Import express JS library
const app = express();
const port = 8888; //Set backend server port number
const cors = require('cors'); //CORS allows requests from browser to be allowed

//This is required for getting past the 'access blocked by cors' error
app.use(cors());

//Will convert all coming data into JSON
app.use(express.json());

app.get('/getlineart', (request, response) => {
	const data = request.params.image;
});
