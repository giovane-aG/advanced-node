export interface LoadUserAccountRepository {
  loadUser: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result | undefined>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = {
    email: string
    name: string
    facebookId: string
  }
}

export interface CreateUserAccountRepository {
  create: (params: CreateUserAccountRepository.Params) => Promise<void>
}

export namespace CreateUserAccountRepository {
  export type Params = {
    name: string
    email: string
    facebookId: string
  }
}