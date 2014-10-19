/**
*
* Growing some Backbone
*
**/

var data;

new Ajax.Request(

	'webinfo.herokuapp.com/dylanmadisetti.com',

	onSucces: function(response){

		data = response.reponseJSON;

	}

)


alert(data);