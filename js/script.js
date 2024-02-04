jQuery(document).ready(function ($) {
    // Function to activate/deactivate file upload based on payment method
    function toggleFileUpload() {
        var paymentMethod = $('input[name="payment_method"]:checked').val();

        // Add or remove validation based on the payment method
        if (paymentMethod === 'bacs') {
            // Activate validation
            $('body').on('checkout_error', function () {
                $('input#vicode_file').attr('required', 'required');
            });
        } else {
            // Deactivate validation
            $('body').off('checkout_error');
            $('input#vicode_file').removeAttr('required');
        }

        // Enable or disable file upload based on the payment method
        if (paymentMethod === 'bacs') {
            // Activate file upload
            $('input#vicode_file').prop('disabled', false);
        } else {
            // Deactivate file upload
            $('input#vicode_file').prop('disabled', true);
            // Clear the file input value to prevent form submission with an invalid file
            $('input#vicode_file').val('');
            // Clear the file list
            $('#vicode_filelist').empty();
        }
    }

    // Initial check on page load
    toggleFileUpload();

    // Handle changes to the payment method
    $('form.checkout').on('change', 'input[name="payment_method"]', function () {
        toggleFileUpload();
    });

    // Handle file upload change
    $('#vicode_file').change(function () {
        if (!this.files.length) {
            $('#vicode_filelist').empty();
        } else {
            const file = this.files[0];
            $('#vicode_filelist').html('<img src="' + URL.createObjectURL(file) + '"><span>' + file.name + '</span>');

            const formData = new FormData();
            formData.append('vicode_file', file);

            $.ajax({
                url: wc_checkout_params.ajax_url + '?action=vicodeupload',
                type: 'POST',
                data: formData,
                contentType: false,
                enctype: 'multipart/form-data',
                processData: false,
                success: function (response) {
                    $('input[name="vicode_file_field"]').val(response);
                }
            });
        }
    });
});
