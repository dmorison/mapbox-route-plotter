import React, { useState } from 'react';

import createGpx from 'gps-to-gpx';
import { saveAs } from 'file-saver';

import './SideBar.css';

const SideBar = (props) => {
	const [dragSrcEl, setDragSrcEl] = useState(null);
	const [dragOnEl, setDragOnEl] = useState(null);
	const [over, setOver] = useState(null);

	const routeToGpx = async () => {
		let waypoints = [];

		props.route.forEach((item) => {
			const point = {
				"latitude": item[1],
				"longitude": item[0]
			};
			waypoints.push(point);
		});

		const gpx = await createGpx(waypoints, {
			activityName: "RUN"
		});

		const data = new Blob([gpx], {type: 'text/xml'});
		saveAs(data, "myRoute.gpx");
	};

	const dragStart = (e) => {
		setDragSrcEl(e.target);
		e.dataTransfer.effectAllowed = 'move';
	};

	const dragOver = (e) => {
		e.preventDefault();
		setOver(e.target.id);
		e.dataTransfer.dropEffect = 'move';
		return false;
	};

	const drop = (e) => {
		if (dragSrcEl !== e.target) {
			setDragOnEl(e.target);
		}
		return false;
	}

	const dragLeave = (e) => {
		setOver(null);
	};

	const dragEnd = (e) => {
		setOver(null);

		const a = Number(e.target.id.split('-')[1]);
		const b = Number(dragOnEl.id.split('-')[1]);

		let routeArray = [...props.route];
		const movedItem = routeArray[a];
		routeArray.splice(a, 1);
		routeArray.splice(b, 0, movedItem);

		props.rearrangeRoute(routeArray);
	};

	return (
		<div className="sidebar">
			<div className="sidebar-title">
				<span>
					Route Builder
				</span>
			</div>
			<div className="waypoints-wrapper">
				<ul className="waypoints">
					{props.route.map((item, index) => {
						return (
							<li
								key={index}
								id={`waypoint-${index}`}
								draggable={true}
								onDragStart={dragStart}
								onDragOver={dragOver}
								onDrop={drop}
								onDragLeave={dragLeave}
								onDragEnd={dragEnd}
								className={over === `waypoint-${index}` ? 'over' : ''}
							>
								Waypoint {index + 1}
								<span className="delete-waypoint" onClick={() => props.removePoint(index)}></span>
							</li>
						);
					})}
				</ul>
			</div>
			<button className="download" onClick={routeToGpx}>Download your Route</button>
		</div>
	);
};

export default SideBar;