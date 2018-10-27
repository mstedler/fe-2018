var paises = 'util/paises.json';
var estados = 'util/estados.json';
var municipios = "util/municipios.json";

function scaleOutTimerIn(element, time) {
    $(element).toggleClass("scale-out");
    setTimeout(function () {
        $(element).toggleClass("scale-out");
    }, time);
}
function preencheSelect(selectId, url, condicao) {
    $(selectId).html("");
    $.getJSON(url, function (data) {
        var html = '<option value="" disabled selected>Escolha uma opção</option>';
        var len = data.length;
        for (var i = 0; i < len; i++) {
            if (eval(condicao)) {
                html += '<option value="' + data[i].codigo + '">' + data[i].nome + '</option>';
            }
        }
        $(selectId).html(html);
        $(selectId).formSelect();
    });
}
function limpaEndereco() {
    $("#cep-endereco").val("");
    $("#logradouro-endereco").val("");
    $("#bairro-endereco").val("");
    $("#municipio-endereco").html("");
    $('#estado-endereco option[value=""]').prop('selected', true);
    $('select').formSelect();
}

$(document).ready(function () {
    $("#cep-endereco").blur(function () {
        if($('input[name="endereco[radio-pais]"]:checked').val() == "es")
            return;
        var cep = $(this).val().replace(/\D/g, '');

        if (cep != "") {
            var validacep = /^[0-9]{8}$/;

            if (validacep.test(cep)) {
                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                    if (!("erro" in dados)) {
                        $("#logradouro-endereco").val(dados.logradouro);
                        $("#bairro-endereco").val(dados.bairro);
                        $('#estado-endereco option[value="' + dados.uf + '"]').prop('selected', true);
                        $('#estado-endereco').formSelect();
                        preencheSelect("#municipio-endereco", municipios, "data[i].uf == '" + dados.uf + "'");
                        setTimeout(function () {
                            $('#municipio-endereco option[value="' + dados.ibge + '"]').prop('selected', true);
                            $('#municipio-endereco').formSelect();
                        }, 10);
                       
                    }
                    else {
                        limpaEndereco();
                        alert("CEP não encontrado.");
                    }
                });
            }
            else {
                limpaEndereco();
                alert("Formato de CEP inválido.");
            }
        }
        else {
            limpaEndereco();
        }
    });

    $('.dropdown-trigger').dropdown();
    $('.tabs').tabs();
    $('select').formSelect();
    $('.datepicker').datepicker({ format: "dd/mm/yyyy", autoClose: true });

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
		
	

	$("#relacionamento-vinculos").change(function () {
		var naobiologicos = [ "22", "262", "263", "264", "265" ];
		if(naobiologicos.includes($(this).val())) {
			$("#datas-vinculo").show();
		} else {
			$("#datas-vinculo").hide();
		}
    });
		
    $("#estado-nacionalidade-dados")
        .change(function () {
            preencheSelect("#municipio-nacionalidade-dados", municipios, "data[i].uf == '" + $(this).val() + "'");
        });

    $("#estado-endereco")
        .change(function () {
            preencheSelect("#municipio-endereco", municipios, "data[i].uf == '" + $(this).val() + "'");
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

    $('input[type=radio][name="endereco[radio-pais]"]').change(function () {
        limpaEndereco();
        if (this.value == 'br') {
            $("#pais-select-endereco").hide();
            $("#fieldset-brasileiro").show();
            $("#fieldset-estrangeiro").hide();
        }
        else if (this.value == 'es') {
            $("#fieldset-brasileiro").hide();
            $("#fieldset-estrangeiro").show();
            $("#pais-select-endereco").show();
        }
    });

    preencheSelect("#pais-endereco", paises , "true");
    preencheSelect("#estado-ctps", estados, "true");
    preencheSelect("#estado-endereco", estados, "true");
    preencheSelect("#pais-nacionalidade-dados", paises, "true");
    preencheSelect("#estado-nacionalidade-dados", estados, "true");
});