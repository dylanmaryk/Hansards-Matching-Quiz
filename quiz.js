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

	$("#category1").click(function() {
		$("#pickone").hide();
		$("#question").show();

		twfyapi.query("getHansard", {"output": "js", "callback": "hansards", "search": "devolution", "num": searchCount, "order": "d"});
	});

	$("#button1").click(function() {
		if (correctButton == 1)
			score++;

		answerChosen();
	});

	$("#button2").click(function() {
		if (correctButton == 2)
			score++;

		answerChosen();
	});

	$("#button2").click(function() {
		if (correctButton == 2)
			score++;

		answerChosen();
	});
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

		// if (!randomNumbersWrongLoop(randomNumber, found)) {
		// 	randomNumbersWrong[randomNumbersWrong.length - 1][0] = randomNumber;

		// 	randomNumber = Math.ceil(Math.random()*searchCount) - 1;
		// 	found = false;

		// 	if (!randomNumbersWrongLoop(randomNumber, found)) {
		// 		randomNumbersWrong[randomNumbersWrong.length - 1][1] = randomNumber;
		// 	} else {
		// 		randomNumbersWrong.pop();

		// 		qsCountWrong++;
		// 	}
		// } else {
		// 	randomNumbersWrong.pop();

		// 	qsCountWrong++;
		// }
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

		if (sentences == undefined)
			sentencesArray[i][0] = contentQsArray[i];
		else
			sentencesArray[i] = contentQsArray[i].match(/[^\.!\?]+[\.!\?]+/g);

		for (var iInner = 0; iInner < sentencesArray[i].length; iInner++) {
			sentencesArray[i][iInner] = sentencesArray[i][iInner].trim();
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
	// console.log(sentencesArray[i][Math.ceil(Math.random()*sentencesArray[i].length) - 1]);
	// console.log(titleQsArray[i]);
	// console.log(titleWrongQsArray[i][0]);
	// console.log(titleWrongQsArray[i][1]);

	correctButton = Math.ceil(Math.random()*3);

	if (correctButton == 1) {
		$("#button1").text(titleQsArray[i]);
		$("#button2").text(titleWrongQsArray[i][0]);
		$("#button3").text(titleWrongQsArray[i][1]);
	} else if (correctButton == 2) {
		$("#button1").text(titleWrongQsArray[i][0]);
		$("#button2").text(titleQsArray[i]);
		$("#button3").text(titleWrongQsArray[i][1]);
	} else if (correctButton == 3) {
		$("#button1").text(titleWrongQsArray[i][0]);
		$("#button2").text(titleWrongQsArray[i][1]);
		$("#button3").text(titleQsArray[i]);
	}

	$("#quote").text(sentencesArray[i][Math.ceil(Math.random()*sentencesArray[i].length) - 1]);

	// console.log(score);
}

function answerChosen() {
	questionCounter++;

	if (questionCounter < 10)
		showQuestion(questionCounter);
	else
		endGame();
}

function endGame() {
	$("#question").hide();
	$("#end").show();
	$("#finalScore").text("You scored: " + score + "/10!")
}

window.onload = init;