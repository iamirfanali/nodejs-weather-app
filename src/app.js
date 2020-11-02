const hbs = require('hbs');
const path = require('path');
const express = require('express');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
	res.render('index', {
		title: 'Weather',
		name: 'Irfan Ali',
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About Me',
		name: 'Irfan Ali',
	});
});

app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Help',
		name: 'Irfan Ali',
		helpText: 'some helpful text here.',
	});
});

app.get('/weather', (req, res) => {
	if (!req.query.address) {
		res.send({
			error: 'You must provide an address!',
		});
	}
	geocode(
		req.query.address,
		(error, { latitude, longitude, location } = {}) => {
			if (error) {
				return res.send({ error });
			}
			forecast(latitude, longitude, (error, forecasteData) => {
				if (error) {
					return res.send({ error });
				}
				res.send({
					forecast: forecasteData,
					location,
					address: req.query.address,
				});
			});
		}
	);
});

app.get('/products', (req, res) => {
	if (!req.query.search) {
		res.send({
			error: 'You must provide a search term',
		});
	} else {
		res.send({
			products: [],
		});
	}
});

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Irfan Ali',
		errorMessage: 'Help article not found',
	});
});

app.get('*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Irfan Ali',
		errorMessage: 'Page not found',
	});
});

app.listen(port, () => {
	console.log('Server is up on port ' + port);
});
