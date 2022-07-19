export const Board = (props) => {
    return (
        <div>
            {props.board ?
                <table className="table m-auto border-green text-xl text-center">
                    <tbody>
                        {(() => {
                            let rows = [];
                            for (let i = 0; i < props.board.length; i++) {
                                rows.push(
                                    <tr key={i} className="border-black	 first:border-t-8 third-child:border-b-8">
                                        {(() => {
                                            let nums = [];
                                            for (let j = 0; j < props.board[i].length; j++) {
                                                let key = i + j
                                                let value = parseInt(props.board[i][j])
                                                if (value == 0) {
                                                    value = ""
                                                }
                                                nums.push(<td key={key} className="border-black	 h-[40px] w-[40px] border-[2px] first:border-l-8 third-child:border-r-8">{value}</td>);
                                            }
                                            return nums;
                                        })()}
                                    </tr>)
                            }
                            return rows
                        })()}

                    </tbody>
                </table>
                :
                <p>Waiting...</p>}
        </div>


    )
}