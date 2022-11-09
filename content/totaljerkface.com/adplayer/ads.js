// Copyright 2013 Google Inc. All Rights Reserved.
// You may study, modify, and use this example for any purpose.
// Note that this example is provided "as is", WITHOUT WARRANTY
// of any kind either expressed or implied.

var adsManager;
var adsLoader;
var adDisplayContainer;
var intervalTimer;
var playButton;
var pauseButton;
var muteButton;
var unMuteButton;
var videoContent;
//var myAdContainer;


function init() {
  videoContent = document.getElementById('contentElement');
  playButton = document.getElementById('playButton');
  pauseButton = document.getElementById('pauseButton');
  muteButton = document.getElementById('muteButton');
  unMuteButton = document.getElementById('unMuteButton');   
  playButton.addEventListener('click', resumeAds);
  pauseButton.addEventListener('click', pauseAds);
  unMuteButton.addEventListener('click', unMuteAds);
  muteButton.addEventListener('click', muteAds); 
  setUpIMA();
}

function setUpIMA() {
  // Create the ad display container.
  try{
	  adDisplayContainer = new google.ima.AdDisplayContainer(document.getElementById('adContainer'), videoContent);
	  adDisplayContainer.initialize();
	  // Create ads loader.
	  adsLoader = new google.ima.AdsLoader(adDisplayContainer);
	  // Listen and respond to ads loaded and error events.
	  adsLoader.addEventListener(
		  google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
		  onAdsManagerLoaded,
		  false);
	  adsLoader.addEventListener(
		  google.ima.AdErrorEvent.Type.AD_ERROR,
		  onAdError,
		  false);

	  // An event listener to tell the SDK that our content video
	  // is completed so the SDK can play any post-roll ads.
	  var contentEndedListener = function() {
			adsLoader.contentComplete();
			console.log("contentEndedListener");
			clearElements();
		  };
	  videoContent.onended = contentEndedListener;

	  // Request video ads.
	  var adsRequest = new google.ima.AdsRequest();
	  
	  adsRequest.adTagUrl = 'https://search.spotxchange.com/vast/2.0/212962?VPAID=JS&content_page_url=http%3A%2F%2Ftotaljerkface.com%2Fhappy_wheels.tjf&player_width=900&player_height=500&ad_server[type]=DFP&ad_server[tag]=https%3A%2F%2Fpubads.g.doubleclick.net%2Fgampad%2Fads%3Fsz%3D640x480%26iu%3D%2F58336618%2Fpre-rollhtml5%26impl%3Ds%26gdfp_req%3D1%26env%3Dvp%26output%3Dvast%26unviewed_position_start%3D1%26url%3D%3Areferrer_url%3A%26description_url%3D%3Adescription_url%3A%26correlator%3D%3Atimestamp%3A%7Chttps%3A%2F%2Fpubads.g.doubleclick.net%2Fgampad%2Fads%3Fsz%3D640x480%26iu%3D%2F58336618%2Fpre-rollhtml5%26impl%3Ds%26gdfp_req%3D1%26env%3Dvp%26output%3Dvast%26unviewed_position_start%3D1%26url%3D%5Breferrer_url%5D%26description_url%3D%5Bdescription_url%5D%26correlator%3D%5Btimestamp%5D%5D'	
	   
	  // Specify the linear and nonlinear slot sizes. This helps the SDK to
	  // select the correct creative if multiple are returned.
	  adsRequest.linearAdSlotWidth = 900;
	  adsRequest.linearAdSlotHeight = 500;

	  adsRequest.nonLinearAdSlotWidth = 900;
	  adsRequest.nonLinearAdSlotHeight = 150;

	  adsLoader.requestAds(adsRequest);
  } catch (adError){
	  console.log("AD BLOCKER DETECTED");
	  clearElements();
  }
}

function resumeAds() {
	 //videoContent.play();
	 adsManager.resume();
	 document.getElementById( 'playButton' ).style.display = 'none';
	 document.getElementById( 'pauseButton' ).style.display = 'block';
}


function pauseAds() {
	 //videoContent.pause();
	 adsManager.pause();
	 document.getElementById( 'pauseButton' ).style.display = 'none';
	 document.getElementById( 'playButton' ).style.display = 'block';
}

function muteAds() {
	 adsManager.setVolume(0);
	 //google.ima.VOLUME_CHANGED();
	 console.log("muteAds");
	 document.getElementById( 'unMuteButton' ).style.display = 'block';
	 document.getElementById( 'muteButton' ).style.display = 'none';
}

function unMuteAds() {
	 adsManager.setVolume(1);
	 console.log("unmuteAds");	 
	 document.getElementById( 'unMuteButton' ).style.display = 'none';
	 document.getElementById( 'muteButton' ).style.display = 'block';
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
  // Get the ads manager.
  var adsRenderingSettings = new google.ima.AdsRenderingSettings();
  adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
  // videoContent should be set to the content video element.
  adsManager = adsManagerLoadedEvent.getAdsManager(videoContent, adsRenderingSettings);

  // Add listeners to the required events.
  adsManager.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      onAdError);
  adsManager.addEventListener(
      google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
      onContentPauseRequested);
  adsManager.addEventListener(
      google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
      onContentResumeRequested);
  adsManager.addEventListener(
      google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
      onAdEvent);

  // Listen to any additional events, if necessary.
  adsManager.addEventListener(
      google.ima.AdEvent.Type.LOADED,
      onAdEvent);
  adsManager.addEventListener(
      google.ima.AdEvent.Type.STARTED,
      onAdEvent);
  adsManager.addEventListener(
      google.ima.AdEvent.Type.COMPLETE,
      onAdEvent);
	  
  try {
    // Initialize the ads manager. Ad rules playlist will start at this time.
    adsManager.init(900, 500, google.ima.ViewMode.NORMAL);
    // Call play to start showing the ad. Single video and overlay ads will
    // start at this time; the call will be ignored for ad rules.
    adsManager.start();
  } catch (adError) {
    // An error may be thrown if there was a problem with the VAST response.
    //videoContent.play();
	console.log("failed to init adsManager");
	clearElements();
  }
}


function onAdEvent(adEvent) {
	console.log("adEvent called");
	console.log(adEvent.type);
  // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
  // don't have ad object associated.
  var ad = adEvent.getAd();
  switch (adEvent.type) {
    case google.ima.AdEvent.Type.LOADED:
      // This is the first event sent for an ad - it is possible to
      // determine whether the ad is a video ad or an overlay.
      if (!ad.isLinear()) {
        console.log("is not Linear!");
		// Position AdDisplayContainer correctly for overlay.
        // Use ad.width and ad.height.
        videoContent.play();
      }
      break;
    case google.ima.AdEvent.Type.STARTED:
      // This event indicates the ad has started - the video player
      // can adjust the UI, for example display a pause button and
      // remaining time.
      if (ad.isLinear()) {
		console.log("is Linear!");
        // For a linear ad, a timer can be started to poll for
        // the remaining time.
        intervalTimer = setInterval(
            function() {
              var remainingTime = adsManager.getRemainingTime();
            },
            300); // every 300ms
      }
      break;
    case google.ima.AdEvent.Type.COMPLETE:
      // This event indicates the ad has finished - the video player
      // can perform appropriate UI actions, such as removing the timer for
      // remaining time detection.
	  console.log("is Complete!");
	  
      if (ad.isLinear()) {
        clearInterval(intervalTimer);
		console.log("is Linear!");
	  }
	  clearElements();
	  
      break;
	case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
      // This event indicates the ad has finished - the video player
      // can perform appropriate UI actions, such as removing the timer for
      // remaining time detection.
	  console.log("all ads Complete!");
	  
      if (ad.isLinear()) {
        clearInterval(intervalTimer);
		console.log("is Linear!");
	  }
	  clearElements();
	  
      break;
  }
}

function onAdError(adErrorEvent) {
  // Handle the error logging.
  console.log(adErrorEvent.getError());
  clearElements();
}

function clearElements(){
	if(adsLoader){
		adsLoader.destroy();
	}
	if(adDisplayContainer){
		adDisplayContainer.destroy();
	}
	if(adsManager){
		adsManager.destroy();
	}
	
	document.getElementById( 'content' ).style.display = 'none';
	document.getElementById( 'adContainer' ).style.display = 'none';
	document.getElementById( 'playButton' ).style.display = 'none';
	document.getElementById( 'pauseButton' ).style.display = 'none';
	document.getElementById( 'unMuteButton' ).style.display = 'none';
	document.getElementById( 'muteButton' ).style.display = 'none';	
}

function onContentPauseRequested() {
  videoContent.pause();
  // This function is where you should setup UI for showing ads (e.g.
  // display ad timer countdown, disable seeking etc.)
  // setupUIForAds();
}

function onContentResumeRequested() {
  videoContent.play();
  // This function is where you should ensure that your UI is ready
  // to play content. It is the responsibility of the Publisher to
  // implement this function when necessary.
  // setupUIForContent();

}

// Wire UI element references and UI event listeners.
init();
