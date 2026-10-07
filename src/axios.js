import axios from "axios";

const instance =axios.create({
    baseURL: window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:5001/clone-3e435/us-central1/api'
    : 'https://us-central1-clone-3e435.cloudfunctions.net/api',
});

export default instance