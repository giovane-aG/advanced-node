export interface LoadUserAccountRepository {
  loadUser: (
    params: LoadUserAccountRepository.Params
  ) => Promise<LoadUserAccountRepository.Result | undefined>;
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string;
  };

  export type Result =
    | undefined
    | {
        id: string;
        name?: string;
      };
}

export interface CreateFacebookAccountRepository {
  createFromFacebook: (
    params: CreateFacebookAccountRepository.Params
  ) => Promise<void>;
}

export namespace CreateFacebookAccountRepository {
  export type Params = {
    name: string;
    email: string;
    facebookId: string;
  };
}

export interface UpdateFacebookAccountRepository {
  updateWithFacebook: (
    params: UpdateUserAccountRepository.Params
  ) => Promise<void>;
}

export namespace UpdateUserAccountRepository {
  export type Params = {
    name: string;
    id: string;
    facebookId: string;
  };
}
