import timeDifferenceForDate from "../utils/timeDifferenceForDate";
import { AUTH_TOKEN_KEY } from "../constants/keys";
import { gql, useMutation } from "@apollo/client";
import { FEED_LINKS_QUERY } from "./LinksList";

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
      }
      user {
        id
      }
    }
  }
`;

const Link = (props) => {
  const { link } = props;
  const [vote] = useMutation(VOTE_MUTATION, {
    variables: { linkId: link.id },
    update(cache, { data: { vote: newVote } }) {
      const votedLink = newVote?.link;
      const cacheData = cache.readQuery({ query: FEED_LINKS_QUERY });

      const updateLinks = cacheData?.feed?.links?.map?.((feedLink) => {
        return feedLink.id === votedLink.id
          ? { ...feedLink, votes: [...feedLink.votes, newVote] }
          : feedLink;
      });

      cache.writeQuery({
        query: FEED_LINKS_QUERY,
        data: {
          feed: {
            ...cacheData?.feed,
            links: updateLinks
          }
        }
      });
    }
  });
  const authToken = localStorage.getItem(AUTH_TOKEN_KEY);

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{props.index + 1}.</span>
        {authToken && (
          <div
            className="ml1 gray f11"
            style={{ cursor: "pointer" }}
            onClick={vote}
          >
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        {
          <div className="f6 lh-copy gray">
            {link?.votes?.length} votes | by{" "}
            {link.postedBy ? link.postedBy.name : "Unknown"}{" "}
            {timeDifferenceForDate(link.createdAt)}
          </div>
        }
      </div>
    </div>
  );
};

export default Link;
