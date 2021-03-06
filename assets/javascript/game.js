// global variables
$(document).ready(function() {

    // audio clips
    let audio = new Audio('./assets/audio/dogsinthepark.wav');
    let cryDog = new Audio('./assets/audio/cryingDog.wav');
    let dogLoses = new Audio('./assets/audio/sadDog.wav');
    let dogHowlWon = new Audio('./assets/audio/dogWonHowl.wav');
    let barkready = new Audio('./assets/audio/singleBark.wav');
    let sniffSniff = new Audio('./assets/audio/dogSniffing.wav');

    // array of Playable Characters
    let characters = {
        'wahwah': {
            name: 'wahwah',
            health: 120,
            attack: 8,
            imageUrl: "./assets/images/chihuahuaCrow.png",
            enemyAttackBack: 15
        }, 
        'daschund': {
            name: 'daschund',
            health: 100,
            attack: 14,
            imageUrl: "./assets/images/daschundShoulderStand.png",
            enemyAttackBack: 5
        }, 
        'pooduhl': {
            name: 'pooduhl',
            health: 150,
            attack: 8,
            imageUrl: "./assets/images/poodleLordDance.png",
            enemyAttackBack: 20
        }, 
        'goldie': {
            name: 'goldie',
            health: 180,
            attack: 7,
            imageUrl: "./assets/images/pinkPuppy.png",
            enemyAttackBack: 20
        }
    };
    
    var currSelectedCharacter;
    var currDefender;
    var combatants = [];
    var turnCounter = 1;
    var killCount = 0;
    
    
    var renderOne = function(character, renderArea, makeChar) {
        //character is an object, renderArea is a class/id, makeChar is a string
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);
        // capitalizes the first letter in characters name
        $('.character').css('textTransform', 'capitalize');
        // conditional render
        if (makeChar === 'enemy') {
          $(charDiv).addClass('enemy');
        } else if (makeChar === 'defender') {
          currDefender = character;
          $(charDiv).addClass('target-enemy');
        }
      };
    
      // create function to render game message to DOM
      var renderMessage = function(message) {
        var gameMesageSet = $("#gameMessage");
        var newMessage = $("<div>").text(message);
        gameMesageSet.append(newMessage);
    
        if (message === 'clearMessage') {
          gameMesageSet.text('');
        }
      };
    
      var renderCharacters = function(charObj, areaRender) {
        // render all characters
        if (areaRender === '#characters-section') {
          $(areaRender).empty();
          for (var key in charObj) {
            if (charObj.hasOwnProperty(key)) {
              renderOne(charObj[key], areaRender, '');
            }
          }
        }
        // render player character
        if (areaRender === '#selected-character') {
          $('#selected-character').prepend("<span id='dogtitle'>Your Dog </span>");       
          renderOne(charObj, areaRender, '');
          $('#attack-button').css('visibility', 'visible');
        }
        // render combatants
        if (areaRender === '#available-to-attack-section') {
            $('#available-to-attack-section').prepend("Choose Your Next Opponent");      
          for (var i = 0; i < charObj.length; i++) {
    
            renderOne(charObj[i], areaRender, 'enemy');
          }
          // render one enemy to defender area
          $(document).on('click', '.enemy', function() {
            // select an combatant to fight
            name = ($(this).data('name'));
            // if defernder area is empty
            if ($('#defender').children().length === 0) {
              renderCharacters(name, '#defender');
              $(this).hide();
              renderMessage("clearMessage");
            }
          });
        }
        // render defender
        if (areaRender === '#defender') {
          $(areaRender).empty();
          for (var i = 0; i < combatants.length; i++) {
            //add enemy to defender area
            if (combatants[i].name === charObj) {
              $('#defender').append("Your selected opponent")
              renderOne(combatants[i], areaRender, 'defender');
            }
          }
        }
        // re-render defender when attacked
        if (areaRender === 'playerDamage') {
          $('#defender').empty();
          $('#defender').append("Your selected opponent")
          renderOne(charObj, '#defender', 'defender');
          barkready.play();
        }
        // re-render player character when attacked
        if (areaRender === 'enemyDamage') {
          $('#selected-character').empty();
          renderOne(charObj, '#selected-character', '');
        }
        // render defeated enemy
        if (areaRender === 'enemyDefeated') {
          $('#defender').empty();
          var gameStateMessage = "You have defeated " + charObj.name + ", you can choose to fight another doggy.";
          renderMessage(gameStateMessage);
          dogLoses.play();
        }
      };
      // this is to render all characters for user to choose their dog
      renderCharacters(characters, '#characters-section');
      $(document).on('click', '.character', function() {
        name = $(this).data('name');
        audio.play();
        //if no player char has been selected
        if (!currSelectedCharacter) {
          currSelectedCharacter = characters[name];
          for (var key in characters) {
            if (key != name) {
              combatants.push(characters[key]);
            }
          }
          $("#characters-section").hide();
          renderCharacters(currSelectedCharacter, '#selected-character');
          // this is to render all characters for user to choose fight against
          renderCharacters(combatants, '#available-to-attack-section');
        }
      });
    
      // create functions to enable actions between objects
      $("#attack-button").on("click", function() {
        // if defender area has enemy
        if ($('#defender').children().length !== 0) {
          // defender state change
          var attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
          renderMessage("clearMessage");
          //combat
          currDefender.health = currDefender.health - (currSelectedCharacter.attack * turnCounter);
    
          // win condition
          if (currDefender.health > 0) {
            //enemy not dead keep playing
            renderCharacters(currDefender, 'playerDamage');
            //player state change
            var counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.enemyAttackBack + " damage.";
            renderMessage(attackMessage);
            renderMessage(counterAttackMessage);
    
            currSelectedCharacter.health = currSelectedCharacter.health - currDefender.enemyAttackBack;
            renderCharacters(currSelectedCharacter, 'enemyDamage');
            if (currSelectedCharacter.health <= 0) {
              renderMessage("clearMessage");
              restartGame("You have been defeated...GAME OVER!!!");
              cryDog.play();
              $("#attack-button").unbind("click");
            }
          } else {
            renderCharacters(currDefender, 'enemyDefeated');
            killCount++;
            if (killCount >= 3) {
              renderMessage("clearMessage");
              restartGame("You Won YAY!!! GAME OVER!!!");
              dogHowlWon.play();
              // The following line will play the imperial march:
              setTimeout(function() {
              audio.play();
              }, 2000);
    
            }
          }
          turnCounter++;
        } else {
          renderMessage("clearMessage");
          renderMessage("No doggy here.");
          sniffSniff.play();
        }
      });
    
    //Restarts the game - renders a reset button
      var restartGame = function(inputEndGame) {
        //When 'Restart' button is clicked, reload the page.
        var restart = $('<button class="btn">Restart</button>').click(function() {
          location.reload();
        });
        var gameState = $("<div>").text(inputEndGame);
        $("#gameMessage").append(gameState);
        $("#gameMessage").append(restart);
      };
    
    });