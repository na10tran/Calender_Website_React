import React from "react";
import {Link} from "react-router-dom";

function Sidebar ()
{

	return (
		<>
			<div className="offcanvas offcanvas-end" tabIndex="-1"
				id="offcanvas" data-bs-keyboard="false" 
				data-bs-backdrop="true">
				<div className="offcanvas-header">
					<h6 className="offcanvas-title d-none d-sm-block"
						id="offcanvas">
						Menu
					</h6>

					<button type="button" className="btn-close text-reset"
						data-bs-dismiss="offcanvas" ria-label="Close"
						id="close_sidebar" />
				</div>

				<div className="offcanvas-body px-0">
					<ul className="nav nav-pills flex-column 
						mb-sm-auto mb-0 align-items-start" id="menu">
						<li>
							<Link to="/homepage" className="nav-link text-truncate">
								<i className="bi bi-speedometer2" />
								<span className="ms-1 d-none d-sm-inline">
									Dashboard
								</span>
							</Link>
						</li>

						<li>
							<a href="/input-schedule" 
								className="nav-link text-truncate">
								<i className="bi bi-bell" />
								<span className="ms-1 d-none d-sm-inline">
									Update Availability
								</span>
							</a>
						</li>

						<li>
							<Link to="/search" 
								className="nav-link text-truncate">
								<i className="bi bi-binoculars" />
								<span className="ms-1 d-none d-sm-inline">
									Lookup a Task
								</span>
							</Link>
						</li>

						<li>
							<Link to="#" className="nav-link text-truncate">
								<i className="bi bi-gear" />

								<span className="ms-1 d-none d-sm-inline">
									Account Setting
								</span>
							</Link>
						</li>

						<li>
							<Link to="#" className="nav-link text-truncate">
								<i className="bi bi-box-arrow-left" />

								<span className="ms-1 d-none d-sm-inline">
									Logout
								</span>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</>
	);

}

export default Sidebar;
