const express = require('express');
const cors = require('cors');
const app = express();
const multer = require('multer');
const cors = require('cors');
const router = express.Router();
const Schemas = require('../models/Schemas');
const { Test } = require('../models/Schemas');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './');
	},
	filename: function (req, file, cb) {
		const ext = file.mimetype.split('/')[1];
		cb(null, `uploads/${file.originalname}-${Date.now()}.${ext}`);
	},
});

const upload = multer({
	storage: storage,
});

router.get('/addWhatever', async (req, res) => {
	const user = { username: 'lololo', fullname: 'LOLO hahahaha' };
	const newWhatever = new Schemas.Whatever(user);

	try {
		await newWhatever.save(async (err, newWhateverResult) => {
			console.log('New whatever created!');
			res.end('New whatever created!');
		});
	} catch (err) {
		console.log('Log ::: err :::', err);
		res.end('Whatever not added!');
	}
});

router.get('/test', async (req, res) => {
	// const str = [
	//   {
	//     name: "Ashot",
	//     surname: "Mkrtchyan",
	//     age: "24",
	//   },
	// ];

	const test = Schemas.Test; //Test is from Schemas.js

	const userTest = await test
		.find({}, (err, testData) => {
			if (err) throw err;
			if (testData) {
				res.end(JSON.stringify(testData));
			} else {
				res.end();
			}
		})
		.clone()
		.catch(function (err) {
			console.log(err);
		});
	// res.end(JSON.stringify(str));
});

router.post('/usersRegister', async (req, res) => {
	const usernameUsers = req.body.username;
	const passwordUsers = req.body.password;
	const genderUsers = req.body.gender;
	const ageUsers = req.body.age;
	const nameUsers = req.body.name;
	const surnameUsers = req.body.surname;
	const emailUsers = req.body.email;
	const phoneUsers = req.body.phone;
	const isAdminUsers = false;

	const newUser = new Schemas.Users({
		username: usernameUsers,
		password: passwordUsers,
		gender: genderUsers,
		age: ageUsers,
		name: nameUsers,
		surname: surnameUsers,
		email: emailUsers,
		phone: phoneUsers,
		isAdmin: isAdminUsers,
	});

	res.set({
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	});

	try {
		await newUser.save((err, newUserResults) => {
			if (err) res.end('Error Saving.');
			console.log('works');
			res.redirect('http://localhost:3000/works');

			res.end();
		});
	} catch (err) {
		console.log('Log ::: err :::', err);
		res.redirect('/error');
		res.end();
	}
});

router.get('/users', async (req, res) => {
	const users = Schemas.Users;
	res.set({
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	});

	const usersSend = await users
		.find({}, (err, userData) => {
			if (err) throw err;
			if (userData) {
				console.log('Log ::: userData :::', userData);

				const sendingData = userData.map((it) => {
					return { username: it.username, email: it.email };
				});

				res.end(JSON.stringify(sendingData));
			} else {
				res.end();
			}
		})
		.clone()
		.catch(function (err) {
			console.log(err);
		});
	// res.end(JSON.stringify(str));
});

router.post('/login', async (req, res) => {
	const users = Schemas.Users;
	res.set({
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	});

	const login = await users
		.find({}, (err, userData) => {
			if (err) throw err;
			if (userData) {
				const username = req.body.username;
				const password = req.body.password;

				let sendingData = userData.filter((it) => {
					if (it.username === username && it.password === password) return it;
					if (it.email === username && it.password === password) return it;
				});

				if (sendingData.length === 0) {
					sendingData = 'wrong';
				}
				res.end(JSON.stringify(sendingData));
			} else {
				res.end();
			}
		})
		.clone()
		.catch(function (err) {
			console.log(err);
		});
});

router.post('/addRecipe', upload.single('image'), async (req, res) => {
	const title = req.body.title;
	const description = req.body.description;
	const ingredients = req.body.ingredients;
	const type = req.body.type;
	const userId = req.body.userId;
	const image = req.file.filename;

	res.set({
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	});

	const newRecipe = new Schemas.Recipes({
		title: title,
		description: description,
		ingredients: ingredients,
		type: type,
		image: image,
		userId: userId,
	});

	try {
		await newRecipe.save((err, newRecipeResults) => {
			if (err) res.end('Error Saving.');
			console.log('works');
			res.redirect('http://localhost:3000/works');
			res.end();
		});
	} catch (err) {
		console.log('Log ::: err :::', err);
		res.redirect('/error');
		res.end();
	}
});

router.post('/addTest', async (req, res) => {
	const nameTest = req.body.name;
	const surnameTest = req.body.surname;

	res.set({
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	});

	const newTest = new Schemas.Test({
		name: nameTest,
		surname: surnameTest,
	});

	try {
		await newTest.save((err, newTestResults) => {
			if (err) res.end('Error Saving.');
			console.log('works');
			res.redirect('http://localhost:3000/works');

			res.end();
		});
	} catch (err) {
		console.log('Log ::: err :::', err);
		res.redirect('/error');
		res.end();
	}
});

router.post('/deleteTest', async (req, res) => {
	const test = await Test.findById(req.body.id);
	await test.remove();
});

router.post('/editTest', async (req, res) => {
	const test = await Test.findById(req.body._id);
	Object.assign(test, req.body);
	test.save();
	res.send({ data: test });
});

module.exports = router;
