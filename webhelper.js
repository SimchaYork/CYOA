/* eslint-disable no-unused-vars */
/*global config gameData getScene OPENING_SCENE_ID */
// webhelper.js
var buttonElement = document.getElementById("button1");
var currentStoryElement = document.getElementById("currentStory");
var dropdown = document.getElementById("choices");
var messages = [];
var choices;
var answer;
var textTimer;

var gameProgress = {
  id: null,
  character: null,
  currentScene: null,
  gold: 25,
  hitPoints: 10,
  flags: [],
  turnNumber: 0
};

var config = {
  START_GAME: 'START_GAME',
  SELECT_CHARACTER: 'SELECT_CHARACTER',
  PLAY_GAME: 'PLAY_GAME',
  GAME_OVER: 'GAME_OVER',
  OPTION_NEW_GAME: 'OPTION_NEW_GAME',
  OPTION_SAVE_GAME: 'OPTION_SAVE_GAME'
};

var gameData = {
  currentGameState: config.START_GAME,
  optionFlags: [],
  characters: [],
  savedGames: {},
  touchedSinceSave: false
};

var optionFlags = {};

function setup() {
  setOptions([{ choice: "", target: "" }]);
  buttonElement.innerHTML = "What will you do?"; 
  buttonElement
    .addEventListener("click", handleClick);
    // .setAttribute("onclick", "getScene(dropdown.value)");
}

function optionIsVisible(requiredFlags, blockingFlags) {
  if (requiredFlags)  {
    for (let idx = 0; idx < requiredFlags.length; idx++) {
      if (!gameProgress.flags.includes(requiredFlags[idx])) {
        return false;
      }
    }
  }
  if (blockingFlags) {
    for (let idx = 0; idx < blockingFlags.length; idx++) {
      if (gameProgress.flags.includes(blockingFlags[idx])) {
        return false;
      }
    }
  }
  return true;
}

function handleClick() {
  switch (gameData.currentGameState) {
    case config.START_GAME:
      console.log('handleClick() START_GAME');
      getNewOrSavedStory(dropdown.value);
      break;
    case config.SELECT_CHARACTER:
      console.log('handleClick() SELECT_CHARACTER');
      getCharacterSelection(dropdown.value);
      break;
    default:
      if (dropdown.value === config.OPTION_SAVE_GAME) {
        console.log('handleClick() OPTION_SAVE_GAME');
        saveGame();
      } else {
        console.log('handleClick() default');
        getScene(dropdown.value);
      }
  }
}

function addOptionFlag(target, flag) {
  optionFlags[target] = flag;
}

function clearOptionFlags() {
  Object.keys(optionFlags).forEach(function (key) {
    delete optionFlags[key];
  });
}

function makeSelection(value) {
  console.log(`You selected ${value}`);
}

function setOptions(options) {
  var dropdown = document.getElementById("choices");
  
  while (dropdown.options.length) {
      dropdown.remove(0);
  }
  if (options) {
    for (var i = 0; i < options.length; i++) {
      // This is object-oriented JavaScript (hence capital letter)
      var option = new Option(options[i].choice, options[i].target);
      dropdown.options.add(option);
      dropdown.setAttribute("onchange", "makeSelection(this.value)");
      if (options[i].flag) {
        addOptionFlag(options[i].target, options[i].flag);
      }
    }
    appendGameOptions();
  } else {
    buttonElement.innerHTML = 'The End';
    buttonElement.setAttribute('disabled', 'true');
  }
}

function appendGameOptions() {
  let option;
  if (playingGame() && gameData.touchedSinceSave) {
    option = new Option('* Save Game', 'OPTION_SAVE_GAME');
    dropdown.options.add(option);
  }
}

function playingGame() {
  return gameData.currentGameState === config.PLAY_GAME;
}

function displayStory(text) {
    currentStoryElement.innerHTML = text;
}

function getCharacterName(character) {
  return character.split(' ')[0];
}
