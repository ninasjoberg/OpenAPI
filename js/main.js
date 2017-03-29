let api = (function(){

	//get data with current weather from OpenWeatherMap's api by longitude and latitude
	const getWeatherInfoByLocation = function(lat, lon){
		return fetch('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&APPID=86ebed830d86568ba6fe8e800be02b58')
		.then(function(response){ //promises
			return response.json();
		})
		.catch(function(error){ //if error occurs
			console.log(error); 
		});
	};


	//get data with current weather from OpenWeatherMap's api by city-name
	const getWeatherInfoByCity = function(city){
		return fetch('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&APPID=86ebed830d86568ba6fe8e800be02b58')
		.then(function(response){ 
			return response.json();
		})
		.then(function(json){ 
			console.log(json);
			if(json.cod == 404 || json.cod == 504){
				alert(`We could not find a city called ${city}`);
			}
			return json;
		})
		.catch(function(error){ 
			console.log(error); 
		});
	};


	//get data with news from the last 24hours from the Times's api
	const getNews = function(){
		return fetch('http://api.nytimes.com/svc/news/v3/content/all/all/24.json?limit=20&offset=0&api-key=9c59065f4cd7499089b7e2e4b6ef0374')
		.then(function(response){ 
			console.log(response);
			return response.json();
		})
		.catch(function(error){ 
			console.log(error); 
		});
	};


	//get data with cat-gifs from imugir's api
	const getCats = function(url){
		return fetch(url || 'https://api.imgur.com/3/gallery/8pFPE.json',
			{
				headers: {
					'Authorization' : 'Client-ID 4086c2e8a306a5e'
				}	
			})
		.then(function(response){ 
			return response.json();
		})
		.then(function(json){
			const items = json.data.items || json.data.images;
			const filtered = items.filter(item => item.type == "image/gif");
			return filtered;
		})
		.catch(function(error){
			console.log(error); 
		});
	};


	//get data with location from ipInfo
	const getLocation = function(){
		return fetch('http://ipinfo.io/geo')
		.then(function(response){ 
			console.log(response.json);
			return response.json();
		})
		.catch(function(error){
			console.log(error); 
			alert('Error. Tip: Shut down addblocker and try again');
			presentation.showLoader();
		});
	};

	
	return{
		getWeatherInfoByLocation: getWeatherInfoByLocation,
		getWeatherInfoByCity: getWeatherInfoByCity,
		getNews: getNews,
		getCats: getCats,
		getLocation: getLocation,
	};


})();	




let util = (function(){
	
	document.getElementById('weather-button').addEventListener('click', weather);
	document.getElementById('news-button').addEventListener('click', news);
	document.getElementById('cat-button').addEventListener('click', cats);

	//creat a new promise to get location before next request
	function location(){
		const promise = new Promise((resolve, reject) =>{
			const location = api.getLocation();
			location.then(function(json){
		    	const latitude = (json.loc.substring(0,7));
		    	const longitude = (json.loc.substring(8,15));
			    resolve({
			    	lat: latitude,
				   	lon: longitude,
				});
			});	
		});
		return promise;
	}

	//this function is called when the button 'get weather' is pressed. If name of location is not given by the user, the function location
	//is called. Then the 'getWeatherInfoByLocation' is called with the info from location as parameter. Then that info is passed to the 
	//function that writes the info to the DOM. 
	//If the name of location is given by the user the function 'location' will not be called.  
	function weather(){
		const cityInput = document.getElementById('add-city').value;
		if(!cityInput){
			 let loader = document.getElementById('loader');
   			 presentation.showLoader();
			location().then((data) => {
				const weaterLoc = api.getWeatherInfoByLocation(data.lat, data.lon);
				weaterLoc.then(function(json){
					presentation.weatherToDom(json.name, json.weather[0].description, json.main.temp, json.wind.speed);
					presentation.iconToDom(json.weather[0].icon);
					activityTip(json.weather[0].description, json.main.temp, json.wind.speed);
					presentation.showLoader();				
				})
				.catch(function(error){
					console.log(error); 
					presentation.showLoader();
 				});
 			})		
		}else{
			const weather = api.getWeatherInfoByCity(cityInput);
			presentation.showLoader();
			weather.then(function(json){
				presentation.weatherToDom(json.name, json.weather[0].description, json.main.temp, json.wind.speed);
				presentation.iconToDom(json.weather[0].icon);
				activityTip(json.weather[0].description, json.main.temp, json.wind.speed);
				presentation.showLoader();
			})
			.catch(function(error){
				console.log(error); 
				presentation.showLoader();
			});
		}
	}


	//activity based on weather
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


	//this function is called when the button 'update news' is pressed. I calls the function getNews and then pass that info 
	//to the function that writes the info to the DOM. 
	function news(){
		const news = api.getNews(); 
		console.log(news);
		presentation.showLoader();
		news.then(function(json){
			console.log(json);
			const indexNews = randomIndex(20);
			presentation.newsToDom(json.results[indexNews]);
			presentation.showLoader();
		})
		.catch(function(error){
			console.log(error); 
			presentation.showLoader();
 		});
	}

	//this function is called when the button 'give me an other' is pressed. I calls the function getCats and then pass that info 
	//to the function that writes the info to the DOM.
	function cats(){
		const cat = api.getCats();
		presentation.showLoader();
		cat.then(function(items){ 
			const indexCat = randomIndex(items.length);
			presentation.catToDom(items[indexCat].link);
			presentation.showLoader();
		})
		.catch(function(error){
			console.log(error); 
			presentation.showLoader();
 		});
	}


	function randomIndex(range){
		return Math.floor((Math.random() * range) + 1);
	}



	return{
		randomIndex: randomIndex,
	};

})();	




let presentation = (function(){		

	function showLoader(){
		loader.classList.toggle('visibility');
	}


	function weatherToDom(location, weather, temp, wind){
		document.getElementById('location-div').innerHTML= location;
		document.getElementById('weather-div').innerHTML = `${weather} ${temp}°C ${wind}m/s`;
	}


	function iconToDom(id){
		document.getElementById('icon').src='http://openweathermap.org/img/w/' + id + '.png';
	}


	function activityToDom(text){
		document.getElementById('activity').innerHTML = `It's a great day ${text}`;
	}


	function newsToDom(news){
		document.getElementById('article').innerHTML = news.abstract;
		document.getElementById('heading').innerHTML = news.title;;
		document.getElementById('date').innerHTML = news.updated_date;
		document.getElementById('link').href = news.url;
	}


	function catToDom(cat){
		document.getElementById('cat-img').src=cat;
	}


	return{
		weatherToDom: weatherToDom,
		iconToDom: iconToDom,
		activityToDom: activityToDom,
		newsToDom: newsToDom,
		catToDom: catToDom,
		showLoader: showLoader,
	};

})();	




//init info for the page
const initialWeather = api.getWeatherInfoByCity('Stockholm');
initialWeather.then(function(json){
	presentation.weatherToDom(json.name, json.weather[0].description, json.main.temp, json.wind.speed);
	presentation.iconToDom(json.weather[0].icon);
})


const initialNews = api.getNews();
initialNews.then(function(json){
	presentation.newsToDom(json.results[0]);
})


const initialCat = api.getCats();
initialCat.then(function(json){
	const indexCat = util.randomIndex(json.length);
	presentation.catToDom(json[indexCat].link);
})











