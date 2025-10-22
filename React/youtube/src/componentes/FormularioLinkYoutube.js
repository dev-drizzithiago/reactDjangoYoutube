import { useRef, useState } from "react";
import sendRequestDjango from "./sendRequestDjango";
import "./FormularioLinkYoutube.css"
const FormularioLinkYoutube = () => {
    const [responseDados, setDados] = useState(null)
    const [btnLimparForms, setLimparForms] = useState(null)

    const refLink = useRef();

    const useDefGravandoLink = async () => {
      const linkYoutube = refLink.current.value

      const responseDados = await sendRequestDjango("http://localhost:8000/requestAddLinks/", {'link': linkYoutube})
      setDados(responseDados)
    }

    const useDefBtnLimparInput = () => {
      if (refLink.current) {
        refLink.value = '';
        setLimparForms('');
      }
    }

  return (
    <div className="returnFormsLink">
      <h2>Formulario para Link do Youtube</h2>      
        <div className="divLabelInput">
          <label className="label labelLink" htmlFor="link">Cole o Link do Video:</label>
          <input type="text" className="inputText inputLinkYoutube" name="link" ref={refLink}/>
        </div>
        <div className="divBtnImgAdd">
          <img src="/img/imgBtns/adicionar.png" alt="adicionar" className="imgBtn btnAdd" onClick={useDefGravandoLink}/>
          <img src="/img/imgBtns/limpar.png" alt="adicionar" className="imgBtn btnLimpar" onClick={useDefBtnLimparInput}/>
        </div>
        
    </div>
  );
};

export default FormularioLinkYoutube;
