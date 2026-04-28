import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Testes() {
    const [ indiceCategoria, setIndiceCategoria ] = useState(0)
    const [ categoriaAtual, setCategoriaAtual ] = useState(null)

    
    

    const btn = () => {

        const dados = [
            { categoria: "Matemática", maturidade: Math.floor(Math.random() * 100) },
            { categoria: "História", maturidade: Math.floor(Math.random() * 100) },
            { categoria: "Geografia", maturidade: Math.floor(Math.random() * 100) },
            { categoria: "Ciências", maturidade: Math.floor(Math.random() * 100) },
            { categoria: "Português", maturidade: Math.floor(Math.random() * 100) },
            { categoria: "Inglês", maturidade: Math.floor(Math.random() * 100) },
            { categoria: "Arte", maturidade: Math.floor(Math.random() * 100) },
        ];
        
        setCategoriaAtual(dados[indiceCategoria])

        setIndiceCategoria(prev => prev + 1)        
    }   
    

  return (
    <div>
        <h1>TESTE</h1>

        {/* <ResponsiveContainer width='100%' height={400}>
            <BarChart
            
            // transforma o gráfico em barras horizontais.
            layout="vertical"
            
            data={dados}
            
            margin={{ top: 20, right:30, left: 100, botton:20 }}
            >
                <XAxis type="number" />

                // mostra o nome da categoria no eixo Y.
                <YAxis dataKey='categoria' type="category" />
                <Tooltip />

                // mostra o índice de maturidade no eixo X.
                <Bar dataKey={'maturidade'} fill="#8884d8"/>
            </BarChart>

        </ResponsiveContainer> */}

        <div>
            { categoriaAtual && 
                <h1>Categoria: {categoriaAtual.categoria}</h1>
            }
            <button onClick={btn}>Começar</button>
        </div>
    </div>
  )
}
