function Cell(size, state){
	this.size = size;
	this.state = typeof state === 'undefined' ? 0 : state;
	this.fill = '#eee';
	this.setPos = function(pos){
		this.pos = pos;
	}
	this.changeSize = function(size) {
		this.size = size;
	}
	this.draw = function( ctx){
		ctx.fillStyle = this.fill;
		ctx.fillRect(this.pos[0], this.pos[1], this.size, this.size);
	}
}
function Button(pos, size, text, action, color){
	this.size = size;
	this.pos = pos;
	this.text = text;
	this.color = typeof color !== 'undefined' ? color: '#999'; 
	this.action = action;
	this.setPos = function(pos){
		this.pos = pos;
	}
	this.draw = function(ctx){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.pos[0], this.pos[1], this.size[0],this.size[1]);
		ctx.fillStyle = '#fff';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle'
		ctx.fillText(this.text, this.pos[0] +( this.size[0]/2 ), this.pos[1]+(this.size[1]/2) );
	}
}

function TicTacToe(){
	var that = this;
	//var board;
	var buttons = {};
	var wins = [[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7], [2,5,8]];
	var turn =0;
	var canvas_width;
	var canvas_height;
	var cell_size;
	
	this.draw = function(){
		
		var canvas = document.getElementById('canvas');
		canvas.width = canvas_width;
		canvas.height = canvas_height;
		
		if (canvas.getContext){
			var ctx = canvas.getContext('2d');
			ctx.clearRect( 0,0,canvas_width,canvas_height);
			ctx.font = '2em Verdana';
			ctx.textAlign = 'left';
			ctx.fillStyle = 'red';
			ctx.fillText('Red : ' + scores[0], .720 * canvas_width, .060 * canvas_height);
			ctx.fillStyle = 'blue';
			ctx.fillText('Blue : ' + scores[1], .720 * canvas_width, .260 * canvas_height);
			ctx.font = '20px Verdana';
			canvas.addEventListener('mousedown', that.doMouseDown, false);
			for (var button in buttons){
				buttons[button].draw(ctx);
			}
			var i = 0;
			for (var row = 0;row < 3; row++){
				for (var col=0; col < 3; col++){
					board[ i ].setPos([1.1*cell_size*col, 1.1*cell_size*row]);
					board[ i ].draw(ctx);
					i++;
				}
			}
			turn = that.checkWins() - 1 || turn;
			that.ai();
		}
		window.onresize = function() {
			var t_size = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
			canvas_height = canvas_width = t_size;
			cell_size = t_size / 5;
			for(var cell in board){
				board[cell].changeSize(cell_size);
			}
			for(var button in buttons) {
				buttons[button].setPos([.720 * canvas_width, .500 * canvas_height]);
			}
		}
	};
	//checks if a player has won. returns state for later implementation into a related game
	this.checkWins = function(){
		if (gameOn){
			for(var w= 0; w<wins.length;w++){
				var i = wins[w];
				if (board[i[0]].state != 0 && board[i[0]].state == board[i[1]].state && board[i[0]].state == board[i[2]].state){
					gameOn = false;
					scores[board[i[0]].state -1]++;
					return i[0].state;
				}
			}
		}
	};
	
	//Checks if player (represented by num) will win in 1 move
	this.checkWinning = function(num){
		var cell;
		for (var i=0; i < wins.length; i++){
				var w = wins[i];
				if (board[w[0]].state == num && board[w[0]].state == board[w[1]].state && board[w[2]].state == 0){
					cell = board[w[2]];
					break;
				} else if (board[w[0]].state == num && board[w[0]].state == board[w[2]].state && board[w[1]].state == 0){
					cell = board[w[1]];
					break;
				}else if (board[w[1]].state == num && board[w[1]].state == board[w[2]].state && board[w[0]].state == 0){
					cell = board[w[0]];
					break;
				}
			}
		return cell;
	};
	this.doMouseDown = function(e){
		var x = e.pageX;
		var y = e.pageY;
		for (var i=0; i < board.length; i++){
			var cell = board[i];
			if (x > cell.pos[0] && x < cell.pos[0] + (1.1*cell_size)){
			if(y > cell.pos[1] && y < cell.pos[1] + (1.1*cell_size)){
				if (cell.state == 0 && turn == 0 && gameOn){
					cell.fill = 'red';
					cell.state = 1;
					turn = 1;
					}
				}
			}
		}
	for (b in buttons){
		var button = buttons[b];
		if (x > button.pos[0] && x < button.pos[0] + button.size[0]){
			if (y > button.pos[1] && y < button.pos[1] + button.size[1]){
				button.action();
			}
		}
	}
};
	this.ai = function(){
			var cell;
			var j;
			cell = (that.checkWinning(2) || that.checkWinning(1)) || that.randomCell();
			if (typeof(cell) != 'undefined' && gameOn && turn == 1){
				cell.fill = 'blue';
				cell.state = 2;
				turn = 0;
			}
	};
	this.randomCell = function(){
		var c = Math.floor(Math.random()*board.length);
		if (board[c].state == 0){
			return board[c];
		}
	};

	this.init = function(width, height){
		canvas_width = typeof width == 'undefined' ? window.innerWidth : width;
		canvas_height = typeof height == 'undefined' ? window.innerHeight : height;
		cell_size = canvas_width / 5;
		scores = [0,0];
		var newGameButton = new Button([.720 * canvas_width ,.440 * canvas_height ],[200,80],"New Game", that.newGame, "#bbb");
		buttons['newGame'] = newGameButton;
		setInterval(this.draw, 1000/60);
		this.newGame();
	};
	this.newGame = function(){
		board = [];
		gameOn = true;
		for (var i = 0; i < 9; i++){
			board[i] = (new Cell(cell_size));
		}
	};
	
}