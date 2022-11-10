import { AuthenticationError } from '../../domain/errors/index'
import { FacebookAuthentication } from '../../domain/features/index'
import { LoadFacebookUserApi } from '../contracts/apis/index'

export class FacebookAuthenticationService {

  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserByTokenApi.loadUser(params)
    return new AuthenticationError()
  }
}