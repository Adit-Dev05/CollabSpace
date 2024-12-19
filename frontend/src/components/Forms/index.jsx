import CreateRoomForm from "./CreateRoomForm";
import JoinRoomForm from "./JoinRoomForm";

import "./index.css";

const Forms = () => {
    return (
        <div className="container-fluid forms-container d-flex align-items-center justify-content-center vh-100">
            <div className="row w-100">
                <div className="col-md-5 form-box p-5 mx-auto shadow-lg bg-white rounded">
                    <h1 className="text-primary fw-bold mb-4 text-center">Create Room</h1>
                    <CreateRoomForm />
                </div>
                <div className="col-md-5 form-box p-5 mx-auto shadow-lg bg-white rounded">
                    <h1 className="text-primary fw-bold mb-4 text-center">Join Room</h1>
                    <JoinRoomForm />
                </div>
            </div>
        </div>
    );
};

export default Forms;
