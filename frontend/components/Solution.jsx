import { AlgorithmChart } from "./AlgorithmChart"
import { Board } from "./Board"
import { Button } from "./Button"

export const Solution = (props) => {
    console.log(props)
    return (
        <div>
            {Object.keys(props.durations).length > 0 ?
                <div>
                    <AlgorithmChart data={props.durations} />
                    <div>
                        <Button text="Reset Chart" onClick={props.resetChart} />
                    </div>
                </div>
                :
                <p>Waiting for solution...</p>
            }
        </div>
    )
}