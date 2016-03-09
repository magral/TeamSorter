 ParseNames = function(){
	var names = document.getElementById("sumNames").value;
	var parsedNames = Array();
	var tmp = "";
	for(i = 0; i < names.length; ++i){
		if(names[i] == ","){
			tmp = tmp.replace(/\s+/g, '');
			parsedNames.push(tmp);
			tmp = "";
		}
		else{
			tmp += names[i];
		}
	}
	if(tmp != ""){
		tmp = tmp.replace(/\s+/g, '');
		parsedNames.push(tmp);
	}
	console.log(parsedNames);
};

