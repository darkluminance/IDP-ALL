export const SET_USER_HISTORY = 'SET_USER_HISTORY';
export const RESET_USER_HISTORY = 'RESET_USER_HISTORY';

export const setHistory = (history) => (dispatch) => {
	dispatch({
		type: SET_USER_HISTORY,
		payload: history,
	});
};
export const resetHistory = (history) => (dispatch) => {
	dispatch({
		type: RESET_USER_HISTORY,
		payload: history,
	});
};
