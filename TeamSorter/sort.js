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

var csvFile;
GrabFile = function(){
	var names = document.getElementById("csv");
	var txt = "";
	if('files' in names){
		if(names.files.length == 0){
			txt = "Select one or more files.";
		}
		else{
			for(var i = 0; i < names.files.length; i++){
				txt += "<br><strong>" + (i+1) + ".file</strong><br>";
				var file = names.files[i];
				csvFile = names.files[i];
				if('name' in file){
					txt += "name: " + file.name + "<br>";
				}
				if('size' in file){
					txt += "size: " + file.size + " bytes <br>";
				}
			}
		}
	}
	else{
		if(names.value == ""){
			txt += "Select one or more files.";
		}
		else{
			txt += "The files property is not supported by your browser";
			txt += "<br>The path of the selected file: " + names.value;
		}
	}
	document.getElementById("FileInfo").innerHTML = txt;
};

GetFile = function(){
	console.log(csvFile);
	return csvFile;
};