//developed from examples here: 

var PenNotes = [48, 50, 52, 55, 57, 60, 62, 64, 67, 69]; //array to hold the pentomic scale
var MusicNotes = []; //this array at setup holds PenNotes[]. When submit Midi clicked+use Custom checked, it takes in userNotes[]

var serial; // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbserial-A5026YQG'; // fill in your serial port name here
var lastTime = 0; //timer to keep steps from overlapping
var osc; // hold oscillator library

var submit, selectButton, instructions, boxSelection; // value to hold values for midi submissions
var fileLoad, fileValue, canvas, file, soundLoadInstructions, userUpload, userPlayInstructions;
var userMedia = false;
var music = [];
var divideMusicUpload = [];
var steps = [];
var stepCalibration, stepInstructions;
var stepMachine = false;

var stepVals = [];
var stepChanges = [];

var synths = [];

var menus = [];
var menuSel = [];
var noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// THINGS I AM ADDING
var noteNameIDs = ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3"];
var synth;
var activeNotes = [];
var userSounds = [];

//ADDING 4-7-16
var userSoundUpload;
var thisPlayer;
var myFile;

//ADDING 4-14-16
var stepFunctions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

//ADDING 4-21-16
var soundFiles = [];

//ADDING 4-28-16
var keyKeys = [];
var userFiles = [];
var fileNum = 0;
var fileNName;


function setup() {
  
  //keyKeys are transparent drag/drop divs wrapping every key drawn
  
  for (var i = 0; i < 10; i++) {
  keyKeys[i] = createImg('keyPic5.png');
  keyKeys[i].position((100 * i)+15, 0);
  keyKeys[i].size(100, 300);
  keyKeys[i].addClass('bname');
  keyKeys[i].bname = i;
  keyKeys[i].addClass('filePointer');
  keyKeys[i].filePointer = false;
  keyKeys[i].drop(gotAFile.bind(keyKeys[i]), postFile);
  keyKeys[i].mousePressed(playKey);
  }
  
  createCanvas(1000, 600);
  
  for (var n = 0; n < PenNotes.length; n++) {
    MusicNotes.push(PenNotes[n]);
  }
  
  //dropdown under every key
  for (var m = 0; m<10; m++) {
    menus[m] = createSelect();
    menus[m].position(m * 100 + 20, 310);
    menus[m].option(noteNames[m]);
    menus[m].option('Splat!');
  // deleted JF 4-14
    menus[m].changed(fhwqads);
  }
  
  //Do we need this? OS 4-28
  // for (var n = 0; n<10; n++) {
  // soundFiles[n] = createFileInput(createSound);
  // soundFiles[n].position(n * 100, 380);
  // }
  
  userUpload = createCheckbox();
  userUpload.position(15, 415);
  userUpload.changed(UploadedMedia);
  userPlayInstructions = createDiv("Check to use uploaded sounds");
  userPlayInstructions.position(30, 415);
  
  soundFile = createFileInput(createSound);
  soundFile.position(15, 380)
  soundLoadInstructions = createDiv("");
  soundLoadInstructions.position(150, 380);

  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing
  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port
  
  synth = new Tone.PolySynth(6, Tone.SimpleSynth).toMaster(); //JFEDIT
  for (var aN = 0; aN<12; aN++) {
    activeNotes[aN] = false;
  } // JFEDIT
  
  // for (var s = 0; s<12; s++) {
  //   synths[s] = new p5.Oscillator();
  //   synths[s].start();
  //   synths[s].amp(0);
  //   stepVals[s] = 0;
  //   stepChanges[s] = 0;
  // } JFEDIT
  
 /* osc = new p5.SinOsc(); // A sine oscillator
  // Start silent
  osc.start();
  osc.amp(0);  JFEDIT */ 

}

function gotAFile(file) {
  console.log(this.bname);
  userFiles[fileNum] = createAudio(file.data).hide();
  userFiles[fileNum].play();
  console.log(userFiles.length);
  keyKeys[this.bname].filePointer = fileNum;
  fileNum++;
}

function postFile() {
  userFiles.push(fileNName);
  keyKeys[this.bname].addClass('nname');
  keyKeys[this.bname].name = files.length - 1;
}

function playKey() {
if (this.filePointer !== false) {
  userFiles[this.filePointer].play();
}
}

// A function to play a note
function playNote(note, duration) {
  osc.freq(midiToFreq(note));
  // fade(value, seconds from now)
  osc.amp(1);
  osc.fade(1, 0.1);
}

function fhwqads() { //JFEDIT4-7

 if (this.value() == 'Upload a File') {
    var x = document.createElement("INPUT");
    x.setAttribute("type", "file");
    document.body.appendChild(x);
  }
}
function draw() {
  
  background(255);

  var w = width / PenNotes.length;
  for (var i = 0; i < PenNotes.length; i++) {
    var x = i * w;
    // If the mouse is over the key
    if (mouseX > x && mouseX < x + w && mouseY < 300) {
      // If we're clicking
      if (mouseIsPressed) {
        fill(100, 255, 200, 30);
        // Or just rolling over
      } else {
        fill(127);
      }
    } else {
      fill(255, 0, 0);
    }
    rect(x+15, 0, w , 300, 20); // key design
    //print(music.length);
  }
 playAllNotes(); //JFEDIT
 
  
 
} //draw loop ends

function CalibrateSteps() {
  stepMachine = !stepMachine;
  return stepMachine;
}

// Fade it out when we release
function mouseReleased() {
  //osc.fade(0, 0.25);
}

function serverConnected() {
  println('connected to server.');
}

function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    println(i + " " + portList[i]);
  }
}

function portOpen() {
  println('the serial port opened.')
}

function processStepInput(dataSet) {
  
  //takes string of data from Arduino and extracts ID and FSR input - JFEDIT
var stepID;

if (dataSet === NaN) {
  var noteData = split(dataSet, ",");
  stepID = Number(noteData[0]);
  var stepVal = Number(noteData[1]);
}

else {
  stepID = dataSet;
}
  
  if (!activeNotes[stepID]) {
    synth.triggerAttack(noteNameIDs[stepID]);
    activeNotes[stepID] = true;
  }
  //stepVals[stepID] = map(stepVal, 0, 150, 0, 1);
  stepChanges[stepID] = millis();
  
}

function serialEvent() {
  // read a string from the serial port
  // until you get carriage return and newline:
  var inString = serial.readStringUntil('\r\n');

  //check to see that there's actually a string there:
  if (inString.length > 0) {
      processStepInput(inString);
      
      //var inData = Number(inString);
  }

  /*if (stepMachine === true && inData > 0) {
    steps.push(inData);
    print(steps[0]);
  }
  else {
    if (inData === 1) {
      if (millis() - lastTime > 50 && userMedia === false) {
        playNote(MusicNotes[0]);
        lastTime = millis();
      }
      if (millis() - lastTime > 50 && userMedia === true) {
        music[0].play();
      }
    }

    if (inData === 0) {
      osc.fade(0, 0.5);
    }

    if (inData === 2) {
      if (millis() - lastTime > 50 && userMedia === false) {
        playNote(MusicNotes[1]);
        lastTime = millis();
      }
      if (millis() - lastTime > 50 && userMedia === true) {
        music[1].play();
      }
    }

    if (inData === 3) {
      if (millis() - lastTime > 50 && userMedia === false) {
        playNote(MusicNotes[2]);
        lastTime = millis();
      }
      if (millis() - lastTime > 50 && userMedia === true) {
        music[2].play();
      }
    }

    if (inData === 4) {
      if (millis() - lastTime > 50 && userMedia === false) {
        playNote(MusicNotes[3]);
        lastTime = millis();
      }
      if (millis() - lastTime > 50 && userMedia === true) {
        music[3].play();
      }
    }

    if (inData === 5) {
      if (millis() - lastTime > 50 && userMedia === false) {
        playNote(MusicNotes[4]);
        lastTime = millis();
      }
      if (millis() - lastTime > 50 && userMedia === true) {
        music[4].play();
      }
    }

    if (inData === 6) {
      if (millis() - lastTime > 50 && userMedia === false) {
        playNote(MusicNotes[5]);
        lastTime = millis();
      }
      if (millis() - lastTime > 50 && userMedia === true) {
        music[5].play();
      }
    }

    if (inData === 7) {
      if (millis() - lastTime > 50 && userMedia === false) {
        playNote(MusicNotes[6]);
        lastTime = millis();
      }
      if (millis() - lastTime > 50 && userMedia === true) {
        music[6].play();
      }
    }

    if (inData === 8) {
      if (millis() - lastTime > 50 && userMedia === false) {
        playNote(MusicNotes[7]);
        lastTime = millis();
      }
      if (millis() - lastTime > 50 && userMedia === true) {
        music[7].play();
      }
    }

    if (inData === 9) {
      if (millis() - lastTime > 50 && userMedia === false) {
        playNote(MusicNotes[8]);
        lastTime = millis();
      }
      if (millis() - lastTime > 50 && userMedia === true) {
        music[8].play();
      }
    }

    if (inData === 10) {
      if (millis() - lastTime > 50 && userMedia === false) {
        playNote(MusicNotes[9]);
        lastTime = millis();
      }
      if (millis() - lastTime > 50 && userMedia === true) {
        music[9].play();
      }
    }
  }*/
}

function createSound(fileSound) {
  
    var files = fileSound.file;
    var file = URL.createObjectURL(files); 
        
        userSoundUpload = file; 
            
  console.log(userSoundUpload);
            
// thisPlayer = new Tone.Player({
// 	"url" : userSoundUpload,
// 	"autostart" : true,
// }).toMaster();

  //userSoundUpload = URL.createObjectURL(fileSound);
  thisPlayer = new Tone.Player(userSoundUpload, startPlayer).toMaster();

}

function startPlayer() {
  thisPlayer.start();
}

function UploadedMedia() {
  userMedia = !userMedia;
  MusicNotes.splice(0, MusicNotes.length);
  if (userMedia === true && music.length > 0) {
    for (var u = 0; u < 10; u++) {
      MusicNotes.unshift(music[u]);
    }
  }
  if (userMedia === false && boxSelection === false) {
    for (var n = 0; n < PenNotes.length; n++) {
      MusicNotes.push(PenNotes[n]);
    }
  }
}

function loadedSoundFile() {
  music.unshift(musicFile);
  music[0].play();
}

function serialError(err) {
  println('Something went wrong with the serial port. ' + err);
}

function portClose() {
  println('The serial port closed.');
}

function playAllNotes() {
  
  //JFEDIT - also we are hardcoding number of steps all over the place but that needs to be a variable

  for (var i=0; i<12; i++) {
    if(stepChanges[i]<(millis()-500) && activeNotes[i] === true) {
      synth.triggerRelease(noteNameIDs[i]);
      activeNotes[i] = false;
    }
  }

}