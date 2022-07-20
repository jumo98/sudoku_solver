import { useState } from "react";
import { Board } from "./Board"
import { Button } from "./Button"
import { Card } from "./Card"

import prettyMilliseconds from 'pretty-ms';


export const Algorithms = (props) => {
    const [solution, setSolution] = useState([])
    const [solved, setSolved] = useState(false)

    function ProcessAlgorithms(sudoku, algorithm) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "sudoku": sudoku })
        };

        return fetch('/api/algorithms/' + algorithm, requestOptions)
            .then(response => response.json())
            .then((result) => {
                setSolution(JSON.parse(result["sudoku"]))
                setSolved(result["solved"] === 'True')
                return result
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function prettyDuration(duration) {
        return duration
        return prettyMilliseconds(duration, { millisecondsDecimalDigits: 7 })
    }

    function resetSolution() {
        setSolution([])
        setSolved(false)
    }


    function handleBacktracking() {
        ProcessAlgorithms(props.board, "backtracking")
            .then((result) => {
                props.setDurations(prev => ({ ...prev, Backtracking: prettyDuration(result["duration"]) }))
            })
    }

    function handleNorvig() {
        ProcessAlgorithms(props.board, "norvig")
            .then((result) => {
                props.setDurations(prev => ({ ...prev, Norvig: prettyDuration(result["duration"]) }))
            })
    }

    function handleMachineLearningOnce() {
        ProcessAlgorithms(props.board, "ml_once")
            .then((result) => {
                props.setDurations(prev => ({ ...prev, ML_Once: prettyDuration(result["duration"]) }))
            })
    }

    function handleMachineLearningInference() {
        ProcessAlgorithms(props.board, "ml_inference")
            .then((result) => {
                props.setDurations(prev => ({ ...prev, ML_Inference: prettyDuration(result["duration"]) }))
            })
    }

    return (
        <div>
            {props.board.length > 0 ?
                <div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Card title="Backtracking" onClick={handleBacktracking} />
                        </div>
                        <div>
                            <Card title="Norvig" onClick={handleNorvig} />
                        </div>
                        <div>
                            <Card title="AI (Once)" onClick={handleMachineLearningOnce} />
                        </div>
                        <div>
                            <Card title="AI (Inference)" onClick={handleMachineLearningInference} />
                        </div>
                    </div>
                    <div className='p-5'>
                        {
                            solution.length > 0 ?
                                <div>
                                    {solved ?
                                        <p>Valid solution</p>
                                        :
                                        <p>No valid solution found</p>
                                    }
                                    <Board board={solution} />
                                    <Button text="Reset Board" onClick={resetSolution} />
                                </div>
                                :
                                <Board board={props.board} />
                        }
                    </div>
                </div>
                :
                <p>Waiting for submission...</p>
            }
        </div>
    )
}