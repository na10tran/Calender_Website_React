const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
	{
		taskName: {
			type: String,
			required: true,
			trim: true,
		},
		length: {
			type: Number, 
			required: true,
			default: 15
		},
		due_date: {
			type: Date,
			default: new Date(Date.now),
		},
		priority_level: {
			type: String,
			trim: true,
			default: "normal",
		},

		done: {
			type: Boolean,
			default: false
		}

	},
	{ collection: "Tasks" }
);

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;