describe("Tic Tac Toe", function() {

  beforeEach(function() {
    window.tictactoe = new App();
    tictactoe.initialise();
  });

  it("should initialise correctly", function() {
    expect(tictactoe.questions).toEqual($('#questions'));
    expect(tictactoe.game).toEqual($('#game'));
    expect(tictactoe.players_tiles).toEqual(tictactoe.computers_tiles);
    expect(tictactoe.winning_outcomes.length).toEqual(8);

  });

  describe("User starts a game", function() {
    beforeEach(function() {
      var name = "Lyn"
      var random = Math.random() > 0.5;
      if (random) {
        var level =  "easy";
      } else {
        var level = "hard";
      }
      tictactoe.submit_questions(name, level);
    });

    it("sets name, level and players_turn correctly", function() {
      expect(["easy", "hard"]).toContain(tictactoe.level);
      expect(tictactoe.name).toEqual("Lyn");
      expect(tictactoe.players_turn).toBeTruthy();
    });


    describe("User clicks a tile", function() {

      beforeEach(function() {
        spyOn(tictactoe, 'calculate_computers_move');
        var tile = Math.floor(Math.random()*9+1); // A random number from 1 to 9
        tictactoe.players_move(tile);
      });



      it ("executes players move and starts computers turn", function() {
        // Invoke function

        expect(tictactoe.players_turn).toBeFalsy();
        expect(tictactoe.played_tiles.length).toEqual(1);
        expect(tictactoe.players_tiles.length).toEqual(1);
        expect(tictactoe.calculate_computers_move).toHaveBeenCalled();

      });


    });

  });

});
