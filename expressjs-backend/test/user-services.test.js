require("dotenv").config();
const mongoose = require("mongoose");
const userModel = require("../models/user");
const userServices = require("../models/user-services");

let testingUser = {};

describe("Connection", () => 
{
	beforeAll(async () => 
	{
		await mongoose.connect("mongodb+srv://" +
        process.env.MONGO_USER +
        ":" +
        process.env.MONGO_PWD +
        "@" +
        process.env.MONGO_CLUSTER +
        "/" +
        process.env.MONGO_DB +
        "?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		const newUser = 
			{name: "testing-user", schedule: [], tasks_list: []};
		const userToSave = new userModel(newUser);
		testingUser = await userToSave.save();

	});

	function compareUsers(lhs, rhs)
	{
		if(rhs === undefined || rhs === null)
			return false;
        
		return String(lhs._id) === String(rhs._id) && lhs.name === rhs.name;
	}

	function is_empty(user_data)
	{
		return user_data.name === null && user_data._id === null;
	}

	test("find user by id", async () => 
	{
		const result = await userServices.findUserById(testingUser._id);
		expect(compareUsers(testingUser, result)).toBeTruthy();
	});

	test("add user fail", async () => 
	{
		const result = userServices.addUser(null);
		expect(is_empty(result)).not.toBeTruthy();
	});


	test("delete user by id", async () => 
	{
		const newUser = {name: "testing-user", schedule: null, tasks_list: []};
		const userToDelete = await userServices.addUser(newUser);

		await userServices.deleleUserByID(userToDelete._id);

		const result = await userModel.findById(userToDelete._id);

		expect(result).toBe(null);
	});

	test("delete user by id fail", async () => 
	{
		let testID = "";
		for(let i=0; i<100000; ++i)
			testID += String(i);

		const result = await userServices.deleleUserByID(testID, null);

		expect(result).toBe(undefined);
	});

	test("delete task inside tasks_list by id fail", async () => 
	{
		let testID = "";
		for(let i=0; i<100000; ++i)
			testID += String(i);

		const result = await userServices.deleleTaskByID(testID, testID);

		expect(result).toBe(undefined);
	});

	test("add task to user tasks_list", async () => 
	{
		let testID = "629ab50fc46a4811b56ad887";

		await userServices.addTasktoUser(testingUser._id, testID);

		const userAfterAddTask = await userModel.findById(testingUser._id);

		expect(userAfterAddTask.tasks_list.find(x=>x===testID)).not.toBe(null);
	});

	test("add task to user tasks_list fail", async () => 
	{
		let testID = "";
		for(let i=0; i<100000; ++i)
			testID += String(i);

		const result = await userServices.addTasktoUser(testID, testID);

		expect(result).toBe(undefined);
	});


	afterAll(async () => 
	{
		await userModel.findByIdAndDelete(testingUser._id);
		mongoose.disconnect();
	});
});