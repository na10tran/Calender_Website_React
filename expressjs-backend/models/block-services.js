const blockModel = require("./block");
const scheduleServices = require("./schedule-services");

async function addBlockOnDay(uid, day, slot) 
{
	try 
	{
		const block = new blockModel(slot);
		const savedBlock = await block.save();
		console.log(savedBlock);
		const result = await scheduleServices.addBlockOnDay(uid, day, savedBlock._id.valueOf());
		if (result === false)
		{
			await blockModel.findByIdAndDelete(savedBlock._id);
			console.log("Block could not be added to schedule of user with id '" + uid + "'");
			return undefined;
		}
		return savedBlock;
	}
	catch (err) 
	{
		console.log(err);
		return undefined;
	}
}

async function deleteBlockById(uid, day, id) 
{
	try 
	{
		const result = await scheduleServices.deleteBlockById(uid, day, id);
		const blockRes = await blockModel.findByIdAndDelete(id);
		if (result === false)
			return undefined;
		else
			return blockRes;
	}
	catch (err) 
	{
		console.log(err);
		return undefined;
	}
}

exports.addBlockOnDay = addBlockOnDay;
exports.deleteBlockById = deleteBlockById;