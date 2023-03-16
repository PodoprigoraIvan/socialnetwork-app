$(() => {
    $(".accordion").accordion({
        collapsible: true
    });

    $('.openDialogButton').on('click', (e) => {
		let element = $(e.currentTarget);
		let id = +element.attr('userid');
		$.get("/user/"+id).done((user)=>{
            console.log($('#name'));
            $('#name').val(user.name);
            $('#email').val(user.email);
            $('#role').val(user.role);
            $('#status').val(user.status);
            $('#birthDate').val(user.birthDate);
            $('#editform').attr('action', '/edit/' + user.id);
            $('#upload_button').attr('userid', id);
            document.getElementById('edit').showModal();
        });
	});

    $('#upload_button').on('click', (e) => {
		let element = $(e.currentTarget);
		let id = element.attr('userid');
		let image = document.getElementById("image-input").files[0];
        let formData = new FormData();
        formData.append("image", image);
        $.ajax({
            type: "POST",
            url: "/upload/image/" + id, 
            data: formData, 
            processData: false,
            contentType: false
        });
        location.href = "/";
	});

    $('.close_button').on('click', (e) => {
        document.getElementById('close_button').closest('dialog').close();
	});

});