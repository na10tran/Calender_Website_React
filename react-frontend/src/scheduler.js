//TEST DATA

export var debug_schedule_blocks = 
[
	{
		start_time: 0,
		end_time: 1,
		
		start_time_flexibility: 1,
		end_time_flexibility: 1,
	},
	{
		start_time: 3,
		end_time: 5,
		
		start_time_flexibility: 1,
		end_time_flexibility: 1,
	},
	{
		start_time: 6,
		end_time: 12,
		
		start_time_flexibility: 1,
		end_time_flexibility: 1,
	},
	{
		start_time: 15,
		end_time: 20,
		
		start_time_flexibility: 1,
		end_time_flexibility: 1,
	}	
];

export var debug_tasks = 
[
	{
		length: 1,
		priority: 5,
	},
	{
		length: 3,
		priority: 2,
	},	
	{
		length: 5,
		priority: 4,
	},	
	{
		length: 3,
		priority: 1,
	},	
	{
		length: 2,
		priority: 2,
	},	
	{
		length: 1,
		priority: 1,
	},
];

//

function activity_sort(a, b)
{
	if (a.priority == b.priority)
	{
		//longer tasks = more important (for now?)
		return a.length > b.length;
	}
	else
	{
		return a.priority > b.priority;
	}
}

function schedule_sort(a, b)
{
	return a.start_time > b.start_time;
}

// const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export function solve_schedule(task_array, schedule_blocks)
{
	//Make sure schedule blocks are in order so during display phase
	//we dont have to worry about this, just display in the current order.
	//Also sort activities based on priority/length so that tasts with the
	//highest "important" score get placed first
	if (!task_array || !schedule_blocks || schedule_blocks.length == 0 || task_array.length == 0)
		return [];

	schedule_blocks.sort(schedule_sort);
	task_array.sort(activity_sort);

	//create schedule shell
	var final_schedule_data = [];
	for (let block_index = 0; 
		block_index < schedule_blocks.length; 
		block_index++)
	{
		var current_block = schedule_blocks[block_index];
		var new_schedule_data = 
		{
			activities: [],
			block_data: current_block,
			remaining_time: current_block.end_time - current_block.start_time,
		};
		final_schedule_data.push(new_schedule_data);
	} 

	//fit activities into schedule
	for (let task_index = 0; 
		task_index < task_array.length; 
		task_index++)
	{
		var task_data = task_array[task_index];

		//find best schedule block for activity
		var best_index = -1;
		for (let block_index = 0; 
			block_index < final_schedule_data.length; 
			block_index++)
		{
			var block_data = final_schedule_data[block_index];
			if (block_data.remaining_time >= task_data.length)
			{
				if (best_index == -1 || 
					final_schedule_data[best_index].remaining_time 
					< block_data.remaining_time) 
				{
					best_index = block_index;
				}
			} 
		}
		
		if (best_index == -1)
		{
			//if we dont not have enough space find the best block to extend
			//so we have just enough space.
			
			var best_score = -1;
			var best_block = -1;
			var best_direction = -1;
			var best_extend = -1;
			// var best_before_time = -1;
			// var best_after_time = -1;

			for (let block_index = 0; 
				block_index < final_schedule_data.length; 
				block_index++)
			{
				var block = final_schedule_data[block_index];
				var extend_targ = task_data.length - block.remaining_time;

				var cs = block.block_data.start_time;
				var ce = block.block_data.end_time;
				var ns = block_index < final_schedule_data.length - 1 
					? final_schedule_data[block_index + 1].block_data.start_time
					: 24 * 60;

				var le = block_index > 0 
					? final_schedule_data[block_index - 1].block_data.end_time 
					: 0;
				
				var before_time = cs - le;
				var after_time = ns - ce;

				var a = -1, b = -1, c = -1;
				if (after_time >= extend_targ)
				{
					a = block.block_data.end_time_flexibility;
				}
				
				if (before_time >= extend_targ)
				{
					b = block.block_data.start_time_flexibility;
				}

				// if (before_time + after_time >= extend_targ)
				// {
				// 	c = Math.max(block.block_data.start_time_flexibility, 
				// 		block.block_data.end_time_flexibility);
				// }

				if(a > b)
				{
					if(a > c)
					{
						if (a > best_score)
						{
							best_score = a;
							best_block = block_index;
							best_direction = 0;
							best_extend = extend_targ;
							// best_after_time = after_time;
							// best_before_time = before_time;
						}
					}
					else
					{
						if (c > best_score)
						{
							best_score = c;
							best_block = block_index;
							best_direction = 2;
							best_extend = extend_targ;
							// best_after_time = after_time;
							// best_before_time = before_time;
						}
					}
				}
				else
				{
					if(b > c)
					{
						if (b > best_score)
						{
							best_score = b;
							best_block = block_index;
							best_direction = 1;
							best_extend = extend_targ;
							// best_after_time = after_time;
							// best_before_time = before_time;
						}
					}
					else
					{
						if (c > best_score)
						{
							best_score = c;
							best_block = block_index;
							best_direction = 2;
							best_extend = extend_targ;
							// best_after_time = after_time;
							// best_before_time = before_time;
						}
					}
				}
			}

			if(best_block == -1)
			{
				//AFAIK this can only happen if there is not enough space to 
				//add the current task throughout the entire schedule, one fix
				//for this would be to allow for segmentation of tasks, but im 
				//not sure if this would actually be a good idea.
				console.log("something is wrong");
			}
			else
			{
				best_index = best_block;
				var bblock = final_schedule_data[best_block];
				switch(best_direction)
				{
				case 0:
				{
					bblock.block_data.end_time += best_extend;
					bblock.remaining_time += best_extend;
					break;	
				}
					
				case 1:
				{
					bblock.block_data.start_tine -= best_extend;
					bblock.remaining_time += best_extend;
					break;	
				}
					
				case 2:
				{
					//TODO:
					//think of a better way to do this section
					/*
					if(bblock.block_data.start_time_flexibility 
						> bblock.block_data.end_time_flexibility)
					{
						var extend_amount = clamp(best_after_time, 
							0, 
							best_extend);

						bblock.block_data.start_time -= extend_amount;
						bblock.block_data.end_time += best_extend 
													- extend_amount;
					}
					else
					{
						var extend_amount = clamp(best_before_time, 
							0, 
							best_extend);

						bblock.block_data.start_time -= best_extend 
														- extend_amount;
						bblock.block_data.end_time += extend_amount;
					}
					*/
					break;	
				}
				}
			}
		}
		
		var final_block = final_schedule_data[best_index];
		task_data.start_time = final_block.block_data.start_time + 
			((final_block.block_data.end_time - final_block.block_data.start_time) 
			- final_block.remaining_time);
		// console.log(task_data.start_time);
		var t_r = final_block.remaining_time - task_data.length;
		final_block.remaining_time = t_r;
		final_block.activities.push(task_data);
	}

	for (let block_index = final_schedule_data.length - 1; 
		block_index >= 0; 
		block_index--)
	{
		var debug_block = final_schedule_data[block_index];
		if (debug_block.activities.length == 0)
		{
			final_schedule_data.splice(block_index, 1);
		}
		// console.log(debug_block);
	}

	// final_schedule_data.sort(schedule_sort);	

	return final_schedule_data;
}

// solve_schedule(debug_tasks, schedule_times);

//node .\react-frontend\src\scheduler.js