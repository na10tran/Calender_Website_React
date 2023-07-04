import React from "react";
import Form from "react-bootstrap/Form";
import {Link} from "react-router-dom";


function TasksDisplayBody(props) 
{
	function translatePriority(priorityNum)
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

	const tasks_list = (props.tasksData.map(row => 
	{
		const dueDate = new Date(row.due_date);
			
		let tmp = dueDate.toDateString();
		let n = tmp.length;
		row.dueDate = tmp.substring(4,n-4) + ", "+ dueDate.getFullYear().toString().slice(-2);
		
		const curDuration = row.length;
		row.duration = {
			hrs: ("0" + String(parseInt(curDuration/60))).slice(-2), 
			mins: ("0" + String(curDuration%60)).slice(-2)
		};

		row.priority_translated = translatePriority(row.priority_level);

		return row;
	}));

	function handleCheck(e, row)
	{
		if(e.target.checked !== row.done)
			props.updateTask(row._id, e.target.checked);
	}

	const rows = tasks_list.map((row, index) => 
	{
		return (
			<div className="d-flex flex-sm-row justify-content-around" 
				key={index}>
				<div className="p-2 w-100"  id="display_todo_item">
					<div className="card" id="todo_item1">
						<div className="card-body">
							<div className="row row-2" id="task_info">
								<div className="col-sm-auto" id="time_task"
									style={(row.done===true ? {color: "grey"} : {color: "black"})}>
									<span>Date: <br/> {row.dueDate} </span>
								</div>

								<div className="col-sm-auto" id="time_task"
									style={(row.done===true ? {color: "gray"} : {color: "black"})}>
									<span>Estimated time: <br/> {row.duration.hrs} : {row.duration.mins}</span>
								</div>

								<div className="col col-sm-fill" id="task_name"
									style={(row.done===true ? {color: "grey"} : {color: "black"})}>
									<span>{row.taskName}</span>

								</div>

								<div className="col-sm-auto" 
									id="priority_level">
									<i  className="bi bi-star-fill"
										id={row.priority_translated+"_priority"}
										data-toggle="tooltip" 
										data-placement="auto"
										title={"Priority: " + 
											row.priority_translated}
									/>
								</div>

								<div className="col-sm-auto" 
									id="task_checkDone">
									<Form.Check aria-label="option 1"
										type="checkbox">
										<Form.Check.Input
											type="checkbox" 
											defaultChecked={row.done}
											onClick={(e) => handleCheck(e, row)}
										/>
									</Form.Check>
								</div>
							</div>
						</div>
					</div>

				</div>

				<div className="p-2"
					id="button_sp">
					<Link to="/edit-task" state={{ taskID: row._id }}>

						<button type="button" 
							className="btn btn-secondary"
							id="edit_task"
						//onClick={()}
						>
							Edit
						</button>
					</Link>
				</div>
				<div className="p-2"
					id="button_sp">
					<button 
						type="button" 
						className="btn btn-secondary"
						id="del_task"
						onClick={() => props.removeTask(row._id)}>
							Delete
					</button>
				</div>
			</div>
		);
	}
	);
	return (
		<div className="d-flex flex-sm-column justify-content-around"
			id="tasksList">
			{rows}
		</div>
	);
}

function TasksDisplay(props) 
{
	return (
		<>
			<TasksDisplayBody tasksData={props.tasksData} 
				removeTask={props.removeTask} updateTask={props.updateTask} />  
		</>
	);  
}

export default TasksDisplay;