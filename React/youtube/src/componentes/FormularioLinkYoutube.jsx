import { useRef, useState } from "react";
import sendRequestDjango from "./sendRequestDjango";
import LinkBancoDados from "./LinkBancoDados";
import "./FormularioLinkYoutube.css"


const urlDefaultDjango = "http://localhost:8080"

const FormularioLinkYoutube = ({ onLinkAdicionado }) => {
    const [btnLimparForms, setLimparForms] = useState(null)
    const [responseAlertaDjango, setResponseAlertaDjango] = useState(null)
    const [carregando, setCarregando] = useState(null)
    const [atualizarLinks, setAtualizeLinks] = useState(false)

    const refLink = useRef();

    /** FUNÇÃO PARA ADICIONAR LINK */
    const useDefGravandoLink = async () => {
      const linkYoutube = refLink.current.value
      refLink.current.value = '';
      setCarregando(true)

      const responseDados = await sendRequestDjango(`${urlDefaultDjango}/requestAddLinks/`, {'link': linkYoutube})
      
      setResponseAlertaDjango(responseDados.mensagem);
      setCarregando(false)

      /** Se não ocorrer nenhum erro, a lista de links serão atualizadas. */
      if (responseDados.erro_processo === 0) {
        onLinkAdicionado() /** Comunica o app.js que deve atualizar os links. */
      }
      
      /** Depois de 15 segundos, a mensagem de alerta vai ser removida. */
      setTimeout(() => {
          setResponseAlertaDjango('')
        }, 15000);        
    }
    
    /** FUNÇÃO PARA LIMPAR O CAMPO DE LINK */
    const useDefBtnLimparInput = () => {
      if (refLink.current) {
        refLink.current.value = '';
        setResponseAlertaDjango('')
      }
    }

  return (    
    <div className="returnFormsLink">
        <div className="divLabelInput">
          <label className="label labelLink" htmlFor="link">Cole o Link do Video:</label>
          <input type="text" className="inputText inputLinkYoutube" name="link" ref={refLink} onKeyUp={useDefGravandoLink}/>
        </div>       

        {/** BLOCO DOS BOTOES */}
        <div className="divBtnImgAdd">
          <img src="/img/imgBtns/adicionar.png" alt="adicionar" className="imgBtn btnAdd" onClick={useDefGravandoLink}/>
          <img src="/img/imgBtns/limpar.png" alt="adicionar" className="imgBtn btnLimpar" onClick={useDefBtnLimparInput}/>          
          {carregando && <div className="divImgLoading"><img  className="imgBtn imgLoading" src="/img/imgBtns/spinner.gif" alt="Carregando..."/></div>}
        </div>   

        <div>          
          <h3 className="mensagemAlerta">{responseAlertaDjango}</h3>
        </div>     
    </div>
   
  );
};

export default FormularioLinkYoutube;
