import api from '../api/api';

const error = (postData: Record<string, unknown>, callBack: void): void => {
	api.log(postData, callBack);
}

export default {
	error
}
