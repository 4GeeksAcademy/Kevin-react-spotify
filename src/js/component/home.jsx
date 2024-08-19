import React, { useState, useEffect, useRef } from "react";

const Home = () => {
    const Col = { background: "black", color: "white" };
    const fondo = { height: "100%", width: "100%" };
    const [caso, setCaso] = useState(0);
    const [repl, setRepl] = useState("block");
    const [pausel, setPausel] = useState("none");
    const [cancion, setCancion] = useState([]);
    const [url, setUrl] = useState('');

    const botoAudio = useRef();

    const stylebotton = { height: "500px", min_width: "90px" };

    const obtenerInfo = async () => {
        try {
            const response = await fetch('https://playground.4geeks.com/sound/songs');
            if (!response.ok) throw new Error('Error en la respuesta de la API');
            const data = await response.json();
            if (data.songs && Array.isArray(data.songs)) {
                setCancion(data.songs);
            } else {
                console.error('Formato de datos inesperado o sin canciones');
                setCancion([]);
            }
        } catch (error) {
            console.error('Error al obtener las canciones:', error);
            setCancion([]);
        }
    };

    const play = () => {
        if (botoAudio.current.paused) {
            botoAudio.current.play().catch(error => console.error('Error al reproducir el audio:', error));
            setRepl("none");
            setPausel("block");
        } else {
            setPausel("none");
            setRepl("block");
            botoAudio.current.pause();
        }
    };

    useEffect(() => {
        obtenerInfo();
    }, []);

    useEffect(() => {
        if (url) {
            botoAudio.current.src = url;
            play();
        }
    }, [url]);

    const pruebas = () => {
        cancion.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) {
                element.style.color = "white";
                element.style.opacity = "100%";
                element.style.border = "none";
            }
        });
    };

    const sig = () => {
        if (caso < cancion.length - 1) {
            pruebas();
            setCaso(caso + 1);
            colores(caso + 1);
            imprimirN(caso + 1);
        }
    };

    const back = () => {
        if (caso > 0) {
            pruebas();
            setCaso(caso - 1);
            colores(caso - 1);
            imprimirB(caso - 1);
        }
    };

    const imprimirN = (num) => {
        const ranN = 'https://assets.breatheco.de/apis/sound' + cancion[num].url;
        setUrl(ranN);
    };

    const imprimirB = (num) => {
        const ranB = 'https://assets.breatheco.de/apis/sound' + cancion[num].url;
        setUrl(ranB);
    };

    const colores = (num) => {
        const element = document.getElementById(num);
        if (element) {
            element.style.opacity = "50%";
            element.style.border = "3px solid red";
        }
    };

    const cambiar = (num) => {
        pruebas();
        colores(num);
        const selectedSong = cancion.find(song => song.id === num);
        if (selectedSong) {
            const songUrl = 'https://assets.breatheco.de/apis/sound' + selectedSong.url;
            setUrl(songUrl);
        }
    };

  
    return (
        <div className="text-start" style={fondo}>
            <div className="mt-2">
                <div className="col-6 m-auto">
                    <div className="overflow-auto" style={stylebotton} id="list-tab" role="tablist">
                        <div className="list-group" id="list-tab" style={stylebotton}>
                            {cancion.map((item) => (
                                <a
                                    className="col text-with p-3 list-group-item list-group-item-action"
                                    style={Col}
                                    id={item.id}
                                    data-bs-toggle="list"
                                    role="tab"
                                    key={item.id}
                                    onClick={() => { setCaso(item.id); cambiar(item.id); }}
                                    aria-label={`Reproducir ${item.name}`}
                                >
                                    {item.id + " " + item.name + " -"}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="control-container col-6 m-auto">
                <button className="control-button" onClick={() => back()} aria-label="Reproducir canción anterior">&#9664;</button>
                <button className={"control-button d-" + repl} onClick={() => play()} aria-label="Reproducir canción">&#9654;</button>
                <button className={"control-button d-" + pausel} onClick={() => play()} aria-label="Pausar canción">&#10074;&#10074;</button>
                <button className="control-button" onClick={() => sig()} aria-label="Reproducir siguiente canción">&#9654;</button>
            </div>

            <audio className="d-none" ref={botoAudio} />
        </div>
    );
};


export default Home;
