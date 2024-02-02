var score = 0; //Holds points on how good the pick was
//var level = 1

var gameStarted = false;

var clicked = [
  false,
  false,
  false,
  false
]; //0:S  1:D  2:F  3:Enter

var noteSpeed = 1;
var startTime;

var initializeNotes = function(lane, object) {
  gameStarted = true;
  var startTime = Date.now();
  var noteElement;
  var x = -444;
  var key = song.sheet[lane];
  noteRemovalSTrack(0, 0);
  noteRemovalDTrack(1, 0);
  noteRemovalFTrack(2, 0);
  var audio = document.getElementById("audio");
  setTimeout(function() {
    audio.play();
  }, 2000);

  key.notes.forEach(function(note) {
    noteElement = document.createElement('div');
    noteElement.classList.add("note");
    noteElement.style.top = x;
    x = x - 222;

    //noteElement.style.left = '-10px';
    noteElement.style.backgroundColor = key.color;
    noteElement.style.animationTimingFunction = 'linear';
    noteElement.style.animationDuration = note.duration - noteSpeed + 's';
    noteElement.style.animationDelay = note.delay + noteSpeed + 's';
    noteElement.style.animationPlayState = 'running';
    document.getElementById(object).appendChild(noteElement);
  });
};


document.getElementById("LockScore").innerHTML = "Score: " + score;
//document.getElementById("Level").innerHTML = "Level: " + level;



document.addEventListener('keypress', function(event) {
  var name = event.key;

  if (name == "s" && clicked[0] == false) {
    clicked[0] = true;
    if (gameStarted) {
      judge(0, "lane");
    }
    document.getElementById("square").style.backgroundColor = "blue";
  }
  if (name == "d" && clicked[1] == false) {
    clicked[1] = true;
    if (gameStarted) {
      judge(1, "lane2");
    }
    document.getElementById("square2").style.backgroundColor = "blue";
  }
  if (name == "f" && clicked[2] == false) {
    clicked[2] = true;
    document.getElementById("square3").style.backgroundColor = "blue";
    judge(2, "lane3");
  }
  if (name == "Enter" && clicked[3] == false) {
    clicked[3] = true;
    startTime = Date.now();
    initializeNotes(0, "lane");
    initializeNotes(1, "lane2");
	 initializeNotes(2, "lane3");
  }

  document.getElementById("LockScore").innerHTML = "Score: " + score;
  //document.getElementById("Level").innerHTML = "Level: " +  level;
});


document.addEventListener('keyup', function(event) {
  var name = event.key;

  if (name == "s") {
    clicked[0] = false;
    document.getElementById("square").style.backgroundColor = "red";
  }
  if (name == "d") {
    clicked[1] = false;
    document.getElementById("square2").style.backgroundColor = "red";
  }
  if (name == "f") {
    clicked[2] = false;
    document.getElementById("square3").style.backgroundColor = "red";
  }
  if (name == "Enter") {
  
  }
});

//judge notes

var judge = function(index, laneObj) {
  var timeInSecond = (Date.now() - startTime) / 1000;
  var nextNoteIndex = song.sheet[index].next;
  var nextNote = song.sheet[index].notes[nextNoteIndex];
  var perfectTime = nextNote.duration + nextNote.delay;
  var accuracy = Math.abs(timeInSecond - perfectTime);
  var hitJudgement;
  /**
   * As long as the note has travelled less than 3/4 of the height of
   * the track, any key press on this track will be ignored.
   */
  console.log("-------------------------");
  console.log("Time in Seconds: " + timeInSecond);
  console.log("Accuracy: " + accuracy);
  console.log("Perfect Time: " + perfectTime);
  console.log("Note Id: " + nextNote);
  /*
  // im starting at the next note assuming you do not care how far away the past notes are
  for (i = nextNoteIndex; i < song.sheet[index].notes.length; i = i + 1) {
    var currentNoteInLoop = song.sheet[index].notes[i];
    console.log("the  " + (i+1) + " the note of the song is " + Math.abs(timeInSecond - (currentNoteInLoop.duration + currentNoteInLoop.delay)) + " away");
  }
  */
  
  if (accuracy > 0.6) {
    return;
  }
  
  hitJudgement = getHitJudgement(accuracy, laneObj);
  
  setTimeout(function() {
    score += (parseFloat(hitJudgement));
    document.getElementById("LockScore").innerHTML = "Score: " + score;
    updateNext(index);
    var noteBar = document.getElementById(laneObj);
    noteBar.removeChild(noteBar.firstElementChild);
  }, 5);
};

//Rewritten Note Removal Code

function noteRemovalSTrack(index, i) {
  if(gameStarted == true){
    setTimeout(function() {
	   var timeInSecondR = (Date.now() - startTime) / 1000;
	   i = song.sheet[index].next;
		
      var currentNoteInLoop = song.sheet[0].notes[i];
		var tester = ((timeInSecondR - (currentNoteInLoop.duration + currentNoteInLoop.delay)) * -1);
		
		if (tester < -0.3) {
	     var Sbar = document.getElementById("lane");
        Sbar.removeChild(Sbar.firstElementChild);
        updateNext(index);
	   }
		
      i++; // Increment the index

      if (i >= song.sheet[index].notes.length) {
        i = 0;
      }
  
      noteRemovalSTrack(index , i);
    }, 5);
  }
}
function noteRemovalDTrack(index, i) {
  if(gameStarted == true){
    setTimeout(function() {
	   var timeInSecondD = (Date.now() - startTime) / 1000;
	   i = song.sheet[index].next;
		
      var currentNoteInLoop = song.sheet[index].notes[i];
		var tester = ((timeInSecondD - (currentNoteInLoop.duration + currentNoteInLoop.delay)) * -1);
		
		if (tester < -0.3) {
	     var Dbar = document.getElementById("lane2");
        Dbar.removeChild(Dbar.firstElementChild);
        updateNext(index);
	   }
		
      i++; // Increment the index

      if (i >= song.sheet[index].notes.length) {
        i = 0;
      }
  
      noteRemovalDTrack(index, i);
    }, 5);
  }
}
function noteRemovalFTrack(index, i) {
  if(gameStarted == true){
    setTimeout(function() {
	   var timeInSecondF = (Date.now() - startTime) / 1000;
	   i = song.sheet[index].next;
		
      var currentNoteInLoop = song.sheet[index].notes[i];
		var tester = ((timeInSecondF - (currentNoteInLoop.duration + currentNoteInLoop.delay)) * -1);
		
		if (tester < -0.3) {
	     var Fbar = document.getElementById("lane3");
        Fbar.removeChild(Fbar.firstElementChild);
        updateNext(index);
	   }
		
      i++; // Increment the index

      if (i >= song.sheet[index].notes.length) {
        i = 0;
      }
  
      noteRemovalFTrack(index, i);
    }, 5);
  }
}

//Return points on the accuracy of the hit

var getHitJudgement = function(accuracy, object) {
  if (accuracy < 0.1) {
    return 1000;
  } else if (accuracy < 0.2) {
    return 750;
  } else if (accuracy < 0.3) {
    return 500;
  } else {
    return 0;
  }
};

//Update notes

var updateNext = function(index) {
  song.sheet[index].next++;
};