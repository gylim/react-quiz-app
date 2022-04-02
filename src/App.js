import React, {useState, useEffect} from 'react';
import Opening from './components/Opening'
import Questions from './components/Questions'

function App() {
  const [finalScore, setFinalScore] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [trivia, setTrivia] = useState([]);
  const [answer, setAnswer] = useState({});
  const [checkAns, setCheckAns] = useState(false);

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  function processData(obj) {
    let results = obj.results
    for (let i=0; i < results.length; i++) {
      let ans = (results[i].incorrect_answers).concat(results[i].correct_answer)
      shuffle(ans)
      results[i].options = ans
    }
    return results;
  }

  function handleChange(event) {
    const {name, value} = event.target
    setAnswer(prevFormData => {
      return {...prevFormData,
        [name]: value
        }
    })
  }

  function toggle() {
    setIsOpen(prev => !prev);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setCheckAns(true);
    setFinalScore(trivia.reduce((score, triv) => {
      let qstns = Object.keys(answer)
      for (let i = 0; i <qstns.length; i++) {
        if (qstns[i] === triv.question && answer[qstns[i]] === triv.correct_answer) {
          score ++;
        }
      }
      return score;
    }, 0));
  }

  function resetQuiz() {
    setCheckAns(false);
    setFinalScore(0);
    const fetchData = async () => {
      const res = await fetch('https://opentdb.com/api.php?amount=5');
      const data = await res.json();
      setTrivia(processData(data));
    }
    fetchData()
      .catch(console.error)
  }

  useEffect(function () {
    const fetchData = async () => {
      const res = await fetch('https://opentdb.com/api.php?amount=5');
      const data = await res.json();
      setTrivia(processData(data));
    }
    fetchData()
      .catch(console.error)
  }, [])

  const QnA = trivia.length>0 ? trivia.map(triv => {
    return(<Questions 
      key={triv.question}
      question={triv.question}
      options={triv.options}
      correct={triv.correct_answer}
      answer={answer}
      handleChange={handleChange}
      checkAns={checkAns}
    />)}) : <p>Loading...</p>

  return (
    <div className="App">
      {!isOpen && <Opening toggle={toggle}/>}
      {isOpen && <div className="quiz">
        {QnA}
        {checkAns ? <div className='score-reset'>
          <p className='score'>You scored {finalScore}/{trivia.length} correct answers</p>
          <button className='open-btn' onClick={resetQuiz}>Play Again</button>
        </div> : <div className='check-ans'><button className='open-btn' onClick={(e) => handleSubmit(e)}>Check Answers</button></div>}
      </div>}
    </div>
  );
}

export default App;
