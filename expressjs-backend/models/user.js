const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		schedule: {
			type: Object,
			default: null
		},
		tasks_list: {
			type: Array,
			default: [],
		},
	},
	{ collection: "users_list" }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
