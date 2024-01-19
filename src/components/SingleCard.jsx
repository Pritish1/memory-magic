import "./SingleCard.css" 

const SingleCard = ({card, handleChoice, flipped, blocked}) => {     //the curly braces for card are important
    
    const handleClick = () => {
        if(!blocked)
            handleChoice(card);
    }
    
    return (
    <div className="card">
        <div className= {flipped ? "flipped" : ""}>
            <img className="front" src={card.src} alt="front side" />
            <img className="back" onClick={handleClick} src="/memory-magic/img/cover.png" alt="back side" />
        </div>
    </div>
    )
};

export default SingleCard;