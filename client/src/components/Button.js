function Button({ title, clickHandler }) {
    return (
        <button
            className='rounded my-3 px-4 py-3 shadow w-100'
            onClick={clickHandler}
            style={{
                textDecoration: 'none',
                color: 'black',
                backgroundColor: 'rgb(255, 223, 0)',
                border: '0px'
            }}
        >
            {title}
        </button>
    );
}

export default Button;