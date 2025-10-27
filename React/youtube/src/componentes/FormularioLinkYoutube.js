import { useRef, useState } from "react";
import sendRequestDjango from "./sendRequestDjango";
import LinkBancoDados from "./LinkBancoDados";
import "./FormularioLinkYoutube.css"


const FormularioLinkYoutube = ({ onLinkAdicionado }) => {
    const [btnLimparForms, setLimparForms] = useState(null)
    const [responseAlertaDjango, setResponseAlertaDjango] = useState(null)
    const [carregando, setCarregando] = useState(null)
    const [atualizarLinks, setAtualizeLinks] = useState(false)

    const refLink = useRef();

    /** FUNÇÃO PARA ADICIONAR LINK */
    const useDefGravandoLink = async () => {
      const linkYoutube = refLink.current.value
      setLimparForms('');
      setCarregando(true)

      const responseDados = await sendRequestDjango("http://localhost:8000/requestAddLinks/", {'link': linkYoutube})
      
      setResponseAlertaDjango(responseDados.mensagem);
      console.log(responseDados)
      setCarregando(false)

      console.log(atualizarLinks)
      {atualizarLinks && <LinkBancoDados />}

      if (responseDados.erro_processo === 0){

        onLinkAdicionado() /** Comunica o app.js que deve atualizar os links. */
      }
      
      setTimeout(() => {
          setResponseAlertaDjango('')
        }, 15000);        
    }
    
    /** FUNÇÃO PARA LIMPAR O CAMPO DE LINK */
    const useDefBtnLimparInput = () => {      
      if (refLink.current) {
        refLink.current.value = '';
        setLimparForms('');
        setResponseAlertaDjango('')
      }
    }

  return (    
    <div className="returnFormsLink">      
      <h2>Formulario para Link do Youtube</h2>      
        <div className="divLabelInput">
          <label className="label labelLink" htmlFor="link">Cole o Link do Video:</label>
          <input type="text" className="inputText inputLinkYoutube" name="link" ref={refLink}/>
        </div>

        <div>                   
          {carregando && <img src="/img/imgBtns/loading.gif" alt="Carregando..."/>}
          <h3 className="mensagemAlerta">{responseAlertaDjango}</h3>
        </div>
        
        <div className="divBtnImgAdd">
          <img src="/img/imgBtns/adicionar.png" alt="adicionar" className="imgBtn btnAdd" onClick={useDefGravandoLink}/>
          <img src="/img/imgBtns/limpar.png" alt="adicionar" className="imgBtn btnLimpar" onClick={useDefBtnLimparInput}/>
        </div>        
    </div>
   
  );
};

export default FormularioLinkYoutube;
