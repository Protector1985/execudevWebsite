import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: process.env.WORDPRESS_API_URL,
  cache: new InMemoryCache(),
});

export default apolloClient;
