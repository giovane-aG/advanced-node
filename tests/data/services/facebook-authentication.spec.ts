import { describe, it, expect, vitest, vi, beforeEach } from "vitest";
import { AuthenticationError } from "../../../src/domain/errors";
import { FacebookAuthentication } from "../../../src/domain/features";
import { LoadFacebookUserApi } from "../../../src/data/contracts/apis";
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
  UpdateFacebookAccountRepository,
} from "../../../src/data/contracts/apis/repos";

import { FacebookAuthenticationService } from "../../../src/data/services";

describe("Facebook Authentication", () => {
  let loadFacebookUserApiSpy: LoadFacebookUserApi;
  let sut: FacebookAuthenticationService;
  let userAccountRepoSpy: LoadUserAccountRepository &
    CreateFacebookAccountRepository &
    UpdateFacebookAccountRepository;

  beforeEach(() => {
    loadFacebookUserApiSpy = { loadUser: vi.fn() };
    userAccountRepoSpy = {
      loadUser: vi.fn(),
      createFromFacebook: vi.fn(),
      updateWithFacebook: vi.fn(),
    };

    sut = new FacebookAuthenticationService(
      loadFacebookUserApiSpy,
      userAccountRepoSpy
    );

    loadFacebookUserApiSpy.loadUser = vi.fn().mockResolvedValue({
      name: "any_name",
      email: "any_email",
      facebookId: "any_fb_id",
    });
  });

  it("should have the same token as the one provided", async () => {
    vitest.spyOn(loadFacebookUserApiSpy, "loadUser");

    await sut.perform({ token: "any_token" });

    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({
      token: "any_token",
    });
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1);
  });

  it("should throw an AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
    vi.spyOn(loadFacebookUserApiSpy, "loadUser").mockResolvedValueOnce(
      undefined
    );
    const authResult = await sut.perform({ token: "any_token" });

    expect(authResult).toBeInstanceOf(AuthenticationError);
  });

  it("should call LoadUserAccountRepository when LoadFacebookUserApi returns data", async () => {
    await sut.perform({ token: "any_token" });
    expect(userAccountRepoSpy.loadUser).toHaveBeenCalledOnce();
    expect(userAccountRepoSpy.loadUser).toHaveBeenCalledWith({
      email: "any_email",
    });
  });

  it("should call CreateUserAccountRepo when LoadUserAccountRepo returns undefined", async () => {
    vi.spyOn(userAccountRepoSpy, "loadUser").mockResolvedValueOnce(undefined);
    await sut.perform({ token: "any_token" });

    expect(userAccountRepoSpy.createFromFacebook).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email",
      facebookId: "any_fb_id",
    });
    expect(userAccountRepoSpy.createFromFacebook).toHaveBeenCalledOnce();
  });

  it("should call UpdateUserAccountRepo when LoadUserAccountRepo returns data", async () => {
    vi.spyOn(userAccountRepoSpy, "loadUser").mockResolvedValueOnce({
      id: "any_id",
      name: "any_name",
    });

    await sut.perform({ token: "any_token" });

    expect(userAccountRepoSpy.updateWithFacebook).toHaveBeenCalledWith({
      name: "any_name",
      id: "any_id",
      facebookId: "any_fb_id",
    });
    expect(userAccountRepoSpy.updateWithFacebook).toHaveBeenCalledOnce();
  });
});
