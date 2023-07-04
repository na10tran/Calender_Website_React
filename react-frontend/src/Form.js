import React from "react";
//import DatePicker from "react-datepicker";
//import TimePicker from "react-time-picker";
//import "react-datepicker/dist/react-datepicker.css";
//import "bootstrap/dist/css/bootstrap.min.css";
function Form (props)
{
	//creates a task 
	const [task, settask] = React.useState(
		{
			taskName: "",
			length:0,
			due_date: new Date(Date.now),
			priority_level:""
		}
	);

	const [date, setDate] = React.useState(Date.now());

	function handleChange(event)
	{
		const{name, value} = event.target;
		if(name === "taskName")
			settask(
				{ taskName:value,length:task["length"], due_date: task["due_date"], location:task["location"]}
			);
		else if(name === "due_date")
		{
			setDate(new Date(value));
			settask(
				{taskName:task["taskName"],length:task["length"],due_date: new Date(value), location:task["location"]}
			);
		}
		else if(name === "priority_level")
			settask(
				{taskName:task["taskName"] , length:task["length"] ,
					due_date: task["due_date"],priority_level :value}
			);
		else
			settask(
				{taskName:task["taskName"] , length:value, 
					due_date: task["due_date"],priority_level :task["priority_level"]}
			);
	}

	function submitForm()
	{
		let newTask = {...task,};
		var parseDate = Date.parse(task.due_date);

		if (isNaN(parseDate) === true)
		{
			newTask.due_date = date;
		}

		props.handleSubmit(newTask);
		settask({taskName: "",length:0 , due_date:new Date(Date.now), priority_level:""});
	}

	return (props.trigger) ? (
		<div className="form"  id="offform" >
			<form>
				<label className = "labels" id = "taskNameLabel" 
					htmlFor="taskName">Task Name</label>
				<input
					type="text"
					name="taskName"
					id="taskName"
					value={task.taskName}
					onChange={handleChange} />
				
				<label className = "labels" id = "dateLabel "
					htmlFor="Length">Length</label>
				<input 
					type="text"
					name="length"
					id="length"
					value={task.length}
					onChange={handleChange} />

				
				<label className = "labels" htmlFor="due_date">Due Date</label>
				<input 
					type= "date"
					name="due_date"
					id="due_date"
					value={task.date}
					onChange={handleChange} /> 
				<label className = "labels" htmlFor="priority level">Priority Level</label>
				<input 
					type= "text"
					name="priority_level"
					id="priority_level"
					value={task.priority_level}
					onChange={handleChange} />
				<input id ="submitButton" type="button"
					value="Submit"onClick={submitForm}/>    
			</form>
			<button id="closeButton" onClick = {() => 
				props.setTrigger(false)} > 
			Close Popup </button> 
		</div>
	) : "";
}
export default Form;