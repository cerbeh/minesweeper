/*
* Lets build this with classes.
* We currently are thinking that we might want to have a class for the dom manipulation for;
* pregame / game / aftergame
* and then there will be some game logic classes.
* then we'll gather them all in with our compiler we're thiknking of making.. maybe.
*/

class GameBoard {
  constructor() {
    this.boardPieces = {
      mines: []
    };
    this.gameBoard = this.createGrid();
    this.handleClick = this.handleClick.bind(this);
  }

  generateMine() {
    return Math.floor(Math.random() * 100) >= 82
      ? true
      : null;
  }

  handleClick(e) {
    e.preventDefault();
    const y = e.target.attributes['data-y'].value;
    const x = e.target.attributes['data-x'].value;

    e.which ? this.leftClick(x,y) : this.rightClick(x,y);
  }

  leftClick(x,y) {

    console.log(`
      clicked ${y}${x},
      ${this.gameBoard[x][y].number},
      ${this.gameBoard[x][y].marked},
      ${this.gameBoard[x][y].clicked}`
    );

    //const below checks the buttons coordinates and then compares them to the array storing all the known coordinates of mines

    const hasMine = this.boardPieces.mines.some(el => el[0] === +x && el[1] === +y);
    console.log(hasMine);

    this.gameBoard[y][x].clicked = true;

    this.boardPieces.mines.some(el => el[0] === +x && el[1] === +y) ? console.log('kaboom') : document.getElementById(`${y}${x}`).className = 'empty';
  }

  generateCellNumber(a,b,array) {
    let number = 0;

    /*
    a === row number
    -1 is above, +1 is below,

    b === column number
    -1 is left, + 1 is right
    */

    //Can we look at having each if for when we've established where we are defining an array and then that array can be used to reduce a number that can be made as a reduce.

    if (!array[a][b].mine) {
      //Top row
      if (a === 0) {
        if (b === 0) {
          // number = 'top left';
          // console.log(boardPieces.mines);
          if (array[a+1][b].mine) number++;
          if (array[a+1][b+1].mine) number++;
          if (array[a][b+1].mine) number++;
        } else if (b=== (array.length-1)) {
          if (array[a][b-1].mine) number++;
          if (array[a+1][b].mine) number++;
          if (array[a+1][b-1].mine) number++;
        } else {
          // number = 'top row';
          if (array[a][b-1].mine) number++;
          if (array[a+1][b-1].mine) number++;
          if (array[a][b+1].mine) number++;
          if (array[a+1][b].mine) number++;
          if (array[a+1][b+1].mine) number++;
        }
        //Bottom row
      } else if (a === (array.length -1)) {
        if (b === 0) number = 'bottom left';
        else if (b === (array.length-1)) number = 'bottom right';
        else number = 'bottom row';
        //Middle
      } else {
        if (b === 0) {
          // number = 'left middle';
          if (array[a][b+1].mine) number++;
          if (array[a+1][b].mine) number++;
          if (array[a+1][b+1].mine) number++;
        } else if (b === (array.length - 1)) number = 'right middle';
        else number = 'body';
      }
    }
    return number;
  }

  createGrid() {
    let gameBoard = Array(10).fill(null).map((e,i) => {
      return Array(10).fill(null).map((f,j) => {
        const mine =  this.generateMine();
        if (mine) this.boardPieces.mines.push([i,j]);
        return {
          mine: mine ? true : false,
          marked: false
        };
      });
    });

    gameBoard = gameBoard.map((e,i,array) => e.map((f,j) => {
      return {
        ...f,
        number: this.generateCellNumber(i,j,array)
      };
    }));

    return gameBoard;
  }

  rightClick(x,y) {

    console.log(`clicked ${y}${x}, ${this.gameBoard[y][x].number}, ${this.gameBoard[y][x].marked}`);

    document.getElementById(`${y}${x}`).classList.toggle('marked');

  }
}

//Could we do some sort of weird calculating here where we are giving it words as a name and then we can use these to dynamically reference an object that has the calculation in it?








window.onload = () => {

  const gameBoard = new GameBoard('test');

  function setButtons(grid) {
    gameBoard.gameBoard.forEach((row,i) =>{
      const rowWrapper = document.createElement('div');
      row.forEach((column, j) => {
        const button = document.createElement('button');
        button.dataset.x = j;
        button.dataset.y = i;
        button.id = `${i}${j}`;

        button.addEventListener('click',gameBoard.handleClick);

        button.addEventListener('contextmenu', gameBoard.handleClick);


        rowWrapper.appendChild(button);
        grid.appendChild(rowWrapper);
      });
    });
  }

  const init = () => {
    const grid = document.createElement('div');
    grid.id = 'grid';
    grid.className = 'grid-style';

    setButtons(grid);
    document.body.appendChild(grid);
  };

  init();

};
