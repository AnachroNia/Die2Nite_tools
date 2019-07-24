var modules = modules || {};

modules.scavengerCountdown = {

	name: 'Scavenger Countdown',

	description: 'Shows the time your next auto search will finish.',

	icon: '/gfx/icons/small_gather.gif',

	pages: 'outside',

	init: function() {
         function dateformat(time, hourtype, showampm) {
             var hours = time.getHours(),
                 minutes = time.getMinutes(),
                 ampm = '';

             if (hourtype == '12') {
                 if (showampm == 'true') {
                     ampm = ' AM';
                     if (hours > 12) {
                         hours = hours - 12;
                         ampm = ' PM';
                     }
                 } else {
                     if (hours > 12) {
                         hours = hours - 12;
                     }
                 }
             }
             if (minutes < 10) {
                 minutes = '0' + minutes;
             }
             return hours + ':' + minutes + ampm;
         }

		if ($('#gcount').length != 0 && $('#gcount span').length == 0 && !$('#gcount').html().match(/-/)) {

			var time = new Date();

			if (!modules.scavengerCountdown.serverTimeOffset) {
				modules.scavengerCountdown.serverTimeOffset = (unsafeWindow.js.ServerTime.currentTime / 1000) - (time / 1000);
			}

			var secondsLeft = unsafeWindow.js.CountDown.countDowns.h.$gcount.remainingTime;
			var zone = localStorage.getItem('modules.scavengerCountdown.config.zone') || 'local';
			var hourtype = localStorage.getItem('modules.scavengerCountdown.config.hourtype') || '24';
			var showampm = localStorage.getItem('modules.scavengerCountdown.config.showampm') || 'true';

			time.setSeconds(time.getSeconds() + secondsLeft);

			if (zone == 'server') {
				time.setSeconds(time.getSeconds() + modules.scavengerCountdown.serverTimeOffset);
			}

			$('#gcount').append(' <span>(' + dateformat(time, hourtype, showampm) + ')</span>');
		}

		$('#gcount').domChange(function() {
			modules.scavengerCountdown.init();
		})
		
		modules.scavengerCountdown.heartbeat = modules.scavengerCountdown.heartbeat || window.setInterval(function() {
			if ($('#gcount span').length == 0) {
				modules.scavengerCountdown.init();
			}
		}, 1000)

	},

	config: function() {

		var content = '<h2>Format</h2>';

		var zone = localStorage.getItem('modules.scavengerCountdown.config.zone') || 'local';
		var hourtype = localStorage.getItem('modules.scavengerCountdown.config.hourtype') || '24';

		content += '<p>' + app.settings.select('modules-scavengerCountdown-config-zone', zone, ['local', 'server'], ['Local', 'Server']) + ' time</p>';
		content += '<p>' + app.settings.select('modules-scavengerCountdown-config-hourtype', hourtype, ['24', '12']) + ' hour clock</p>';

		if (hourtype == '12') {
			var showampm = localStorage.getItem('modules.scavengerCountdown.config.showampm') || '1';
			content += '<p>Show AM / PM? ' + app.settings.select('modules-scavengerCountdown-config-showampm', showampm, ['true', 'false'], ['Yes', 'No']) + '</p>';
		}

		$('#gameLayout #generic_section').on('change', '#modules-scavengerCountdown-config-hourtype', function(e) {
			var target = $(e.target);
			localStorage.setItem('modules.scavengerCountdown.config.hourtype', target.val());
			app.settings.moduleSettings();
		})

		$('#gameLayout #generic_section').on('change', '#modules-scavengerCountdown-config-showampm', function(e) {
			var target = $(e.target);
			localStorage.setItem('modules.scavengerCountdown.config.showampm', target.val());
		})

		$('#gameLayout #generic_section').on('change', '#modules-scavengerCountdown-config-zone', function(e) {
			var target = $(e.target);
			localStorage.setItem('modules.scavengerCountdown.config.zone', target.val());
		})

		return content;
	}

}
