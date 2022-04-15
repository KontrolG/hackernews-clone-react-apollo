import "./App.css";

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache
} from "@apollo/client";
import LinksList from "./LinksList";
import { ErrorBoundary } from "react-error-boundary";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql"
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

function App() {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => {
        return (
          <div>
            Ha ocurrido un error: {error.message} <br />{" "}
            {error.stack.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        );
      }}
    >
      <ApolloProvider client={apolloClient}>
        <LinksList />
      </ApolloProvider>
    </ErrorBoundary>
  );
}

export default App;
