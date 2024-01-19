import { useEffect, useState } from 'react';
import './App.css'
import SingleCard from './components/SingleCard';

const cardImages = [            //keeping this outside of the component so that we don't need to reinitialize this every time the comp re-renders
    {"src": "/img/helmet-1.png", matched: false}, //alt-click at multiple places to have multiple cursors
    {"src": "/img/scroll-1.png", matched: false},
    {"src": "/img/ring-1.png", matched: false},
    {"src": "/img/potion-1.png", matched: false},
    {"src": "/img/shield-1.png", matched: false},
    {"src": "/img/sword-1.png", matched: false}
  ]


function App() {
  const [cards, setCards] = useState([]);  //saving the cards array to the state with default value as an empty array
  const [turn, setTurn] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const [matched, setMatched] = useState(0);
  const [bestScore, setBestScore] = useState(1000);
  //duplicate the cardImages and sort them, i.e. shuffle them, add a random id to each card
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages].sort(() => Math.random() - 0.5).map((card) => ({...card, id: Math.random()}));
    setCards(shuffledCards);
    setTurn(0);
    setMatched(0); 
  }

  const handleChoice = (card) => {  //we cannot compare the choices here because this is not instantaneous and takes time to update
    console.log(`Card with id ${card.id} and src ${card.src} clicked`);
    if(choiceOne) setChoiceTwo(card);
    else setChoiceOne(card);
  }

  useEffect(() => {  //to solve the above problem, we need to use useEffect which will be fired after every render once and also when any dependecy listed in the array changes.
    if(choiceOne && choiceTwo){
      setBlocked(true); // during evaluation, we must not allow any other clicks
      if(choiceOne.src === choiceTwo.src) {  //both cards match, change the cards state to update matched property
        setCards(prevCards => {
          return prevCards.map(card => {    //the return here is needed
            if(card.src === choiceOne.src) 
              return {...card, matched: true}; //as the transformation in map involves creating new objects, return statement is necessary, for simple transformation, implicit return can be used.
            else 
              return card});
        });
        setMatched(prevMatched => prevMatched + 1);
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
        console.log("Cards don't match");
      }
      console.log(`Turn : ${turn}`);
    }
  }, [choiceOne, choiceTwo]);

  //console.log(cards);

  //reset turn function to be called when we make two choices
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurn(prevTurn => prevTurn + 1); //increment the turn state
    setBlocked(false);
  }

  useEffect (() => {   //start the game when the component first loads, no need to click the start game button for the first time.
    shuffleCards();
  }, []);   // no dependencies, so this will be triggered only when the component first loads
  
  useEffect (() => {   //sets the best till now score
    if(matched == 6){
      setBestScore(prevBestScore => {
        if(prevBestScore > turn)
          return turn;
        else
          return prevBestScore;
      });
    }
  }, [matched]);

  return (
    <div className="App">
      <h1>Memory Magic</h1>
      <button onClick={shuffleCards}>Start new game!</button>
      <div className="card-grid">
        {
          cards.map((card) => (
            <SingleCard key={card.id} card={card}  handleChoice={handleChoice} 
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            blocked={blocked}
            />
          ))
        }
      </div>
      <h1>Turn {turn}</h1>
      <h2>Matched pairs {matched}</h2>
      <div>
      {
        bestScore != 1000 ? (
          <h2>Best score {bestScore}</h2>
        ) : <h2>Set a new record!</h2>
      }
      </div>
      

    </div>
  );
}

export default App