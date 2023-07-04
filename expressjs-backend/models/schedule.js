const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema(
	{
		Mon: {
			type: Array,
			default: [],
		},
		Tue: {
			type: Array,
			default: [],
		},
		Wed: {
			type: Array,
			default: [],
		},
		Thu: {
			type: Array,
			default: [],
		},
		Fri: {
			type: Array,
			default: [],
		},
		Sat: {
			type: Array,
			default: [],
		},
		Sun: {
			type: Array,
			default: [],
		},
	},
	{ collection: "Schedules" }
);

const Schedule = mongoose.model("Schedule", ScheduleSchema);

module.exports = Schedule;