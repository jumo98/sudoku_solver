export const Card = (props) => {
    return (
        <>
            <div onClick={props.onClick} className="h-50 bg-slate-900 border-slate-900 border-2 text-white drop-shadow-md hover:drop-shadow-xl hover:bg-slate-500 hover:border-slate-500 b-2 rounded">
                <p className="m-4 text-2xl"> {props.title} </p>
                <p className="m-4"> {props.description}</p>
            </div>
        </>
    );
};