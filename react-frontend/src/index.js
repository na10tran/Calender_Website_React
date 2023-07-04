import React from "react";
import ReactDOM from "react-dom";
import {Route, BrowserRouter, Routes} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./homepage/homepage.css";
import "./searchpage/searchpage.css";
import "./inputschedulepage/input_schedule.css";
import "./edittaskpage/edittaskpage.css";

import SearchPage from "./searchpage/searchpage";
import Homepage from "./homepage/homepage"; 
import InputSchedule from "./inputschedulepage/inputSchedule";
import EditTaskPage from "./edittaskpage/edittaskpage";


ReactDOM.render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Homepage/ >}/>
			<Route path="/homepage" element={<Homepage/ >}/>
			<Route path="/search" element={<SearchPage />}/>
			<Route path="/edit-task" element={<EditTaskPage />}/>
			<Route path="/input-schedule" element={<InputSchedule id="62938a5d129b495001006987" />}/>
		</Routes>
	</BrowserRouter>,
	document.getElementById("root")
);	