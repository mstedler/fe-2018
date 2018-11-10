var paises = 'util/paises.json';
var estados = 'util/estados.json';
var municipios = "util/municipios.json";
var removeRowBtn = '<a onclick="removeClosest(this, \'tr\', \'tbody\');"class="btn-floating btn-small waves-effect waves-light red scale-transition"><i class="material-icons">remove</i></a>'
var removeLiBtn = '<a style="margin-top: 10px;" onclick="removeClosest(this, \'li\');"class="btn btn-small waves-effect waves-light red scale-transition">Remover</a>'

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
function removeClosest(element, closest, parent) {
    var parent = $(element).closest(parent);
    $(element).closest(closest).remove();
    checkEmptyness(parent);
}
function checkEmptyness(element) {
    if(element.children().length <= 0){
         element.parent().hide(); 
    }
}
function addToTableGrupoUtilizacao(){
    var uso = $("#uso-grupo-utilizacao");
    var condicao = $("#condicao-grupo-utilizacao");
    var dataI = $("#data-inicio-grupo-utilizacao");
    var dataF = $("#data-fim-grupo-utilizacao");
    var table = $("#table-grupo-utilizacao");
    var template = 
    [
        "<tr>", 
            "<td>",
            uso.find(":selected").text(),
            "</td>",
            "<td>",
            condicao.find(":selected").text(),
            "</td>",
            "<td>",
            dataI.val(),
            "</td>",
            "<td>",
            dataF.val(),
            "</td>","<td>",
            removeRowBtn,
            "</td>",
        "</tr>"
    ];
    uso.val('');
    uso.formSelect();
    condicao.val('');
    condicao.formSelect();
    dataI.val('');
    dataF.val('');
    table.find('tbody').append(template.join(''));
    table.show();
}

function addToTableRepresentacaoAlternativa(){
    var input = $("#representacao-alternativa-nome");
    var table = $("#table-representacao-alternativa");
    var template = 
    [
        "<tr>", 
            "<td>",
            input.val(),
            "</td>",
            "<td>",
            removeRowBtn,
            "</td>",
        "</tr>"
    ];
    input.val('');
    table.find('tbody').append(template.join(''));
    table.show();
}

function addToTableComunicacaoEletronica() {
    var meio = $("#meio-comunicacoes");
    var preferencia = $("#preferencia-comunicacoes");
    var utilizacao = $("#utilizacao-comunicacoes");
    var informacao = $("#informacao-comunicacoes");
    var table = $("#table-comunicacao-eletronica");
    var template = [
        "<tr>", 
            "<td>",
            meio.find(":selected").text(),
            "</td>",
            "<td>",
            informacao.val(),
            "</td>",
            "<td>",
            preferencia.find(":selected").text(),
            "</td>",
            "<td>",
            utilizacao.find(":selected").text(),
            "</td>","<td>",
            removeRowBtn,
            "</td>",
        "</tr>"
    ];
    table.find('tbody').append(template.join(''));
    table.show();
}

function addNome() {
    var primeiro = $("#primeiro-nome");
    var sobrenome = $("#sobrenome-nome");
    var titulo = $("#titulo-nome");
    var nomes = $("#nomes");
    
    var tableRA = $("#table-representacao-alternativa");
    var tableGU = $("#table-grupo-utilizacao");
    
    var divRA = tableRA.parent().clone(true);
    var divGU = tableGU.parent().clone(true);

    var template = [
        '<li style="display:inline">',
            '<div class="collapsible-header">',
                '<div style="width: 100%; height: 100%;">',
                    '<span style="float-left">' + titulo.val() + ' ' + primeiro.val() + ' ' + sobrenome.val() + '</span>',
                    '<label style="float: right;"><input class="with-gap" name="group3" type="radio" checked /><span>Preferido</span></label>',
                '</div>',
            '</div>',
            '<div class="collapsible-body">',
                divRA.html(),
                divGU.html(),
                removeLiBtn,
            '</div>',
        '</li>'
    ];
    
    tableRA.find("tbody").empty();
    tableGU.find("tbody").empty();
    
    tableRA.hide();
    tableGU.hide();
    
    nomes.append(template.join(''));
    nomes.show();
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
    $('.collapsible').collapsible();
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