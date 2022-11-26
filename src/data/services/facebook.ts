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
    const data = await this.facebookApi.loadUser(params);

    if (data) {
      const accountData = await this.userAccountRepo.loadUser({
        email: data.email,
      });

      if (accountData?.name !== undefined) {
        await this.userAccountRepo.updateWithFacebook({
          id: accountData.id,
          name: accountData.name,
          facebookId: data.facebookId,
        });
      } else {
        await this.userAccountRepo.createFromFacebook(data);
      }
    }

    return new AuthenticationError();
  }
}
