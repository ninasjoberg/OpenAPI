
//Endpoint for any API calls
//api.openweathermap.org

//Example of API call
//api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=86ebed830d86568ba6fe8e800be02b58


let api = (function(){

	//get data from OpenWeatherMap's api
	const getWeatherInfoByLocation = function(lat, lon){
		return fetch('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&APPID=86ebed830d86568ba6fe8e800be02b58')
		.then(function(response){ //promises
			return response.json();
		})
		.catch(function(error){
			console.log(error); //loggar ut error om det skulle uppstå
		});
	};


	//get data from OpenWeatherMap's api
	const getWeatherInfoByCity = function(city){
		return fetch('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&APPID=86ebed830d86568ba6fe8e800be02b58')
		.then(function(response){ //promises
			return response.json();
		})
		.then(function(json){ //promises , kan döpas till vad som helst
			console.log(json);
			if(json.cod == 404 || json.cod == 504){
				console.log('We could not find a city called' + city);
			}
			return json;
		})
		.catch(function(error){
			console.log(error); //loggar ut error om det skulle uppstå
		});
	};


	//get data from OpenWeatherMap's api
	const getMap = function(){
		fetch('http://tile.openweathermap.org/map/Temperature/59/17/3.png?appid=86ebed830d86568ba6fe8e800be02b58')
		.then(function(response){ //promise
			return response.json();
		})
		.catch(function(error){
			console.log(error); //loggar ut error om det skulle uppstå
		});
	};



	return{
		getWeatherInfoByLocation: getWeatherInfoByLocation,
		getWeatherInfoByCity: getWeatherInfoByCity,
		getMap: getMap,
	};


})();	




let event = (function(){
	document.getElementById('weather').addEventListener('click', getWeather);

	//get the users location
	function getLocation(){
		const promise = new Promise((resolve, reject) =>{
			navigator.geolocation.getCurrentPosition((res) => { 
			    const latitude = (res.coords.latitude);
			    const longitude = (res.coords.longitude);
			    resolve({
			    	lat: latitude,
				   	lon: longitude,
				});
			});
		});
		return promise;
	}


	function getWeather(){
		const cityInput = document.getElementById('add-city').value;
		if(!cityInput){
			getLocation().then((data) => {
				const weaterLoc = api.getWeatherInfoByLocation(data.lat, data.lon);
				console.log(weaterLoc);
				weaterLoc.then(function(json){
					console.log(json);
					presentation.toDom(json.name, json.weather[0].main, json.main.temp);
					presentation.iconToDom(json.weather[0].icon);
				})
 			})		
		}else{
			const weather = api.getWeatherInfoByCity(cityInput);
			weather.then(function(json){
				presentation.toDom(json.name, json.weather[0].main, json.main.temp);
				presentation.iconToDom(json.weather[0].icon);
			})
		}
	}


	return{
		getWeather: getWeather,
	};


})();	



let presentation = (function(){		

	function toDom(location, weather, temp){
		const weatherDiv = document.getElementById('weather-div');
		weatherDiv.innerHTML = location + ' - ' + weather + ' - ' + temp +'°C';
	}

	function iconToDom(id){
		document.getElementById('icon').src='http://openweathermap.org/img/w/' + id + '.png';
	}


	return{
		toDom: toDom,
		iconToDom: iconToDom,
		};


})();	


api.getWeatherInfoByCity(Stockholm);

