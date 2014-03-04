function App() {};

App.prototype.initialise = function() {
	this.questions = $('#questions');
	this.game = $('#game');
	this.players_tiles = [];
	this.computers_tiles = [];
	this.played_tiles = []; // player_tiles + computer_tiles
	this.players_turn = false; // Set to true each time it is the players turn
	this.update_notice("A few questions before we get started...")
	this.questions.show();
}

App.prototype.submit_questions = function(name, level) {
	this.name = name || "homie";
	this.level = level || "easy";
	this.start_game();
}

App.prototype.start_game = function() {
	this.game.fadeIn();
	// Populate the game info section
	$('.legend .player').text(this.name.charAt(0).toUpperCase() + this.name.slice(1) + " (you)");
	$('.current_level').text("Current level: " + this.level)
	// The player always starts
	this.waiting_for_players_move();
}

App.prototype.waiting_for_players_move = function(tile) {
	var square_names = {
		1:"top left", 
		2:"top center", 
		3:"top right", 
		4:"middle left", 
		5:"middle", 
		6:"middle right", 
		7:"bottom left", 
		8:"bottom center", 
		9:"bottom right"
	};

	if (tile) {
		this.update_notice("Computer played the " + square_names[tile] + " tile. It's your turn now!");
	} else {
		this.update_notice("It's your turn " + this.name + "!");
	}
	this.players_turn = true;
}

App.prototype.players_move = function(tile) {
	if (this.players_turn == true && this.played_tiles.indexOf(tile) == -1) {
		// It is a valid play
	  $('a[data-tile="' + tile + '"').addClass('player');
		this.players_tiles.push(tile);
		this.played_tiles.push(tile);
		if (this.check_for_winner()) {
			this.won()
			this.players_turn = false; // Don't let player move
		} else {
			this.players_turn = false; // Don't let player move
			if (this.played_tiles.length == 9) {
				this.draw();
			} else {
				this.computers_move();
			}
		}
	}
}

App.prototype.computers_move = function() {
	this.update_notice("It's the computers turn");
	var self = this;

	setTimeout(function() { // A little delay while the computer 'thinks'
		while (self.played_tiles.length < 9) {
			var tile = Math.floor(Math.random()*9+1); // A random number from 1 to 9
			if (self.played_tiles.indexOf(tile) == -1) {
				// the tile hasn't been played
		  	$('a[data-tile="' + tile + '"').addClass('computer');
				self.computers_tiles.push(parseInt(tile));
				self.played_tiles.push(parseInt(tile));
				if (self.check_for_winner()) {
					self.lost();
				} else {
					if (self.played_tiles.length == 9) {
						self.draw();
					} else {
						self.waiting_for_players_move(tile);
					}
				}
				return;
			}
		}

	}, 1000)

}


App.prototype.check_for_winner = function() {
	/* This function checks if there's a winner
	   Returns true if a winner exists
	   Returns false if there is no winner */
	var winning_outcomes = [
		[1,2,3],
		[1,4,7],
		[1,5,9],
		[2,5,8],
		[3,6,9],
		[4,5,6],
		[7,8,9],
		[3,5,7]
	];

	if (this.players_turn == true) {
		var array_to_check = this.players_tiles;
	} else {
		var array_to_check = this.computers_tiles;
	}

	for (var i=0;i<winning_outcomes.length;i++) {
		if ((array_to_check.indexOf(winning_outcomes[i][0]) > -1) && (array_to_check.indexOf(winning_outcomes[i][1]) > -1) && (array_to_check.indexOf(winning_outcomes[i][2]) > -1)) {
			// There is a winner
			return true;
		}
	}
	return false; // No winner found - continue the game
}


/* Outcomes */

App.prototype.won = function(elem) {
	this.update_notice("You legend!!!");
	$('#game_info').fadeOut(400, function() {
		$('#won').fadeIn();
	});
}

App.prototype.lost = function() {
	this.update_notice("Bad luck " + this.name)	
	$('#game_info').fadeOut();
	$('#game_info').fadeOut(400, function() {
		$('#lost').fadeIn();
	});
}

App.prototype.draw = function() {
	this.update_notice("It's a draw")	
	$('#game_info').fadeOut();
	$('#game_info').fadeOut(400, function() {
		$('#draw').fadeIn();
	});
}

App.prototype.update_notice = function(notice) {
	$('#notice span').text(notice);
	$('#notice span').fadeIn();
}


$(document).ready(function() {
  window.tictactoe = new App();
  tictactoe.initialise();
  $('body').fadeIn();

  // Event handlers
	$('#form_qns').submit( function(evt) {
		evt.preventDefault();
		var name = $('#player_name').val();
		var level = $('#level').val();
		$('#questions').fadeOut(400, function() {
			tictactoe.submit_questions(name, level);
		});
	});

	$('.tile').click( function(evt) {
		evt.preventDefault();
		tictactoe.players_move(parseInt($(this).attr('data-tile')));
	});

	// Page reloads when .replay is clicked
	$('.replay').click( function(evt) {
		evt.preventDefault();
		$('body').fadeOut(400, function() {
			location.reload();
		});
	});


});
