import React, { useState } from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { FEED_QUERY } from "./LinkList";
import { LINKS_PER_PAGE } from "../constants";

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
        onCompleted={() => history.push("/new/1")}
        update={(store, { data: { post } }) => {
          const first = LINKS_PER_PAGE;
          const skip = 0;
          const orderBy = "createdAt_DESC";

          const data = store.readQuery({
            query: FEED_QUERY,
            variables: { first, skip, orderBy }
          });
          data.feed.links.unshift(post);
          store.writeQuery({
            quer: FEED_QUERY,
            data,
            variables: { first, skip, orderBy }
          });
        }}
      >
        {postLink => <button onClick={postLink}>Submit</button>}
      </Mutation>
    </div>
  );
};

export default CreateLink;
