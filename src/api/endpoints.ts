const API_ENDPOINT = `/api/`;

export const newOrder = `${API_ENDPOINT}order/new`;
export const orderStatus = `${API_ENDPOINT}order/{orderId}`;
export const log = `${API_ENDPOINT}log/`;

export default {
	newOrder,
	orderStatus,
	log
};
