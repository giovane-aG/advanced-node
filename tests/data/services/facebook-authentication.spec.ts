import { describe, it, expect } from 'vitest'
import { AuthenticationError } from '../../../src/domain/errors'
import { FacebookAuthentication } from '../../../src/domain/features'
import { LoadFacebookUserApi } from '../../../src/data/contracts/apis'

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  result = undefined

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    return this.result
  }
}

class FacebookAuthenticationService {

  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserByTokenApi.loadUser(params)
    return new AuthenticationError()
  }
}

describe('Facebook Authentication', () => {

  it('should have the same token as the one provided', async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)

    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApiSpy.token).toBe('any_token')
  })

  it('should throw an AuthenticationError when LoadFacebookUserApi returns undefined', async () => {

    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy()
    loadFacebookUserApiSpy.result = undefined
    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)
    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toBeInstanceOf(AuthenticationError)
  })

})