import { describe, it, expect, vitest, vi, beforeEach } from 'vitest'
import { AuthenticationError } from '../../../src/domain/errors'
import { FacebookAuthentication } from '../../../src/domain/features'
import { LoadFacebookUserApi } from '../../../src/data/contracts/apis'
import { CreateUserAccountRepository, LoadUserAccountRepository } from '../../../src/data/contracts/apis/repos'
import { FacebookAuthenticationService } from '../../../src/data/services'

describe('Facebook Authentication', () => {

  let loadFacebookUserApiSpy: LoadFacebookUserApi
  let sut: FacebookAuthenticationService
  let loadUserAccountRepoSpy: LoadUserAccountRepository
  let createUserAccountRepoSpy: CreateUserAccountRepository

  beforeEach(() => {
    loadFacebookUserApiSpy   = { loadUser: vi.fn() }
    loadUserAccountRepoSpy   = { loadUser: vi.fn() }
    createUserAccountRepoSpy = { create: vi.fn() }
    sut = new FacebookAuthenticationService(loadFacebookUserApiSpy, loadUserAccountRepoSpy, createUserAccountRepoSpy)

    loadFacebookUserApiSpy.loadUser = vi.fn().mockResolvedValue({
      name: 'any_name',
      email: 'any_email',
      facebookId: 'any_facebook_id'
    })
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

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token: 'any_token' })
    expect(loadUserAccountRepoSpy.loadUser).toHaveBeenCalledOnce()
    expect(loadUserAccountRepoSpy.loadUser).toHaveBeenCalledWith({ email: 'any_email'})
  })

  it('should call CreateUserAccountRepo when LoadUserAccountRepo returns data', async () => {
    vi.spyOn(loadUserAccountRepoSpy, 'loadUser').mockResolvedValueOnce(undefined)
    await sut.perform({ token: 'any_token'})

    expect(createUserAccountRepoSpy.create).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email',
      facebookId: 'any_facebook_id'
    })
    expect(createUserAccountRepoSpy.create).toHaveBeenCalledOnce()
  })

})
