
const FormularioLinkYoutube = () => {

  const btnAddLinkyoutube = () => {
    alert('Teste')
  }

  return (
    <div>
      <h2>Formulario para Link do Youtube</h2>
      
        <div className="divLabelInput">
          <label className="label labelLink" htmlFor="link">Cole o Link do Video:</label>
          <input type="text" className="inputText inputLinkYoutube" name="link" />
        </div>
        <img src="/img/imgBtns/adicionar.png" alt="adicionar" className="imgBtn" onClick={btnAddLinkyoutube}/>
             
    </div>
  );
};

export default FormularioLinkYoutube;
