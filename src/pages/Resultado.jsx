import { useState } from "react";
import { Link } from "react-router-dom";
import {
    obterVotos,
    calcularResultado,
    desfazerUltimoVoto,
    zerarVotos,
} from "../services/votacaoService";

function formatarPercentual(valor) {
    return (
        valor.toLocaleString("pt-BR", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }) + "%"
    );
}

function Resultado() {
    const [votos, setVotos] = useState(() => obterVotos());

    // Valores derivados do estado: recalculados a cada renderização
    const total = votos.length;
    const resultado = calcularResultado(votos);
    const primeiro = 0;
    const craque = resultado[primeiro];
    const vice = resultado[primeiro + 1];
    const diferenca = craque.votos - vice.votos;

    function classeDoItem(indice) {
        if (indice === primeiro) return "placar-item placar-craque";
        if (indice === primeiro + 1) return "placar-item placar-vice";
        return "placar-item";
    }

    function handleDesfazer() {
        setVotos(desfazerUltimoVoto());
    }

    function handleZerar() {
        if (window.confirm("Apagar todos os votos e reiniciar a votação?")) {
            zerarVotos();
            setVotos([]);
        }
    }

    return (
        <main className="pagina">
            <header className="pagina-cabecalho">
                <h1>Parcial: Craque do Jogo</h1>
                <p className="total-votos">
                    <strong>{total.toLocaleString("pt-BR")}</strong>{" "}
                    {total === 1 ? "voto computado" : "votos computados"}
                </p>
            </header>

            {total === 0 ? (
                <div className="vazio">
                    <p>
                        Nenhum voto ainda. Escolha o craque do jogo para ver a
                        parcial.
                    </p>
                    <Link to="/votacao" className="botao botao-principal">
                        Ir para a votação
                    </Link>
                </div>
            ) : (
                <>
                    <p className="disputa">
                        {diferenca === 0
                            ? `Empate na premiação entre ${vice.nome} e ${craque.nome}!`
                            : `${craque.nome} lidera com ${diferenca} ${diferenca === 1 ? "voto" : "votos"} de vantagem sobre ${vice.nome}.`}
                    </p>

                    <ol className="placar">
                        {resultado.map((p, indice) => (
                            <li key={p.id} className={classeDoItem(indice)}>
                                <span className="placar-posicao">
                                    {indice + 1}º
                                </span>
                                <img
                                    src={p.foto}
                                    alt={p.nome}
                                    className="placar-foto"
                                />
                                <div className="placar-info">
                                    <div className="placar-linha">
                                        <span className="placar-nome">
                                            {p.nome}
                                        </span>
                                        {indice === primeiro + 1 && (
                                            <span className="selo-placar selo-vice">
                                                Vice
                                            </span>
                                        )}
                                        {indice === primeiro && (
                                            <span className="selo-placar selo-craque">
                                                Craque do jogo
                                            </span>
                                        )}
                                    </div>
                                    <div className="barra">
                                        <div
                                            className="barra-preenchida"
                                            style={{
                                                width: `${p.percentual}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="placar-numeros">
                                        {formatarPercentual(p.percentual)} (
                                        {p.votos}{" "}
                                        {p.votos === 1 ? "voto" : "votos"})
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ol>

                    <div className="resultado-acoes">
                        <button
                            type="button"
                            className="botao botao-desfazer"
                            onClick={handleDesfazer}
                        >
                            Desfazer último voto
                        </button>
                        <button
                            type="button"
                            className="botao botao-zerar"
                            onClick={handleZerar}
                        >
                            Zerar votação
                        </button>
                    </div>
                </>
            )}
        </main>
    );
}

export default Resultado;
