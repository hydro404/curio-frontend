$(document).ready(function() {
    $('#profile-form').submit(function(event) {
        event.preventDefault();
        var formElement = this;
        var formData = new FormData(formElement);
        var firstname = formData.get('firstname');
        var lastname = formData.get('lastname');
        var phone = formData.get('phone');
        
        $.ajax({
            url: '/updateProfile',
            type: 'PUT',
            data: {
                firstname: firstname,
                lastname: lastname,
                phone: phone
            },
            success: function(data) {
                console.log(data);
                if (data.status === 'success') {
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
                        }
                    });
                } else {
                    alert('Profile update failed');
                }
            },
            error: function() {
                alert('Profile update failed');
            }
        });
    });
});
