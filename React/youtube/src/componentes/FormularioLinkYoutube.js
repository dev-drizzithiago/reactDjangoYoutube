import { useRef, useState } from "react";
import sendRequestDjango from "./sendRequestDjango";

const FormularioLinkYoutube = () => {
    const [responseDados, setDados] = useState(null)
    const refLink = useRef();

    const useDefGravandoLink = async () => {
      const linkYoutube = refLink.current.value

      const responseDados = await sendRequestDjango({urlDjango: "http://localhost:8000/requestAddLinks/", payload: {'link': linkYoutube}})
      setDados(responseDados)
  }

  return (
    <div>      
      <h2>Formulario para Link do Youtube</h2>      
        <div className="divLabelInput">
          <label className="label labelLink" htmlFor="link">Cole o Link do Video:</label>
          <input type="text" className="inputText inputLinkYoutube" name="link" ref={refLink}/>
        </div>
        <img src="/img/imgBtns/adicionar.png" alt="adicionar" className="imgBtn" onClick={useDefGravandoLink}/>
    </div>
  );
};

export default FormularioLinkYoutube;
