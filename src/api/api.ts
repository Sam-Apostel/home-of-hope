import endpoints from './endpoints';
import log from '../utils/logger';

const endpointToApiCall = (api, [name, endpoint] ) => {
	api[name] = (postData = {}, then = () => {}) => {

		const formData = new FormData();
		Object.entries(postData).forEach( ([key, value]) => {
			formData.append(key, JSON.stringify(value));
		});

		fetch(endpoint, {
			method: 'POST',
			headers: {
				Accept: 'application/json'
			},
			body: formData
		})
			.then(res=>res.json())
			.then(then)
			.catch(response => {
				log.error({ endpoint, response, ...postData});
			});
	}
};

export default Object.entries(endpoints).reduce( endpointToApiCall, {});
