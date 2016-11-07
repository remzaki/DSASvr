/***********************
*   Validators
***********************/
var login_validator = $("#loginForm").validate({
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

var validator = $("#elementForm").validate({
    rules: {
        ename: {
            required: true
        },
        eval: {
            required: true
        },
        escn: {
            accept: "image/*"
        }
    },
    messages: {
        escn: {
            accept: "File should be an image"
        }
    }
});
/***********************
*   Validators
***********************/

var tokenKey = 'accessToken';

File.prototype.toBase64 = function (callback) {
    var reader = new FileReader();
    reader.onload = function (e) {
        callback(e.target.result)
    };
    reader.onerror = function (e) {
        callback(null);
    };
    reader.readAsDataURL(this);
};

$("input[type='file'][name='escn']").on("change", function () {
    var form = $("#elementForm")
    var selectedFile = this.files[0];
    if (form.valid() && (typeof selectedFile !== 'undefined') && (selectedFile !== null)) {
        selectedFile.toBase64(function (base64) {
            if (base64 !== null) {
                $("#element-scn").val(base64)
                $(".modal-body .scn").show();
                $('.modal-body .scn img').attr('alt', 'New upload').attr('src', base64)
            }
            else {
                console.log("Error in encoding image to base64")
            }
        });
    }
    else {
        console.log("Form validity: " + form.valid() + " | Selected file: " + selectedFile)
    }
})

var elementModel = function () {
    var self = this;
    self.loading = ko.observable(true);
    self.elements = ko.observableArray();
    self.error = ko.observable();
    self.msg = ko.observable();
    self.search = ko.observable('');
    self.name = ko.observable();
    self.value = ko.observable();
    self.Desc = ko.observable();
    self.screenshot = ko.observable();

    function ApiRequest(uri, method, headers, data) {
        self.error('');
        return $.ajax({
            type: method,
            url: uri,
            headers: headers,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        }).fail(function (jqXHR, textStatus, errorThrown) {
            self.error(errorThrown);
        });
    }

    var ElementsUri = '/api/elements';
    function getAllElements() {
        self.loading(true);
        ApiRequest(ElementsUri, 'GET').done(function (data) {
            //console.log(data);
            self.elements(data);
            self.loading(false);
        });
    }

    function gotoAnchorElement() {
        var hash = location.hash
        hash = hash.replace('#', '')

        if (hash != '') {
            self.search(hash);
        }
    }

    self.reloadElements = function () {
        self.loading(true);
        self.elements('');
        getAllElements();
        self.clearSearch();
    }

    self.submitElement = function (formElement) {
        headers = {};
        var token = sessionStorage.getItem(tokenKey);
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        } else {
            self.error("Are you trying to do something not good?")
            return;
        }
        if ($(formElement).valid()) {
            self.msg()
            self.name()
            var method, msg_str
            var uri = ElementsUri
            var name = $("#element-name", formElement).val()
            name = name.replace(/ /g, '_')
            name = encodeURI(name)
            var value = $("#element-val", formElement).val()
            var Desc = $("#element-desc", formElement).val()
            var screenshot = $("#element-scn", formElement).val()
            var data =
                {
                    "Name": name,
                    "Value": value,
                    "Description": Desc,
                    "Screenshot": screenshot
                }

            if (self.act() == "Update") {
                method = "PUT"
                uri = uri + "?name=" + name
                msg_str = "Perfectly updated "
            } else {
                method = "POST"
                msg_str = "Awesomely added "
            }
            if (screenshot == "") {
                delete data.Screenshot;
            }

            ApiRequest(uri, method, headers, data).done(function (response) {
                $('#msg').show();
                $('#elementModal').modal('hide');
                self.msg(msg_str)
                self.name(name)
                $('#msg').delay(6000).fadeOut('slow');
                getAllElements();
            });
        }
    }

    self.clearSearch = function () {
        self.search('');
        location.hash = "";
    }
    self.filterElements = ko.computed(function () {
        $('#results').show();
        self.error('');
        var results = ko.utils.arrayFilter(self.elements(), function (element) {
            return (
                    (
                        self.search().length == 0 ||
                        element.Name.toLowerCase().indexOf(self.search().toLowerCase()) > -1 ||
                        element.Value.toLowerCase().indexOf(self.search().toLowerCase()) > -1 ||
                        element.Desc.toLowerCase().indexOf(self.search().toLowerCase()) > -1
                    )
            );
        });
        if (results.length > 0) {
            return results;
        }
        else {
            self.error('Poor, oh poor, no results found')
        }
    });

    self.anchorElement = function (element) {
        location.hash = element.Name;
    }

    self.act = ko.observable();
    self.mod_loading = ko.observable();
    self.mod_title = ko.observable('Element');
    self.mod_btn = ko.observable('Submit');

    self.selectElement = function (act, data) {
        $('#msg').hide();
        $('#elementModal .modal-body input[type=file]').val('')
        validator.resetForm();
        var request_flag = true;
        self.mod_loading(true);
        self.act(act);
        switch (act) {
            case 'View':
                self.mod_title('View Element')
                self.mod_btn('');
                break;
            case 'Update':
                self.mod_title('Update Element')
                self.mod_btn('Update');
                break;
            case 'Add':
                self.name('');
                self.value('');
                self.Desc('');
                self.screenshot('');
                self.mod_loading(false);
                self.mod_title('New Element')
                self.mod_btn('Submit');
                request_flag = false;
                break;
        }
        //if (self.name() != data.Name) {
            if (request_flag) {
                uri = ElementsUri
                uri += '?name=' + data.Name
                ApiRequest(uri, 'GET').done(function (e) {
                    self.name(e.Name);
                    self.value(e.Value);
                    self.Desc(e.Desc);
                    self.screenshot(e.Screenshot);
                    self.mod_loading(false);
                });
            }
        //} else {
        //    self.mod_loading(false);
        //}
    }

    getAllElements();

    gotoAnchorElement();
}

var viewModel = function () {
    var self = this;
    self.user = ko.observable(sessionStorage.getItem('User'));
    self.account_act = ko.observable(null);
    self.login_msg = ko.observable();
    self.elementModel = new elementModel;

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

            login_validator.resetForm();
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
                login_validator.resetForm();
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
        login_validator.resetForm();
        self.account_act(act);
    }
    
}

ko.applyBindings(new viewModel());