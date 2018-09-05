$(document).ready(function () {

    // players!
    var characters = {
        "wahWah": {
            name: "Wah Wah",
            healthPts: 120,
            attackPwr: 8,
            imageUrl: "./assets/images/chihuahuaCrow.jpg",
            counterAttackPwr: 15
        },
        "daschUnd": {
            name: "Dasch Und",
            healthPts: 100,
            attackPwr: 14,
            imageUrl: "./assets/images/daschundShoulderStand.jpg",
            counterAttackPwr: 5
        },
        "pooDuhl": {
            name: "Poo Duhl",
            healthPts: 150,
            attackPwr: 8,
            imageUrl: "./assets/images/poodleLordDance.jpg",
            counterAttackPwr: 20
        },
        "goldie": {
            name: "Goldie",
            healthPts: 180,
            attackPwr: 7,
            imageUrl: "./assets/images/chihuahuaCrow.jpg",
            counterAttackPwr: 20,
        }
    }

    var currentPlayer;
    var currentDefender;
    var enemies = [];
    var attackResult;
    var turnCounter = 1;
    var killCounter = 0;

    var renderOne = function (character, renderArea, makeChar) {
        //character: obj, renderArea: class/id, makeChar: string
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);
        //Capitalizes the first letter in characters name
        // $('.character').css('textTransform', 'capitalize');
        // conditional render
        if (makeChar == 'enemy') {
            $(charDiv).addClass('enemy');
        } else if (makeChar == 'defender') {
            currDefender = character;
            $(charDiv).addClass('target-enemy');
        }
    };

});