/**
 * Lê o valor de um cookie salvo pelo navegador.
 * @param {string} name - Nome do cookie a ser buscado (ex: 'csrftoken').
 * @returns {string|null} Retorna o valor do cookie, ou null se não existir.
 */
function getCookies(name) {

    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export default getCookies;