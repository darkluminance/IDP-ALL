import { SET_USER_HISTORY, RESET_USER_HISTORY } from './actions';

const initialState = {
	history: [],
};

function userReducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER_HISTORY:
			return { ...state, history: [...state.history, action.payload] };
		case RESET_USER_HISTORY:
			return { ...state, history: [] };
		default:
			return state;
	}
}

export default userReducer;
