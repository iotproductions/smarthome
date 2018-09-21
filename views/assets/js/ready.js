$(function() {
    $('[data-toggle="tooltip"]').tooltip()
});

jQuery(document).ready(function() {
    jQuery('.scrollbar-inner').scrollbar();
    getMinMaxTemperature();
});

//http://smarthome.myftp.org:7788/getnodecacheday

function getMinMaxTemperature() {
    date_time_array = [];
    temperature_min_array = [];
    temperature_max_array = [];

    $.ajax({
            method: "GET",
            url: 'http://smarthome.myftp.org:7788/getnodecacheday'
        })
        .done(function(node_payload) {
            //console.log(JSON.stringify(node_payload));
            var jsonNode = JSON.parse(JSON.stringify(node_payload));

            if (jsonNode.status == true) {
                console.log("Data length: ", jsonNode.length);
                console.log("Payload: ", jsonNode.payload);
                for (i = 0; i < jsonNode.length; i++) {
                    date_time_array.push(moment(new Date(jsonNode.payload[i].yearCheck, jsonNode.payload[i].monthCheck - 1, jsonNode.payload[i].dayCheck)).format('l'));
                    temperature_max_array.push(jsonNode.payload[i].temperature_max_value);
                    temperature_min_array.push(jsonNode.payload[i].temperature_min_value);
                }
            }
            //console.log("Max Temperature: " , Math.max.apply(Math, temperature_array));
            //console.log("Max Time: " , date_array[temperature_array.indexOf(Math.max.apply(Math, temperature_array))]);
            
            $("#id_minimum_temperature_month").html(Math.min.apply(Math, temperature_min_array));
            $("#id_maximum_temperature_month").html(Math.max.apply(Math, temperature_max_array));
            
            console.log("date_array: ", date_time_array);
            console.log("temperature_max_array: ", temperature_max_array);
            console.log("temperature_max_array: ", temperature_min_array);
            plot_min_max_temperature_chart(date_time_array, temperature_min_array, temperature_max_array);
        });
}


function getChartofDate(date) {
    date_array = [];
    temperature_array = [];
    $.ajax({
            method: "GET",
            url: 'http://smarthome.myftp.org:7788/nodes/getChartByADate?FromDate=' + date
        })
        .done(function(node_payload) {
            //console.log(JSON.stringify(node_payload));
            var jsonNode = JSON.parse(JSON.stringify(node_payload));

            if (jsonNode.status == true) {
                //console.log("Data length: ", jsonNode.length);
                //console.log("Payload: ", jsonNode.payload);
                for (i = 0; i < jsonNode.length; i++) {
                    date_array.push(moment(new Date(jsonNode.payload[i].sensor_time)).format('lll'));
                    temperature_array.push(jsonNode.payload[i].temperature);
                }
                if (jsonNode.length == 0) {
                    $.notify({
                        icon: 'la la-times-circle',
                        title: 'Smart Home System',
                        message: 'Không có dữ liệu trong ngày đã chọn !',
                    }, {
                        type: 'danger',
                        placement: {
                            from: "bottom",
                            align: "center"
                        },
                        time: 1000,
                    });
                }
                //date_array = date_array.reverse();
                //temperature_array = temperature_array.reverse();
            }
            //console.log("Max Temperature: " , Math.max.apply(Math, temperature_array));
            //console.log("Max Time: " , date_array[temperature_array.indexOf(Math.max.apply(Math, temperature_array))]);
            $("#id_current_temperature_value").html(temperature_array[jsonNode.length - 1]);
            $("#id_current_temperature_time").html(date_array[jsonNode.length - 1]);

            $("#id_maximum_temperature_value").html(Math.max.apply(Math, temperature_array));
            $("#id_maximum_temperature_time").html(date_array[temperature_array.indexOf(Math.max.apply(Math, temperature_array))]);


            $("#id_minimum_temperature_value").html(Math.min.apply(Math, temperature_array));
            $("#id_minimum_temperature_time").html(date_array[temperature_array.indexOf(Math.min.apply(Math, temperature_array))]);

            //console.log("date_array: ", date_array);
            //console.log("temperature_array: ", temperature_array);
            plot_chart();
        });
}

$(document).ready(function() {

    var toggle_sidebar = false,
        toggle_topbar = false,
        nav_open = 0,
        topbar_open = 0;

    if (!toggle_sidebar) {
        $toggle = $('.sidenav-toggler');

        $toggle.click(function() {
            if (nav_open == 1) {
                $('html').removeClass('nav_open');
                $toggle.removeClass('toggled');
                nav_open = 0;
            } else {
                $('html').addClass('nav_open');
                $toggle.addClass('toggled');
                nav_open = 1;
            }
        });
        toggle_sidebar = true;
    }

    if (!toggle_topbar) {
        $topbar = $('.topbar-toggler');

        $topbar.click(function() {
            if (topbar_open == 1) {
                $('html').removeClass('topbar_open');
                $topbar.removeClass('toggled');
                topbar_open = 0;
            } else {
                $('html').addClass('topbar_open');
                $topbar.addClass('toggled');
                topbar_open = 1;
            }
        });
        toggle_topbar = true;
    }

    //select all
    $('[data-select="checkbox"]').change(function() {
        $target = $(this).attr('data-target');
        $($target).prop('checked', $(this).prop("checked"));
    })

});

// Initialize Socket
var socket = io.connect('http://smarthome.myftp.org:8080');
socket.emit('some event', {
    for: 'everyone'
});
// Ondocument ready
$(document).ready(function() {
    // Initialize Date picker
    $('#datepicker').datepicker({
        uiLibrary: 'bootstrap4',
        footer: true,
        modal: true
    });
    // Set current date
    $('#datepicker').val(moment().format('L'));
    // Handle date picker is changed
    $("#datepicker").change(function() {
        console.log("Handler for datepicker changed");
        $("#datepicker").val(moment(moment($("#datepicker").val()).format('L')).format('L'));
        getChartofDate($("#datepicker").val());
    });



    $("#id_previous_date").click(function() {
        $("#datepicker").val(moment(moment($("#datepicker").val()).format('L')).subtract(1, 'days').format('L'));
        getChartofDate($("#datepicker").val());
    });

    $("#id_next_date").click(function() {
        $("#datepicker").val(moment(moment($("#datepicker").val()).format('L')).add(1, 'days').format('L'));
        getChartofDate($("#datepicker").val());

    });

    $("#id_get_chart_of_date").click(function() {
        console.log("Get chart of date: ", moment().format('L'));
        $('#datepicker').val(moment().format('L'));
        getChartofDate(moment().format('L'));
    });


    socket.on('chat message', function(msg) {
        /*
        $.notify({
        	icon: 'la la-bell',
        	title: 'Smart Home System',
        	message: msg,
        },{
        	type: 'minimalist',
        	placement: {
        		from: "top",
        		align: "right"
        	},
        	time: 200,
        });*/

    });
    socket.on('server message', function(msg) {
        console.log("Device status: ", msg);
        var device_status = JSON.parse(JSON.stringify(msg));
        console.log("Device status: ", device_status);
        if (device_status.device === "light") {
            if (device_status.status === "on") {
                $("#btn_demo_button").removeClass("btn-basic").addClass("btn-danger");

                $.notify({
                    icon: 'la la-bell',
                    title: 'Smart Home System',
                    message: "Turn on the light",
                }, {
                    type: 'success',
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    time: 200,
                });
            } else {
                $("#btn_demo_button").removeClass("btn-danger").addClass("btn-basic");
                $.notify({
                    icon: 'la la-bell',
                    title: 'Smart Home System',
                    message: "Turn off the light",
                }, {
                    type: 'danger',
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    time: 200,
                });
            }
        }

        if (device_status.device === "timer") {
            if (device_status.status === "on") {
                $("#btn_timer_control").removeClass("btn-basic").addClass("btn-success");

                $.notify({
                    icon: 'la la-bell',
                    title: 'Smart Home System',
                    message: "Turn on the timer",
                }, {
                    type: 'success',
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    time: 200,
                });
            } else {
                $("#btn_timer_control").removeClass("btn-success").addClass("btn-basic");
                $.notify({
                    icon: 'la la-bell',
                    title: 'Smart Home System',
                    message: "Turn off the timer",
                }, {
                    type: 'danger',
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    time: 200,
                });
            }
        }

        if (device_status.device === "pump") {
            if (device_status.status === "on") {
                $("#btn_pump_control").removeClass("btn-basic").addClass("btn-info");

                $.notify({
                    icon: 'la la-bell',
                    title: 'Smart Home System',
                    message: "Turn on the pump",
                }, {
                    type: 'success',
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    time: 200,
                });
            } else {
                $("#btn_pump_control").removeClass("btn-info").addClass("btn-basic");
                $.notify({
                    icon: 'la la-bell',
                    title: 'Smart Home System',
                    message: "Turn off the pump",
                }, {
                    type: 'danger',
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    time: 200,
                });
            }
        }

        if (device_status.device === "socket") {
            if (device_status.status === "on") {
                $("#btn_socket_control").removeClass("btn-basic").addClass("btn-primary");

                $.notify({
                    icon: 'la la-bell',
                    title: 'Smart Home System',
                    message: "Turn on the socket",
                }, {
                    type: 'success',
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    time: 200,
                });
            } else {
                $("#btn_socket_control").removeClass("btn-primary").addClass("btn-basic");
                $.notify({
                    icon: 'la la-bell',
                    title: 'Smart Home System',
                    message: "Turn off the socket",
                }, {
                    type: 'danger',
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    time: 200,
                });
            }
        }

        if (device_status.device === "door") {
            if (device_status.status === "on") {
                $("#btn_door_control").removeClass("btn-basic").addClass("btn-warning");

                $.notify({
                    icon: 'la la-bell',
                    title: 'Smart Home System',
                    message: "Turn on the door",
                }, {
                    type: 'success',
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    time: 200,
                });
            } else {
                $("#btn_door_control").removeClass("btn-warning").addClass("btn-basic");
                $.notify({
                    icon: 'la la-bell',
                    title: 'Smart Home System',
                    message: "Turn off the door",
                }, {
                    type: 'danger',
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    time: 200,
                });
            }
        }

        if (device_status.device === "power") {
            if (device_status.status === "on") {
                $("#btn_power_control").removeClass("btn-basic").addClass("btn-success");

                $.notify({
                    icon: 'la la-bell',
                    title: 'Smart Home System',
                    message: "Turn on the power",
                }, {
                    type: 'success',
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    time: 200,
                });
            } else {
                $("#btn_power_control").removeClass("btn-success").addClass("btn-basic");
                $.notify({
                    icon: 'la la-bell',
                    title: 'Smart Home System',
                    message: "Turn off the power",
                }, {
                    type: 'danger',
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    time: 200,
                });
            }
        }

    }); // end of socket.on

    socket.on('mqtt-message', function(msg) {
        console.log(msg);
        if (msg.topic === 'device/light') // update light status
        {
            try {
                var jsonData = JSON.parse(msg.message);
                if (jsonData.state === "ON") // den dang mo
                {
                    console.log("Cap nhat trang thai den dang mo");
                    $("#btn_demo_button").removeClass("btn-basic").addClass("btn-danger");
                    $.notify({
                        icon: 'la la-bell',
                        title: 'Smart Home System',
                        message: 'Đèn ngủ đang bật !',
                    }, {
                        type: 'success',
                        placement: {
                            from: "top",
                            align: "right"
                        },
                        time: 200,
                    });
                } else // Den dang tat
                {
                    console.log("Cap nhat trang thai den dang tat");
                    $("#btn_demo_button").removeClass("btn-danger").addClass("btn-basic");
                    $.notify({
                        icon: 'la la-bell',
                        title: 'Smart Home System',
                        message: 'Đèn ngủ đang tắt !',
                    }, {
                        type: 'danger',
                        placement: {
                            from: "top",
                            align: "right"
                        },
                        time: 200,
                    });
                }
                // Update slider bar value
                console.log("Root = ", jsonData.brightness);
                console.log("Width = ", Math.round((jsonData.brightness / 255) * 100));
                $('#id_light_brightness').css('width: ' + Math.round((jsonData.brightness / 255) * 100) + '%;').attr('aria-valuenow=', Math.round((jsonData.brightness / 255) * 100));
                $("#id_light_brightness").text(jsonData.brightness + '%');
            } catch (e) {
                console.log("[Error] ", e);
            }
        }
        if (msg.topic === "/devices/H0148R1S001N001/update") {
            try {
                var jsonData = JSON.parse(msg.message);
                console.log("Temperature: ", jsonData.Temperature, " ,Humidity: ", jsonData.Humidity);
                $("#room_current_temperature").html(jsonData.Temperature + " °C");
                $("#room_current_humidity").html(jsonData.Humidity + " %");

            } catch (e) {
                console.log("[Error] ", e);
            }
        }

    }); // end of socket.on

    $("#btn_demo_button").click(function() {
        $(this).toggleClass('btn-danger  btn-basic');
        if ($(this).hasClass("btn-danger")) {
            //socket.emit('chat message',{"device":"light", "status":"on"});

            $.ajax({
                url: 'http://smarthome.myftp.org:5566/devices/on',
                dataType: 'json',
                type: 'GET',
                data: null,
                async: false,
                success: function(result) {
                    if (!result.success || !result.data || !result.data.length) {
                        console.log("Gui lenh bat den thanh cong !");
                        getDeviceStatus();
                        /*swal({
                        	closeOnEsc: false,
                        	closeOnClickOutside: false,
                        	title: 'Bật đèn thành công',
                        	text: 'Đèn ngủ đã được bật !',
                        	icon: 'success',
                        	timer: 1500,
                        	buttons: false,
                        });*/
                    } else {
                        sweetAlert("Thất bại", "Xảy ra lỗi, vui lòng thử lại sau", "warning")
                    }
                }
            });
        } else {
            //socket.emit('chat message',{"device":"light", "status":"off"});

            $.ajax({
                url: 'http://smarthome.myftp.org:5566/devices/off',
                dataType: 'json',
                type: 'GET',
                data: null,
                async: false,
                success: function(result) {

                    if (!result.success || !result.data || !result.data.length) {
                        console.log("Gui lenh tat den thanh cong !");
                        getDeviceStatus();
                        /*swal({
                        	closeOnEsc: false,
                        	closeOnClickOutside: false,
                        	title: 'Tắt đèn thành công',
                        	text: 'Đèn ngủ đã được tắt !',
                        	icon: 'success',
                        	timer: 1500,
                        	buttons: false,
                        });
                        */
                    } else {
                        sweetAlert("Thất bại", "Xảy ra lỗi, vui lòng thử lại sau", "warning")
                    }
                }
            });
        }
    });

    $("#btn_pump_control").click(function() {
        $(this).toggleClass('btn-info  btn-basic');
        if ($(this).hasClass("btn-info")) {
            socket.emit('chat message', {
                "device": "pump",
                "status": "on"
            });
        } else {
            socket.emit('chat message', {
                "device": "pump",
                "status": "off"
            });
        }
    });

    $("#btn_timer_control").click(function() {
        $(this).toggleClass('btn-success  btn-basic');
        if ($(this).hasClass("btn-success")) {
            socket.emit('chat message', {
                "device": "timer",
                "status": "on"
            });
        } else {
            socket.emit('chat message', {
                "device": "timer",
                "status": "off"
            });
        }
    });

    $("#btn_socket_control").click(function() {
        $(this).toggleClass('btn-primary  btn-basic');
        if ($(this).hasClass("btn-primary")) {
            socket.emit('chat message', {
                "device": "socket",
                "status": "on"
            });
        } else {
            socket.emit('chat message', {
                "device": "socket",
                "status": "off"
            });
        }
    });

    $("#btn_door_control").click(function() {
        $(this).toggleClass('btn-warning  btn-basic');
        if ($(this).hasClass("btn-warning")) {
            socket.emit('chat message', {
                "device": "door",
                "status": "on"
            });
        } else {
            socket.emit('chat message', {
                "device": "door",
                "status": "off"
            });
        }
    });

    $("#btn_power_control").click(function() {
        $(this).toggleClass('btn-success  btn-basic');
        if ($(this).hasClass("btn-success")) {
            socket.emit('chat message', {
                "device": "power",
                "status": "on"
            });
        } else {
            socket.emit('chat message', {
                "device": "power",
                "status": "off"
            });
        }
    });

    $(function() {
        // Basic instantiation:
        $('#id_change_light_color').colorpicker();

        // Example using an event, to change the color of the .jumbotron background:
        $('#id_change_light_color').on('colorpickerChange', function(event) {
            $('.jumbotron').css('background-color', event.color.toString());
        });
    });

    getDeviceStatus();

    $("#id_btn_set_brightness").click(function() {
        //console.log("Current brightness value: ",$( "#slider" )); 
    });

    $('#slider').bootstrapSlider({
        formatter: function(value) {
            console.log("Current brightness value: ", value);
            return 'Current value: ' + value;
        }
    });

}); // Ondocument ready

function getDeviceStatus() {
    $.ajax({
        url: 'http://smarthome.myftp.org:5566/devices/getStatus',
        dataType: 'json',
        type: 'POST',
        data: {
            SerialNumber: "H0148R1S001N001"
        },
        async: false,
        success: function(result) {

            if (!result.success || !result.data || !result.data.length) {
                console.log("Gui lenh dong bo trang thai thanh cong !");
                /*
                swal({
                	closeOnEsc: false,
                	closeOnClickOutside: false,
                	title: 'Cập nhật trạng thái',
                	text: 'Đã gửi yêu cầu cập nhật trạng thái thiết bị !',
                	icon: 'success',
                	timer: 1000,
                	buttons: false,
                });
                */
            } else {
                sweetAlert("Thất bại", "Xảy ra lỗi, vui lòng thử lại sau", "warning")
            }
        }
    });
}