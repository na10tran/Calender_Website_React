require("dotenv").config();
const mongoose = require("mongoose");
const blockServices = require("../models/block-services");
const scheduleServices = require("../models/schedule-services");
const blockModel = require("../models/block");

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
	});

	function compareBlocks(lhs, rhs)
	{
		if(rhs === undefined || rhs === null)
			return false;

		return lhs.start_time === rhs.start_time &&
            lhs.end_time === rhs.end_time && lhs.start_time_flexibility === rhs.start_time_flexibility
            && lhs.end_time_flexibility === rhs.end_time_flexibility;
	}

	test("add block", async () =>
	{
		const newBlock = {start_time: 420, end_time: 480, start_time_flexibility: 3, end_time_flexibility: 5};
		const uid = "629a16ba86dd526af5def396";
		const day = "3";
		const result = await blockServices.addBlockOnDay(uid, day, newBlock);

		expect(compareBlocks(newBlock, result)).toBeTruthy();
		
		await scheduleServices.deleteBlockById(uid, day, result._id.valueOf());
		await blockModel.findByIdAndDelete(result._id);
	});
	
	test("add block (missing field) -- will fail", async () => 
	{
		const uid = "629a16ba86dd526af5def396";
		const day = "3";
		const anotherBlock = {start_time: 420, start_time_flexibility: 3, end_time_flexibility: 5};
		const result = await blockServices.addBlockOnDay(uid, day, anotherBlock);

		expect(compareBlocks(anotherBlock, result)).toBeFalsy();
	});

	test("add block (nonexisting user) -- will fail", async () => 
	{
		let uid = "";
		for (let i = 0; i < 10; i++)
			uid += String(i);
		const day = "3";
		const anotherBlock = {start_time: 420, end_time: 480, start_time_flexibility: 3, end_time_flexibility: 5};
		const result = await blockServices.addBlockOnDay(uid, day, anotherBlock);
		
		expect(compareBlocks(anotherBlock, result)).toBeFalsy();
	});

	test("delete block by id", async () => 
	{
		const newBlock = {start_time: 420, end_time: 480, start_time_flexibility: 3, end_time_flexibility: 5};
		const uid = "629a16ba86dd526af5def396";
		const day = "3";
		const addedBlock = await blockServices.addBlockOnDay(uid, day, newBlock);
		const result = await blockServices.deleteBlockById(uid, day, addedBlock._id.valueOf());

		expect(compareBlocks(addedBlock, result)).toBeTruthy();
	});
	
	test("delete block by id (wrong id) -- will fail", async () => 
	{
		const newBlock = {start_time: 420, end_time: 480, start_time_flexibility: 3, end_time_flexibility: 5};
		const uid = "629a16ba86dd526af5def396";
		const day = "3";
		let id = "";
		for (let i = 0; i < 10; i++)
			id += String(i);
		const result = await blockServices.deleteBlockById(uid, day, id);
		
		expect(compareBlocks(newBlock, result)).toBeFalsy();
	});

	test("delete block by id (undefined id) -- will fail", async () => 
	{
		const newBlock = {start_time: 420, end_time: 480, start_time_flexibility: 3, end_time_flexibility: 5};
		const uid = "629a16ba86dd526af5def396";
		const day = "3";
		const result = await blockServices.deleteBlockById(uid, day, undefined);
		
		expect(compareBlocks(newBlock, result)).toBeFalsy();
	});

	afterAll(async () => 
	{
		mongoose.disconnect();
	});
});