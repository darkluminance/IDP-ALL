// const cv = require('./opencv');
const express = require('express'); //Import express JS library
const app = express();
const port = 6969; //Set backend server port number
const cors = require('cors'); //CORS allows requests from browser to be allowed
const multer = require('multer');
const bodyParser = require('body-parser');
const Jimp = require('jimp');
const { spawn } = require('child_process');
const { cloudinary } = require('./utils/cloudinary');
const fs = require('fs');

let accuracy = 0;
let lastAlgo = 0;
let lastThreshold = -1;

//This is required for getting past the 'access blocked by cors' error
app.use(cors());

//Will convert all coming data into JSON
app.use(express.json());

// Function to serve all static files
// inside public directory.
app.use(express.static('public'));
app.use('/images', express.static('images'));

const storage = multer.diskStorage({
	destination(req, file, callback) {
		callback(null, './images');
	},
	filename(req, file, callback) {
		callback(null, `${file.fieldname}_${file.originalname}`);
	},
});

const upload = multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } });

const convertLineart = (img) => {
	cv.cvtColor(img, img, cv.COLOR_BGR2GRAY);
	inverted = new cv.Mat();
	cv.bitwise_not(img, inverted);
	blurred = new cv.Mat();
	let ksize = new cv.Size(13, 13);
	cv.GaussianBlur(inverted, blurred, ksize, 0, 0, cv.BORDER_DEFAULT);
	inv_blur = new cv.Mat();
	cv.bitwise_not(blurred, inv_blur);
	pencilsktch = new cv.Mat();
	cv.divide(img, inv_blur, pencilsktch, (scale = 256.0));
	cv.imshow('imageCanvas', pencilsktch);

	inverted.delete();
	blurred.delete();
	inv_blur.delete();
	pencilsktch.delete();
	img.delete();

	return pencilsktch;
};

const executepythonscript = (path, algo, tt) => {
	console.log(path);
	var dataToSend;
	// spawn new child process to call the python script
	const python = spawn('python', ['main.py', path, algo, tt]);
	// collect data from script
	python.stdout.on('data', function (data) {
		console.log('Pipe data from python script ...');
		dataToSend = data.toString();
		// console.log(dataToSend);
	});
	// in close event we are sure that stream from child process is closed
	python.on('close', (code) => {
		console.log(`child process close all stdio with code ${code}`);
	});
};
const executeaccuracyscript = (path, path2) => {
	var dataToSend;
	console.log(path, path2);
	// spawn new child process to call the python script
	const python = spawn('python', [
		'Classification/image_similarity.py',
		path,
		path2,
	]);
	// collect data from script
	printer = [];
	python.stdout.on('data', function (data) {
		console.log('Pipe data from python script ...');
		console.log(data.toString());
		printer.push(data.toString());
	});
	// in close event we are sure that stream from child process is closed
	python.on('close', (code) => {
		let ret = printer.pop().match(/\d+/)[0];
		console.log('returner ', ret);
		console.log(`child process close all stdio with code ${code}`);
		// return ret;
		accuracy = ret;

		const content = ret;

		fs.writeFile('./accuracy/' + path + '.txt', content, (err) => {
			if (err) {
				console.error(err);
				return;
			}
			//file written successfully
		});
	});
};

const executepilscript = () => {
	const python = spawn('python', ['pil.py']);
	// collect data from script
	python.stdout.on('data', function (data) {
		console.log('Pipe data from python script ...');
		dataToSend = data.toString();
		// console.log(dataToSend);
	});
	// in close event we are sure that stream from child process is closed
	python.on('close', (code) => {
		console.log(`child process close all stdio with code ${code}`);
	});
};

const executepythonscriptdot = (path, tt = 7) => {
	fs.open('points.txt', 'w', function (err, file) {
		if (err) throw err;
	});
	fs.writeFile('points.txt', '', function (err) {
		if (err) throw err;
	});
	console.log(path);
	var dataToSend;
	// spawn new child process to call the python script
	const python = spawn('python', ['dot.py', path, tt]);
	// collect data from script
	python.stdout.on('data', function (data) {
		console.log('Pipe data from python script ...');
		dataToSend = data.toString();
		// console.log(dataToSend);

		fs.appendFile('points.txt', dataToSend, function (err) {
			if (err) throw err;
			// console.log('Updated!');
		});
	});
	// in close event we are sure that stream from child process is closed
	python.on('close', (code) => {
		console.log(`child process close all stdio with code ${code}`);
		//executepilscript();
	});
};

app.get('/', (req, res) => {
	res.send('<h1 style="color: red;">Hello to the backend zone!</h1>');
	console.log('HI');
});

app.get('/draw', (req, res) => {
	executepilscript();

	setTimeout(async () => {
		try {
			// console.log('Uploading image...');
			// const up = await cloudinary.v2.uploader.upload('./output.gif');
			// console.log(up.url);
			// console.log('Uploading Successful');
			// res.send(up.url);
			res.send('Uploading Successful');
		} catch (error) {
			console.log(error);
		}
	}, 6800);
});

app.post('/tolineart/:algo/:threshold', upload.single('image'), (req, res) => {
	console.log('image recieved');
	// console.log('file', req.file); //this will be automatically set by multer
	// console.log('body', req.body);
	// console.log('file', req.file); //this will be automatically set by multer

	let data = req.file;

	let imagename = `${data.fieldname}_${data.originalname}`;

	// let processingimage = readImg(`./images/${imagename}`);
	let algo = parseInt(req.params.algo);
	lastAlgo = algo;
	let threshold = parseInt(req.params.threshold);
	lastThreshold = threshold;
	executepythonscript(`images/${imagename}`, algo, threshold);

	setTimeout(async () => {
		try {
			console.log('Uploading image...');
			const up = await cloudinary.v2.uploader.upload(
				'./images/' + imagename + '.png',
				{ upload_preset: 'ml_default' }
			);
			console.log(up.url);
			console.log('Uploading Successful');
			res.send([up.url, 'images/' + imagename + '.png']);
		} catch (error) {
			console.log(error);
		}
	}, 5800);
	// let lineartimage = 'outputs/' + imagename + '.png';

	// data = await req.body;
	// jsonfile = await JSON.parse(data.img);

	// console.log(JSON.parse(req.body.file));
});

app.post('/accuracy', upload.single('image'), (req, res) => {
	console.log('image recieved');
	// console.log('file', req.file); //this will be automatically set by multer
	// console.log('body', req.body);
	// console.log(req.query.nem);

	let data = req.file;

	let imagename = `${data.fieldname}_${data.originalname}`;
	let nemm = req.query.nem;
	nemm = nemm.substring(0, nemm.length - 4);
	// executepythonscript(`images/${imagename}`, 0, -1);
	console.log(nemm);
	executeaccuracyscript(`images/${imagename}`, nemm);
	setTimeout(() => {
		res.send(accuracy);
	}, 20000);

	// setTimeout(async () => {
	// 	try {
	// 		console.log('Uploading image...');
	// 		const up = await cloudinary.v2.uploader.upload(
	// 			'./images/' + imagename + '.png',
	// 			{ upload_preset: 'ml_default' }
	// 		);
	// 		console.log(up.url);
	// 		console.log('Uploading Successful');
	// 		res.send([up.url, 'images/' + imagename + '.png']);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }, 1800);
	// let lineartimage = 'outputs/' + imagename + '.png';

	// data = await req.body;
	// jsonfile = await JSON.parse(data.img);

	// console.log(JSON.parse(req.body.file));
});

app.get('/todot', (req, res) => {
	console.log('image recieved for dotting ', req.query.name);
	// console.log('file', req.file); //this will be automatically set by multer

	// let data = req.file;

	// let imagename = `${data.fieldname}_${data.originalname}`;

	// let processingimage = readImg(`./images/${imagename}`);
	executepythonscriptdot(`${req.query.name}`);

	setTimeout(async () => {
		try {
			console.log('Uploading dot image...');
			const up = await cloudinary.v2.uploader.upload(
				'./dots/' + req.query.name + '.png',
				{ upload_preset: 'ml_default' }
			);
			console.log(up.url);
			console.log('Uploading Successful');
			res.send(up.url);
		} catch (error) {
			console.log(error);
		}
	}, 2800);
	// let lineartimage = 'outputs/' + imagename + '.png';

	// data = await req.body;
	// jsonfile = await JSON.parse(data.img);

	// console.log(JSON.parse(req.body.file));
});
// app.post('/imagelineart', upload.single('photo'), async (req, res) => {
// 	formData = await req.body;
// 	var userJSON = await JSON.parse(formData.image);

// 	const photo = await Buffer.from(userJSON.photo, 'utf-8');

// 	delete userJSON.photo;
// 	userJSON.photo = photo;
// 	console.log(userJSON);

// 	try {
// 		// await user.save();
// 		res.send({ message: 'Registeration Successfull' });
// 	} catch (e) {
// 		res.send({ response: 'registeration failed' });
// 		console.log(e);
// 	}
// });

async function readImg(path) {
	let pepo = await Jimp.read(path);
	let src = convertLineart(cv.matFromImageData(pepo.bitmap));

	return src;
}

const server = app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
