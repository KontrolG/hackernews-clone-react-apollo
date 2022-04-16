import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import Link from "./Link";

const FEED_SEARCH_FILTER = gql`
  query FeedSearchFilter($filter: String!) {
    feed(filter: $filter) {
      id
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const Search = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const [fetchResults, { data }] = useLazyQuery(FEED_SEARCH_FILTER, {
    variables: { filter: searchFilter }
  });

  return (
    <>
      <div>
        Search
        <input type="text" onChange={(e) => setSearchFilter(e.target.value)} />
        <button type="button" onClick={fetchResults}>
          OK
        </button>
      </div>
      {data &&
        data.feed.links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
    </>
  );
};

export default Search;
