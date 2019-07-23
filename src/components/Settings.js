import React from "react";
import { HashRouter as Router, Route, Redirect, NavLink } from "react-router-dom";
import { Grid, Menu } from "semantic-ui-react";
import $ from "jquery";
import Parser from "changelog-parser";

import SettingsSchema from "../constants/SettingsSchema";

import Screen from "./Settings/Screen";
import About from "./Settings/About";

import "./../styles/components/settings/settings-dark.less";

class Settings extends React.Component {
	componentWillMount() {
		$.get(process.env.REACT_APP_ROUTER_BASE + "/logs/CHANGELOG.md")
			.done((data) => {
				Parser({
					text : data
				})
				.then((result) => {
					console.log(result);
				});
			});
	}

	render() {
		let base_url  = this.props.match.url;
		let nav_links = [];
		let routes    = [];

		for (let section of SettingsSchema.sections) {
			let path = `${base_url}/${section.path}`;

			nav_links.push(
				<NavLink to={path} className="item" key={section.path}>{section.title}</NavLink>
			);

			routes.push(
				<Route path={path} key={path} render={() => <Screen sections={section.sections}/>}/>
			);
		}

		return (
			<React.Fragment>
				<Router>
					<Grid celled id="settings-container">
						<Grid.Row>
							<Grid.Column width={3} id="settings-sidebar">
								<Menu vertical id="settings-menu">
									{nav_links}
									<NavLink to={base_url + "/about"} className="item">About</NavLink>
								</Menu>
							</Grid.Column>
							<Grid.Column width={13} id="settings-screen">
								<Route exact path={base_url} render={() => (
									<Redirect to={base_url + "/about"}/>
								)}/>
								{routes}
								<Route path={base_url + "/about"} component={About}/>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Router>
			</React.Fragment>
		);
	}
}

export default Settings;