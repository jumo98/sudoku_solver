export const Button = (props) => {
  function handleClick() {
    props.onClick();
  }

  return (
    <div className="p-10">
      <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {props.text}
      </button>
    </div>

  )
}