import { ApolloClient, InMemoryCache } from '@apollo/client';

const apiUrl = import.meta.env.VITE_GRAPHQL_API_URL || '';
console.log(apiUrl, 'apiUrl');
// 创建 Apollo Client 实例
export const client = new ApolloClient({
	uri: `${apiUrl}/graphql`,
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'network-only',
			errorPolicy: 'all',
		},
		query: {
			fetchPolicy: 'network-only',
			errorPolicy: 'all',
		},
	},
});
