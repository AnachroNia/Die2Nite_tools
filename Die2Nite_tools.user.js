/*global $,modules */

// ==UserScript==
// @name        Die2Nite tools
// @version     1.0.13
// @author      Isaac - isaaclw@gmail.com
// @namespace   isaaclw-die2nite-from-rulesy
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// @grant       GM_info
// @include     http://www.die2nite.com/*
// @description:en updater thingie
// @require     https://raw.githubusercontent.com/isaaclw/Die2Nite_tools/master/libs/jquery.min.js
// @require     https://raw.githubusercontent.com/isaaclw/Die2Nite_tools/master/libs/jquery-ui.min.js
// @require     https://raw.githubusercontent.com/isaaclw/Die2Nite_tools/master/libs/Farbtastic.js
// @require     https://raw.githubusercontent.com/isaaclw/Die2Nite_tools/master/apps/appjs.js
// @require     https://raw.githubusercontent.com/isaaclw/Die2Nite_tools/master/apps/updateApps.js
// @require     https://raw.githubusercontent.com/isaaclw/Die2Nite_tools/master/apps/scavengerCountdown.js
// @require     https://raw.githubusercontent.com/isaaclw/Die2Nite_tools/master/apps/flashingEscortButton.js
// @require     https://raw.githubusercontent.com/isaaclw/Die2Nite_tools/master/apps/ghoulHungerPercentages.js
// @require     https://raw.githubusercontent.com/isaaclw/Die2Nite_tools/master/apps/mod_devtools.js
// @resource    style.css https://raw.githubusercontent.com/isaaclw/Die2Nite_tools/master/style.css
// @description updater thingie

// ==/UserScript==

// @todo		names alone are not enough to identify some items. need to use images as well
// @todo		add a reset button to the flashing escort button config page
// @todo		stop dtd updating when camped, because topology is unavailable but required
delete modules.updateApps.externalApps.cartographer;
delete modules.updateApps.externalApps.mapviewer;

var debugMode = true;

if (!debugMode) {
	delete modules.devtools;
}

window.log = function(data) {
	if (debugMode && this.console) {
		console.log(data);
	}
};

// basic jquery mutation observer extension, fuck IE for now
$.fn.domChange = function(callback) {
	var mutations;
	var mutationObserver
	var selector;
	app.mutationObservers = app.mutationObservers || {};
	selector = this.selector;

	// kill any existing observers for this selector
	if (app.mutationObservers[selector]) {
		app.mutationObservers[selector].disconnect();
	}
	mutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

	app.mutationObservers[selector] = new mutationObserver(function() {
		// run once, might need to make this a variable later...
		this.disconnect();

		callback();
	});

	mutations = {
		attributes: true,
		characterData: true,
		childList: true
	}

	this.each(function() {
		app.mutationObservers[selector].observe(this, mutations);
	});

}

// bootstrap
window.setInterval(function() {
	if ($('#appsettings').length == 0 && window.location.hash != '') {
		app.settings.init();
		app.init();
	}
}, 1000);
