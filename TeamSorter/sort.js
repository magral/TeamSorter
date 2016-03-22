var API_KEY = "1e9722cb-94a0-4b5f-821f-0492453429b2";
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
GetSummonerID = function(){
	var SUMMONER_NAME = "Bearly Leah";
	$.ajax({
		url: 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + SUMMONER_NAME + '?api_key=' + API_KEY,
		type: 'GET',
		dataType: 'json',
		data: {
			
		},
		success: function(json){
			SUMMONER_NAME = SUMMONER_NAME.replace(" ", "");
			SUMMONER_NAME = SUMMONER_NAME.toLowerCase().trim();		
			
			var summonerID = json[SUMMONER_NAME].id;
			
			document.getElementById("SummonerID").innerHTML = summonerID;
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			alert("error getting summoner data!");
		}
	});
};
var matchIDs = [];
GetMatchList = function(){
	var SUMMONER_ID = "28869688";
	var MAX_SEARCH_LENGTH = 1;
	$.ajax({
		url: 'https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/' + SUMMONER_ID + '?seasons=SEASON2016&beginIndex=0&endIndex=' + MAX_SEARCH_LENGTH.toString() + '&api_key=' + API_KEY,
		type: 'GET',
		dataType: 'json',
		data: {
	
		},
		success: function(json){
			for(var i = 0; i < MAX_SEARCH_LENGTH; i++){
				matchIDs[i] = json["matches"][i].matchId;
			}
			for(var i = 0; i < MAX_SEARCH_LENGTH; i++){
				GetParticipantsFromMatchlist(matchIDs[i]);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			alert("error getting match data!");
		}
	});
};
GetParticipantsFromMatchlist = function(matchID){
	$.ajax({
		url: 'https://na.api.pvp.net/api/lol/na/v2.2/match/' + matchID.toString() + '?includeTimeline=false&api_key=' + API_KEY,
		type: 'GET',
		dataType:'json',
		data:{
			
		},
		success: function(json){
			console.log(json["participantIdentities"][0]["player"].summonerId);
			GetDivisionOfPlayer(json["participantIdentities"][0]["player"].summonerId);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			alert("Error getting participant data");
		}
	});
	//move this call into get match list
	//call per match list id
};
GetDivisionOfPlayer = function(summonerID){
	$.ajax({
		url: 'https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/' + summonerID.toString() + '/entry?api_key=' + API_KEY,
		type: 'GET',
		dataType: 'json',
		data: {
			
		},
		success: function(json){
			console.log(json[summonerID.toString()][0]["entries"][0].division);
			console.log(json[summonerID.toString()][0].tier);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			alert("Error getting participant data");
		}
	});
};
ParseCSV = function(){
	config = {
		delimiter: ",",
		newline: "",
		header: false,
		dynamicTyping: false,
		preview: 0,
		encoding: "",
		worker: false,
		comments: false,
		step: undefined,
		complete: function(results, file) {
			console.log("Parsing complete:", results, file);
		},
		error: undefined,
		download: false,
		skipEmptyLines: true,
		chunk: undefined,
		fastMode: undefined,
		beforeFirstChunk: undefined,
		withCredentials: undefined
	}
	Papa.parse(GetFile(), config);
};

CalculateAverageMMR = function(){
	var mmrs = GetMMRs();
	var total = 0;
	for(var i = 0; i < mmrs.length; i++){
		total += mmrs[i];
	}
	var avg = total/mmrs.length;
	console.log(avg);
	return avg;
};

