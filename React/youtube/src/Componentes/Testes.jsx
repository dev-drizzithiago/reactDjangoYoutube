import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Testes() {
    const [ indiceCategoria, setIndiceCategoria ] = useState(0)
    const [ categoriaAtual, setCategoriaAtual ] = useState(null)
    const [ graficos, setGraficos ] = useState(null)
    const [ listaValores, setListaValores ] = useState([]);  // Contem as repostas

          
    const btn = () => {

         const lista_categorias = [
        {id: 1, nome: "Matemática", weight: 10, perguntas: [
            {id: 1, questao: 'questao_matematica_1', weight: 5, alternativas: [
                {id: 1, nivel: 'novo', descricao: 'opc_1', pontuacao: 5},
                {id: 1, nivel: 'novo', descricao: 'opc_1', pontuacao: 5},
                {id: 1, nivel: 'novo', descricao: 'opc_1', pontuacao: 5},
                {id: 1, nivel: 'novo', descricao: 'opc_1', pontuacao: 5},
            ]} ,
            
            {id: 2, questao: 'questao_matematica_2', weight: 5, alternativas: [
                {id: 1, nivel: 'novo', descricao: 'opc_1', pontuacao: 5},
                {id: 1, nivel: 'novo', descricao: 'opc_1', pontuacao: 5},
                {id: 1, nivel: 'novo', descricao: 'opc_1', pontuacao: 5},
                {id: 1, nivel: 'novo', descricao: 'opc_1', pontuacao: 5},
            ]} ,  
        ]},

        {id: 2, nome: "História", weight: 10, perguntas: [
            {id: 1, questao: 'questao_1', weight: 5, alternativas: [
                {id: 1, nivel: 'novo', descricao: 'opc_1', pontuacao: 5},
                {id: 1, nivel: 'novo', descricao: 'opc_1', pontuacao: 5},
                {id: 1, nivel: 'novo', descricao: 'opc_1', pontuacao: 5},
                {id: 1, nivel: 'novo', descricao: 'opc_1', pontuacao: 5},
            ]} ,
            {id: 2, questao: 'questao_2', weight: 5, alternativas: [
                {id: 1, nivel: 'novo', descricao: 'opc_1', pontuacao: 5},
                {id: 1, nivel: 'novo', descricao: 'opc_1', pontuacao: 5},
                {id: 1, nivel: 'novo', descricao: 'opc_1', pontuacao: 5},
                {id: 1, nivel: 'novo', descricao: 'opc_1', pontuacao: 5},
            ]} ,  
        ]},
    ]   

        console.log(lista_categorias[indiceCategoria])
        const dados = [
            { categoria: "Matemática", maturidade: Math.floor(Math.random() * 100) },
            { categoria: "História", maturidade: Math.floor(Math.random() * 100) },
            { categoria: "Geografia", maturidade: Math.floor(Math.random() * 100) },
            { categoria: "Ciências", maturidade: Math.floor(Math.random() * 100) },
            { categoria: "Português", maturidade: Math.floor(Math.random() * 100) },
            { categoria: "Inglês", maturidade: Math.floor(Math.random() * 100) },
            { categoria: "Arte", maturidade: Math.floor(Math.random() * 100) },
        ];
        
        setCategoriaAtual(lista_categorias[indiceCategoria])

        if (indiceCategoria >= lista_categorias.length) {
            console.log('Finalizado')
            setGraficos(dados)
            return
        } else {
            setIndiceCategoria(prev => prev + 1)
        }
    }   
    

  return (
    <div>
        <h1>TESTE</h1>

        {/* {graficos &&         
        <ResponsiveContainer width='100%' height={400}>
            <BarChart
            
            // transforma o gráfico em barras horizontais.
            layout="vertical"
            
            data={graficos}
            
            margin={{ top: 20, right:30, left: 100, botton:20 }}
            >
                <XAxis type="number" />

                // mostra o nome da categoria no eixo Y.
                <YAxis dataKey='categoria' type="category" />
                <Tooltip />

                // mostra o índice de maturidade no eixo X.
                <Bar dataKey={'maturidade'} fill="#8884d8"/>
            </BarChart>

        </ResponsiveContainer>} */}

        <div>
            {
                categoriaAtual && 
                <>
                <h1>{categoriaAtual.nome}</h1>            
                
                {categoriaAtual.perguntas.map(pergunta => (
                
                    <div key={pergunta.id} className='quest-divPerguntas'>
                        <h3>{pergunta.questao}</h3>

                        {pergunta.alternativas.map(alternativa => (                            
                            <div key={alternativa.id} className='quest-trAlterinativas'>
                                <div className='quest-tdAlternativas'>
                                    <input type="radio" 
                                    name={pergunta.questao}
                                    value={alternativa.pontuacao}
                                    onChange={(e) => {
                                        setListaValores(prev => {

                                            // procura se já existe a categoria
                                            const categoriaExistente = prev.find(c => c.categoria_id === cat.id);

                                            if (categoriaExistente) {

                                            // atualiza perguntas dentro da categoria
                                            const perguntasAtualizadas = [
                                                ...categoriaExistente.perguntas.filter(p => p.pergunta_id !== pergunta.pergunta_id),
                                                {
                                                    pergunta_id: pergunta.id,
                                                    questao: pergunta.questao,
                                                    weight: pergunta.weight,
                                                    resposta: {
                                                        alternativa_id: alternativa.id,
                                                        descricao: alternativa.descricao,
                                                        pontuacao: Number(e.target.value)
                                                    }
                                                }
                                            ];

                                            // substitui categoria atualizada
                                            return prev.map(c =>
                                                c.categoria_id === cat.id ? { ...c, perguntas: perguntasAtualizadas } : c
                                            );
                                            } else {

                                            // cria nova categoria com a primeira pergunta respondida
                                            return [
                                                ...prev,
                                                {
                                                categoria_id: cat.id,
                                                nome: cat.nome,
                                                weight: cat.weight,
                                                perguntas: [
                                                    {
                                                    pergunta_id: pergunta.id,
                                                    questao: pergunta.questao,
                                                    weight: pergunta.weight,
                                                    resposta: {
                                                        alternativa_id: alternativa.id,
                                                        descricao: alternativa.descricao,
                                                        pontuacao: Number(e.target.value)
                                                    }}]}]}})}}
                                            />
                                    <span className='quest-spanAlternativa'>
                                        {alternativa.descricao}
                                    </span>
                                </div>
                            </div>                            
                        ))}
                    </div> 
                ))}
                </>}
            
            <button onClick={btn}>Começar</button>
        </div>
    </div>
  )
}
