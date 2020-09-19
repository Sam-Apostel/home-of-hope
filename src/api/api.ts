import endpoints from './endpoints';
//import log from '../utils/logger';

const endpointToApiCall = (api, [name, endpoint] ) => {
	api[name] = (postData = {}, then = (res) => {if(!res) throw res}, fallback) => {
		const formData = new FormData();
		Object.entries(postData).forEach( ([key, value]) => {
			formData.append(key, JSON.stringify(value));
		});
		if(!fallback){ fallback = (e) => {console.log(e)};}
		fetch(endpoint, {
			method: 'POST',
			headers: {
				Accept: 'application/json'
			},
			body: formData
		})
			.then(res=>res.json())
			.then(then)
			.catch(fallback)



				/*() => {
				//log.error({ endpoint, response, ...postData});
			});*/
	}
	return api;
};

export default Object.entries(endpoints).reduce( endpointToApiCall, {});
