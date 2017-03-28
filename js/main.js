//Times Newswire API: 9c59065f4cd7499089b7e2e4b6ef0374
//http://api.nytimes.com/svc/news/{version}/content


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
				alert(`We could not find a city called ${city}`);
			}
			return json;
		})
		.catch(function(error){
			console.log(error); //loggar ut error om det skulle uppstå
		});
	};


	//get data from the Times's api
	const getNews = function(){
		return fetch('http://api.nytimes.com/svc/news/v3/content/iht/all.json?limit=20&offset=0&api-key=9c59065f4cd7499089b7e2e4b6ef0374')
		.then(function(response){ //promises
			return response.json();
		})
		.catch(function(error){
			console.log(error); //loggar ut error om det skulle uppstå
		});
	};


	//get data from imugir's api
	const getCat = function(url){
		return fetch(url || 'https://api.imgur.com/3/gallery/8pFPE.json',
			{
				headers: {
					'Authorization' : 'Client-ID 4086c2e8a306a5e'
				}	
			})
		.then(function(response){ //promise
			return response.json();
		})
		.then(function(json){
			const items = json.data.items || json.data.images;
			const filtered = items.filter(item => item.type == "image/gif");
			return filtered;
		})
		.catch(function(error){
			console.log(error); //loggar ut error om det skulle uppstå
		});
	};

/*	
		//get data from GoogleMap's api
		const getCat = function(){
		return fetch('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=2faac0eaa322a95d1be792ea387dbd9b&per_page=1&tags="cats"&format=json')
		.then(function(response){ //promises
			console.log(response);
			return response;
		})
		.catch(function(error){
			console.log(error); //loggar ut error om det skulle uppstå
		});
	};
*/
/*
	//get data from OpenWeatherMap's api
	const getMap = function(){
		fetch('https://tile.openweathermap.org/map/Temperature/59/17/3.png?appid=86ebed830d86568ba6fe8e800be02b58')
		.then(function(response){ //promise
			return response.json();
		})
		.catch(function(error){
			console.log(error); //loggar ut error om det skulle uppstå
		});
	};
*/


	return{
		getWeatherInfoByLocation: getWeatherInfoByLocation,
		getWeatherInfoByCity: getWeatherInfoByCity,
		//showMap: showMap,
		//getMap: getMap,
		getNews: getNews,
		getCat: getCat,
	};


})();	




let util = (function(){
	document.getElementById('weather-button').addEventListener('click', getWeather);
	document.getElementById('news-button').addEventListener('click', getUpdateNews);
	document.getElementById('cat-button').addEventListener('click', getCatOfToday);

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
					presentation.infoToDom(json.name, json.weather[0].description, json.main.temp, json.wind.speed);
					presentation.iconToDom(json.weather[0].icon);
					activityTip(json.weather[0].description, json.main.temp, json.wind.speed);
					loader.classList.toggle('visibility');
				})
				.catch(function(error){
					console.log(error); //loggar ut error om det skulle uppstå
 				});
 			})		
		}else{
			const weather = api.getWeatherInfoByCity(cityInput);
			weather.then(function(json){
				presentation.infoToDom(json.name, json.weather[0].description, json.main.temp, json.wind.speed);
				presentation.iconToDom(json.weather[0].icon);
				activityTip(json.weather[0].description, json.main.temp, json.wind.speed);
			})
			.catch(function(error){
				console.log(error); //loggar ut error om det skulle uppstå
			});
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


	function getUpdateNews(){
		const news = api.getNews(); 
		news.then(function(json){
			console.log(json);
			const indexNews = randomIndex(20);
			presentation.newsToDom(json.results[indexNews]);
		})
	}

	function randomIndex(range){
		return Math.floor((Math.random() * range) + 1);
	}


	function getCatOfToday(){
		const cat = api.getCat()
		cat.then(function(items){ 
			const indexCat = randomIndex(items.length);
			console.log(indexCat);
			presentation.catToDom(items[indexCat].link)
		})
	}


	return{
		getWeather: getWeather,
	};

})();	




let presentation = (function(){		

	function infoToDom(location, weather, temp, wind){
		const locationDiv = document.getElementById('location-div');
		locationDiv.innerHTML= location;
		const weatherDiv = document.getElementById('weather-div');
		weatherDiv.innerHTML = `${weather} ${temp}°C ${wind}m/s`;
	}


	function iconToDom(id){
		document.getElementById('icon').src='http://openweathermap.org/img/w/' + id + '.png';
	}


	function activityToDom(text){
		const activity = document.getElementById('activity');
		activity.innerHTML = `It's a great day ${text}`;
	}


	function newsToDom(news){
		const article = document.getElementById('article');
		article.innerHTML = news.abstract; 
		const heading = document.getElementById('heading');
		heading.innerHTML = news.title;
		const date = document.getElementById('date');
		date.innerHTML = news.updated_date;
		document.getElementById('link').href='news.url';
	}

	function catToDom(cat){
		document.getElementById('cat-img').src=cat;
	}


	return{
		infoToDom: infoToDom,
		iconToDom: iconToDom,
		activityToDom: activityToDom,
		newsToDom: newsToDom,
		catToDom: catToDom
	};

})();	




const initialWeather = api.getWeatherInfoByCity('Stockholm');
initialWeather.then(function(json){
	presentation.infoToDom(json.name, json.weather[0].description, json.main.temp, json.wind.speed);
	presentation.iconToDom(json.weather[0].icon);
})


const initialNews = api.getNews();
initialNews.then(function(json){
	presentation.newsToDom(json.results[0]);
})


const initialCat = api.getCat();
initialCat.then(function(json){
	console.log(json);
	presentation.catToDom(json[0].link)
})


















