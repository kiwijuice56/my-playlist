function getUrl(pagetoken) {
	var pt = (typeof pagetoken === "undefined") ? "" :`&pageToken=${pagetoken}`,
	mykey = "AIzaSyDdHKpCM1frjPOPAN96rQ0vUwTtJ14L9qY",
	playListID = params.get("id"); 
	URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playListID}&key=${mykey}${pt}`;
	return URL;
}

function apiCall(npt) {
	fetch(getUrl(npt))
	.then(response => {
		return response.json();
	})
	.then(function(response) {
	if(response.error){
		console.log(response.error)
	} else {
		responseHandler(response)
	}
	});
}

function responseHandler(response){
	if(response.nextPageToken)
		apiCall(response.nextPageToken);
	console.log(response)
}
apiCall();