import React, { useState } from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { FEED_QUERY } from "./LinkList";

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

const CreateLink = ({ history }) => {
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  return (
    <div>
      <div className="flex flex-column mt3">
        <input
          className="mb2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          type="text"
          placeholder="Description of the link"
        />
        <input
          className="mb2"
          value={url}
          onChange={e => setUrl(e.target.value)}
          type="text"
          placeholder="Url for the link"
        />
      </div>
      <Mutation
        mutation={POST_MUTATION}
        variables={{ description, url }}
        onCompleted={() => history.push("/")}
        update={(store, { data: { post } }) => {
          const data = store.readQuery({ query: FEED_QUERY });
          data.feed.links.unshift(post);
          store.writeQuery({
            quer: FEED_QUERY,
            data
          });
        }}
      >
        {postLink => <button onClick={postLink}>Submit</button>}
      </Mutation>
    </div>
  );
};

export default CreateLink;
