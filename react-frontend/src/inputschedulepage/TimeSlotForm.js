import React, {useState} from "react";
import TimePicker from "react-time-picker";

function Form(props)
{
	const [time, setTime] = useState(
		{
			start_time: "0:00",
			end_time: "1:00",
			start_time_flexibility: 0,
			end_time_flexibility: 0
		}
	);

	function setStartTime(sTime)
	{
		setTime(
			{
				start_time: sTime,
				end_time: time["end_time"],
				start_time_flexibility: time["start_time_flexibility"],
				end_time_flexibility: time["end_time_flexibility"]
			}
		);
	}

	function setEndTime(eTime)
	{
		setTime(
			{
				start_time: time["start_time"],
				end_time: eTime,
				start_time_flexibility: time["start_time_flexibility"],
				end_time_flexibility: time["end_time_flexibility"]
			}
		);
	}

	function setStartTimeFlex(sFlex)
	{
		const flex = parseInt(sFlex.nativeEvent.data);
		setTime(
			{
				start_time: time["start_time"],
				end_time: time["end_time"],
				start_time_flexibility: flex,
				end_time_flexibility: time["end_time_flexibility"]
			}
		);
	}

	function setEndTimeFlex(eFlex)
	{
		const flex = parseInt(eFlex.nativeEvent.data);
		setTime(
			{
				start_time: time["start_time"],
				end_time: time["end_time"],
				start_time_flexibility: time["start_time_flexibility"],
				end_time_flexibility: flex
			}
		);
	}

	function submitForm()
	{
		if (isNaN(time.start_time_flexibility) || isNaN(time.end_time_flexibility)) 
		{
			console.log("Error - Flexibility should be a number. Please try again.");
		}
		else if (parseInt(time.start_time.substring(0, time.start_time.indexOf(":"))) >
				parseInt(time.end_time.substring(0, time.end_time.indexOf(":"))))
		{
			console.log("Error - Start time is chronologically after end time. Please try again.");
		}
		else if (parseInt(time.start_time.substring(0, time.start_time.indexOf(":"))) ===
				parseInt(time.end_time.substring(0, time.end_time.indexOf(":")))
				&& (parseInt(time.start_time.substring(time.start_time.indexOf(":") + 1))) >=
				parseInt(time.end_time.substring(time.end_time.indexOf(":") + 1)))
		{
			console.log("Error - Start time is chronologically at or after end time. Please try again.");
		}
		else
			props.handleSubmit(props.dayIndex, time);
		setTime({start_time: "0:00", end_time: "1:00", start_time_flexibility: 0, end_time_flexibility: 0});
	}

	return (
		<form>
			<label htmlFor="startTimeHr">Start Time</label>
			<div>
				<TimePicker onChange={setStartTime} value={time.start_time} />
			</div>
			<label htmlFor="startTimeFlex">Flexibility&nbsp;&nbsp;</label>
			<input
				type="number"
				className="time_bound"
				name="startTimeFlexibility"
				value={time.start_time_flexibility}
				onChange={setStartTimeFlex} />
			<br />
			<label htmlFor="endTimeHr">End Time</label>
			<div>
				<TimePicker onChange={setEndTime} value={time.end_time} />
			</div>
			<label htmlFor="endTimeFlex">Flexibility&nbsp;&nbsp;</label>
			<input
				type="number"
				className="time_bound"
				name="endTimeFlexibility"
				value={time.end_time_flexibility}
				onChange={setEndTimeFlex} />
			<br />
			<input type="button" value="Submit" onClick={submitForm} />
		</form>
	);
}

export default Form;