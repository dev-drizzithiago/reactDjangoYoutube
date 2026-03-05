import { useRef, useState } from "react";
import { toast } from "react-toastify";

import sendRequestDjango from "./sendRequestDjango";
import "./FormularioLinkYoutube.css"

import { SiCcleaner } from "react-icons/si";
import { IoIosAddCircleOutline } from "react-icons/io";

const urlDefaultDjango = `http://192.168.15.250:8080`

const FormularioLinkYoutube = ({ onLinkAdicionado, fecharFormularioAdicionarLonk }) => {
    const [carregando, setCarregando] = useState(null)

    const refLink = useRef();

    /** FUNÇÃO PARA ADICIONAR LINK */
    const useDefGravandoLink = async () => {
      const linkYoutube = refLink.current.value
      refLink.current.value = '';

      setCarregando(true) // ínicia o spinner

      const responseDados = await sendRequestDjango(`${urlDefaultDjango}/requestAddLinks/`, {'link': linkYoutube})

      if (responseDados.erro_processo === 0){
        toast.success(responseDados.mensagem_processo);

        /** Comunica o app.js que deve atualizar os links. */
        onLinkAdicionado(prev => prev + 1)
        fecharFormularioAdicionarLonk(false) // Fecha o formulário

      } else if (responseDados.erro_processo === 1) {
        toast.warning(responseDados.mensagem_processo);
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
      <h3> Registrar link na base de dados</h3>
        <div className="divLabelInput">          
          <input type="text" className="inputText inputLinkYoutube" name="link" 
          placeholder="Cole aqui o link do youtube"
          ref={refLink} 
          onKeyDown={e => {
            if (e.key === "Enter") {
              useDefGravandoLink;
              }
            }
          }/>
          
        </div>

        {/** BLOCO DOS BOTOES */}
        <div className="forms-divBtnImgAdd">
          {carregando && <div className="forms-divImgLoading"><img className="imgBtn forms-imgLoading" src="/img/imgBtns/spinner.gif" alt="Carregando..."/></div>}
          <IoIosAddCircleOutline className="imgBtn btnAdd" onClick={useDefGravandoLink} />
          <SiCcleaner className="imgBtn btnLimpar" onClick={useDefBtnLimparInput} />          
        </div>
    </div>   
  );
};

export default FormularioLinkYoutube;
