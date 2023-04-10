const fs = require('fs');
const Jimp = require('jimp');

async function onRuntimeInitialized() {
	// load local image file with jimp. It supports jpg, png, bmp, tiff and gif:
	let jimpSrc = await Jimp.read(
		'./images/image_97aad915-25a7-4e93-ae12-daeb298ef2ad.jpg'
	);
	// `jimpImage.bitmap` property has the decoded ImageData that we can use to create a cv:Mat
	// var img = cv.matFromImageData(jimpSrc.bitmap);
	let src = cv.matFromImageData(jimpSrc.bitmap);
	// following lines is copy&paste of opencv.js dilate tutorial:
	let dst = new cv.Mat();
	// let M = cv.Mat.ones(5, 5, cv.CV_8U);
	// let anchor = new cv.Point(-1, -1);
	// cv.dilate(
	// 	src,
	// 	dst,
	// 	M,
	// 	anchor,
	// 	1,
	// 	cv.BORDER_CONSTANT,
	// 	cv.morphologyDefaultBorderValue()
	// );

	console.log('assi 1');
	cv.cvtColor(src, dst, cv.COLOR_BGR2GRAY);
	console.log('assi 2');
	let inverted = new cv.Mat();
	console.log('assi 3');
	cv.bitwise_not(dst, inverted);
	console.log('assi 4');
	let blurred = new cv.Mat();
	console.log('assi 5');
	let ksize = new cv.Size(13, 13);
	console.log('assi 6');
	cv.GaussianBlur(inverted, blurred, ksize, 0, 0, cv.BORDER_DEFAULT);
	console.log('assi 7');
	let inv_blur = new cv.Mat();
	console.log('assi 8');
	cv.bitwise_not(blurred, inv_blur);
	console.log('assi 9');
	let pencilsktch = new cv.Mat();
	console.log('assi 10');
	// cv.divide(src, inv_blur, pencilsktch, (scale = 256.0));
	// console.log('assi 11');
	// // cv.imshow('imageCanvas', pencilsktch);

	// img.delete();

	// Now that we are finish, we want to write `dst` to file `output.png`. For this we create a `Jimp`
	// image which accepts the image data as a [`Buffer`](https://nodejs.org/docs/latest-v10.x/api/buffer.html).
	// `write('output.png')` will write it to disk and Jimp infers the output format from given file name:
	// new Jimp({
	// 	data: Buffer.from(inv_blur.data),
	// 	width: inv_blur.cols,
	// 	height: inv_blur.rows,
	// }).write('output.png');

	// jimpSrc.delete();
	pencilsktch.delete();
	inv_blur.delete();
	blurred.delete();
	inverted.delete();
	src.delete();
	dst.delete();
}
// Finally, load the open.js as before. The function `onRuntimeInitialized` contains our program.
Module = {
	onRuntimeInitialized,
};
cv = require('./opencv.js');
