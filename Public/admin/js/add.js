		$(function () {
			$('#studentID').on('keydown', function (event) {
				if (event.keyCode === 13) {
					var studentID = $(this).val();
					$.ajax({
						url: 'test',
						type: 'POST',
						dataType: 'json',
						data: {
							studentID: studentID
						},
						success: function (response, status) {
							var data = response;
							if (data.status === 200 && status === 'success') {
								var tr  = '<tr>';
									tr += '<td>'+ studentID +'</td>',
									tr += '<td>'+ data.data.user_name +'</td>',
									tr += '<td>'+ data.data.user_gender +'</td>',
									tr += '<td>'+ data.data.user_tel +'</td>',
									tr += '<td>'+ data.data.user_college +'</td>',
									tr += '<td>'+ data.data.user_status +'</td>';
									tr += '<td><span class="label label-sm label-primary">删除</span></td>';
								$('#studentID').parents('tr').before(tr);
							} else {
								alert("你输入的面试编号或学号有误!");
							}
						}
					});
				}
			});



			$('.label-primary').on('click', function () {
				$(this).parents('tr').remove();
			});

			$('.add-all').click(function (event) {
				event.preventDefault();
				
				$.ajax({
					url: 'test',
					type: 'POST',
					dataType: 'json',
					data: {
						applyNumber: applyNumber
					},
					success: function (response, status) {

					}
				});
			});

		});