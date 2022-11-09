import { describe, it, expect } from 'vitest'
import { AuthenticationError } from '../../../src/domain/errors'
import { FacebookAuthentication } from '../../../src/domain/features'

interface LoadFacebookUser {
  loadUser: (params: LoadFacebookUser.Params) => Promise<void>
}

class LoadFacebookUserApiSpy implements LoadFacebookUser {
  token?: string
  result = { name: 'any_name' }

  async loadUser (params: LoadFacebookUser.Params): Promise<void> {
    this.token = params.token
  }
}

namespace LoadFacebookUser {
  export type Params = {
    token: string
  }
}

class FacebookAuthenticationService {

  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUser
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Params> {
    if (!params.token || params.token == '') throw new AuthenticationError()
    await this.loadFacebookUserByTokenApi.loadUser(params)
    return params
  }
}

describe('Facebook Authentication', () => {

  it('should have the same token as the one provided', async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)

    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApiSpy.token).toBe('any_token')
  })

  it('should throw an AuthenticationError when a token is not provided', async () => {

    try {
    } catch (error) {
      expect(error).toBeInstanceOf(AuthenticationError)
    }
  })
})