import { gql, useQuery } from "@apollo/client";
import React from "react";
import Link from "./Link";

export const FEED_LINKS_QUERY = gql`
  {
    feed {
      id
      count
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

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription NewLinkSubscription {
    newLink {
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
`;

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription NewLinkSubscription {
    newVote {
      id
      link {
        id
        url
        description
        createdAt
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
      user {
        id
      }
    }
  }
`;

const LinksList = () => {
  const { data, loading, error, subscribeToMore } = useQuery(FEED_LINKS_QUERY);

  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery(previousResult, { subscriptionData }) {
      if (!subscriptionData?.data) return previousResult;
      const newLink = subscriptionData?.data?.newLink;
      const alreadyExists = previousResult?.feed?.links?.find?.(
        (feedLink) => feedLink.id === newLink.id
      );
      if (alreadyExists) return previousResult;

      return Object.assign({}, previousResult, {
        feed: Object.assign({}, previousResult?.feed, {
          links: [...previousResult?.feed?.links, newLink],
          count: previousResult?.feed?.count + 1
        })
      });
    }
  });

  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION
  });

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
