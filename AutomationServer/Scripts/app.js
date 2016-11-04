var validator = $("#loginForm").validate({
    rules: {
        email: {
            required: true
        },
        password: {
            required: true
        }
    }
});
$("#updateForm").validate({
    rules: {
        oldpassword: {
            required: true
        },
        newpassword: {
            required: true
        },
        confirmpassword: {
            equalTo: "#user-new-password"
        }
    },
    messages: {
        confirmpassword: {
            equalTo: "Password does not match"
        }
    }
});

var viewModel = function () {
    var self = this;
    var tokenKey = 'accessToken';
    self.user = ko.observable(sessionStorage.getItem('User'));
    self.account_act = ko.observable(null);
    self.login_msg = ko.observable();

    self.Login = function (formElement) {
        if ($(formElement).valid()) {
            var loginData = {
                grant_type: 'password',
                username: $("#user-email", formElement).val() + "@unitedhealthone.com",
                password: $("#user-password", formElement).val()
            }

            self.login_msg("Logging in, please wait...");

            $.ajax({
                type: 'POST',
                url: './token',
                data: loginData
            }).done(function (data) {
                self.user(data.userName);
                sessionStorage.setItem('User', data.userName)
                sessionStorage.setItem(tokenKey, data.access_token);
                $('#accountModal').modal('hide');
                self.login_msg('');
                formElement.reset();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                self.login_msg(jqXHR.responseJSON.error_description);
            });

            validator.resetForm();
        }
    }

    self.UserPassword = function (formElement) {
        headers = {};
        var token = sessionStorage.getItem(tokenKey);
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        } else {
            self.login_msg("Are you trying to do something not good?")
            return;
        }

        if ($(formElement).valid()) {
            var accountData = {
                "OldPassword": $("#user-old-password", formElement).val(),
                "NewPassword": $("#user-new-password", formElement).val(),
                "ConfirmPassword": $("#user-confirm-password", formElement).val()
            }

            $.ajax({
                type: 'POST',
                url: '/api/Account/ChangePassword',
                headers: headers,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(accountData)
            }).done(function () {
                validator.resetForm();
                formElement.reset();
                self.login_msg("Password change successful");
            }).fail(function (jqXHR, textStatus, errorThrown) {
                try{
                    var err = jqXHR.responseJSON.ModelState['model.NewPassword'][0];
                }
                catch(error){
                    var err = jqXHR.responseJSON.ModelState[''][0]
                }
                finally {
                    self.login_msg(err);
                }
            });
        }
    }

    self.Logout = function () {
        sessionStorage.removeItem(tokenKey);
        sessionStorage.removeItem('User');
        self.user(sessionStorage.getItem('User'));
        token = sessionStorage.getItem(tokenKey);
        self.account_act(null)
        $('#accountModal').modal('hide');
    }

    self.selectAccount = function (act) {
        validator.resetForm();
        self.account_act(act);
    }
    
}

ko.applyBindings(new viewModel());