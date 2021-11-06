
document.addEventListener('DOMContentLoaded', function () {
    $(document).ready(function () {
        var localServer = 'http://192.168.1.2:8000';
        var liveServer = 'https://cem.soussidev.com';
        var server  = localServer;
        function uploadStudentsList(secret) {
            $.ajaxSetup({ async: false });
            $.get("https://amatti.education.gov.dz/scolarite/dossier_eleves/eleves", function (data, status) {
                var pageRender = $(data);
                var options = $("#annee_school > option", pageRender).clone();
                $('#yearsSelect').find('option').remove().end().append(options);
                $("#yearsSelect option").each(function () {
                    if ($(this).val()) {
                        let year = $(this).val();
                        let yearName = $(this).text();
                        var newcontent = document.createElement('div');
                        newcontent.innerHTML = '<p>رفع قائمة التلاميذ... يرجى الإنتظار ' + yearName + '</p><br>';
                        document.getElementById("status").appendChild(newcontent);
                        var objDiv = document.getElementById("status");
                        objDiv.scrollTop = objDiv.scrollHeight;
                        jQuery.ajax({
                            url: "https://amatti.education.gov.dz/scolarite/dossier_eleves/eleves/list_eleves",
                            data: { annee: year },
                            type: "POST",
                            success: function (data) {
                                var students = JSON.parse(data);

                                for (let i = 0; i < students.data.length; i++) {
                                    students.data[i][9] = '';
                                }

                                students = JSON.stringify(students);

                                jQuery.ajax({
                                    url: server + "/api/uploadstudents",
                                    data: {
                                        secret_token: secret,
                                        scholaryear: "students-" + year,
                                        data: students,
                                    },
                                    type: "POST",
                                    success: function (data) {
                                        newcontent.innerHTML = '<p>' + data + '</p>';
                                        document.getElementById("status").appendChild(newcontent);
                                        var objDiv = document.getElementById("status");
                                        objDiv.scrollTop = objDiv.scrollHeight;
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }

        function uploadStudentsMarks(secret) {
            $.get("https://amatti.education.gov.dz/scolarite/en_chiffre/analyse_class", function (data, status) {
                var pageRender = $(data);
                var options = $("#annee_school > option", pageRender).clone();
                $('#yearsSelect').find('option').remove().end().append(options);
                $("#yearsSelect option").each(function () {
                    if ($(this).val()) {
                        let year = $(this).val();
                        let yearName = $(this).text();
                        var newcontent = document.createElement('div');
                        newcontent.innerHTML = '<p>رفع قائمة المعدلات... يرجى الإنتظار ' + yearName + '</p>';
                        document.getElementById("status").appendChild(newcontent);
                        var objDiv = document.getElementById("status");
                        objDiv.scrollTop = objDiv.scrollHeight;
                        jQuery.ajax({
                            url: "https://amatti.education.gov.dz/scolarite/en_chiffre/analyse_class/get_division",
                            data: { annee: year, isAjax: true },
                            type: "POST",
                            success: function (data) {
                                newcontent.innerHTML = '<p> ... يرجى الإنتظار ' + yearName + '</p>';
                                document.getElementById("status").appendChild(newcontent);
                                var objDiv = document.getElementById("status");
                                objDiv.scrollTop = objDiv.scrollHeight;
                                $("#classSelect").html(data);
                                $("#classSelect option").each(function () {
                                    if ($(this).val()) {
                                        let group = $(this).val();
                                        let groupname = $(this).text();
                                        jQuery.ajax({
                                            url: "https://amatti.education.gov.dz/scolarite/en_chiffre/analyse_class/get_list",
                                            data: { trimestre: year, division: group },
                                            type: "POST",
                                            success: function (data) {
                                                jQuery.ajax({
                                                    url: server + "/api/uploadstudentsmarks",
                                                    data: {
                                                        secret_token: secret,
                                                        scholaryear: "marks-" + year + "-" + group,
                                                        data: data,
                                                    },
                                                    type: "POST",
                                                    success: function (data) {
                                                        newcontent.innerHTML = '<p>' + data + '</p>';
                                                        document.getElementById("status").appendChild(newcontent);
                                                        var objDiv = document.getElementById("status");
                                                        objDiv.scrollTop = objDiv.scrollHeight;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });

                            }
                        });
                    }
                });
            });
        }

        function getNewYearStudentsWithSubGroups(secret) {
            $.get("https://amatti.education.gov.dz/scolarite/passage_eleves/sub_division", function (data, status) {
                var pageRender = $(data);
                var options = $("#division > option", pageRender).clone();
                $('#newyearSelectSubGroups').find('option').remove().end().append(options);
                $("#newyearSelectSubGroups option").each(function () {
                    if ($(this).val()) {
                        let group = $(this).val();
                        let groupName = $(this).text();
                        var newcontent = document.createElement('div');
                        newcontent.innerHTML = '<p>رفع قائمة التلاميذ... يرجى الإنتظار ' + group + '</p><br>';
                        document.getElementById("status").appendChild(newcontent);
                        var objDiv = document.getElementById("status");
                        objDiv.scrollTop = objDiv.scrollHeight;
                        jQuery.ajax({
                            url: "https://amatti.education.gov.dz/scolarite/passage_eleves/sub_division/list_eleves",
                            data: { division: group },
                            type: "POST",
                            success: function (response) {
                                jQuery.ajax({
                                    url: server + "/api/uploadstudentssubgroups",
                                    data: {
                                        secret_token: secret,
                                        subgroup: "subgroup-" + group,
                                        data: response,
                                    },
                                    type: "POST",
                                    success: function (data) {
                                        newcontent.innerHTML = '<p>' + data + '</p>';
                                        document.getElementById("status").appendChild(newcontent);
                                        var objDiv = document.getElementById("status");
                                        objDiv.scrollTop = objDiv.scrollHeight;
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }

        function getWorkersData(secret) {
            var newcontent = document.createElement('div');
            newcontent.innerHTML = '<p>رفع قائمة العمال... يرجى الإنتظار</p><br>';
            document.getElementById("status").appendChild(newcontent);
            var objDiv = document.getElementById("status");
            objDiv.scrollTop = objDiv.scrollHeight;
            jQuery.ajax({
                url: "https://amatti.education.gov.dz/pers/personnel/list_etablissement",
                type: "POST",
                success: function (response) {

                    jQuery.ajax({
                        url: server + "/api/uploadworkers",
                        data: {
                            secret_token: secret,
                            data: response,
                        },
                        type: "POST",
                        success: function (data) {
                            newcontent.innerHTML = '<p>' + data + '</p>';
                            document.getElementById("status").appendChild(newcontent);
                            var objDiv = document.getElementById("status");
                            objDiv.scrollTop = objDiv.scrollHeight;
                        }
                    });
                }
            });
        }

        function getStudentsState(secret) {
            jQuery.ajax({
                url: "https://amatti.education.gov.dz/scolarite/passage_eleves/dossier_eleve/list_eleves",
                type: "POST",
                success: function (response) {
                    var students = JSON.parse(response);

                    for (let i = 0; i < students.data.length; i++) {
                        students.data[i][9] = '';
                    }

                    students = JSON.stringify(students);
                    var newcontent = document.createElement('div');
                            newcontent.innerHTML = '<p>يتم الآن تحميل صفة التلاميذ</p>';
                            document.getElementById("status").appendChild(newcontent);
                            var objDiv = document.getElementById("status");
                            objDiv.scrollTop = objDiv.scrollHeight;

                    jQuery.ajax({
                        url: server + "/api/uploadstudentsstate",
                        data: {
                            secret_token: secret,
                            data: students,
                        },
                        type: "POST",
                        success: function (data) {
                            var newcontent = document.createElement('div');
                            newcontent.innerHTML = '<p>' + data + '</p>';
                            document.getElementById("status").appendChild(newcontent);
                            var objDiv = document.getElementById("status");
                            objDiv.scrollTop = objDiv.scrollHeight;
                        }
                    });
                }
            });
        }

        $('#updatestudents').on('click', function () {
            $('#status').empty();
            var newcontent = document.createElement('div');
            newcontent.innerHTML = '<p>رفع قوائم التلاميذ</p>';
            document.getElementById("status").appendChild(newcontent);
            var objDiv = document.getElementById("status");
            objDiv.scrollTop = objDiv.scrollHeight;
            let secret = $('#secret_token').val();
            $.ajaxSetup({ async: true });
            uploadStudentsList(secret);
        });

        $('#updatestudentsState').on('click', function () {
            $('#status').empty();
            let secret = $('#secret_token').val();
            $.ajaxSetup({ async: true });
            getStudentsState(secret);
        });

        $('#updatesubgroups').on('click', function () {
            $('#status').empty();
            let secret = $('#secret_token').val();
            $.ajaxSetup({ async: true });
            getNewYearStudentsWithSubGroups(secret);
        });

        $('#updatemarks').on('click', function () {
            $('#status').empty();
            let secret = $('#secret_token').val();
            $.ajaxSetup({ async: true });
            uploadStudentsMarks(secret);
        });

        $('#updateworkers').on('click', function () {
            $('#status').empty();
            let secret = $('#secret_token').val();
            $.ajaxSetup({ async: true });
            getWorkersData(secret);

        });



        $(document).ajaxStop(function () {
            var newcontent = document.createElement('div');
            newcontent.innerHTML = '<p> إنتهى </p>';
            document.getElementById("status").appendChild(newcontent);
            var objDiv = document.getElementById("status");
            objDiv.scrollTop = objDiv.scrollHeight;
        });
    });

});
