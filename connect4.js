/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
const htmlBoard = document.querySelector("#board");
let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
const currentPlayer = document.querySelector("#currentPlayer");
let intervalId;
/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  board = Array(HEIGHT).fill().map(()=>Array(WIDTH).fill(null));
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: add comment for this code
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  top.addEventListener("mouseover", function(e){
    e.target.classList.add(`p${currPlayer}`)
  });
  top.addEventListener("mouseout", function(e){
    e.target.classList="";
  });
  
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  
  let tmp = [];
  for(let y of board){
    tmp.push(y[x])
  }
  let result = tmp.lastIndexOf(null);
  if(result!=-1){
    return result;
  } else{
    return null;
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let result = document.createElement('div');
  let resultcontainer = document.createElement('div');
  let position = document.getElementById(y+'-'+x);
  resultcontainer.classList.add('pieceContainer');
  result.classList.add('piece',`p${currPlayer}`);
  resultcontainer.append(result);
  position.append(resultcontainer);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  const tableHead = document.querySelector("#column-top");
  tableHead.removeEventListener("click",handleClick);
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  evt.target.classList="";

  // get x from ID of clicked cell\
  let x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  
  board[y][x]=currPlayer;
  // check for win
  if (checkForWin()) {
    let winner = document.querySelectorAll(`.p${currPlayer}`);
    winner = Array.from(winner);
    winner.forEach(function(val){
      val.classList.toggle("winner");
      val.classList.toggle(`p${currPlayer}`);
    })
    intervalId = setInterval(function(){
      let tmp = randomRGB();
      winner.forEach(function(val){
        val.style.backgroundColor= tmp;
      })
    },1000)
    return endGame(`Player ${currPlayer} won!`);
  }
  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if(board.every((val)=>{
    return val.every(el=>{
      return el;
    })
  })){
    endGame(`It is a tie!`)
  }
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  if(currPlayer===1){
    currPlayer=2;
  }else{
    currPlayer=1;
  }
  
  currentPlayer.innerText =  `Current Player: Player ${currPlayer}`;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

//function to restart the game
const restartBtn = document.querySelector("#restart");
restartBtn.addEventListener("click",function(el){
  htmlBoard.innerHTML="";
  makeBoard();
  makeHtmlBoard();
  clearInterval(intervalId);
  
  let winner = document.querySelectorAll(`.winner`);
    winner = Array.from(winner);
    winner.forEach(function(val){
      val.classList.remove("winner");
      val.classList.add(`p${currPlayer}`);
      val.style.backgroundColor="";
    })
  currPlayer=1;
  currentPlayer.innerText =  `Current Player: Player ${currPlayer}`;
})

makeBoard();
makeHtmlBoard();

//random RGB color generator 
function randomRGB(){
  const r = Math.floor(Math.random()*256);
  const g = Math.floor(Math.random()*256);
  const b = Math.floor(Math.random()*256);
  return `rgb(${r},${g},${b})`
}

//hover on table head
