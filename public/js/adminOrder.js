
function cancelOrder(id, status){
    $.ajax({
        url: '/approveCancelOrder',
        type: 'PUT',
        data: {id, status},
        success: function(result){
            if(result.status === 'success'){
                Swal.fire ({
                    title: 'Order Cancelled',
                    icon: 'success'
                }).then(() => {
                    location.reload();
                });
            }
        },
        error: function(error){
            console.log(error);
            Swal.fire({
                title: 'Something went wrong',
                icon: 'error'
            });
        }
    });
}