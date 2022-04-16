import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FEED_LINKS_QUERY } from "./LinksList";

const CREATE_LINK_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
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

function CreateLink() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    description: "",
    url: ""
  });
  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: formState,
    onCompleted() {
      navigate("/");
    },
    update(cache, { data: { post: newLink } }) {
      const cacheData = cache.readQuery({ query: FEED_LINKS_QUERY });

      const updateLinks = [...cacheData?.feed?.links, newLink];

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

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          createLink();
        }}
      >
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={formState.description}
            onChange={(e) =>
              setFormState({
                ...formState,
                description: e.target.value
              })
            }
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={formState.url}
            onChange={(e) =>
              setFormState({
                ...formState,
                url: e.target.value
              })
            }
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateLink;
