var twfyapi = new TWFYAPI.TWFYAPI("BwK9hJCQgjm5AceGePEZjccD");
var searchCount = 100;
var qsCount = 10;
var titleArray = new Array();
var contentArray = new Array();
var randomNumbers = new Array();
var randomNumbersWrong = new Array();
var titleQsArray = new Array();
var contentQsArray = new Array();
var titleWrongQsArray = new Array();
var sentencesArray = new Array();
var questionCounter = 0;
var correctButton;
var score = 0;

function init() {
	$("#question").hide();
	$("#end").hide();
	$("#right").hide();
	$("#wrong").hide();

	$("#category1").click(function() {
		callAPI(1);
	});

	$("#category2").click(function() {
		callAPI(2);
	});

	$("#category3").click(function() {
		callAPI(3);
	});
	$("#category4").click(function() {
		callAPI(4);
	});

	$("#button1").click(function() {
		buttonClick(1);
	});

	$("#button2").click(function() {
		buttonClick(2);
	});

	$("#button3").click(function() {
		buttonClick(3);
	});
}

function callAPI(category) {
	$("#pickone").hide();
	$("#question").show();

	twfyapi.query("getHansard", {"output": "js", "callback": "hansards", "search": $("#category" + category).text(), "num": searchCount, "order": "d"});
}

function buttonClick(button) {
	if (correctButton == button) {
		score++;

		$("#right").show();
		$("#wrong").hide();
	} else {
		$("#right").hide();
		$("#wrong").show();
	}

	answerChosen();
}

function hansards(data) {
	for (var i = 0; i < searchCount; i++) {
		try {
			titleArray[i] = data.rows[i].parent.body.replace(/<\/?[^>]+(>|$)/g, "").replace("hon.", "honourable");
			contentArray[i] = data.rows[i].body.replace(/<\/?[^>]+(>|$)/g, "").replace("hon.", "honourable");
		} catch(err) {
			break;
		}
	}

	var qsCountOriginal = qsCount;

	while (randomNumbers.length < qsCount) {
		var randomNumber = Math.ceil(Math.random()*searchCount) - 1;
		var found = false;

		if (!randomNumbersLoop())
			randomNumbers[randomNumbers.length] = randomNumber;
		else
			qsCount++;
	}

	qsCount = qsCountOriginal;

	var qsCountWrong = qsCount * 2;

	while (randomNumbersWrong.length < qsCountWrong) {
		var randomNumber = Math.ceil(Math.random()*searchCount) - 1;
		var found = false;

		randomNumbersWrong[randomNumbersWrong.length] = new Array(0, 1);
		titleWrongQsArray[randomNumbersWrong.length - 1] = new Array(0, 1);

		if (!randomNumbersWrongLoop(randomNumber, found))
			randomNumbersWrong[randomNumbersWrong.length - 1][0] = randomNumber;

		randomNumber = Math.ceil(Math.random()*searchCount) - 1;
		found = false;

		if (!randomNumbersWrongLoop(randomNumber, found))
			randomNumbersWrong[randomNumbersWrong.length - 1][1] = randomNumber;
	}

	qsCountWrong = qsCount * 2;

	for (var i = 0; i < randomNumbers.length; i++) {
		titleQsArray[i] = $('<textarea/>').html(titleArray[randomNumbers[i]]).val();
		contentQsArray[i] = $('<textarea/>').html(contentArray[randomNumbers[i]]).val();
		titleWrongQsArray[i][0] = titleArray[randomNumbersWrong[i][0]];
		titleWrongQsArray[i][1] = titleArray[randomNumbersWrong[i][1]];
	}

	var sentences;

	for (var i = 0; i < contentQsArray.length; i++) {
		sentences = contentQsArray[i].match(/[^\.!\?]+[\.!\?]+/g);

		try {
			sentencesArray[i] = contentQsArray[i].match(/[^\.!\?]+[\.!\?]+/g);

			for (var iInner = 0; iInner < sentencesArray[i].length; iInner++) {
				sentencesArray[i][iInner] = sentencesArray[i][iInner].trim();
			}
		} catch(err) {
			sentencesArray[i] = new Array(contentQsArray[i].trim());
		}
	}

	showQuestion(questionCounter);
}

function randomNumbersLoop(randomNumber, found) {
	for (var i = 0; i < randomNumbers.length; i++) {
		if (randomNumbers[i] == randomNumber) {
			found = true;

			break;
		}
	}

	return found;
}

function randomNumbersWrongLoop(randomNumber, found) {
	for (var i = 0; i < randomNumbersWrong.length; i++) {
		if (randomNumbersWrong[i][0] == randomNumber || randomNumbersWrong[i][1] == randomNumber) {
			found = true;

			break;
		}
	}

	return found;
}

function showQuestion(i) {
	$("#currentQs").text("Question: " + (i + 1) + "/10");
	$("#scoreCount").text("Score: " + score + "/10");

	correctButton = Math.ceil(Math.random()*3);

	if (correctButton == 1) {
		$("#option1").html("A: " + titleQsArray[i]).text();
		$("#option2").html("B: " + titleWrongQsArray[i][0]).text();
		$("#option3").html("C: " + titleWrongQsArray[i][1]).text();
	} else if (correctButton == 2) {
		$("#option1").html("A: " + titleWrongQsArray[i][0]).text();
		$("#option2").html("B: " + titleQsArray[i]).text();
		$("#option3").html("C: " + titleWrongQsArray[i][1]).text();
	} else if (correctButton == 3) {
		$("#option1").html("A: " + titleWrongQsArray[i][0]).text();
		$("#option2").html("B: " + titleWrongQsArray[i][1]).text();
		$("#option3").html("C: " + titleQsArray[i]).text();
	}

	$("#quote").text(sentencesArray[i][Math.ceil(Math.random()*sentencesArray[i].length) - 1]);
}

function answerChosen() {
	questionCounter++;

	if (questionCounter < 10)
		showQuestion(questionCounter);
	else
		endGame();
}

function endGame() {
	$("#right").hide();
	$("#wrong").hide();
	$("#question").hide();
	$("#end").show();
	$("#finalScore").text("You scored: " + score + "/10!");
	$("#progressbarInner").css("width", score * 10 + "%");
}

window.onload = init;