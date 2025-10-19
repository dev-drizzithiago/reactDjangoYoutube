import { useRef } from "react";
import useRequestDjango from "./useRequestDjango";

const FormularioLinkYoutube = () => {
  const refLink = useRef();
  const useDefGravandoLink = () => {
    const linkYoutube = refLink.current.value    
    const {dados, carregando} = useRequestDjango("http://localhost:8000/requestAddLinks/", {'link': linkYoutube})
    if (carregando) {<h1>carregando...</h1>}
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
