//Revealing Module Pattern:

let api = (function(){

	//get data from Smhi's api
	var getWeatherInfo = function(lon, lat){
		fetch('http://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/' + lon + '/lat/' + lat + '/data.json')
		.then(function(response){ //promises
			return response.json();
		})
		.then(function(json){ //promises , kan döpas till vad som helst
			console.log(json);
			console.log(json.timeSeries);
			events.showWeater(json.timeSeries);
		})
		.catch(function(error){
			console.log(error); //loggar ut error om det skulle uppstå
		});
	};

	//get the relevant time from the api
	function getCurrentTime(time){
		const timedate = new Date; //gives us the actual time and date
		//console.log(timedate);
		//console.log(timedate.getTime()); //getTime() gives us the time in millisec
		var currentTime = timedate.toString().substring(16, 18);
		//console.log(currentTime);

		var forecastTime = time.toString().substring(11, 13);
		//console.log(forecastTime);

		if(currentTime === forecastTime){
			return time;
		}

		//let weatherTimelala = time.replace('T', ' ');
		//let weatherTimevkv = weatherTimelala.replace('Z', '');
		//let weatherTime = weatherTimevkv.replace(/-/g, ' ');
		//console.log(weatherTime);
		//console.log(weatherTime.getTime());
	}

	function weatherSymbols(value){
		var symbolMeaning = ['Clear sky', 'Nearly clear sky', 'Variable cloudiness', 'Halfclear sky', 'Cloudy sky', 'Overcast', 'Fog', 'Rain showers', 'Thunderstorm', 'Light sleet', 'Snow showers', 'Rain', 'Thunder', 'Sleet', 'Snowfall'];
		
		var symbol = symbolMeaning[value-1];
		console.log(symbol);
		return symbol;
	}	
/*
	const info = getWeatherInfo(19, 59);
	console.log(info);
	console.log(info.timeSeries);
	//function filterByTime(date){
*/
	//}

	//get data from google map's api
	var getLocationMap = function(lon, lat){
		fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat +',' + lon + '&key=AIzaSyCbirmRfdWYeiuZ7R0sfBWsRzcS4Gsm-4c')
		.then(function(response){ //promises
			return response.json();
		})
		.then(function(json){ //promises , kan döpas till vad som helst
			console.log(json);
		})
		.catch(function(error){
			console.log(error); //loggar ut error om det skulle uppstå
		});
	};

	
	function initMap(lon, lat) {
        var uluru = {lat: lat, lng: lon};
        var map = new google.maps.Map(document.getElementById('map'), {
          	zoom: 4,
          	center: uluru
        });
        var marker = new google.maps.Marker({
          	position: uluru,
          	map: map
        });
    }



	//Revealing Module Pattern must return all functions at the end, so they are reachable from outside. 
	return{
		getWeatherInfo: getWeatherInfo,
		getCurrentTime: getCurrentTime,
		weatherSymbols: weatherSymbols,
		getLocationMap: getLocationMap,
		initMap: initMap,
	};


})(); //<-- this function executes itself, which is a part of this pattern.





let presentation = (function(){

	//get the users location
	function getLocation(){
		const promise = new Promise((resolve, reject) =>{
			navigator.geolocation.getCurrentPosition((res) => { 
			    let latitude = (res.coords.latitude);
				let latDigits = latitude.toString().substring(0, 6);//makes latitude to a string and takes out the first two values
			    let longitude = (res.coords.longitude);
			    let lonDigits = longitude.toString().substring(0, 6); 
			    resolve({
				   	lon: lonDigits,
				   	lat: latDigits,
				});
			});
		});
		return promise;
	}

	/*
	function getWeater(){
		const newpromise = new Promise((resolve, reject) =>{
			let weatherInfo = api.getWeatherInfo(17, 59);
			resolve(weatherInfo);
		});
		return newpromise;
	}
	*/		



	//Revealing Module Pattern must return all functions at the end, so they are reachable from outside. 
	return{
		getLocation: getLocation,
		//getWeater: getWeater,
	};

})(); //<-- this function executes itself, which is a part of this pattern.


 

let events = (function(){

	document.getElementById('location').addEventListener('click', showLocation);
	document.getElementById('weather').addEventListener('click', weather);

	function showLocation(event){
		presentation.getLocation().then((data) => {
			//console.log(data);
			const locationDiv = document.getElementById('location-div');
			locationDiv.innerHTML = JSON.stringify(data);
			api.getLocationMap(data.lon, data.lat);
 		});
		
	}


	function weather(){
		//let locat = presentation.getLocation();
		
		presentation.getLocation().then((data) => {
			console.log(data);
			return data;
		})
		.then((data) => {
			api.getWeatherInfo(data.lon, data.lat);
			console.log(data.lon); 
		})

	}



	function showWeater(event){
		//console.log(event[0].validTime);
		//console.log(event[0].parameters[18]);
		console.log(event);

		//var times = '';
		//var weather = '';
		for(let obj of event){
			let time = obj.validTime; //tar ut alla tiddatumstränar 
			//console.log(time);
			const forecastTime = api.getCurrentTime(time); //skickar in den för omvandling och jämförelse av aktuellt tid. 
			if(forecastTime != undefined) {
				//console.log(forecastTime);
				let value = obj.parameters[18].values;
				let symbol = api.weatherSymbols(value);

				//console.log(symbol);
				times = obj.validTime;
				weather = symbol;
				toDom(times, weather);
				return; //to stop the function when the first maching value is found
			}
		
			//let value = obj.parameters[18].values; //gives me the value of weathersymbols
			//let symbol = api.weatherSymbols(value);
			//print += time + ' ' + symbol + '\n';
		}
		
	}


	function toDom(times, weather){
		const weatherDiv = document.getElementById('weather-info');
		weatherDiv.innerHTML = times + weather;
	}


	//Revealing Module Pattern must return all functions at the end, so they are reachable from outside. 
	return{
		showWeater: showWeater,
	};
	
})(); //<-- this function executes itself, which is a part of this pattern.


api.getLocationMap(17, 59);

//presentation.showWeater();



/*
const p = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('här har du data');
	}, 1000);
	console.log('nu har vi satt igång timeout');
	//reject('du fick ingen data');
})

presentation.getLocation().then((data) => {
	console.log(data);
	return data;
})

.then((data) => {
	console.log(data); 
})

.catch((error) => {
	console.log('vi fick ett error');
	console.error(error);
})
*/

//google maps api key. AIzaSyCorKMjZx3gFM7k5laRTTLYugkwP9HaWSc
//AIzaSyCbirmRfdWYeiuZ7R0sfBWsRzcS4Gsm-4c

