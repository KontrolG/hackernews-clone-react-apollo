import { gql, useQuery } from "@apollo/client";
import React from "react";
import Link from "./Link";

export const FEED_LINKS_QUERY = gql`
  {
    feed {
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
      {data?.feed?.links?.map?.((link, index) => (
        <Link key={link.id} link={link} index={index} />
      ))}
    </div>
  );
};

export default LinksList;
