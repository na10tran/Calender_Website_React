import axios from "axios";
import React, {useState, useEffect}  from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Calendar from "react-calendar";

import HoursOptions from "./hoursoptions";
import HeaderHome from "../homepage/header_home";

function EditTaskPage() 
{
	const navigate = useNavigate();
	const location = useLocation();

	const [curTask, setCurTask] = useState();

	const [dateState, setDateState] = useState(new Date());
	const [taskName, setTaskName] = useState("");
	const [duration, setDuration] = useState({hrs:"00", mins:"00"});
	const [priority, setPriority] = useState("");
	const [done, setDone] = useState(false);

	async function fetchAll()
	{
		try 
		{
			const response = 
				await axios.get("http://localhost:5001/tasks/"+location.state.taskID);
			return response.data;
		}
		catch(error) 
		{
			console.log(error);
			return false;
		}
	}

	useEffect(() => 
	{
		console.log("inside useeffect");
		if(location.state===undefined || location.state===null)
			navigate(-1);

		fetchAll().then(result => 
		{
			if(result)
			{
				setCurTask(result);

				setPriority(result.priority_level);
				setTaskName(result.taskName);
				setDateState(new Date(result.due_date));
				setDone(result.done);

				let curDuration = result.length;
				setDuration({
					hrs: ("0" + String(parseInt(curDuration/60))).slice(-2), 
					mins: ("0" + String(curDuration%60)).slice(-2)
				});
			}
		});
	}, []);

	function updateTask()
	{
		let newTask = curTask;

		newTask.taskName = taskName;
		newTask.due_date = new Date(dateState);
		newTask.priority_level = priority;
		newTask.done = done;

		let intDuration = parseInt(duration.hrs)*60 + parseInt(duration.mins);
		newTask.length = intDuration;
    
		const taskID = location.state.taskID;
		makeUpdateCall(taskID, newTask).then(result => 
		{
			if(result && result.status === 204)
			{
				setCurTask(newTask);
				setIsSuccessfullySubmitted(true);
				setShow(true);
			}
			else 
				setIsSuccessfullySubmitted(false);
		});
	}

	async function makeUpdateCall(id, newTask)
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

	const [validated, setValidated] = useState(false);
	const [isSuccessfullySubmitted,setIsSuccessfullySubmitted] = useState(false);

	const handleSubmit = (event) => 
	{
		const hrsValidation = document.getElementById("hoursSelect");
		const minsValidation = document.getElementById("minsSelect");
		
		const form = event.currentTarget;

		event.preventDefault();

		if(duration.hrs==="00" && duration.mins==="00")
		{

			hrsValidation.setCustomValidity(" ");
			minsValidation.setCustomValidity("Estimated working time cannot be 0");

			setIsSuccessfullySubmitted(false);
		}
		else
		{
			hrsValidation.setCustomValidity("");
			minsValidation.setCustomValidity("");
		}

		if (form.checkValidity() === false) 
		{

			setIsSuccessfullySubmitted(false);
		}
		else
		{
			updateTask();
		}

		hrsValidation.reportValidity();
		minsValidation.reportValidity();
		setValidated(true);
	};
	const [show, setShow] = useState(false);

	return (
		<>
			{location.state!==undefined && location.state!==null &&
				<div className="container-fluid">
					<div className="row">
						<HeaderHome />
					</div>

					<div className="row" id="editTaskPage">

						<div className="d-flex flex-column"
							id="editTask_col">
			
							<div className="p-2" id="editTaskPage_title">Edit Task</div>

							{isSuccessfullySubmitted && show && (
								<Alert variant="success" onClose={() => setShow(false)} dismissible>
									<Alert.Heading>Your task has been updated successfully.</Alert.Heading>
								</Alert>)}
								
							<div className="p-2" id="editTaskPage">
								<Form id="editTaskForm" noValidate validated={validated} onSubmit={handleSubmit}>
									<div className="d-flex flex-row">
										<div className="d-flex flex-column" id="taskEditInfo">
											<div className="p-2">
												<Form.Label htmlFor="inputTaskName">Task Name</Form.Label>
												<Form.Control 
													id="inputTaskName" type="text"
													defaultValue={taskName} 
													placeholder="Task name" required
													onChange={(e) => 
													{
														setTaskName(e.target.value);
														setShow(false);
													}} />
												<Form.Control.Feedback type="invalid" id="taskNameValidation"> 
													Please provide a valid task name. 
												</Form.Control.Feedback>
											</div>

											<div className="p-2" id="estimatedTimeLabel">
												<Form.Label>Estimated Working Time (hh:mm)</Form.Label>
												<HoursOptions 
													defaultDuration={duration}
													setDuration={setDuration} 
													validated={validated}
													show={show}
													setShow={setShow}
												/>
											</div>

											<div className="p-2">
												<Form.Label htmlFor="priorityEdit">Priority Level</Form.Label>
												<Form.Select 
													value={priority} 
													onChange={(e) => 
													{
														setPriority(e.target.value),
														setShow(false);
													}}
													id="priorityEdit" aria-label="Default select example">
													<option value="1">Low</option>
													<option value="2">Normal</option>
													<option value="3">Medium</option>
													<option value="4">High</option>
													<option value="5">Highest</option>
												</Form.Select>
											</div>

											<div className="p-2" 
												id="task_checkDone">
												<Form.Check aria-label="option 1"
													type="checkbox">
													<Form.Check.Input
														type="checkbox" 
														checked={done}
														onClick={e => setDone(e.target.checked)}
													/>
													<span>  This task has been completed.</span>
												</Form.Check>
											</div>
										</div>
											
										<div className="d-flex flex-column" id="editDueDate">
											<Form.Label id="dueDateLabel" as={Row} sm="w-100">Due date</Form.Label> 
											<Calendar 
												id="editDate"
												as={Row}
												defaultValue={dateState}
												value={dateState}
												onChange={(e) => setDateState(new Date(e))}
											/>
										</div>
									</div>
									<div className="d-flex flex-row" id="editSubmitRow">
										<button  
											className="btn btn-secondary"
											id="editSubmitButton"type="submit">Update Task</button>
									</div>
								</Form>
							</div>
						</div>
					</div>
				</div>
			}
		</>
	);
}

export default EditTaskPage;
