var hipoteca = artifacts.require("hipoteca");

function hex_to_ascii(str1) {
    var hex = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}
Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}
const now = Math.floor((new Date()).addHours(4) / 1000);

function convertToHex(str) {
    var hex = '';
    for (var i = 0; i < str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;
}


contract('hipoteca', function (accounts) {

    /* bytes32 _endereco,
    bytes32 _matricula,
    uint _valor_emprestimo,
    uint _valor_equivalente,
    uint _juros_mensais,
    uint _data_vencimento,
    uint _percentual_multa,
    address _devedor,
    address _credor */
    it("Criando Contrato", function () {


        return hipoteca.deployed().then(function (instance) {
            var endereco1 = "0x" + convertToHex("Rua Quatá, 300");
            var matricula1 = [0x11, 0x02, 0x03, 0x1f];
            return instance.pegarEmprestimo(
                endereco1,  // Endereco
                matricula1, // Matricula
                1250,       // Valor
                1270,       // Valor Ajustado
                2,          // Juros Mensais
                now,        // Data de vencimento do Contrato
                20,         // Juros da multa
                accounts[1],// Devedor, aplicante ao empréstimo
                accounts[0] // Credor
            ).then(function () {
                return instance.verEmprestimo.call();
            }).then(function (res) {
                console.log("Endereco do contrato: " + hex_to_ascii(res._endereco));
                console.log("valor do Emprestimo : " + res._valor_emprestimo);
                console.log("Contrato Pronto\n");
                console.log(res);
                assert.equal(res._valor_emprestimo, 1250, "Valor de emprestimo não bate");


            });
        });
    });
    it("Verificando se o balanco do credor diminuiu", function () {
        return hipoteca.deployed().then(function (instance) {
            return instance.balanco.call(accounts[0]);
        }).then(function (balanco) {
            console.log("balanco 0: " + balanco.valueOf());
            assert.equal(balanco.valueOf(), 3750, "Valor do Credor não bate");
        });
    });
    it("Verificando se o balanco do devedor aumentou", function () {
        return hipoteca.deployed().then(function (instance) {
            return instance.balanco.call(accounts[1]);
        }).then(function (balanco) {
            console.log("balanco 1: " + balanco.valueOf());
            assert.equal(balanco.valueOf(), 1250, "Valor do devedor não bate");
        });
    });

    it("Verificando Data", function () {
        return hipoteca.deployed().then(function (instance) {
            return instance.verEmprestimo.call();
        }).then(function (res) {

            console.log("Data de fim do Contrato: " + (new Date(res._data_vencimento * 1000)));
            assert.equal((res._data_vencimento * 1000), (now * 1000), "Valor de emprestimo não bate");
        });
    });

});