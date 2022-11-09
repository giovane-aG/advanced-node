import { describe, it, expect } from 'vitest'
import { AuthenticationError } from '../../../src/domain/errors'
import { FacebookAuthentication } from '../../../src/domain/features'

class FacebookAuthenticationService {
  public token: string

  async perform(params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Params> {
    this.token = params.token
    if (!params.token || params.token == '') throw new AuthenticationError()

    return params
  }
}

describe('Facebook Authentication', () => {
  it('should have the same token as the one provided', async () => {
    const sut = new FacebookAuthenticationService()
    await sut.perform({ token: 'any_token' })
    expect(sut.token).toBe('any_token')
  })

  it('should throw an AuthenticationError when a token is not provided', async () => {

    try {
    } catch (error) {
      expect(error).toBeInstanceOf(AuthenticationError)
    }
  })
})