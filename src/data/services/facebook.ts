import { AuthenticationError } from '../../domain/errors/index'
import { FacebookAuthentication } from '../../domain/features/index'
import { LoadFacebookUserApi } from '../contracts/apis/index'
import { CreateUserAccountRepository, LoadUserAccountRepository } from '../contracts/apis/repos'

export class FacebookAuthenticationService {

  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly createUserAccountRepository: CreateUserAccountRepository
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const data = await this.loadFacebookUserByTokenApi.loadUser(params)

    if (!data) {
      return new AuthenticationError()
    }

    const user = await this.loadUserAccountRepository.loadUser({ email: 'any_email' })

    if (!user) {
      await this.createUserAccountRepository.create({
        name: data.name,
        email: data.email,
        facebookId: data.facebookId
      })
    }
    return new AuthenticationError()
  }
}