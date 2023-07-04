import axios from "axios";
import React, {useState, useEffect} from "react";
import Form from "./TimeSlotForm";

function WeeklyAvailability (props)
{
	const [slots, setTimeSlots] = useState({Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [],});
	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	async function removeTimeSlot (dayIndex, index) 
	{
		let updated = JSON.parse(JSON.stringify(slots));
		let id = updated[days[dayIndex]][index]._id;
		updated[days[dayIndex]] = updated[days[dayIndex]].filter((slot, i) => 
		{
			return i !== index;
		});
		setTimeSlots(updated);
		try 
		{
			let response = await axios.delete("http://localhost:5001/user/"
				+ props.id + "/schedule/" + dayIndex + "/" + id);
			if (!(response && response.status === 204))
				console.log(
					"Could not delete time slot for user with id '" +
				props.id + "' in backend.");
		}
		catch (error)
		{
			console.log(error);
		}
	}

	function sortTimeSlots(slots, index)
	{
		let st = (index === -1)?0:index;
		let end = (index === -1)?7:index + 1;
		for (let i = st; i < end; i++)
			slots[days[i]].sort((a, b) => a.start_time - b.start_time);
	}

	function noOverlap(dayIndex, slot) 
	{
		const checkSlots = JSON.parse(JSON.stringify(slots));
		let m = checkSlots[days[dayIndex]].length;
		for (let i = 0; i < m; i++) 
		{
			if (checkSlots[days[dayIndex]][i].start_time <= slot.start_time
				&& checkSlots[days[dayIndex]][i].end_time > slot.start_time
				|| checkSlots[days[dayIndex]][i].start_time < slot.end_time
				&& checkSlots[days[dayIndex]][i].end_time >= slot.end_time)
				return false;
		}
		return true;
	}

	function updateList(dayIndex, slot)
	{
		const start_time = parseInt(slot.start_time.substring(0, slot.start_time.indexOf(":"))) * 60
							+ parseInt(slot.start_time.substring(slot.start_time.indexOf(":") + 1));
		const end_time = parseInt(slot.end_time.substring(0, slot.end_time.indexOf(":"))) * 60
							+ parseInt(slot.end_time.substring(slot.end_time.indexOf(":") + 1));
		let dbSlot = {
			start_time: start_time,
			end_time: end_time,
			start_time_flexibility: slot.start_time_flexibility,
			end_time_flexibility: slot.end_time_flexibility
		};

		if (noOverlap(dayIndex, dbSlot))
		{
			postSlot(dayIndex, dbSlot).then(result => 
			{
				if (result && result.status === 201) 
				{
					const updated = JSON.parse(JSON.stringify(slots));
					dbSlot.id = result.data.savedSlot._id;
					updated[days[dayIndex]].push(dbSlot);
					sortTimeSlots(updated, dayIndex);
					setTimeSlots(updated);
				}
			});
		}
	}

	async function fetchSchedule() 
	{
		try 
		{
			const response = await axios.get("http://localhost:5001/user/"
				+ props.id + "/schedule");
			return response.data.schedule;     
		}
		catch (error)
		{
			console.log(error); 
			return false;         
		}
	}
	
	async function postSlot(dayIndex, slot)
	{
		try 
		{
			const response = await axios.post("http://localhost:5001/user/"
				+ props.id + "/schedule/" + dayIndex, slot);
			return response;
		}
		catch (error)
		{
			console.log(error);
			return false;
		}
	}

	useEffect(() => 
	{
		fetchSchedule().then(result => 
		{
			if (result) 
			{
				sortTimeSlots(result, -1);
				setTimeSlots(result);
			}
		});
	}, []);

	function timeNumToString(start_time, end_time)
	{
		let tH = Math.trunc(start_time / 60).toString();
		tH = (tH.length === 1)?"0"+tH:tH;
		let tM = (start_time % 60).toString();
		tM = (tM.length === 1)?"0"+tM:tM;
		let stTime = tH + ":" + tM;
		tH = Math.trunc(end_time / 60).toString();
		tH = (tH.length === 1)?"0"+tH:tH;
		tM = (end_time % 60).toString();
		tM = (tM.length === 1)?"0"+tM:tM;
		let enTime = tH + ":" + tM;
		return [stTime, enTime];
	}

	function SlotList(props) 
	{
		const rows = props.timeSlots.map((row, index) => 
		{
			let [start_time, end_time] = timeNumToString(row.start_time, row.end_time);
			return (
				<tr key={index}>
					<td>{start_time}</td>
					<td>&nbsp;-&nbsp;</td>
					<td>{end_time}&nbsp;&nbsp;</td>
					<td>
						<button 
							onClick={() => 
								props.removeTimeSlot(props.dayIndex, index)}>
							Delete
						</button>
					</td>
				</tr>
			);
		});
		return (
			<tr>
				{rows}
			</tr>
		);
	}

	return (
		<div className="d-flex align-content-sm-stretch flex-sm-column"
			id="primary_view">
			<div className="p-1" id="input_schedule_prompt">
				<span className="input_schedule_prompt">
					Your Weekly Availability
				</span>
			</div>

			<div className="row" id="input_schedule_titles">
				<div className="col-1" id="input_day_view">
					<div className="p-3" id="day_title">
						<span className="day_title">Monday</span>
					</div>
				</div>
				<div className="col-1" id="input_day_view">
					<div className="p-3" id="day_title">
						<span className="day_title">Tuesday</span>
					</div>
				</div>
				<div className="col-1" id="input_day_view">
					<div className="p-3" id="day_title">
						<span className="day_title">Wednesday</span>
					</div>
				</div>
				<div className="col-1" id="input_day_view">
					<div className="p-3" id="day_title">
						<span className="day_title">Thursday</span>
					</div>
				</div>
				<div className="col-1" id="input_day_view">
					<div className="p-3" id="day_title">
						<span className="day_title">Friday</span>
					</div>
				</div>
				<div className="col-1" id="input_day_view">
					<div className="p-3" id="day_title">
						<span className="day_title">Saturday</span>
					</div>
				</div>
				<div className="col-1" id="input_day_view">
					<div className="p-3" id="day_title">
						<span className="day_title">Sunday</span>
					</div>
				</div>
			</div>

			<div className="row" id="input_schedule_blocks">
				<div className="col-1" id="input_day_view">
					<SlotList timeSlots={slots.Mon} 
						removeTimeSlot={removeTimeSlot} dayIndex={0} />
				</div>
				<div className="col-1" id="input_day_view">
					<SlotList timeSlots={slots.Tue} 
						removeTimeSlot={removeTimeSlot} dayIndex={1} />
				</div>
				<div className="col-1" id="input_day_view">
					<SlotList timeSlots={slots.Wed} 
						removeTimeSlot={removeTimeSlot} dayIndex={2} />
				</div>
				<div className="col-1" id="input_day_view">
					<SlotList timeSlots={slots.Thu} 
						removeTimeSlot={removeTimeSlot} dayIndex={3} />
				</div>
				<div className="col-1" id="input_day_view">
					<SlotList timeSlots={slots.Fri} 
						removeTimeSlot={removeTimeSlot} dayIndex={4} />
				</div>
				<div className="col-1" id="input_day_view">
					<SlotList timeSlots={slots.Sat} 
						removeTimeSlot={removeTimeSlot} dayIndex={5} />
				</div>
				<div className="col-1" id="input_day_view">
					<SlotList timeSlots={slots.Sun} 
						removeTimeSlot={removeTimeSlot} dayIndex={6} />
				</div>
			</div>

			<div className="row" id="input_schedule">
				<div className="col-1" id="input_day_view">
					<Form handleSubmit={updateList} dayIndex={0} />
				</div>
				<div className="col-1" id="input_day_view">
					<Form handleSubmit={updateList} dayIndex={1} />
				</div>
				<div className="col-1" id="input_day_view">
					<Form handleSubmit={updateList} dayIndex={2} />
				</div>
				<div className="col-1" id="input_day_view">
					<Form handleSubmit={updateList} dayIndex={3} />
				</div>
				<div className="col-1" id="input_day_view">
					<Form handleSubmit={updateList} dayIndex={4} />
				</div>
				<div className="col-1" id="input_day_view">
					<Form handleSubmit={updateList} dayIndex={5} />
				</div>
				<div className="col-1" id="input_day_view">
					<Form handleSubmit={updateList} dayIndex={6} />
				</div>
			</div>
		</div>
	);

}

export default WeeklyAvailability;
