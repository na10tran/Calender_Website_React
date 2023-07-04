import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import image from "../homepage/default_avatar.jpeg";
import Sidebar from "./Sidebar";
import LoginReg from "./LoginReg";

function HeaderHome ()
{
	return (
		<>
			<div className="header_home">
				<div>
					<h1 className="header_title">Dialed In</h1>
				</div>
				<div className="user_info">
					<div className="avatar_col">
						<img className="user_avatar" 
							src={image} alt="user avatar"/>
					</div>

					<div className="login_user_name">
						<button className="btn btn-outline-dark"
							data-bs-toggle="offcanvas" 
							data-bs-target="#offcanvas_login"
							id="login_button">Log In</button>
					</div>

					<div className="menu_button_col">
						<button className="btn btn-outline-success"
							data-bs-toggle="offcanvas" 
							data-bs-target="#offcanvas"
							id="menu_button" />
					</div>

				</div>
			</div>
			<Sidebar />
			<LoginReg />
		</>
	);

}

export default HeaderHome;
