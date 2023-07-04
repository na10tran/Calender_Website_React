
import Form from "react-bootstrap/Form";
import React, {useState, useEffect}  from "react";
import axios from "axios";
import * as scheduler from "../scheduler.js";
/*
 *Import { useState, useEffect } from "react";
 *const [tasks, setCompleteTasks] = React.useState([]);
 *const handleStyleComplete = (id) => {
 *  // tell your state here, that these task is complete.
 *  setCompleteTasks([...tasks, id]);
 *};
 *
 *tasks = ["task1", "task2", "task3","task4", "task5"];
 */
/* Max task_name = 20 chars*/

//convert start time to string

// function tts(t)
// {
// 	var hour = Math.floor(t);
// 	var min = Math.floor((t - hour) * 60);
// 	if (hour < 1)
// 		return "0:" + min.toString();

// 	var min_string = "0:";
// 	if (min < 10)
// 		min_string = ":0";
// 	min_string += min.toString();

// 	return hour.toString() + min_string;
// }

const schedule_key = 
{
	0: "Sun",
	1: "Mon",
	2: "Tue",
	3: "Wed",
	4: "Thu",
	5: "Fri",
	6: "Sat",
};

function csts(t)
{
	t = t / (60);
	var hour = Math.floor(t);
	var min = Math.floor((t - hour) * 60);

	var am_pm = "AM";

	if(hour > 12)
	{
		hour = hour - 12;
		am_pm = "PM";
	}
	if (hour == 12)
		am_pm = "PM";

	if(hour == 0)
		hour = 12;
	var hour_string = hour.toString();

	var min_string = ":";
	if (min < 10)
		min_string = ":0";
	min_string += min.toString();

	return hour_string + min_string + am_pm;
}

//get block string
function gbs(bd)
{
	var s = csts(bd.start_time);
	var e = csts(bd.end_time);

	return s + " - " + e;
}

function get_min_max_priority(task_data)
{
	var min = -1;
	var max = -1;
	for (let task_index = 0; 
		task_index < task_data.length; 
		task_index++)
	{
		var task = task_data[task_index];
		if (min == -1 || task.priority < min)
			min = task.priority;

		if (max == -1 || task.priority > max)
			max = task.priority;
	}
	return [min, max];
}

function prio_color_scale(p, min, max)
{
	var v = min;
	if(min != max)
		v = (p - min) / (max - min);
	var color_a = rgb_to_hex(237, 88, 88);
	var color_b = rgb_to_hex(115, 237, 88);
	return lerp_hex_colors(color_a, color_b, v);
}

function rgb_to_hex(r, g, b) //yoink
{
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function lerp_hex_colors(a, b, amount) //yoink
{ 
	var ah = parseInt(a.replace(/#/g, ""), 16),
		ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
		bh = parseInt(b.replace(/#/g, ""), 16),
		br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
		rr = ar + amount * (br - ar),
		rg = ag + amount * (bg - ag),
		rb = ab + amount * (bb - ab);

	return "#" + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

function priorityToString(priorityNum)
{
	switch(parseInt(priorityNum))
	{
	case 1:
		return "Low";
	case 2:
		return "Normal";
	case 3:
		return "Medium";
	case 4:
		return "High";
	}
	return "Highest";
}

function ToDoListView() 
{
	const [tasks, setTasks] = useState([]);
	const [schedule_blocks, setScheduleBlocks] = useState([]);

	async function fetchTasks()
	{
		try 
		{
			const response = 
				await axios.get("http://localhost:5001/user/tasks/"+
								"62896e58b1cb8555ed799f3c");
			return response.data.tasks_list;
		}
		catch(error) 
		{
			console.log(error);
			return false;
		}
	}

	async function fetchSchedule()
	{
		try 
		{
			const response = 
				await axios.get("http://localhost:5001/user/62938a5d129b495001006987/schedule");
			return response.data.schedule;
		}
		catch(error) 
		{
			console.log(error);
			return false;
		}
	}
	/*async function fetchTaskNoID()
	{
		try 
		{
			const response = 
				await axios.get("http://localhost:5001/user/tasks/"+
				"62896e58b1cb8555ed799f3c");
			return response.data.tasks_list;
		}
		catch(error) 
		{
			console.log(error);
			return false;
		}
	}*/



	useEffect(() => 
	{
		fetchTasks().then(result => 
		{
			if(result)
				setTasks(result);
		});
	},[]);
	/*useEffect(() => 
	{
		fetchTaskNoID().then(result => 
		{
			if(result)
				setTasks(result);
		});
	},[]);*/

	useEffect(() => 
	{
		fetchSchedule().then(result => 
		{
			if(result)
				setScheduleBlocks(result);
		});
	},[]);

	function handleCheck(e, task_data)
	{
		if(e.target.checked !== task_data.done)
			checkDoneTask(task_data._id, e.target.checked);
		
	}

	function checkDoneTask(id, val)
	{
		const updatedTasks = tasks.map(task => task);
		/*tasks.filter((task,index) => 
		{
			if(task._id === id)
				return index;
		});*/
    
		let index = updatedTasks.findIndex(task=>task._id===id);
		updatedTasks[index].done = val;

		makeUpdateTaskDoneCall(id, updatedTasks[index]).then(result => 
		{
			if(result && result.status === 204)
			{
				setTasks(updatedTasks);
			}
		});
	}

	async function makeUpdateTaskDoneCall(id, newTask)
	{
		try 
		{
			const response = 
				await axios.put("http://localhost:5001/update/tasks"
					+"/"+id, newTask);
			return response;
		}
		catch(error) 
		{
			console.log(error);
			return false;
		}
	}

	var start = new Date(Date.now());
	const current_day = start.getDate();
	const current_week_day = start.getDay();
	const current_month = start.getMonth() + 1;
	const week_day_string = schedule_key[current_week_day];

	for (let task_index = tasks.length-1; 
		task_index >= 0; 
		task_index--)
	{
		// console.log(tasks);
		var task_date_raw = tasks[task_index].due_date;
		var task_date = task_date_raw.slice(0, 10);//"2022-05-31";
		task_date = task_date.split("-");
		
		// tasks[task_index].length = 15;
		// tasks[task_index].priority = task_index;
		if(!(parseInt(task_date[1]) == current_month && current_day == parseInt(task_date[2])))
		{
			tasks.splice(task_index, 1);
		}
	}
	
	var schedule_data = scheduler.solve_schedule(tasks, schedule_blocks[week_day_string]);
	
	var thresh = get_min_max_priority(tasks);
	return (
		<div className="d-flex flex-column" id="todolist_col">
			<div className="p-2" id="todolist_title">
				<span>To-Do</span>
			</div>

			{schedule_data.map((schedule_block) => (	//maps schedule data to schedule blocks
				console.log(""),
				
				<div className="p-2 w-100" id="todo_list">
					<div className="row">
						<span style={{ color: "white", fontSize: 32}}>
							{gbs(schedule_block.block_data)}
						</span>
					</div>
					
					{schedule_block.activities.map((task_data) => ( //maps activties to task data
						
						console.log(""),
						
						<div className="card" id="todo_item">
							<div className="card-body">
								<div className="row row-2" id="task_info">
									<div className="col col-sm-auto" 
										style={(task_data.done===true ? {color: "gray"} : {color: "black"})}
										id="time_task">
										<span>
											{csts(task_data.start_time)}
											-
											{csts(task_data.start_time + task_data.length)}
										</span>
									</div>

									{/* 									
									 <div className="col-sm-auto" 
										id="time_task">
										{"Length[ "+tts(task_data.length)+" ]"}
									</div> */}

									<div className="col col-sm-fill" 
										style={(task_data.done===true ? {color: "gray"} : {color: "black"})}
										id="task_name">
										<span> {task_data.taskName} </span>
									</div>

									<div className="col-sm-auto" 
										id="priority_level">
										<i style={{color: prio_color_scale(task_data.priority, 
											thresh[0], 
											thresh[1])}}
										className="bi bi-star-fill"
										id="high_priority" 
										data-toggle="tooltip"
										data-placement="auto"
										title={"Priority: " + priorityToString(task_data.priority_level)} />
									</div>

									<div className="col-sm-auto" 
										id="task_checkDone">
										<Form.Check aria-label="option 1"
											type="checkbox">
											<Form.Check.Input
												type="checkbox"
												defaultChecked={task_data.done}
												onClick={(e) => 
												{
													handleCheck(e, task_data);
													console.log(task_data._id);
												}}
											/>
										</Form.Check>
									</div>
								</div>
							</div>
						</div>
					))}
				</div >
			))}
		</div >
	);
}

export default ToDoListView;