/**
 * Created by axetroy on 17-7-14.
 */

import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { login, createUser } from '../../controllers/user';
import { UserType, RegisterArgv, LoginArgv, LoginType } from '../types/user';

const loginEntity = {
  type: LoginType,
  description: '登陆',
  args: {
    argv: {
      type: LoginArgv
    }
  },
  async resolve(root: any, { argv }: any, req: any) {
    const { username, password } = argv;
    return await login({ username, password });
  }
};

const registryEntity = {
  type: UserType,
  description: '注册',
  args: {
    argv: {
      type: RegisterArgv
    }
  },
  async resolve(root: any, { argv }: any, req: any) {
    const { username, password } = argv;
    return await createUser({ username, password });
  }
};

export const user = {
  Public: {
    registry: registryEntity,
    login: loginEntity
  },
  Me: {
    registry: registryEntity,
    login: loginEntity
  }
};

export const admin = {
  Public: {
    registry: registryEntity,
    login: loginEntity
  },
  Me: {
    registry: registryEntity,
    login: loginEntity
  }
};
