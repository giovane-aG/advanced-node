import { describe, it, expect, vitest, vi } from 'vitest'
import { AuthenticationError } from '../../../src/domain/errors'
import { FacebookAuthentication } from '../../../src/domain/features'
import { LoadFacebookUserApi } from '../../../src/data/contracts/apis'
import { FacebookAuthenticationService } from '../../../src/data/services'

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  result = undefined

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    return this.result
  }
}

describe('Facebook Authentication', () => {

  it('should have the same token as the one provided', async () => {

    const loadFacebookUserApiSpy = {
      loadUser: vi.fn()
    }

    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)
    vitest.spyOn(loadFacebookUserApiSpy, 'loadUser')

    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should throw an AuthenticationError when LoadFacebookUserApi returns undefined', async () => {

    const loadFacebookUserApiSpy = {
      loadUser: vi.fn()
    }

    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined)
    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)
    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toBeInstanceOf(AuthenticationError)
  })

})