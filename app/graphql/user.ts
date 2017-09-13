/**
 * Created by axetroy on 17-7-13.
 */
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

import { user as userMutation } from './mutations';
import { user as userQuery } from './queries';

const args = {
  token: {
    type: GraphQLString
  }
};

/**
 * 扩展req字段
 * @param req
 * @param params
 * @returns {Promise<void>}
 */
async function extendReq(req: any, params: any) {
  req.token = params.token || req.headers.authentication || req.cookies.Authentication || '';
}

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      ['public']: {
        name: 'UserPublic',
        type: new GraphQLObjectType({
          name: 'UserPublicQuery',
          fields: userQuery.Public
        }),
        resolve(root: any, params: any, req: any) {
          return userQuery.Public;
        }
      },
      me: {
        name: 'UserMe',
        type: new GraphQLObjectType({
          name: 'UserMeQuery',
          fields: userQuery.Me
        }),
        args,
        async resolve(root: any, params: any, req: any) {
          extendReq(req, params);
          return userQuery.Me;
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'UserMutation',
    fields: {
      ['public']: {
        name: 'UserPublic',
        type: new GraphQLObjectType({
          name: 'UserPublicMutation',
          fields: userMutation.Public
        }),
        args,
        async resolve(root: any, params: any, req: any) {
          await extendReq(req, params);
          return userMutation.Public;
        }
      },
      me: {
        name: 'UserMe',
        type: new GraphQLObjectType({
          name: 'UserMeMutation',
          fields: userMutation.Me
        }),
        args,
        async resolve(root: any, params: any, req: any) {
          await extendReq(req, params);
          return userMutation.Me;
        }
      }
    }
  })
});
