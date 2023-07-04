import React, {useState, useEffect}  from "react";
import axios from "axios";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
// Import timeGridPlugin from "@fullcalendar/timegrid";

//import "@fullcalendar/daygrid/main.css";
//import "@fullcalendar/timegrid/main.css";

//import events from "./events";

function PrimaryView ()
{	
	var event_data = [];

	const [tasks, setTasks] = useState([]);

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

	
	useEffect(() => 
	{
		fetchTasks().then(result => 
		{
			if(result)
			{
				setTasks(result);
				console.log(result);
			}
		});
	},[]);

	var task_counts = [];
	for(var task_index = 0; task_index < tasks.length; task_index++)
	{
		if(tasks[task_index])
		{
			var task_date_raw = tasks[task_index].due_date;
			var task_date = task_date_raw.slice(0, 10);//"2022-05-31";
			if (!(task_date in task_counts))
			{
				task_counts[task_date] = 0;
			}
			task_counts[task_date] = task_counts[task_date] + 1;
		}
	}

	for (const [task_date, task_count] of Object.entries(task_counts)) 
	{
		event_data.push({
			title: task_count + " Tasks",
			date: task_date
		});
	}

	return (
		<div className="d-flex align-content-sm-stretch flex-sm-column"
			id="primary_view">
			<div className="p-2" id="calendar_title">
				<span className="calendar_title">Calendar</span>
			</div>

			<div className="p-2" id="calendar">
				<FullCalendar
					defaultView="dayGridMonth"
					height="60vh"
					/*
					 * ThemeSystem="Simplex"
					 * header={{
					 *   left: "prev,next",
					 *   center: "title",
					 *   right: "dayGridMonth,timeGridWeek,timeGridDay",
					 * }}
					 */
					dayMaxEvents
					plugins={[dayGridPlugin]}
					events={event_data}
					displayEventEnd="true"
					eventColor=
						{"#404040"}
					handleWindowResize="true"
					aspectRatio="4"
					
				/>
			</div>
		</div>
	);
}

export default PrimaryView;
