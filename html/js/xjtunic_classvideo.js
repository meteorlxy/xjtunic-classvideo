$(function(){
	/***********************************************/
	/*main-contaner : main & righttop & rightbottom*/
	$(".cv-main-container").on("click",".cv-player-righttop", function(){
		$(".cv-player-main").removeClass("cv-player-main").addClass("cv-player-righttop");
		$(this).removeClass("cv-player-righttop").addClass("cv-player-main");
	});
	$(".cv-main-container").on("click",".cv-player-rightbottom", function(){
		$(".cv-player-main").removeClass("cv-player-main").addClass("cv-player-rightbottom");
		$(this).removeClass("cv-player-rightbottom").addClass("cv-player-main");
	});
	/***********************************************/
	
	
	/*******************************************/
	/*time-bar : current & duration & dragEvent*/
	$("#player_1").on("loadedmetadata", function(){
		$(".cv-text-currenttime").html(timeFormat($(this)[0].currentTime));
		$(".cv-text-duration").html(timeFormat($(this)[0].duration));
		$(".cv-volume-bar-value").css("width", 100 * $("#player_1")[0].volume + "%");
	});
	$("#player_1").on("timeupdate", function(){
		if($("#player_1")[0].ended){
			$(".cv-btn-stop").trigger("click");
		}
		$(".cv-text-currenttime").html(timeFormat($(this)[0].currentTime));
		$(".cv-playbar").css("width", 100 * $(this)[0].currentTime / $(this)[0].duration + "%");
	});
	var timeFormat = function(seconds){
		var h = Math.floor(seconds/3600)<10 ? "0"+Math.floor(seconds/3600) : Math.floor(seconds/3600);
		var m = Math.floor(seconds/60)<10 ? "0"+Math.floor(seconds/60) : Math.floor(seconds/60);
		var s = Math.floor(seconds-(m*60))<10 ? "0"+Math.floor(seconds-(m*60)) : Math.floor(seconds-(m*60));
		return h+":"+m+":"+s;
	};
	//DragEvent
	var timeDrag = false;
	$('.cv-progress').on('mousedown', function(e) {
		timeDrag = true;
		updateTime(e.pageX);
	});
	$(document).on('mouseup', function(e) {
		if(timeDrag) {
			timeDrag = false;
			updateTime(e.pageX);
		}
	});
	$(document).on('mousemove', function(e) {
		if(timeDrag) {
			updateTime(e.pageX);
		}
	});
	var updateTime = function(x) {
		var maxduration = $("#player_1")[0].duration;
		var position = x - $('.cv-progress').offset().left;
		var percentage = 100 * position / $('.cv-progress').width();
		if(percentage > 100) {
			percentage = 100;
		}
		if(percentage < 0) {
			percentage = 0;
		}
		$('.cv-playbar').css('width',percentage+'%');	
		$("#player_1")[0].currentTime = maxduration * percentage / 100;
		$("#player_2")[0].currentTime = maxduration * percentage / 100;
		$("#player_3")[0].currentTime = maxduration * percentage / 100;
	};
	/*******************************************/
	
	/*************************************************/
	/*volume-controls : mute & max-volume & dragEvent*/
	$(".cv-btn-mute").on("click",function(){
		$(".cv-main-container").toggleClass("cv-state-muted");
		$("#player_1")[0].muted = !$("#player_1")[0].muted;
		if($("#player_1")[0].muted){
			$(".cv-volume-bar-value").css("width", 0);
		}
		else{
			$(".cv-volume-bar-value").css("width", 100 * $("#player_1")[0].volume + "%");
		}
	});
	$(".cv-btn-volume-max").on("click",function(){
		updateVolume(0,1);
	});
	//DragEvent
	var volumeDrag = false;
	$('.cv-volume-bar').on('mousedown', function(e) {
		volumeDrag = true;
		updateVolume(e.pageX);
	});
	$(document).on('mouseup', function(e) {
		if(volumeDrag) {
			volumeDrag = false;
			updateVolume(e.pageX);
		}
	});
	$(document).on('mousemove', function(e) {
		if(volumeDrag) {
			updateVolume(e.pageX);
		}
	});
	var updateVolume = function(x, vol) {
		var percentage;
		if(vol) {
			percentage = vol * 100;
		}
		else {
			var position = x - $('.cv-volume-bar').offset().left;
			percentage = 100 * position / $('.cv-volume-bar').width();
			if(percentage > 100) {
				percentage = 100;
			}
			if(percentage < 0) {
				percentage = 0;
			}
		}
		$('.cv-volume-bar-value').css('width',percentage+'%');	
		$("#player_1")[0].volume = percentage / 100;
		$("#player_1")[0].muted = false;
		if($("#player_1")[0].volume == 0){
			$(".cv-main-container").addClass("cv-state-muted");
		}
		else{
			$(".cv-main-container").removeClass("cv-state-muted");
		}
	};
	/*************************************************/
	
	
	/*************************************/
	/*play-controls : play & pause & stop*/
	$(".cv-btn-play").on("click",function(){
		$(".cv-main-container").toggleClass("cv-state-playing");
		if($("#player_1")[0].paused){
			$(".cv-video-player").trigger("play");
		}
		else{
			$(".cv-video-player").trigger("pause");
		}
	});
	$(".cv-btn-stop").on("click",function(){
		$(".cv-main-container").removeClass("cv-state-playing");
		$(".cv-video-player").trigger("pause").each(function(){$(this)[0].currentTime = 0;});
	});
	/*************************************/
	
	/*******************************/
	/*toggles : repeat & fullscreen*/
	$(".cv-btn-repeat").on("click",function(){
		$(".cv-main-container").toggleClass("cv-state-looped");
		$(".cv-main-container.cv-state-looped .cv-video-player").each(function(){$(this)[0].loop = true;});
		$(".cv-main-container:not(.cv-state-looped) .cv-video-player").each(function(){$(this)[0].loop = false;});
	});
	$(".cv-btn-fullscreen").on("click",function(){
		$(".cv-state-fullscreen").css("height", '');
		$(".cv-main-container").toggleClass("cv-state-fullscreen");
		$(".cv-state-fullscreen").css("height", $(window).height()-100);
	});
	$(window).on("resize", function(){
		$(".cv-state-fullscreen").css("height", $(window).height()-100);
	});
	/*******************************/

	/*******************************/
	/*select-fullscreen : 1 & 2 % 3*/
	$(".cv-btn-select").on("click", function(){
		if($(this).hasClass("cv-btn-select-selected") && $(".cv-btn-select-selected").size() == 1){
			return;
		}
		if($(this).hasClass("cv-btn-select-selected")){
			$(this).removeClass("cv-btn-select-selected");
		}
		else{
			$(this).addClass("cv-btn-select-selected");
		}
		$(".cv-player-div").removeClass("cv-player-only").removeClass("cv-player-left").removeClass("cv-player-right");
		if($(".cv-btn-select-selected").size() == 1){
			$("#cv-playerdiv-" + $(".cv-btn-select-selected").data("selection")).addClass("cv-player-only");
		}
		if($(".cv-btn-select-selected").size() == 2){
			$("#cv-playerdiv-" + $(".cv-btn-select-selected:eq(0)").data("selection")).addClass("cv-player-left");
			$("#cv-playerdiv-" + $(".cv-btn-select-selected:eq(1)").data("selection")).addClass("cv-player-right");
		}
	});
	/*******************************/
});