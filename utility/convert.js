const humanizeDuration = require("humanize-duration");

const shortEnglishHumanizer = humanizeDuration.humanizer({
	language: "shortEn",
	languages: {
		shortEn: {
			y: () => "y",
			mo: () => "mo",
			w: () => "w",
			d: () => "d",
			h: () => "h",
			m: () => "m",
			s: () => "s",
			ms: () => "ms",
		},
	},
});

exports.time = function (seconds) {
	sec = Math.round(seconds * 1000);


	return humanizeDuration(sec, {
		maxDecimalPoints: 0,
		conjunction: " ",
		serialComma: true
	});

};

exports.msShort = function (milliseconds) {
	return humanizeDuration(milliseconds, {
		maxDecimalPoints: 5,
		conjunction: " ",
		serialComma: true
	});
};


exports.ms = function (milliseconds) {
	return humanizeDuration(milliseconds, {
		maxDecimalPoints: 0,
		conjunction: " ",
		serialComma: true
	});
};

exports.msToDate = function (milliseconds, timezone) {
	return new Date(milliseconds).toLocaleString("en-US", { timeZone: timezone });
};


exports.discordFormatShortDate = function (time, type) {
	return `<t:${time}:d>`
};



exports.discordFormatShortDateTime = function (time, type) {
	if (!type) time = time / 1000;

	if (type == "Seconds") time = ((time * 1000) + Date.now()) / 1000;

	return `<t:${Math.round(time)}:f>`
}

exports.discordFormatLongDateTime = function (time, type) {

	if (!type) time = time / 1000;

	if (type == "Seconds") time = ((time * 1000) + Date.now()) / 1000;

	return `<t:${Math.round(time)}:F>`
}

exports.discordFormatRelativeTime = function (time, type) {
	if (!type) time = time / 1000;

	if (type == "Seconds") time = ((time * 1000) + Date.now()) / 1000;

	return `<t:${Math.round(time)}:R>`
}
