initGame();

var socket = io();
socket.on('cardFlip',clickElement);
socket.on('cardUnflip',unflipCards);
socket.on('cardMatch',disableCards);
//socket.on('reset', endGame);

// game functions
const cards = document.querySelectorAll('.memory-card');
var pairs = 24;
var currentMatch = 0;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  this.classList.add('flip');
}

function checkForMatch() {
  let isMatch = firstCard.dataset.card === secondCard.dataset.card;

  isMatch ? disableCards() : unflipCards();
}

function disableCards(data) {
  card1 = document.getElementById(data.card1);
  card2 = document.getElementById(data.card2);
  card1.removeEventListener('click', flipCard);
  card2.removeEventListener('click', flipCard);
  for (var i = 0; i < card1.childNodes.length; i++) {
    if (card1.childNodes[i].className == "reveal-face") {
      card1.childNodes[i].classList.add("reveal-show");
      break;
    }
  }
  for (var i = 0; i < card2.childNodes.length; i++) {
    if (card2.childNodes[i].className == "reveal-face") {
      card2.childNodes[i].classList.add("reveal-show");
      break;
    }
  }
  //remove cards
  currentMatch++;
  if(currentMatch == pairs)
  {
    reveal = document.getElementById("reveal");
    reveal.classList.add("reveal-show");
    setTimeout(function(){ endGame(); }, 15000);
    //endGame();
  }
  resetBoard();
}

function unflipCards(data) {
  card1 = document.getElementById(data.card1);
  card2 = document.getElementById(data.card2);
  card1.classList.remove('flip');
  card2.classList.remove('flip');
  resetBoard();
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function clickElement(data)
{
  var card = document.getElementById(data);
  card.click();
}

cards.forEach(card => card.addEventListener('click', flipCard));


//main methods
function endGame()
{
  socket.emit('endGame');
  window.location.reload();
}

function initGame()
{
  var section = document.querySelector('section');
  for (var i = section.children.length; i >= 0; i--) {
      section.appendChild(section.children[Math.random() * i | 0]);
  }
  for(var i = 0; i < section.children.length; i++)
  {
    var img = document.createElement("img");
    var num = i+1;
    img.src = "images/slices/end_card_slice_"+ num +".png";
    img.className = "reveal-face";
    section.children[i].appendChild(img);
  }
  var img = document.createElement("img");
  img.src = "images/end_card_complete.png";
  img.id = "reveal";
  section.appendChild(img);
}

document.addEventListener('keydown', function(e){
  if (e.keyCode == 75)
  {
    endGame();
  }
});
