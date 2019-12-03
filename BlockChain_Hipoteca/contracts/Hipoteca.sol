pragma solidity ^0.5.0;

contract hipoteca{

    address credor1;

    struct Propriedade {
        bytes32 endereco;
        bytes32 matricula;
        address dono;
    }

    struct Termos_contrato{
        uint valor_emprestimo;
        uint valor_equivalente;
        uint juros_mensais;
        uint data_vencimento;
        uint percentual_multa;
    }

    struct Pessoas{
        address devedor;
        address credor;
    }

    Propriedade propriedade;
    Termos_contrato termos;
    Pessoas pessoas;

    constructor() public{
        credor1 = msg.sender;
        balanco[msg.sender] = 5000;
    }

    function emprestimo(address devedor, uint montante) public returns(uint) {
        if(balanco[msg.sender] < montante) {
            return 0;
        }
        balanco[msg.sender] -= montante;
        balanco[devedor] += montante;
        return balanco[devedor];
    }


    function pegarEmprestimo(
        bytes32 _endereco,
        bytes32 _matricula,
        uint _valor_emprestimo,
        uint _valor_equivalente,
        uint _juros_mensais,
        uint _data_vencimento,
        uint _percentual_multa,
        address _devedor,
        address _credor) public {
            if(emprestimo(_devedor, _valor_emprestimo) > 0){
            pessoas.devedor = _devedor;
            pessoas.credor = _credor;
            termos.valor_emprestimo = _valor_emprestimo;
            termos.valor_equivalente = _valor_equivalente;
            termos.juros_mensais = _juros_mensais;
            termos.data_vencimento = _data_vencimento;
            termos.percentual_multa = _percentual_multa;
            propriedade.endereco = _endereco;
            propriedade.matricula = _matricula;
            propriedade.dono = _devedor;
        }
    }

    function verEmprestimo() public view returns(
        bytes32 _endereco,
        bytes32 _matricula,
        uint _valor_emprestimo,
        uint _valor_equivalente,
        uint _juros_mensais,
        uint _data_vencimento,
        uint _percentual_multa,
        address _devedor,
        address _credor) {
            _devedor = pessoas.devedor;
            _credor = pessoas.credor;
            _valor_emprestimo = termos.valor_emprestimo;
            _valor_equivalente = termos.valor_equivalente;
            _juros_mensais = termos.juros_mensais;
            _data_vencimento = termos.data_vencimento;
            _percentual_multa = termos.percentual_multa;
            _endereco = propriedade.endereco;
            _matricula = propriedade.matricula;
            _devedor = propriedade.dono;
    }


    mapping (address => uint256) public balanco;
}