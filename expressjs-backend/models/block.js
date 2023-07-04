const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema(
	{
		start_time: {
			type: Number,
			required: true,
		},
		end_time: {
			type: Number,
			required: true,
		},
		start_time_flexibility: {
			type: Number,
			default: 0,
		},
		end_time_flexibility: {
			type: Number,
			default: 0,
		},
	},
	{ collection: "Blocks"}
);

const Block = mongoose.model("Block", BlockSchema);

module.exports = Block;