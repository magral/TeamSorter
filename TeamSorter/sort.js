//REQURIED GLOBAL VARS
var API_KEY = "1e9722cb-94a0-4b5f-821f-0492453429b2";
var csvFile;
var playerMMRS = {};
var players = new Array();
var participantAVGs = new Array();

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
	return csvFile;
};
GetSummonerID = function(SUMMONER_NAME){
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
			GetMatchList(summonerID);
			//var mmr = CalculateAverageMMR(participantAVGs);
			//AddPlayerToAVGs(SUMMONER_NAME, mmr);

		},
		complete: function(json){
			var mmr = CalculateAverageMMR(participantAVGs);
			AddPlayerToAVGs(SUMMONER_NAME, mmr);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			alert("error getting summoner data!");
		}
	});
};
var matchIDs = [];
GetMatchList = function(SUMMONER_ID){
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
	var MAX_PLAYERS_PER_TEAM = 10;
	$.ajax({
		url: 'https://na.api.pvp.net/api/lol/na/v2.2/match/' + matchID.toString() + '?includeTimeline=false&api_key=' + API_KEY,
		type: 'GET',
		dataType:'json',
		data:{
			
		},
		success: function(json){
			//console.log(json["participantIdentities"][1]["player"].summonerId);
			//for(var i = 0; i < MAX_PLAYERS_PER_TEAM; i++){
				GetDivisionOfPlayer(json["participantIdentities"][1]["player"].summonerId);
			//}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			alert("Error getting participant data");
		}
	});

};
GetDivisionOfPlayer = function(summonerID){
	var playerDivision;
	var playerTier;
	$.ajax({
		url: 'https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/' + summonerID.toString() + '/entry?api_key=' + API_KEY,
		type: 'GET',
		dataType: 'json',
		data: {
			
		},
		success: function(json){
			console.log(json[summonerID.toString()][0]["entries"][0].division);
			console.log(json[summonerID.toString()][0].tier);
			
			playerDivision = json[summonerID.toString()][0]["entries"][0].division;
			playerTier = json[summonerID.toString()][0].tier;
			//CalculatePlayerMMR(playerDivision, playerTier);
		},
		complete: function(json){
			CalculatePlayerMMR(playerDivision, playerTier);	
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			alert("Error getting participant data");
		}
	});
};
CalculatePlayerMMR = function(playerDivision, playerTier){
	var base;
	var augment;
	playerDivision = playerDivision.toString();
	playerTier = playerTier.toString();
	if(playerDivision == "BRONZE"){
		base = 800;
	}
	else if(playerTier == "SILVER"){
		base = 1150;
	}
	else if(playerTier == "GOLD"){
		base = 1500;
	}
	else if(playerTier == "PLATINUM"){
		base = 1850;
	}
	else if(playerTier == "DIAMOND"){
		base = 2200;
	}
	else if(playerTier == "MASTER"){
		base = 2550;
	}
	else if(playerTier == "CHALLENGER"){
		base = 2900;
	}
	if(playerTier != "MASTER" && playerTier != "CHALLENGER"){
		if(playerDivision == "V"){
			augment = 34.5;
		}	
		else if(playerDivision == "IV"){
			augment = 104.5
		}
		else if(playerDivision == "III"){
			augment = 174.5;
		}
		else if(playerDivision == "II"){
			augment = 244.5;
		}
		else if(playerDivision == "I"){
			augment = 314.5
		}
	}
	else{
		augment = 34.5;
	}
	
	var mmr = base + augment;
	console.log(mmr);
	participantAVGs.push(mmr);

}
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
			for(var i = 0; i < results["data"].length; i++){
					players.push(results["data"][i][0]);
			}
			for(var i = 0; i < players.length; i++){
				GetSummonerID(players[i]);
			}
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
AddParticipantMMRToAVG = function(mmr){
	participantAVGs.push(mmr);
}
AddPlayerToAVGs = function(playerName, mmr){
	playerMMRS["playerName"] = mmr;
}
CalculateAverageMMR = function(mmrs){
	var total = 0;
	for(var i = 0; i < mmrs.length; i++){
		total += mmrs[i];
	}
	var avg = total/mmrs.length;
	console.log(avg);
	return avg;
};

control = function(){
	ParseCSV();
}
