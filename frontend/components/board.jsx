export function Board() {
    const a = 9
    return (
        <table className="table m-auto">
            <tbody>
            {(() => {
                let rows = [];
                for (let i = 1; i <= a; i++) {
                    rows.push(
                    <tr key={i} className="first:border-t-4 third-child:border-b-4">
                        {(() => {
                        let nums = [];
                        for (let j = 1; j <= a; j++) {
                            let key = i + j
                            nums.push(<td key={key} className="h-[30px] w-[30px] text-center border-[1px] first:border-l-4 third-child:border-r-4">{j%10}</td>);
                        }
                        return nums;
                        })()}
                    </tr>)
                }
                return rows
            })()}

            </tbody>
        </table>
    )
}