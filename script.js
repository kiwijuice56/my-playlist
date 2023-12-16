const urlList = [];

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		playerVars: {
			color: 'white',
			autoplay: 1,
			loop: 0,
			controls: 1,
			frameborder: 0,
			rel: 0, 
		},
	});
}  
 

function getUrl(pagetoken) {
	const params = new URLSearchParams(window.location.search); 
	var pt = (typeof pagetoken === "undefined") ? "" :`&pageToken=${pagetoken}`,
	mykey = "AIzaSyDdHKpCM1frjPOPAN96rQ0vUwTtJ14L9qY",
	playListID = params.get("id"); 
	URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playListID}&key=${mykey}${pt}`;
	return URL;
}

function apiCall(nextPageToken) {
	fetch(getUrl(nextPageToken))
	.then(response => response.json())
	.then(function(response) {
		responseHandler(response);
	});
}

function responseHandler(response) {
	for (const idx in response.items) {
		urlList.push(response.items[idx].snippet.resourceId.videoId);
	}
	
	if (response.nextPageToken) {
		apiCall(response.nextPageToken);
	} else {
		player.loadVideoById(urlList[Math.floor(Math.random() * urlList.length)]);
	}
}



document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        player.loadVideoById(urlList[Math.floor(Math.random() * urlList.length)]);
    }

});

apiCall();
