import { describe, it, expect, vitest, vi, beforeEach } from 'vitest'
import { AuthenticationError } from '../../../src/domain/errors'
import { FacebookAuthentication } from '../../../src/domain/features'
import { LoadFacebookUserApi } from '../../../src/data/contracts/apis'
import { FacebookAuthenticationService } from '../../../src/data/services'

describe('Facebook Authentication', () => {

  let loadFacebookUserApiSpy: LoadFacebookUserApi
  let sut: FacebookAuthenticationService

  beforeEach(() => {
    loadFacebookUserApiSpy = { loadUser: vi.fn() }
    sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)
  })

  it('should have the same token as the one provided', async () => {
    vitest.spyOn(loadFacebookUserApiSpy, 'loadUser')

    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should throw an AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    vi.spyOn(loadFacebookUserApiSpy, 'loadUser').mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toBeInstanceOf(AuthenticationError)
  })

})