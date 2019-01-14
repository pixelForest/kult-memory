var socket = io.connect('http://localhost:3000');

socket.on('cardPairs',initGame);
socket.on('reset', reset);
socket.on('tooManyPlayers', tooManyPlayers);

// game functions
const cards = document.querySelectorAll('.memory-card');
var pairs = 6;
var currentMatch = 0;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');
  cardFlip(this.id);

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.card === secondCard.dataset.card;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  cardMatch(firstCard,secondCard);
  currentMatch++;
  if(currentMatch == pairs)
  {
    endGame();
  }
  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    cardUnflip(firstCard,secondCard);
    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

cards.forEach(card => card.addEventListener('click', flipCard));

//main functions
function startGame()
{
  //send id to server
  console.log("starting game: " + socket.id);
  var data = {type:"player"};
  socket.emit('startGame',data);
}

function endGame()
{
  //var data={id:socket.id};
  //socket.emit('endGamePlayer',data);
  //redirect to end screen
  window.location.href = "end.html";
}

function reset()
{
  window.location.reload();
}

function tooManyPlayers()
{
  onboarding = document.getElementById("onboarding_image");
  onboarding.src = "images/error_card_mobile.svg";
  document.getElementById("continue_button").style.display = "none";
}

function cardFlip(el)
{
  var data = {cardId:el};
  socket.emit('cardFlip',data);
}

function cardUnflip(card1,card2)
{
  var data={card1:card1.id,card2:card2.id};
  socket.emit('cardUnflip',data);
}

function cardMatch(card1,card2)
{
  var data={card1:card1.id,card2:card2.id};
  socket.emit('cardMatch',data);
}

function initGame(data)
{
  var cardCount = 0;
  var cards = document.getElementsByClassName("memory-card");
  for(var i = 0; i<cards.length; i++)
  {
    switch(cardCount)
    {
      case 0:
        cards[i].id = data.pair1 + "_a";
        cards[i].dataset.card = data.pair1;
        cards[i].firstElementChild.src = "images/card_" + data.pair1 + ".png";
        cardCount++;
      break;
      case 1:
        cards[i].id = data.pair1 + "_b";
        cards[i].dataset.card = data.pair1;
        cards[i].firstElementChild.src = "images/card_" + data.pair1 + ".png";
        cardCount++;
      break;
      case 2:
        cards[i].id = data.pair2 + "_a";
        cards[i].dataset.card = data.pair2;
        cards[i].firstElementChild.src = "images/card_" + data.pair2 + ".png";
        cardCount++;
      break;
      case 3:
        cards[i].id = data.pair2 + "_b";
        cards[i].dataset.card = data.pair2;
        cards[i].firstElementChild.src = "images/card_" + data.pair2 + ".png";
        cardCount++;
      break;
      case 4:
        cards[i].id = data.pair3 + "_a";
        cards[i].dataset.card = data.pair3;
        cards[i].firstElementChild.src = "images/card_" + data.pair3 + ".png";
        cardCount++;
      break;
      case 5:
        cards[i].id = data.pair3 + "_b";
        cards[i].dataset.card = data.pair3;
        cards[i].firstElementChild.src = "images/card_" + data.pair3 + ".png";
        cardCount++;
      break
      case 6:
        cards[i].id = data.pair4 + "_a";
        cards[i].dataset.card = data.pair4;
        cards[i].firstElementChild.src = "images/card_" + data.pair4 + ".png";
        cardCount++;
      break;
      case 7:
        cards[i].id = data.pair4 + "_b";
        cards[i].dataset.card = data.pair4;
        cards[i].firstElementChild.src = "images/card_" + data.pair4 + ".png";
        cardCount++;
      break;
      case 8:
        cards[i].id = data.pair5 + "_a";
        cards[i].dataset.card = data.pair5;
        cards[i].firstElementChild.src = "images/card_" + data.pair5 + ".png";
        cardCount++;
      break;
      case 9:
        cards[i].id = data.pair5 + "_b";
        cards[i].dataset.card = data.pair5;
        cards[i].firstElementChild.src = "images/card_" + data.pair5 + ".png";
        cardCount++;
      break;
      case 10:
        cards[i].id = data.pair6 + "_a";
        cards[i].dataset.card = data.pair6;
        cards[i].firstElementChild.src = "images/card_" + data.pair6 + ".png";
        cardCount++;
      break;
      case 11:
        cards[i].id = data.pair6 + "_b";
        cards[i].dataset.card = data.pair6;
        cards[i].firstElementChild.src = "images/card_" + data.pair6 + ".png";
        cardCount++;
      break;
    }
    //close modal
    var modal = document.getElementById("onboarding");
    modal.classList.remove("is-active");
  }
  var section = document.querySelector('section');
  for (var i = section.children.length; i >= 0; i--) {
      section.appendChild(section.children[Math.random() * i | 0]);
  }
}

//helper functions
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
