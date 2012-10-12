pvis.pam = {}
pvis.pam.payload_id = "pam";

pvis.pam.value = function(v) {
	var response = v.data.responses[0].value.last();
	
	// If we are using an old version of PAM we need to re-organize the data
	if(!response.mood) {
		response.mood = response.photo_id
		response.photo_id = response.score
		response.sub_photo_id = 1
	}
	return response;
}

pvis.pam.timestamp = pvis.timestamp;

pvis.pam.filter = function(v, key) {
	return $.inArray(this.value(v).mood, key) != -1;
}

pvis.pam.key_title = function(key) {
	if(key == pam.positive) {
		return "Postitive Emotions";
	} else if(key == pam.negative) {
		return "Negative Emotions";
	} else {
		return key;
	}
}