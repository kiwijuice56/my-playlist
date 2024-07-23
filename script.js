// Parse data in URL
const params = new URLSearchParams(window.location.search);
const playlistId = params.get("id");
const shuffle_requested = params.has("shuffle") ? params.get("shuffle") : "yes";

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
	if (localStorage.hasOwnProperty(playlistId)) {
		urlList = JSON.parse(localStorage.getItem(playlistId));
		createPlayer();
	} else {
		loadUrlList();
	}
}

function createPlayer() {
	console.log(urlList.length);
	if (shuffle_requested === "yes") {
		shuffleArray(urlList);
	}
	const sample = urlList.slice(0, 200);
	console.log(sample);
	player = new YT.Player('player', {
		playerVars: {
			color: 'white',
			frameborder: 0,
			loop: 0,
			controls: 1,
			rel: 0,
			enablejsapi: 1,
			host: 'https://www.youtube-nocookie.com',
			'playlist': sample.join(','),
		},
		events: {
			'onStateChange': onStateChanged,
			'onError': onError,
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

function onStateChanged() {
	if (player.getPlayerState() == 1) {
		document.getElementById("icon").setAttribute("href", "playing.png");
	} else if (player.getPlayerState() == 0 || player.getPlayerState() == 2) {
		document.getElementById("icon").setAttribute("href", "paused.png");
	}
}

function onError() {
    location.reload();
}

function getUrl(pagetoken) {
	const token = (typeof pagetoken === "undefined") ? "" :`&page_token=${pagetoken}`;
	return`https://122412240.xyz/my-playlist/?playlist_id=${playlistId}${token}`;
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
		createPlayer();
	}
}


function refresh() {
	localStorage.clear();
	location.reload();
}

function next() {
	player.nextVideo();
}

function back() {
	player.previousVideo();
}