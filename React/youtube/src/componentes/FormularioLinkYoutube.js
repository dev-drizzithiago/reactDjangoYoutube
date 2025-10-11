const FormularioLinkYoutube = () => {
  return (
    <div>
      <h2>Formulario para Link do Youtube</h2>
      <form className="formsLinkYoutube" method="POST">
        <div>
          <label className="label labelLink" htmlFor="link">Cole o Link do Video:</label>
          <input type="text" className="inputLinkYoutube" name="link" />
        </div>
        <button className="buttonSubmit" type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default FormularioLinkYoutube;
