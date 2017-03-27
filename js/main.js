
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
				console.log(`We could not find a city called ${city}`);
			}
			return json;
		})
		.catch(function(error){
			console.log(error); //loggar ut error om det skulle uppstå
		});
	};

		//get data from OpenWeatherMap's api
		const showMap = function(){
		return fetch('https://maps.googleapis.com/maps/api/js?key=AIzaSyAb3Sw65iQ9LaN9gV8irmQzv-Qr_fuveFg&callback=initMap',
			{
				mode: 'no-cors',
			})
		.then(function(response){ //promises
			console.log(response);
			return response;
		})
		.catch(function(error){
			console.log(error); //loggar ut error om det skulle uppstå
		});
	};


	function initMap() {
        var uluru = {lat: -25.363, lng: 131.044};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
      }


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
		showMap: showMap,
		getMap: getMap,
	};


})();	




let event = (function(){
	document.getElementById('weather').addEventListener('click', getWeather);
	document.getElementById('map-button').addEventListener('click', getMap);

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
			 let loader = document.getElementById('loader');
   			 loader.classList.toggle('visibility');
			getLocation().then((data) => {
				const weaterLoc = api.getWeatherInfoByLocation(data.lat, data.lon);
				weaterLoc.then(function(json){
					presentation.toDom(json.name, json.weather[0].description, json.main.temp, json.wind.speed);
					presentation.iconToDom(json.weather[0].icon);
					activityTip(json.weather[0].description, json.main.temp, json.wind.speed);
					loader.classList.toggle('visibility');
				})
 			})		
		}else{
			const weather = api.getWeatherInfoByCity(cityInput);
			weather.then(function(json){
				presentation.toDom(json.name, json.weather[0].description, json.main.temp, json.wind.speed);
				presentation.iconToDom(json.weather[0].icon);
				activityTip(json.weather[0].description, json.main.temp, json.wind.speed);
			})
		}
	}


	//show activity based on weather
	function activityTip(weather, temp, wind){
		let text = '';
		if(temp > 9 && temp < 19 && weather == 'clear sky' && wind < 5){
			text = `for a walk outside!`;
		}
		else if(temp > 9 && temp < 16 && wind < 5 && weather == 'clear sky' || weather == 'few clouds'){
			text = `for outdoor climbing`;
		}
		else if(temp > 18 && wind > 5 && wind < 12 && weather == 'clear sky' || weather == 'few clouds'){
			text = `for sailing`;
		}
		else if(wind > 3 && temp > 20){
			text = `to take a swim`;
		}
		else if(temp < 0 && weather == 'clear sky' || weather == 'few clouds'){
			text = `skiing or sledding (if it's snow)`;
		}
		else if(weather == 'rain' || weather == 'thunderstorm'){
			text = `to stay inside and watch a movie`;
		}
		else{
			text= `for programming`;
		}
		presentation.activityToDom(text);	
	}


	function getMap(){
		const mapImg = api.showMap();
		presentation.mapToDom(mapImg);
	}


	return{
		getWeather: getWeather,
	};

})();	




let presentation = (function(){		

	function toDom(location, weather, temp, wind){
		const weatherDiv = document.getElementById('weather-div');
		weatherDiv.innerHTML = `${location} ${weather} ${temp}°C ${wind}m/s`;
	}

	function iconToDom(id){
		document.getElementById('icon').src='http://openweathermap.org/img/w/' + id + '.png';
	}

	function activityToDom(text){
		const activity = document.getElementById('activity');
		activity.innerHTML = `It's a great day ${text}`;
	}

	function mapToDom(map){
		const mapPic = document.getElementById('map');
		mapPic.innerHTML = map;
	}


	return{
		toDom: toDom,
		iconToDom: iconToDom,
		activityToDom: activityToDom,
		mapToDom: mapToDom,
	};

})();	



//event.getWeather();






















