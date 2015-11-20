let store = {};

const Flux = {
    dispatch(payload) {
        let key;
        for (key in store) {
            store[key](payload);
        }
    },
    register(name, event) {
        store[name] = event;
    }
};


export default Flux;
