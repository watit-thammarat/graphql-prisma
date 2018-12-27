import ApolloBoost from 'apollo-boost';

export default jwt => {
  return new ApolloBoost({
    uri: 'http://localhost:4000',
    request(operation) {
      if (jwt) {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        });
      }
    }
  });
};
