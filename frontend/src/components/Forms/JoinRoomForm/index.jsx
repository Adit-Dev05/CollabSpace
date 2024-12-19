const JoinRoomForm = () => {
    return (
        <form className="form w-100 mt-4">
            <div className="form-group mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter your name" 
                />
            </div>
            <div className="form-group mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter room code" 
                />
            </div>
            <button type="submit" className="btn btn-primary form-control mt-3">
                Join Room
            </button>
        </form>
    );
};

export default JoinRoomForm;
