"use client";
import { ArrowRightIcon, CloudIcon } from "@heroicons/react/outline";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Card,
  TextInput,
  Title,
} from "@tremor/react";
import { useCallback, useState } from "react";
import { CodeBlock } from "react-code-blocks";
import { Expense, OpenAIResponse } from "../../lib/type";
import { OpenAIKeyInput } from "./OpenAIKeyInput";
import { Result } from "./Result";

type Props = {
  expenses: Expense[];
};
type Message = {
  from: "user" | "bot";
  message: string;
  functionBody?: string;
};

export const Chat = ({ expenses }: Props) => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const chatGPTquery = `
		Given a list of expenses with the following following type:
		
		{	
			id: string
			description: string
			details: string
			repayments: {
				from: number
				to: number
				amount: string
			}[]
			cost: string
			date: string
			category: {
				name: 
					| 'Utilidades'
					| 'Sin categoría'
					| 'Entretenimiento'
					| 'Comidas y bebidas'
					| 'Casa'
					| 'Transporte'
					| 'Vida'
					| 'Limpieza'
					| 'Electricidad'
					| 'Calefacción'
					| 'Otro'
					| 'Basura'
					| 'TV/teléfono/Internet'
					| 'Agua'
					| 'General'
					| 'Juegos'
					| 'Películas'
					| 'Música'
					| 'Otro'
					| 'Deportes'
					| 'Restaurantes'
					| 'Alimentos'
					| 'Licor'
					| 'Otro'
					| 'Electrónica'
					| 'Muebles'
					| 'Suministros del hogar'
					| 'Mantenimiento'
					| 'Hipoteca'
					| 'Otro'
					| 'Mascotas'
					| 'Alquiler'
					| 'Servicios'
					| 'Bicicleta'
					| 'Autobús/tren'
					| 'Coche'
					| 'Gasolina'
					| 'Hotel'
					| 'Otro'
					| 'Estacionamiento'
					| 'Avión'
					| 'Taxi'
					| 'Guardería'
					| 'Ropa'
					| 'Formación'
					| 'Regalos'
					| 'Seguro'
					| 'Gastos médicos'
					| 'Otro'
					| 'Impuestos
			}
		}

		return the body of a javascript function (only the body, not the function declaration) that returns the value that is being queried in the below query.
		wrap the function body with '{START}' and '{END}'. 

		example of what you should return for a query that returns the sum of all expenses:
    \`\`\`
		{START}
		return expenses.reduce((acc, exp) => acc + parseFloat(exp.cost), 0)
		{END}
		\`\`\`


		The query is:
		${query}

		it is very imporant that you only return the body of the function and that this is wrapped with '{START}' and '{END}'.
		and that the code given runs by itself without needing anything else
		`;

  const openAIKey = localStorage.getItem("openAIKey");

  const addMessage = useCallback((message: Message) => {
    setMessages((msgs) => [...msgs, message]);
  }, []);

  const ask = useCallback(() => {
    setQuery("");
    setLoading(true);
    addMessage({ from: "user", message: query });
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: chatGPTquery }],
      }),
    })
      .then((res) => res.json())
      .then((res: OpenAIResponse) => {
        setLoading(false);
        const text = res.choices[0].message.content;
        const start = text.indexOf("{START}") + "{START}".length;
        const end = text.indexOf("{END}");
        const functionBody = text.substring(start, end);

        try {
          const result = JSON.stringify(
            new Function("expenses", functionBody)(expenses)
          );
          addMessage({ from: "bot", message: result, functionBody });
        } catch (error) {
          addMessage({
            from: "bot",
            message: `Error:
						function
						 ${functionBody}
						 
						 gave error
						 ${error}
						 `,
          });
        }
      });
  }, [addMessage, chatGPTquery, expenses, openAIKey, query]);

  if (!openAIKey) return <OpenAIKeyInput />;

  return (
    <Card>
      <Title>Chat</Title>

      <div className="flex flex-col gap-2 m-3">
        {messages.map((message) => (
          <div key={message.message} className="flex gap-2">
            {message.from === "user" ? (
              <div className="w-[100%] flex">
                <div className="bg-green-100 rounded-md p-2 ml-auto">
                  <div className="relative px-2 py-1 rounded-md bg-green-100 text-sm">
                    <div className="absolute top-[-2.9px] right-0 -mr-3 w-3 h-3 transform rotate-45 bg-green-100"></div>
                    {message.message}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-[100%] flex">
                <div className="bg-blue-100 rounded-md p-2 mr-auto">
                  <div className="relative px-2 py-1 rounded-md bg-blue-100 text-sm">
                    <div className="absolute top-[-2.9px] left-0 -ml-3 w-3 h-3 transform rotate-45 bg-blue-100"></div>
                    <Accordion>
                      <AccordionHeader>
                        <Result json={message.message} />
                      </AccordionHeader>
                      <AccordionBody className={"font-mono"}>
                        <CodeBlock
                          text={`function(expenses) {${message.functionBody}}`}
                          className={"font-mono"}
                          language={"javascript"}
                          showLineNumbers={false}
                          theme={"atom-one-light"}
                        />
                      </AccordionBody>
                    </Accordion>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="w-[100%] flex">
            <div className=" bg-blue-500 animate-pulse rounded-md p-2 mr-auto">
              <div className="relative px-2 py-1 rounded-md bg-blue-500 animate-pulse text-sm">
                <div className="absolute top-[-2.9px] left-0 -ml-3 w-3 h-3 transform rotate-45 bg-blue-500 animate-pulse"></div>
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 py-1">
                    <div className="h-4 bg-blue-500 animate-pulse rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <TextInput
        className="w-full"
        placeholder="Enter your query here..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") ask();
        }}
        icon={
          loading
            ? CloudIcon
            : () => (
                <ArrowRightIcon
                  className="w-5 right-3 absolute hover:cursor-pointer"
                  onClick={ask}
                />
              )
        }
      />
    </Card>
  );
};
