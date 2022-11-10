import { describe, it, expect, vitest, vi } from 'vitest'
import { AuthenticationError } from '../../../src/domain/errors'
import { FacebookAuthentication } from '../../../src/domain/features'
import { LoadFacebookUserApi } from '../../../src/data/contracts/apis'
import { FacebookAuthenticationService } from '../../../src/data/services'

const makeSut = () => {
  const loadFacebookUserApiSpy = { loadUser: vi.fn() }
  const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)
  return { sut, loadFacebookUserApiSpy }
}

describe('Facebook Authentication', () => {

  it('should have the same token as the one provided', async () => {
    const { sut, loadFacebookUserApiSpy } = makeSut()
    vitest.spyOn(loadFacebookUserApiSpy, 'loadUser')

    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should throw an AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { sut, loadFacebookUserApiSpy } = makeSut()
    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toBeInstanceOf(AuthenticationError)
  })

})