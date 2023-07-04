const taskModel = require("./task");
const userServices = require("./user-services");

async function addTask(task)
{
	try 
	{
		const taskToAdd = new taskModel(task);
		const savedTask = await taskToAdd.save();
		return savedTask;
	}
	catch(error)
	{
		//console.log(error);
		return undefined;
	}
}
//adds task to a given user using the userid
async function addTasktoUser(uid,task) 
{
	try 
	{
		//console.log(task);
		const newTask = new taskModel(task);	
		const savedTask = await newTask.save();	//inserts into Tasks 
		await userServices.addTasktoUser(uid,savedTask._id.valueOf());
		return savedTask;
	}
	catch (err) 
	{
		//console.log(err);
		return undefined;
	}
}

async function findTasksByUserId(id) 
{
	try 
	{
		const user = await userServices.findUserById(id);
		const tasksIDList = user.tasks_list;
		const tasksList = [];
    
		let n = tasksIDList.length;
		for(let i=0; i<n; ++i)
			tasksList.push(await taskModel.findById(tasksIDList[i]));
		
		return tasksList;
	}
	catch (error) 
	{
		//console.log(error);
		return undefined;
	}
}


/*async function findTaskByName(name) 
{
	return await taskModel.find({ name: name });
}
*/

async function deleleTaskByID(id, uid) 
{
	try 
	{
		await userServices.deleleTaskByID(uid, id);
		return await taskModel.findByIdAndDelete(id);
	}
	catch (error) 
	{
		//console.log(error);
		return undefined;
	}
}  

async function updateTaskByID(id, newTask) 
{
	try 
	{
		return await taskModel.findOneAndUpdate({_id: id}, 
			{
				taskName: newTask.taskName,
				priority_level: newTask.priority_level,
				due_date: newTask.due_date,
				length: newTask.length,
				done: newTask.done
			});
	}
	catch (error) 
	{
		//console.log(error);
		return undefined;
	}
} 

async function findTaskById(id) 
{
	try 
	{
		return await taskModel.findById(id);
	}
	catch (error) 
	{
		//console.log(error);
		return undefined;
	}
}

exports.findTasksByUserId = findTasksByUserId;
exports.deleleTaskByID = deleleTaskByID;
exports.addTasktoUser = addTasktoUser;
exports.addTask = addTask;
exports.updateTaskByID = updateTaskByID;
exports.findTaskById = findTaskById;