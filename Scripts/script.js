var score = 0; //Holds points on how good the pick was
//var level = 1

var combo = 0;
var maxCombo = 0;

var gameStarted = false;

var music;
var songNameRemoval;
var songName;

var clicked = [
  false,
  false,
  false,
  false
]; //0:S  1:D  2:F  3:Enter

var noteSpeed = 2;
var startTime;

var initializeNotes = function(lane, object, songName) {
  gameStarted = true;
  var startTime = Date.now();
  var noteElement;
  var x = -444;
  var key = window[songName].sheet[lane];
  noteRemovalSTrack(0, 0, songName);
  noteRemovalDTrack(1, 0, songName);
  noteRemovalFTrack(2, 0, songName);
 

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
    noteElement.style.animationPlayState = 'paused';
    document.getElementById(object).appendChild(noteElement);
  });
};


document.getElementById("LockScore").innerHTML = "Score: " + score;
document.getElementById("combo").innerHTML = "Combo: " + combo;
document.getElementById("maxCombo").innerHTML = "Max Combo: " + maxCombo;
//document.getElementById("Level").innerHTML = "Level: " + level;

//Key Down Function

document.addEventListener('keypress', function(event) {
  var name = event.key;

  if (name == "s" && clicked[0] == false) {
    clicked[0] = true;
    document.getElementById("square").style.backgroundColor = "blue";
    if (gameStarted) {
      judge(0, "lane", songName);
    }
  }
  if (name == "d" && clicked[1] == false) {
    clicked[1] = true;
    document.getElementById("square2").style.backgroundColor = "blue";
    if (gameStarted) {
      judge(1, "lane2", songName);
    }
  }
  if (name == "f" && clicked[2] == false) {
    clicked[2] = true;
    document.getElementById("square3").style.backgroundColor = "blue";
    if(gameStarted){
      judge(2, "lane3", songName);
    }
  }
  if (name == "Enter" && clicked[3] == false) {
    clicked[3] = true;
    startTime = Date.now();

    var music = document.querySelector("#songPicker");
    var actualsong = music.options[music.selectedIndex].getAttribute('src');
    songNameRemoval = music.options[music.selectedIndex].innerHTML;
    songName = songNameRemoval.split(" ").join("");

    initializeNotes(0, "lane", songName);
    initializeNotes(1, "lane2", songName);
	  initializeNotes(2, "lane3", songName);

    var audioPlayer = document.getElementById("audio");

    audioPlayer.src = actualsong;
    audioPlayer.type = "audio/mpeg";
    var songDelay;
    
    if (songName == 'Portland'){
      songDelay = 5500;
    }
    if(songName == 'ILoveYouIHateYou'){
      songDelay = 6000;
    }
    if(songName == 'Crystallized'){
      songDelay = 3400;
    }
    if(songName == 'RockWithYouPt2'){
      songDelay = 3100;
    }
    if(songName == 'BadPiggies'){
      songDelay = 3100;
    }
    if(songName == 'NoTimeToExplain'){
      songDelay = 3100;
    }
    if(songName == 'GoodMorningVietnam'){
      songDelay = 3100;
    }
    
    document.querySelectorAll('.note').forEach(function (note) {
        note.style.animationPlayState = 'running';
    });

    setTimeout(function() {
      
      audioPlayer.play();
    }, songDelay);
  }

  document.getElementById("LockScore").innerHTML = "Score: " + score;
  //document.getElementById("Level").innerHTML = "Level: " +  level;
});

//eventListener for when key up. Only allows one input from a key even when pressed down

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

//Judge notes via the startTime and a Date.now function

var judge = function(index, laneObj, songName) {
  var timeInSecond = (Date.now() - startTime) / 1000;
  var nextNoteIndex = window[songName].sheet[index].next;
  var nextNote = window[songName].sheet[index].notes[nextNoteIndex];
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
    updateNext(index, songName);
    var noteBar = document.getElementById(laneObj);
    noteBar.removeChild(noteBar.firstElementChild);
  }, 5);
};

//Rewritten Note Removal Code. Basically a for loop just in a function cause it makes more sense to me.
//Should prob change to a for loop later

function noteRemovalSTrack(index, i, songName) {
  if(gameStarted == true){
    setTimeout(function() {
	   var timeInSecondR = (Date.now() - startTime) / 1000;
	   i = window[songName].sheet[index].next;
		
      var currentNoteInLoop = window[songName].sheet[0].notes[i];
		var tester = ((timeInSecondR - (currentNoteInLoop.duration + currentNoteInLoop.delay)) * -1);
		
		if (tester < -0.3) {
	     var Sbar = document.getElementById("lane");
        Sbar.removeChild(Sbar.firstElementChild);
        combo = 0;
        document.getElementById("combo").innerHTML = "Combo: " + combo;
        updateNext(index, songName);
	   }
		
      i++; // Increment the index

      if (i >= window[songName].sheet[index].notes.length) {
        i = 0;
      }
  
      noteRemovalSTrack(index , i, songName);
    }, 5);
  }
}
function noteRemovalDTrack(index, i, songName) {
  if(gameStarted == true){
    setTimeout(function() {
	   var timeInSecondD = (Date.now() - startTime) / 1000;
	   i = window[songName].sheet[index].next;
		
      var currentNoteInLoop = window[songName].sheet[index].notes[i];
		var tester = ((timeInSecondD - (currentNoteInLoop.duration + currentNoteInLoop.delay)) * -1);
		
		if (tester < -0.3) {
	     var Dbar = document.getElementById("lane2");
        Dbar.removeChild(Dbar.firstElementChild);
        combo = 0;
        document.getElementById("combo").innerHTML = "Combo: " + combo;
        updateNext(index, songName);
	   }
		
      i++; // Increment the index

      if (i >= window[songName].sheet[index].notes.length) {
        i = 0;
      }
  
      noteRemovalDTrack(index, i, songName);
    }, 5);
  }
}
function noteRemovalFTrack(index, i, songName) {
  if(gameStarted == true){
    setTimeout(function() {
	    var timeInSecondF = (Date.now() - startTime) / 1000;
	    i = window[songName].sheet[index].next;
		
      var currentNoteInLoop = window[songName].sheet[index].notes[i];
	   	var tester = ((timeInSecondF - (currentNoteInLoop.duration + currentNoteInLoop.delay)) * -1);
		
	  	if (tester < -0.3) {
	      var Fbar = document.getElementById("lane3");
        Fbar.removeChild(Fbar.firstElementChild);
        combo = 0;
        document.getElementById("combo").innerHTML = "Combo: " + combo;
        updateNext(index, songName);
	    }
		
      i++; // Increment the index

      if (i >= window[songName].sheet[index].notes.length) {
        i = 0;
      }
  
      noteRemovalFTrack(index, i, songName);
    }, 5);
  }
}

//Return points on the accuracy of the hit. As of now only returns value to the judge function

var getHitJudgement = function(accuracy, object) {
  if (accuracy < 0.1) {
    
    combo++;
    if(combo > maxCombo){
      maxCombo = combo;
    }
    document.getElementById("combo").innerHTML = "Combo: " + combo;
    document.getElementById("maxCombo").innerHTML = "Max Combo: " + maxCombo;
    
    return (1000 * noteSpeed);
    
  } else if (accuracy < 0.2) {
    
    combo++;
    if(combo > maxCombo){
      maxCombo = combo;
    }
    document.getElementById("combo").innerHTML = "Combo: " + combo;
    document.getElementById("maxCombo").innerHTML = "Max Combo: " + maxCombo;
    
    return (750 * noteSpeed);
    
  } else if (accuracy < 0.3) {
    
    combo = 0;
    document.getElementById("combo").innerHTML = "Combo: " + combo;
    return (500 * noteSpeed);
    
  } else {
    
    combo = 0;
    document.getElementById("combo").innerHTML = "Combo: " + combo;
    return 0;
  }
};

//Update to the next note with the next object var inside of the song chosen to move to next note (Array)

var updateNext = function(index, songName) {
  window[songName].sheet[index].next++;
};
