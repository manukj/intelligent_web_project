function onUserLoggedOut() {
  const loginUserModel = document.getElementById("login_user_model");
  if (loginUserModel) {
    loginUserModel.showModal();
  }
  toggleLogoutButton(false);
  toggleWelcomeText(false);
}

function onUserLoggedIn() {
  const loginUserModel = document.getElementById("login_user_model");
  if (loginUserModel) {
    loginUserModel.close();
  }
  toggleLogoutButton(true);
  toggleWelcomeText(true);
}

function toggleLogoutButton(shouldShow) {
  const logoutButton = document.getElementById("logout_button");
  if (logoutButton) {
    logoutButton.classList.toggle("hidden", !shouldShow);
  }
}

function toggleWelcomeText(shouldShow) {
  const userWelcomeText = document.getElementById("welcome_user_text");
  if (userWelcomeText) {
    userWelcomeText.innerHTML = "Welcome " + loggedInUser;
    userWelcomeText.classList.toggle("hidden", !shouldShow);
  }
}
