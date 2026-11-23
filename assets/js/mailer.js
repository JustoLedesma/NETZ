$(function() {

	var form = $('#ajax-contact');
	var formMessages = $('#form-messages');
	var submitBtn = form.find('button[type="submit"]');

	$(form).submit(function(e) {
		e.preventDefault();

		var formData = $(form).serialize();
		submitBtn.prop('disabled', true).text('Enviando...');

		$.ajax({
			type: 'POST',
			url: $(form).attr('action'),
			data: formData
		})
		.done(function(response) {
			$(formMessages).removeClass('error');
			$(formMessages).addClass('success');

			$(formMessages).text(response);

			$('#name').val('');
			$('#phone').val('');
			$('#email').val('');
			$('#message').val('');
		})
		.fail(function(data) {
			$(formMessages).removeClass('success');
			$(formMessages).addClass('error');

			if (data.responseText) {
				$(formMessages).text(data.responseText);
			} else {
				$(formMessages).text('Ocurrió un inconveniente al enviar su mensaje. Por favor contáctenos a info@netz.com.py o WhatsApp.');
			}
		})
		.always(function() {
			submitBtn.prop('disabled', false).text('Enviar');
		});

	});

});
