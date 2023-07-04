/* eslint-disable react/jsx-key  */
import React  from "react";
import Form from "react-bootstrap/Form";


const hrs = ["00","01", "02", "03", "04", "05","06","07","08","09","10",
	"11", "12", "13", "14", "15","16","17","18","19","20","21", "22", "23"];

const mins = ["00", "01", "02", "03", "04", "05","06","07","08","09","10",
	"11", "12", "13", "14", "15","16","17","18","19","20",
	"21", "22", "23", "24", "25","26","27","28","29","30",
	"31", "32", "33", "34", "35","36","37","38","39","40",
	"41", "42", "43", "44", "45","46","47","48","49","50",
	"51", "52", "53", "54", "55","56","57","58","59"];

function HoursOptions(props) 
{
	function checkDuration(newDuration)
	{
		if(props.validated)
		{
			const hrsValidation = document.getElementById("hoursSelect");
			const minsValidation = document.getElementById("minsSelect");

			console.log(newDuration.hrs==="00" && newDuration.mins==="00");

			if(newDuration.hrs!=="00" || newDuration.mins!=="00")
			{
				hrsValidation.setCustomValidity("");
				minsValidation.setCustomValidity("");
			}
			else
			{
				hrsValidation.setCustomValidity(" ");
				minsValidation.setCustomValidity("Estimated working time cannot be 0");	
			}
			hrsValidation.reportValidity();
			minsValidation.reportValidity();
		}
	}

	const handleChangeDurationHrs = event => 
	{
		const newDuration = 
		{
			...props.defaultDuration,
			hrs: event.target.value
		};

		props.setDuration(newDuration);
		props.setShow(false);
		checkDuration(newDuration);
	};
	const handleChangeDurationMins = event => 
	{
		const newDuration = 
		{
			...props.defaultDuration,
			mins: event.target.value,
		};

		props.setDuration(newDuration);
		props.setShow(false);
		checkDuration(newDuration);
	};
    

	return (
		<div className="d-flex flex-row" id="estimatedTimeSelect">
			<div className="p-2">
				<Form.Select 
					value={props.defaultDuration.hrs} 
					id="hoursSelect"
					onChange={handleChangeDurationHrs}
					aria-label="Default select example">
					{hrs.map((hr) => (
						<option key={hr.toString()} value={hr}>{hr}</option>
					))} 
				</Form.Select>
			</div>
			<div className="p-2"> <span>:</span> </div>
			<div className="p-2">
				<Form.Select 
					value={props.defaultDuration.mins} 	
					id="minsSelect"
					onChange={handleChangeDurationMins}
					aria-label="Default select example">
					{mins.map((m,index) => (
						<option key={m.toString()+index} value={m}>{m}</option>
					))} 

				</Form.Select>
			</div>
		</div>

	);
}

export default HoursOptions;
