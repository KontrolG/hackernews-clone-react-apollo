import "./App.css";

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache
} from "@apollo/client";
import LinksList from "./LinksList";
import { ErrorBoundary } from "react-error-boundary";
import CreateLink from "./CreateLink";
import Header from "./Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import { setContext } from "@apollo/client/link/context";
import { AUTH_TOKEN_KEY } from "../constants/keys";

const authLink = setContext((_request, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql"
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
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
      <BrowserRouter>
        <ApolloProvider client={apolloClient}>
          <div className="center w85">
            <Header />
            <div className="ph3 pv1 background-gray">
              <Routes>
                <Route path="/" element={<LinksList />} />
                <Route path="/create" element={<CreateLink />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </div>
          </div>
        </ApolloProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
