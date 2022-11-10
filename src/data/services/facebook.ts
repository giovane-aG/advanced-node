import { AuthenticationError } from '../../domain/errors/index'
import { FacebookAuthentication } from '../../domain/features/index'
import { LoadFacebookUserApi, LoadUserRepository } from '../contracts/apis/index'

export class FacebookAuthenticationService {

  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadUserRepository: LoadUserRepository
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const data = await this.loadFacebookUserByTokenApi.loadUser(params)

    if (data) {
      await this.loadUserRepository.loadUser({ email: 'any_email' })
    }

    return new AuthenticationError()
  }
}