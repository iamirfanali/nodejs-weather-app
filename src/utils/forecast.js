const request = require('postman-request');

const forecast = (latitude, longitude, callback) => {
	const url = `http://api.weatherstack.com/current?access_key=b67fd2ce1959c09b55964eec39b454b5&query=${latitude},${longitude}&units=f`;

	request({ url, json: true }, (error, response, body) => {
		if (error) {
			callback('Unable to connect to weather service!', undefined);
		} else if (response.body.error) {
			callback('Unable to find location', undefined);
		} else {
			callback(
				undefined,
				body.current.weather_descriptions[0] +
					'. Its ' +
					body.current.temperature +
					' fahrenheit but it feels like ' +
					body.current.feelslike + ' fahrenheit.'
			);
		}
	});
};

module.exports = forecast;
