import React, { useState } from "react";
//import {Link} from "react-router-dom";

function LoginReg ()
{

	const [login_values, set_login_values] = useState({
		email: "",
		password: ""
	});

	const [reg_values, set_reg_values] = useState({
		name: "",
		email: "",
		password: "",
		confirm_password: ""
	});

	const [login_submitted, set_login_submitted] = useState(false);
	const [login_valid, set_login_valid] = useState(false);
	const [reg_submitted, set_reg_submitted] = useState(false);
	const [reg_valid, set_reg_valid] = useState(false);

	const handle_login_email_change = (event) => 
	{
		set_login_values({...login_values, email: event.target.value});
	};
	
	const handle_login_password_change = (event) => 
	{
		set_login_values({...login_values, password: event.target.value});
	};

	const handle_reg_name_change = (event) => 
	{
		set_reg_values({...reg_values, name: event.target.value});
	};

	const handle_reg_email_change = (event) => 
	{
		set_reg_values({...reg_values, email: event.target.value});
	};

	const handle_reg_password_change = (event) => 
	{
		set_reg_values({...reg_values, password: event.target.value});
	};

	const handle_reg_confirm_change = (event) => 
	{
		set_reg_values({...reg_values, confirm_password: event.target.value});
	};

	const handle_login_submit = (event) =>
	{
		event.preventDefault();
		if (login_values.email && login_values.password)
		{
			set_login_valid(true);
		}
		set_login_submitted(true);
	};

	const handle_reg_submit = (event) =>
	{
		event.preventDefault();
		if (reg_values.name &&
			reg_values.email &&
			reg_values.password &&
			reg_values.confirm_password &&
			(reg_values.password === reg_values.confirm_password))
		{
			set_reg_valid(true);
		}

		set_reg_submitted(true);
	};

	return (
		<>
			<div className="offcanvas offcanvas-end w-30" tabIndex="-1"
				id="offcanvas_login" data-bs-keyboard="false" 
				data-bs-backdrop="true">
				<div className="offcanvas-header">
					<h6 className="offcanvas-title d-none d-sm-block"
						id="offcanvas">
						Login
					</h6>

					<button type="button" className="btn-close text-reset"
						data-bs-dismiss="offcanvas" ria-label="Close"
						id="close_sidebar" />
				</div>

				<div className="offcanvas-body px-2">
					<form onSubmit={handle_login_submit}>
						{login_submitted && login_valid ? 
							<div className="alert alert-success" 
								role={"alert"}>
									Login Success!
							</div> 
							: null}
						<div className="form-group">
							<input
								onChange={handle_login_email_change}
								value={login_values.email}
								type="email"
								placeholder="Email"
								className="form-control input-sm"
								id="input_email"
							/>
							{login_submitted && !login_values.email ? 
								<span>Please enter your email</span> 
								: null}
							<br></br>		
							<input
								onChange={handle_login_password_change}
								value={login_values.password}
								type="password"
								placeholder="Password"
								className="form-control input-sm"
								id="input_password"
							/>
							{login_submitted && !login_values.password ? 
								<span>Please enter your password</span> 
								: null}
							<br></br>
							<button className="btn btn-primary"
								//data-bs-toggle="offcanvas"
								//data-bs-target="#offcanvas_login"
								id="submit_login_button">Login</button>
						</div>
					</form>
				</div>
				<div className="offcanvas-header">
					<h6 className="offcanvas-title d-none d-sm-block"
						id="offcanvas">
						Register
					</h6>
				</div>
				<div className="offcanvas-body px-2">
					<form onSubmit={handle_reg_submit}>
						{reg_submitted && reg_valid ? 
							<div className="alert alert-success" 
								role={"alert"}>
									Registration Success!
							</div> 
							: null}
						<div className="form-group">
							<input
								onChange={handle_reg_name_change}
								value={reg_values.name}
								type="text"
								placeholder="Name"
								className="form-control input-sm"
								id="input_name"
							/>
							{reg_submitted && !reg_values.name ? 
								<span>Please enter your name</span> 
								: null}
							<br></br>
							<input
								onChange={handle_reg_email_change}
								value={reg_values.email}
								type="email"
								placeholder="Email"
								className="form-control input-sm"
								id="input_email"
							/>
							{reg_submitted && !reg_values.email ? 
								<span>Please enter your email</span> 
								: null}
							<br></br>
							<input
								onChange={handle_reg_password_change}
								value={reg_values.password}
								type="password"
								placeholder="Password"
								className="form-control"
								id="input_password"
							/>
							{reg_submitted && !reg_values.password ? 
								<span>Please enter your password</span> 
								: null}
							<br></br>
							<input
								onChange={handle_reg_confirm_change}
								value={reg_values.confirm_password}
								type="password"
								placeholder="Confirm Password"
								className="form-control"
								id="input_confirm_password"
							/>
							{reg_submitted && !reg_values.confirm_password ? 
								<span>
									Please confirm your password
								</span> 
								: null}
							{reg_submitted && 
								!(reg_values.confirm_password === 
									reg_values.password) ? 
								<span>
									Must match password above
								</span> 
								: null}
							<br></br>
							<button className="btn btn-primary"
								//data-bs-toggle="offcanvas"
								//data-bs-target="#offcanvas_login"
								id="submit_login_button">
									Register
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default LoginReg;