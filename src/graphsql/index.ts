import { gql } from '@apollo/client';

export const ASK_QUERY = gql`
  query AskQuestion($prompt: String!) {
    ask(prompt: $prompt)
  }
`;
