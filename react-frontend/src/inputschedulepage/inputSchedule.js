import HeaderHome from "../homepage/header_home";
import React from "react";
import WeeklyAvailability from "./WeeklyAvailability";

function InputSchedule (props)
{
	return (
		<div className="container-fluid">
			<div className="row">
				<HeaderHome />
			</div>

			<div className="row" id="primary_view">
				<div className="col-7" id="input_schedule_view">
					<WeeklyAvailability id={props.id}/>
				</div>
			</div>

			<button type="button" 
				className="btn btn-secondary btn-lg" id="add_task">
				+
			</button>
		</div>
	);

}

export default InputSchedule;