const scheduleModel = require("./schedule");
const blockModel = require("./block");
const userServices = require("./user-services");

async function getSchedule(id) 
{
	try 
	{
		const us = await userServices.findUserById(id);

		const scheduleID = us.schedule;
		const scheduleRef = await scheduleModel.findById(scheduleID);
		const schedule = {Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []};

		let m = scheduleRef.Mon.length;
		for (let j = 0; j < m; j++) 
			schedule.Mon.push(await blockModel.findById(scheduleRef.Mon[j]));

		

		m = scheduleRef.Tue.length;
		for (let j = 0; j < m; j++) 
			schedule.Tue.push(await blockModel.findById(scheduleRef.Tue[j]));

		
        
		m = scheduleRef.Wed.length;
		for (let j = 0; j < m; j++) 
			schedule.Wed.push(await blockModel.findById(scheduleRef.Wed[j]));

		
        
		m = scheduleRef.Thu.length;
		for (let j = 0; j < m; j++) 
			schedule.Thu.push(await blockModel.findById(scheduleRef.Thu[j]));

		
        
		m = scheduleRef.Fri.length;
		for (let j = 0; j < m; j++) 
			schedule.Fri.push(await blockModel.findById(scheduleRef.Fri[j]));

		

		m = scheduleRef.Sat.length;
		for (let j = 0; j < m; j++) 
			schedule.Sat.push(await blockModel.findById(scheduleRef.Sat[j]));
		
        
		m = scheduleRef.Sun.length;
		for (let j = 0; j < m; j++) 
			schedule.Sun.push(await blockModel.findById(scheduleRef.Sun[j]));

		return schedule;
	}
	catch (err) 
	{
		console.log(err);
		return undefined;
	}
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

//user id, day parameter, body of schedule(actual data)
async function addBlockOnDay(uid, day, slotID) //USED IN BACKEND.JS
{
	try 
	{
		if (slotID === undefined || slotID === null) 
		{
			return false;
		}
		const us = await userServices.findUserById(uid);
		if (us === undefined || us===null) 
		{
			console.log("Failed to retreive schedule for user with id " + uid + ".\n");
			throw(Error);
		}
		const scheduleID = us.schedule;
		var query = {};
		query[days[parseInt(day)]] = slotID;
		const result = await scheduleModel.updateOne(
			{ _id: scheduleID },
			{ $push: query }
		);
		if (result.modifiedCount > 0)
			return true;
		else
			return false;
	}
	catch (error) 
	{
		console.log(error);
		return false;
	}
}

async function deleteBlockById(uid, day, slotID) 
{
	try 
	{
		if (slotID === undefined || slotID === null) 
		{
			return false;
		}
		const us = await userServices.findUserById(uid);
		if (us === undefined || us === null) 
		{
			console.log("Failed to retreive schedule for user with id " + uid + ".\n");
			throw(Error);
		}
		const scheduleID = us.schedule;
		var query = {};
		query[days[parseInt(day)]] = slotID;
		const result = await scheduleModel.updateOne( 
			{ _id: scheduleID },
			{ $pull: query }
		);
		if (result.modifiedCount > 0)
			return true;
		else
			return false;
	}
	catch (error) 
	{
		console.log(error);
		return false;
	}
}

exports.getSchedule = getSchedule;
exports.addBlockOnDay = addBlockOnDay;
exports.deleteBlockById = deleteBlockById;