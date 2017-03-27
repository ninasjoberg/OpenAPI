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


	//get data from Google map's api
	var getLocationMap = function(lon, lat){
		fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat +',' + lon + '&key=AIzaSyCorKMjZx3gFM7k5laRTTLYugkwP9HaWSc')
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


	var getCafe = function(lon, lat){
		fetch('https://maps.googleapis.com/maps/api/place/radarsearch/json?location=' + lat + ',' + lon + '&radius=5000&type=cafe&key=AIzaSyAb3Sw65iQ9LaN9gV8irmQzv-Qr_fuveFg',
			{
				mode: 'no-cors',
			})
		.then(function(response){ //promises
			return response;
		})
		.then(function(json){ //promises , kan döpas till vad som helst
			console.log(json);
		})
		.catch(function(error){
			console.log(error); //loggar ut error om det skulle uppstå
		});
	};
	//get info with a plce id from google api
	//https://maps.googleapis.com/maps/api/place/radarsearch/json?location=51.503186,-0.126446&radius=5000&type=museum&key=AIzaSyAb3Sw65iQ9LaN9gV8irmQzv-Qr_fuveFg

	//get info about a place with google api
	//https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&key=AIzaSyAb3Sw65iQ9LaN9gV8irmQzv-Qr_fuveFg


	/*
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
	*/

/*
	//get data from yelp's api
	var getCafe = function(lon, lat){
		fetch('https://api.yelp.com/v3/businesses/search?term=food&location=London',
			{
				mode: 'no-cors',
				headers: {	
					Authorization : "Bearer deZp48oBxIggM2WuxLuL0ugHwC82TV1glOVkfDN3awxa6zwoBnzSlHql-GgPC9wyI4K-9xX8YmiCLYVOPy17hsbjb-UcLd8yTngo_0I64jgRscaa4MsAzjN12T3UWHYx",
				}
			}
		)
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
*/


	//get the relevant time from smhi's api
	function getCurrentTime(time){
		const timedate = new Date; //gives us the actual time and date
		timedate.getTime(); //getTime() gives us the time in millisec
		

		const smhiTime = new Date(time);
		console.log(smhiTime);
		
		//var closesTime = 


		var currentTime = timedate.toString().substring(16, 18);
		//console.log(currentTime);

		var forecastTime = time.toString().substring(11, 13);
		//console.log(forecastTime);

		if(currentTime === forecastTime){
			return time;
		}
	}


	//take out weather info from smhi's api init
	function weatherSymbols(value){
		var symbolMeaning = ['Clear sky', 'Nearly clear sky', 'Variable cloudiness', 'Halfclear sky', 'Cloudy sky', 'Overcast', 'Fog', 'Rain showers', 'Thunderstorm', 'Light sleet', 'Snow showers', 'Rain', 'Thunder', 'Sleet', 'Snowfall'];
		
		var symbol = symbolMeaning[value-1];
		console.log(symbol);
		return symbol;
	}	


	//Revealing Module Pattern must return all functions at the end, so they are reachable from outside. 
	return{
		getWeatherInfo: getWeatherInfo,
		getCurrentTime: getCurrentTime,
		weatherSymbols: weatherSymbols,
		getLocationMap: getLocationMap,
		getCafe: getCafe,
		//initMap: initMap,
	};


})(); //<-- this function executes itself, which is a part of this pattern.




let events = (function(){

	document.getElementById('location').addEventListener('click', showLocation);
	document.getElementById('weather').addEventListener('click', weather);
	document.getElementById('cafe').addEventListener('click', cafe);


	function showLocation(event){
		presentation.getLocation().then((data) => {
			presentation.locationToDom(data);
			api.getLocationMap(data.lon, data.lat); //SE TILL att denna funkar eller ta bort!!
 		});
	}


	function weather(){
		presentation.getLocation().then((data) => {
			return data;
		})
		.then((data) => {
			api.getWeatherInfo(data.lon, data.lat); 
		})

	}

	function showWeater(event){

		console.log(event);

		const timeDate = new Date; //gives us the actual time and date
		const timeDateSec = timeDate.getTime(); //getTime() gives us the time in millisec

		//console.log(timeDate);
		//console.log(timeDateSec);

		const time = event.reduce((prev, obj) => {
			let returnObject = {};
			if((new Date(obj.valitTime).getTime() - new Date.getTime()) < (new Date(prev.validTime).getTime() - new Date.getTime())){
				returnObject = obj;
			}
			//else{ returnObject = {prev}}
			return returnObject;
			//(Math.abs(smhiTimeSec - timeDateSec) < Math.abs(prev - timeDateSec) ? smhiTimeSec : prev);
		},{}); //<-- har funderat på om denna ska bytas ut mot {}, men antar att det är något mer som måste ändras då.. 


		console.log(time);
		
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
				console.log(times);
				console.log(weather);
				presentation.toDom(times, weather);
				return; //to stop the function when the first maching value is found
			}
			//let value = obj.parameters[18].values; //gives me the value of weathersymbols
			//let symbol = api.weatherSymbols(value);
			//print += time + ' ' + symbol + '\n';
		}
	}


	function cafe(){
		presentation.getLocation().then((data) => {
			console.log(data);
			return data;
		})
		.then((data) => {
			api.getCafe(data.lon, data.lat);
			console.log(data.lon); 
		})
	}

	

	//Revealing Module Pattern must return all functions at the end, so they are reachable from outside. 
	return{
		showWeater: showWeater,
		showLocation: showLocation,
	};
	
})(); //<-- this function executes itself, which is a part of this pattern.





let presentation = (function(){

	//get the users location
	function getLocation(){
		const promise = new Promise((resolve, reject) =>{
			navigator.geolocation.getCurrentPosition((res) => { 
			    let latitude = (res.coords.latitude);
				let latDigits = latitude.toString().substring(0, 6);//makes latitude to a string and takes out the first six values
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


	function locationToDom(data){
		const locationDiv = document.getElementById('location-div');
		locationDiv.innerHTML = JSON.stringify(data);
	}


	function toDom(times, weather){
		const weatherDiv = document.getElementById('weather-div');
		weatherDiv.innerHTML = times + weather;
	}



	//Revealing Module Pattern must return all functions at the end, so they are reachable from outside. 
	return{
		getLocation: getLocation,
		//getWeater: getWeater,
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



