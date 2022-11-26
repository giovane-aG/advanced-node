import { AuthenticationError } from "../../domain/errors/index";
import { FacebookAuthentication } from "../../domain/features/index";
import { LoadFacebookUserApi } from "../contracts/apis/index";
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
  UpdateFacebookAccountRepository,
} from "../contracts/apis/repos";

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository &
      CreateFacebookAccountRepository &
      UpdateFacebookAccountRepository
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params);

    if (facebookData) {
      const accountData = await this.userAccountRepo.loadUser({
        email: facebookData.email,
      });

      if (accountData !== undefined) {
        await this.userAccountRepo.updateWithFacebook({
          id: accountData.id,
          name: accountData.name ?? facebookData.name,
          facebookId: facebookData.facebookId,
        });
      } else {
        await this.userAccountRepo.createFromFacebook(facebookData);
      }
    }

    return new AuthenticationError();
  }
}
