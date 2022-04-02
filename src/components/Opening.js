import React from 'react';

export default function Opening(props) {
    return(
        <div className="open-container">
            <h1 className="open-title">Quizzical</h1>
            <p className="open-desc">Ready to test your trivia-bility?</p>
            <button className="open-btn" onClick={props.toggle}>Start Quiz</button>
        </div>
    )
}