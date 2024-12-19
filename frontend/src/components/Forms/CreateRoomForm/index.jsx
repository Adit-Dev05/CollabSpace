const CreateRoomForm = () => {
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
                <div className="input-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        disabled 
                        placeholder="Generate room code" 
                    />
                    <div className="input-group-append">
                        <button className="btn btn-primary me-2" type="button">
                            Generate
                        </button>
                        <button className="btn btn-outline-danger" type="button">
                            Copy
                        </button>
                    </div>
                </div>
            </div>
            <button type="submit" className="btn btn-primary form-control mt-3">
                Generate Room
            </button>
        </form>
    );
};

export default CreateRoomForm;
