import endpoints from './endpoints';
import log from '../utils/logger';

const endpointToApiCall = (api, [name, endpoint] ) => {
	api[name] = (postData = {}, then = (res) => {if(!res) throw res}) => {
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
	return api;
};

export default Object.entries(endpoints).reduce( endpointToApiCall, {});
