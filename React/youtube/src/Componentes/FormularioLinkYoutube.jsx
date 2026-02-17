import { useRef, useState } from "react";
import { toast } from "react-toastify";
import sendRequestDjango from "./sendRequestDjango";
import "./FormularioLinkYoutube.css"

import { SiCcleaner } from "react-icons/si";
import { IoIosAddCircleOutline } from "react-icons/io";

const urlDefaultDjango = `http://localhost:8080`

const FormularioLinkYoutube = ({ onLinkAdicionado }) => {
    const [carregando, setCarregando] = useState(null)

    const refLink = useRef();

    /** FUNÇÃO PARA ADICIONAR LINK */
    const useDefGravandoLink = async () => {
      const linkYoutube = refLink.current.value
      refLink.current.value = '';

      setCarregando(true) // ínicia o spinner

      const responseDados = await sendRequestDjango(`${urlDefaultDjango}/requestAddLinks/`, {'link': linkYoutube})

      if (responseDados.erro_processo === 0){
        toast.success(responseDados.mensagem);
      } else if (responseDados.erro_processo === 1) {
        toast.warning(responseDados.mensagem);

        /** Comunica o app.js que deve atualizar os links. */
        onLinkAdicionado(prev => prev + 1)
      }
      
      setCarregando(false) // Fecha o spinner
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
          <label className="label forms-labelLink" htmlFor="link">Cole o Link do Video:</label>
          <input type="text" className="inputText inputLinkYoutube" name="link" 
          ref={refLink} 
          onKeyDown={e => {
            if (e.key === "Enter") {
              useDefGravandoLink;
              }
            }
          }/>
          
        </div>       

        {/** BLOCO DOS BOTOES */}
        <div className="divBtnImgAdd">
          <IoIosAddCircleOutline className="imgBtn btnAdd" onClick={useDefGravandoLink} />
          <SiCcleaner className="imgBtn btnLimpar" onClick={useDefBtnLimparInput} />          
          {carregando && <div className="divImgLoading"><img  className="imgBtn imgLoading" src="/img/imgBtns/spinner.gif" alt="Carregando..."/></div>}
        </div>
    </div>   
  );
};

export default FormularioLinkYoutube;
