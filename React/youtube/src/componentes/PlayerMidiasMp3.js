/**  key= só utilizando que a lista não possui uma chave. */

import { useState } from "react";

const PlayerMidiasMp3 = () => {

    const [listaMp3Salva] = useState(
        [{
            nome_midia: 'Nome_1',
            link_midia: '../Django/medias/MP4/Black TBlack T - Breve.mp4',
            miniatura: ''
        }]
    )

  return (
    <div>
        <div className="listaMidias">
            <ul>
                {listaMp3Salva.map(
                    (item, index) => (                        
                    <a href="item.link_midia">{item.nome_midia}</a>                        
                    )
                )}
            </ul>
        </div>

        <div className="modalPlayVideos">
                <div class="div div_dialog_play">
                    <video controls class="video_player">
                        <source src="../Django/medias/MP4/Black TBlack T - Breve.mp4" type="video/mp4"></source>
                    </video>
                </div>
        </div>
    </div>
  );
};

export default PlayerMidiasMp3;