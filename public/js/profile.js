$(document).ready(function () {
  $("#profile-form").submit(function (event) {
    event.preventDefault();
    var formElement = this;
    var formData = new FormData(formElement);
    var firstname = formData.get("firstname");
    var lastname = formData.get("lastname");
    var phone = formData.get("phone");

    $.ajax({
      url: "/updateProfile",
      type: "PUT",
      data: {
        firstname: firstname,
        lastname: lastname,
        phone: phone,
      },
      success: function (data) {
        console.log(data);
        if (data.status === "success") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Profile updated successfully!",
            showConfirmButton: false,
            timer: 1500,
            willClose: () => {
              setTimeout(() => {
                window.location.reload();
              }, 100);
            },
          });
        } else {
          alert("Profile update failed");
        }
      },
      error: function () {
        alert("Profile update failed");
      },
    });
  });
});

$("#changepass-form").submit(function (event) {
    event.preventDefault();
    $("#account-confirm-pass").removeClass("is-invalid");
    $("#account-pass").removeClass("is-invalid");

    var formElement = this;
    var formData = new FormData(formElement);
    var currentPass = formData.get("current_pass");
    var newPass = formData.get("new_pass");
    var confirmPass = formData.get("confirm_pass");

    if (newPass !== confirmPass) {
      $("#account-confirm-pass").addClass("is-invalid");
      $("#account-pass").addClass("is-invalid");
      return;
    }

    $.ajax({
      url: "/updatePassword",
      type: "POST",
      data: {
        currentPassword: currentPass,
        newPassword: newPass,
      },
      success: function (data) {
        console.log(data);
        if (data.status === "success") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Password updated successfully!",
            showConfirmButton: false,
            timer: 1500,
            willClose: () => {
              setTimeout(() => {
                window.location.reload();
              }, 100);
            },
          });
        } else {
          $("#current-pass").addClass("is-invalid");
          Swal.fire({
            position: "center",
            icon: "question",
            title: "Incorrect password!",
            showConfirmButton: true,
          });
        }
      },
      error: function () {
        $("#current-pass").addClass("is-invalid");
        Swal.fire({
          position: "center",
          icon: "question",
          title: "Incorrect password!",
          showConfirmButton: true,
        });
      },
    });
  });
