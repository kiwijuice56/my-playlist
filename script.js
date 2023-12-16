// Parse data in URL
const params = new URLSearchParams(window.location.search); 
const playlistId = params.get("id"); 

// List of videos in playlist
let urlList = [];

// Generate IFrame script and insert it into the document
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// YouTube player object
var player;

// Initialize the player object 
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		playerVars: {
			color: 'white',
			frameborder: 0,
			loop: 0,
			controls: 1,
			frameborder: 0,
			rel: 0,
			enablejsapi: 1,
			'playlist': urlList.slice(0, 128).join(','),
			origin: 'https://kiwijuice56.github.io/my-playlist/',
		},
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onStateChanged,
		}
	});
}  


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function onPlayerReady() {

}

function onStateChanged() {
	
}
 
function getUrl(pagetoken) {
	const token = (typeof pagetoken === "undefined") ? "" :`&pageToken=${pagetoken}`;
	// Yes... this is really just public. You can generate your own for free, so be nice!
	const key = "AIzaSyDdHKpCM1frjPOPAN96rQ0vUwTtJ14L9qY";
	return`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${key}${token}`;
}

function loadUrlList(nextPageToken) {
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
		loadUrlList(response.nextPageToken);
	} else {
		// Finished loading playlist
		localStorage.setItem(playlistId, JSON.stringify(urlList));
	}
}

function refresh() {
	localStorage.clear();
	location.reload();
}

if (localStorage.hasOwnProperty(playlistId)) {
	console.log("used storage");
	urlList = JSON.parse(localStorage.getItem(playlistId));
} else {
	console.log("used api");
	loadUrlList();
}
