import React from "react";
import { AUTH_TOKEN } from "../constants";
import { timeDifferenceForDate } from "../utils";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
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

const Link = ({ link, index, updateStoreAfterVote }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <Mutation
            mutation={VOTE_MUTATION}
            variables={{ linkId: link.id }}
            update={(store, { data: { vote } }) =>
              updateStoreAfterVote(store, vote, link.id)
            }
          >
            {voteForLink => (
              <div className="ml1 gray f11" onClick={voteForLink}>
                ▲
              </div>
            )}
          </Mutation>
        )}
        <div className="ml1">
          <div>
            {link.description} ({link.url})
          </div>
          <div className="f6 lh-copy gray">
            {link.votes ? link.votes.length : 0} votes | by{" "}
            {link.postedBy ? link.postedBy.name : "Unknown"}{" "}
            {timeDifferenceForDate(link.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Link;
