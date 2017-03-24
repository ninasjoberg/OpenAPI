const request = require('request');

request.post({
	url:'https://api.yelp.com/oauth2/token', 
	headers: {
    	'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  	},
	form: {
		grant_type: 'OAuth2 grant type',
		client_id: 'c-guAF0WE-VxNgXiDSqEwA',
		client_secret: 'iq58r43jmIEyFNwlbTSJWgBaxdTJGCdabkLfCeKrgvA0Qd6Qf40XbFlTZpS18Tc7',
	}
}, 
function(err,httpResponse,body){
	console.log(body);
})


"deZp48oBxIggM2WuxLuL0ugHwC82TV1glOVkfDN3awxa6zwoBnzSlHql-GgPC9wyI4K-9xX8YmiCLYVOPy17hsbjb-UcLd8yTngo_0I64jgRscaa4MsAzjN12T3UWHYx"