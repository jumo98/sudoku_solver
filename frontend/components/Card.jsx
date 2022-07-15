export const Card = (props) => {
    return (
        <>
            <div className="h-30 bg-slate-100 border-slate-100 border-2 text-black drop-shadow-md hover:drop-shadow-xl b-2 rounded">
                <p className="m-4 text-2xl"> {props.title} </p>
                <p className="m-4"> {props.description}</p>
            </div>
        </>
    );
};