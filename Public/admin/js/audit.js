		

		$(function () {
			function auditOneStu(elem) {
				elem.on('keydown', function (event) {
					if (event.keyCode === 13) {
						$.ajax({
							url: 'test',
							type: 'POST',
							dataType: 'json',
							data: {
								number: $(this).val()
							},
							success: function (response, status) {
								var data = response;
								if (data.status === 200 && status === 'success') {
									var tr  = '<tr data-id='+ data.data.flow_id +'>';
										tr += '<td>'+ data.data.apply_number +'</td>',
										tr += '<td>'+ data.data.user_number +'</td>',
										tr += '<td>'+ data.data.user_name +'</td>',
										tr += '<td>'+ data.data.user_gender +'</td>',
										tr += '<td>'+ data.data.user_college +'</td>',
										tr += '<td>'+ data.data.user_tel +'</td>',
										tr += '<td>'+ data.data.user_status +'</td>'
									$('.new').before(tr);
								} else {
									alert("你输入的面试编号或学号有误!");
								}
							}
						});
					}
				})
			}

			auditOneStu($('#apply-number'));
			auditOneStu($('#user-number'));

			
			function passAll() {
				var flowIdArray = [];
				$.each($('.table-hover tbody > tr'), function (index, elem) {
					if ($(elem).data('id')) {
						flowIdArray.push($(elem).data('id'));
					}
				})
				$.ajax({
					url: '',
					type: 'POST',
					data: {
						flow_ids: $flowIdArray
					}
				}).then(function (response, status) {
					/*
					 * 如果成功remove所有的节点
					 */
				})
			}

			$('.pass-all').on('click', passAll);

		});
