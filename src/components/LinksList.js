import { gql, useQuery } from "@apollo/client";
import React from "react";
import Link from "./Link";

const FEED_LINKS_QUERY = gql`
  {
    feed {
      links {
        id
        description
        url
      }
    }
  }
`;

const LinksList = () => {
  const { data, loading, error } = useQuery(FEED_LINKS_QUERY);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {data?.feed?.links?.map?.(({ id, description, url }) => (
        <Link key={id} description={description} url={url} />
      ))}
    </div>
  );
};

export default LinksList;
