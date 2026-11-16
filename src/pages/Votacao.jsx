import { useState } from "react";
import { Link } from "react-router-dom";
import JogadorCard from "../components/JogadorCard";
import {
    listarPorSituacao,
    obterSuspenso,
    registrarVoto,
} from "../services/votacaoService";

function Votacao() {
    const indicados = listarPorSituacao("indicado");
    const elenco = listarPorSituacao("elenco");
    const suspenso = obterSuspenso();

    const [selecionado, setSelecionado] = useState(null);
    const [historico, setHistorico] = useState([]);

    function handleConfirmar() {
        registrarVoto(selecionado.id);
        setHistorico([...historico, selecionado.nome]);
        setSelecionado(null);
    }

    return (
        <main className="pagina">
            <header className="pagina-cabecalho">
                <h1>Quem deve ser o Craque do Jogo?</h1>
                <p>
                    Selecione um jogador e confirme o voto para ele receber o
                    troféu de Craque do Jogo.
                </p>
            </header>

            <section className="time-galo">
                {indicados.map((j) => (
                    <JogadorCard
                        key={j.id}
                        jogador={j}
                        selecionado={selecionado?.id === j.id}
                        onSelecionar={setSelecionado}
                    />
                ))}
            </section>

            <div className="confirmacao">
                <p>
                    {selecionado ? (
                        <>
                            Seu voto vai para{" "}
                            <strong>{selecionado.nome}</strong> ficar.
                        </>
                    ) : (
                        "Nenhum peão selecionado."
                    )}
                </p>
                <button
                    type="button"
                    className="botao botao-principal"
                    disabled={!selecionado}
                    onClick={handleConfirmar}
                >
                    Confirmar voto
                </button>
            </div>

            {historico.length > 0 && (
                <section className="historico" aria-live="polite">
                    <h2>
                        Seus votos nesta sessão: {historico.length}{" "}
                        {historico.length === 1 ? "voto" : "votos"}
                    </h2>
                    <ol className="historico-lista">
                        {historico.map((nome, indice) => (
                            <li key={indice}>{nome}</li>
                        ))}
                    </ol>
                    <Link to="/resultado">Ver parcial</Link>
                </section>
            )}

            {suspenso && (
                <section className="demais">
                    <h2>Jogador suspenso</h2>
                    <p className="demais-legenda">
                        Está suspenso e não pode receber votos.
                    </p>
                    <div className="grade-jogadores">
                        <JogadorCard participante={suspenso} />
                    </div>
                </section>
            )}

            <section className="demais">
                <h2>Demais jogadores</h2>
                <p className="demais-legenda">
                    Fora do jogo nessa partida, não podem receber votos.
                </p>
                <div className="grade-jogadores">
                    {elenco.map((p) => (
                        <JogadorCard key={p.id} participante={p} />
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Votacao;
