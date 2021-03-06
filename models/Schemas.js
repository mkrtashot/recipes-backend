const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const whateverSchema = new Schema({
	// _id: ObjectId
	username: { type: String, required: true },
	fullname: { type: String, required: true },
	entryDate: { type: Date, default: Date.now },
});

const testSchema = new Schema({
	//id
	name: { type: String, required: true },
	surname: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, ref: 'whatever' },
});

const usersSchema = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	gender: { type: String, required: true },
	age: { type: Number, required: true },
	name: { type: String, required: true },
	surname: { type: String, required: true },
	email: { type: String, required: true },
	phone: { type: Number, required: false },
	isAdmin: { type: Boolean, required: true },
});

const recipesSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	ingredients: { type: Array, required: true },
	type: { type: String, required: true },
	image: { data: Buffer, contentType: String, required: false },
	userId: { type: String, required: true },
});

const Whatever = mongoose.model('whatever', whateverSchema, 'whatever');
const Test = mongoose.model('test', testSchema, 'test');
const Users = mongoose.model('users', usersSchema, 'users');
const Recipes = mongoose.model('recipes', recipesSchema, 'recipes');
const mySchemas = {
	Whatever: Whatever,
	Test: Test,
	Users: Users,
	Recipes: Recipes,
};

module.exports = mySchemas;
