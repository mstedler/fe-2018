function scaleOutTimerIn(element, time) {
    $(element).toggleClass("scale-out");
    setTimeout(function () {
        $(element).toggleClass("scale-out");
    }, time);
}
$(document).ready(function () {
    $('.dropdown-trigger').dropdown();
    $('.tabs').tabs();
    $('select').formSelect();
    $('.datepicker').datepicker({ format: "dd/mm/yyyy", autoClose: true, disableWeekends: true });
    $("#tipo-identificador")
        .change(function () {
            $("#tipo-identificador option:selected").each(function () {
                $("#ctps, #titulo-eleitor, #certidao").hide();
                switch ($(this).val()) {
                    case "18":
                        $("#ctps").show();
                        break;
                    case "19":
                        $("#titulo-eleitor").show();
                        break;
                    case "20":
                        $("#certidao").show();
                        break;
                }
            });
        });

    $('input[type=radio][name=nacionalidade]').change(function () {
        if (this.value == 'br') {
            $("#estrangeiro").hide();
            $("#brasileiro").show();
        }
        else if (this.value == 'es') {
            $("#brasileiro").hide();
            $("#estrangeiro").show();
        }
    });
});